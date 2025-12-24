from rest_framework import serializers
from .models import  Product,Category
# for built user auth
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields='__all__'
      
     
class ProductSerializer(serializers.ModelSerializer):
    
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()
    # discounted_price=serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields ='__all__'
    # Get full URL for the image
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
     # Add this missing method:
    # def get_discounted_price(self, obj):
    #     # Implement your discount logic here
    #     # Example 1: If your Product model has price and discount_percentage fields
    #     if hasattr(obj, 'discount_percentage') and obj.discount_percentage:
    #         discount = obj.price * (obj.discount_percentage / 100)
    #         return obj.price - discount
        
    #     # Example 2: If you have a custom discount calculation
    #     # return obj.calculate_discounted_price()
        
    #     # Example 3: Return original price if no discount
    #     return obj.price

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")
    
    def validate_password(self, value):
        validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", "")
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(
            username=data.get("username"),
            password=data.get("password")
        )
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")
        data["user"] = user
        return data

