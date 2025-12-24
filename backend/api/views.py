from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Product,Category
from .serializers import ProductSerializer, RegisterSerializer, LoginSerializer, UserSerializer,CategorySerializer
# IsAuthenticated        # user must be logged in
# AllowAny               # anyone can access




# =====================CATEGORY LIST is created here==============
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])     # controls who can access the endpoint
def category_list_create(request):
    """
    GET  -> List categories
    POST -> Create category
    """
    if request.method == 'GET':
        categories = Category.objects.filter(is_active=True)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])     # controls who can access the endpoint
def category_detail(request, id):
    """
    GET    -> Retrieve category
    PUT    -> Update category
    PATCH  -> Partial update
    DELETE -> Delete category
    """
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        serializer = CategorySerializer(
            category, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        category.delete()
        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
# =====================CATEGORY LIST is created here==============





# =====================get all products here==============
# Add context to product views
@api_view(['GET'])                  # turns a normal function into a DRF API endpoint
@permission_classes([AllowAny])     # controls who can access the endpoint
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

# this is another way
    #  # Get category filter from query parameters
    # category_id = request.GET.get('category')
    
    # # Start with all products
    # products = Product.objects.all()
    
    # # Apply category filter if provided
    # if category_id:
    #     try:
    #         category_id = int(category_id)
    #         products = products.filter(category_id=category_id)
    #     except (ValueError, TypeError):
    #         pass  # If category_id is not a valid integer, ignore filter
    
    # # Also filter by is_active if your Product model has this field
    # products = products.filter(is_active=True)
    
    # serializer = ProductSerializer(products, many=True, context={'request': request})
    # return Response(serializer.data)

# =====================get all products here==============

@api_view(['GET'])
@permission_classes([AllowAny])
def get_products_by_category(request, category_id):
    try:
        # Verify category exists
        category = Category.objects.get(id=category_id, is_active=True)
    except Category.DoesNotExist:
        return Response(
            {"error": "Category not found or inactive"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Get products for this category
    products = Product.objects.filter(category_id=category_id, is_active=True)
    serializer = ProductSerializer(products, many=True, context={'request': request})
    
    # Include category info in response
    response_data = {
        "category": CategorySerializer(category).data,
        "products": serializer.data,
        "count": products.count()
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


# =====================get single products here==============
@api_view(['GET'])                  # turns a normal function into a DRF API endpoint
@permission_classes([AllowAny])     # controls who can access the endpoint
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data)
# =====================get single products here==============


# =====================creates new products here==============
@api_view(['POST'])                 # turns a normal function into a DRF API endpoint
@permission_classes([IsAuthenticated])      # controls who can access the endpoint
def create_product(request):
    serializer = ProductSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])                  # turns a normal function into a DRF API endpoint
@permission_classes([IsAuthenticated])      # controls who can access the endpoint
# =====================creates new products here==============




# =====================updates products here==============
def update_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# =====================updates products here==============

# =====================delete products here==============
@api_view(['DELETE'])                   # turns a normal function into a DRF API endpoint
@permission_classes([IsAuthenticated])      # controls who can access the endpoint
def delete_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({"message": "Product deleted successfully"})
# =====================delete products here==============


#register new user

@api_view(["POST"])                 # turns a normal function into a DRF API endpoint
@permission_classes([AllowAny])     # controls who can access the endpoint
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        # DO NOT create token here - user should login separately
        # DO NOT return token in response
        
        return Response({
            "user": UserSerializer(user).data,
            "message": "Registration successful! Please login with your credentials."
        }, status=status.HTTP_201_CREATED)
    
    # Return detailed error messages
    return Response({
        "errors": serializer.errors,
        "message": "Registration failed"
    }, status=status.HTTP_400_BAD_REQUEST)




#login logic for user
@api_view(["POST"])                 # turns a normal function into a DRF API endpoint
@permission_classes([AllowAny])     # controls who can access the endpoint
def login_user(request):
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)      # token-based authentication
        
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key,
            "message": "Login successful"
        })
    
    return Response({
        "errors": serializer.errors,
        "message": "Login failed"
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])                  # turns a normal function into a DRF API endpoint
@permission_classes([IsAuthenticated])      # controls who can access the endpoint
def get_profile(request):
    return Response(UserSerializer(request.user).data)

