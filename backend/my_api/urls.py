"""my_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static 
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('API/v1/', include('API.urls'))
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# from django.http import HttpResponse
# from django.views.decorators.http import require_http_methods
# from django.core.files.storage import default_storage

# @require_http_methods(['GET'])
# def serve_image(request, image_path):
#     token = request.GET.get('token')
#     if not token or token != 'your_secret_token':
#         return HttpResponseForbidden('Acceso denegado')

#     image_file = default_storage.open(image_path)
#     response = HttpResponse(image_file.read(), content_type='image/jpeg')
#     response['Content-Disposition'] = f'inline; filename="{image_path}"'
#     return response