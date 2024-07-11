from django.urls import path
from .views.cargos import Cargos_Views
from .views.login import Login
from .views.permisos import Permisos_Views
from .views.tipo_documento import Tipo_Documento_Views
from .views.permisos import Permisos_Views
from .views.personas import Persona_Views
from .views.usuarios import Usuario_Views
from .views.materiales import Materiales_Views
from .views.actividades import Actividades_Views
from .views.recreadores import Recreadores_Views
from .views.niveles import Nivel_Views
from .views.sobrecargos import Sobrecargo_Views
from .views.verify_token import Verify_Token_Views
from .views.servicios import Servicios_Views
from .views.generos import Genero_Views
from .views.eventos import Eventos_Views
from .views.clientes import Clientes_Views
from .views.respaldo import Respaldo
# from .views.dollar import Dollar_View

urlpatterns=[
    path('cargos/', Cargos_Views.as_view(), name='cargos'),
    path('cargos/<int:id>/', Cargos_Views.as_view(), name='cargo'),
    path('permisos/', Permisos_Views.as_view(), name='permisos'),
    path('tipo_documentos/', Tipo_Documento_Views.as_view(), name='tipo_documentos'),
    path('tipo_documentos/<int:id>/', Tipo_Documento_Views.as_view(), name='tipo_documento'),
    path('niveles/', Nivel_Views.as_view(), name='niveles'),
    path('niveles/<int:id>/', Nivel_Views.as_view(), name='nivel'),
    path('generos/', Genero_Views.as_view(), name='generos'),
    path('generos/<int:id>/', Genero_Views.as_view(), name='genero'),
    path('sobrecargos/', Sobrecargo_Views.as_view(), name='sobrecargos'),
    path('sobrecargos/<int:id>/', Sobrecargo_Views.as_view(), name='sobrecargo'),
    path('actividades/', Actividades_Views.as_view(), name='actividades'),
    path('actividades/<int:id>/', Actividades_Views.as_view(), name='actividad'),
    path('materiales/', Materiales_Views.as_view(), name='materiales'),
    path('materiales/<int:id>/', Materiales_Views.as_view(), name='material'),
    path('servicios/', Servicios_Views.as_view(), name='servicios'),
    path('servicios/<int:id>/', Servicios_Views.as_view(), name='servicio'),
    path('personas/<int:tipo_documento>/<int:documento>/', Persona_Views.as_view(), name='personas'),
    path('usuarios/', Usuario_Views.as_view(), name='usuarios'),
    path('recreadores/', Recreadores_Views.as_view(), name='recreadores'),
    path('recreadores/<str:identificador>/', Recreadores_Views.as_view(), name='recreadores'),
    path('eventos/', Eventos_Views.as_view(), name='eventos'),
    path('eventos/<int:id>/', Eventos_Views.as_view(), name='evento'),
    path('clientes/', Clientes_Views.as_view(), name='clientes'),
    path('clientes/<str:identificador>/', Clientes_Views.as_view(), name='cliente'),
    path('login/', Login.as_view(), name='login'),
    path('verify/', Verify_Token_Views.as_view(), name='verify'),
    path('respaldo/', Respaldo.as_view(), name='resldo'),
]