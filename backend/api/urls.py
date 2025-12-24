from django.urls import path
from . import views

urlpatterns = [
      # ================== CATEGORY ==================

    path('categories/',views.category_list_create, name='category_list_create'),
    path('categories/<int:id>/',views.category_detail, name='category_detail'),
    path('categories/<int:category_id>/products/', views.get_products_by_category, name='category-products'),
    # Product endpoints
    path('products/', views.get_products, name='get_products'),
    path('products/<int:pk>/', views.get_product, name='get_product'),
    path('products/create/', views.create_product, name='create_product'),
    path('products/<int:pk>/update/', views.update_product, name='update_product'),
    path('products/<int:pk>/delete/', views.delete_product, name='delete_product'),
    
    # Authentication endpoints
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/profile/', views.get_profile, name='profile'),
    # forgot password

]

# # Extend admin URLs
# admin.site.site_header = "Password Reset Admin"
# admin.site.site_title = "Password Reset System"
# admin.site.index_title = "Welcome to Password Reset Administration"
