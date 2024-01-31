from django.urls import path
from .views.cargos import Cargos_Views
from .views.login import Login
from .views.permisos import Permisos_Views
from .views.tipo_documento import Tipo_Documento_Views
from .views.permisos import Permisos_Views
from .views.personas import Persona_Views
from .views.usuarios import Usuario_Views

urlpatterns=[
    path('cargos/', Cargos_Views.as_view(), name='cargos'),
    path('cargos/<int:id>/', Cargos_Views.as_view(), name='cargo'),
    path('permisos/', Permisos_Views.as_view(), name='permisos'),
    path('tipo_documento/', Tipo_Documento_Views.as_view(), name='tipo_documentos'),
    path('tipo_documento/<int:id>/', Tipo_Documento_Views.as_view(), name='tipo_documentos'),
    path('personas/', Persona_Views.as_view(), name='personas'),
    path('usuarios/', Usuario_Views.as_view(), name='usuarios'),
    path('login/', Login.as_view(), name='login'),
]