from django.db import models

# CATEGORY (parent table)
class Category(models.Model):
    name=models.CharField(max_length=100,unique=True)
    slug=models.SlugField(unique=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.name
#general books models
class Product(models.Model):
   
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount=models.PositiveBigIntegerField(default=0)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,related_name='products',null=True,blank=True)
    stock=models.PositiveIntegerField(default=0)
    is_active=models.BooleanField(default=True)
    rating=models.FloatField(default=0)
    brand=models.CharField(max_length=100,blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now_add=True)
    
    def discounted_price(self):
        return self.price - (self.price*self.discount/100)

    def __str__(self):
        return self.name

    
