from django.contrib import admin
from .models import Product,Category
from django.utils.html import format_html

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id','image_preview', 'name', 'price','discount','stock','category','is_active','created_at')
    readonly_fields = ("image_preview",)
    
    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "price", "discount", 'description')
        }),
        ("Image", {
            "fields": ("image", "image_preview")
        }),
    )
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width:60px; height:60px; object-fit:cover;" />',
                obj.image.url,
            )
        return "No Image"

    image_preview.short_description = "Image"

      
    list_filter = ('category','is_active')
    search_fields = ('name', 'description')
    list_editable=('price','discount','stock','is_active','category')
    ordering = ('created_at',)
    list_per_page = 10
    # empty_value_display='Not Available'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','slug','is_active')  
    list_filter=('is_active',)
    list_editable=('name','slug','is_active')
    prepopulated_fields={'slug':('name',)}  
    search_fields = ('name',)        
    ordering = ('name',)             

