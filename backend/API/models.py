from django.db import models

# Create your models here.


# Tabla con los permisos propios del sistema
class Permisos(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)

    class Meta:
        db_table = "permisos"

# Tabla con los cargos del sistema principal funcion determinar que puede hacer cada usuario
class Cargos(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)
    administrador = models.BooleanField()
    img_logo = models.FileField(upload_to="img_logo_cargos", null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "cargos"

# Tabla intermedia entre los cargos y los permisos
class PermisosCargos(models.Model):
    permisos = models.ForeignKey(
        Permisos, on_delete=models.CASCADE, related_name="cargos", db_column="permiso_id")
    cargos = models.ForeignKey(
        Cargos, on_delete=models.CASCADE, related_name="permisos", db_column="cargo_id")

    class Meta:
        db_table = "permisos_has_cargos"

# Tabla los tipos de documentos
class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tipo_documentos"

# Tabla base de las personas o entidades
class Personas(models.Model):
    nombres = models.CharField(max_length=200)
    apellidos = models.CharField(max_length=200)
    numero_documento = models.BigIntegerField(unique=True)
    telefono_principal = models.BigIntegerField(unique=True)
    telefono_secundario = models.BigIntegerField()
    correo = models.EmailField(
        max_length=100, null=True, blank=True, unique=True)
    tipo_documento = models.ForeignKey(
        TipoDocumento, on_delete=models.PROTECT, related_name="personas", db_column="tipo_documento_id")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "personas"

# Tabla de los usuarios del sistema
class Usuarios(models.Model):
    persona = models.OneToOneField(
        Personas, on_delete=models.PROTECT, related_name="usuario", db_column="persona_id")
    usuario = models.CharField(max_length=20, unique=True)
    contraseña = models.CharField(max_length=200)
    inhabilitado = models.BooleanField(default=False)
    cargo = models.ForeignKey(
        Cargos, on_delete=models.PROTECT, related_name="usuarios", db_column="cargo_id")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "usuarios"

# Tabla los niveles de los recreadores
class Nivel(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "niveles"

# Tabla los niveles de los recreadores
class Generos(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=250, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "generos"

# Tabla los niveles de los recreadores
class Recreadores(models.Model):
    persona = models.OneToOneField(
        Personas, on_delete=models.PROTECT, related_name="recreador", db_column="persona_id")
    inhabilitado = models.BooleanField(default=False)
    nivel = models.ForeignKey(
        Nivel, on_delete=models.PROTECT, related_name="recreadores", db_column="nivel_id")
    genero = models.ForeignKey(
        Generos, on_delete=models.PROTECT, related_name="recreadores", db_column="genero_id")
    img_perfil = models.FileField(upload_to="img_recreadores", null=True, blank=True)
    fecha_nacimiento = models.DateField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "recreadores"

class Actividades(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "actividades"

class Materiales(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    total = models.IntegerField(default=0)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "materiales"

class Servicios(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    precio = models.FloatField(default=0)
    duracion = models.DurationField()
    numero_recreadores = models.IntegerField(default=1)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "servicios"

class MaterialesActividad(models.Model):
    material = models.ForeignKey(
        Materiales, on_delete=models.CASCADE, related_name="actividades", db_column="material_id")
    actividad = models.ForeignKey(
        Actividades, on_delete=models.CASCADE, related_name="materiales", db_column="actividad_id")

    class Meta:
        db_table = "materiales_has_actvidades"

class ServiciosRecreadores(models.Model):
    servicio = models.ForeignKey(
        Servicios, on_delete=models.CASCADE, related_name="recreador", db_column="servicio_id")
    recreador = models.ForeignKey(
        Recreadores, on_delete=models.CASCADE, related_name="servicio", db_column="recreador_id")

    class Meta:
        db_table = "servicios_has_recreadores"

class ServiciosActividades(models.Model):
    servicio = models.ForeignKey(
        Servicios, on_delete=models.CASCADE, related_name="actividades", db_column="servicio_id")
    actividad = models.ForeignKey(
        Actividades, on_delete=models.CASCADE, related_name="servicios", db_column="actividad_id")

    class Meta:
        db_table = "servicios_has_actvidades"

class Serviciosmateriales(models.Model):
    servicio = models.ForeignKey(
        Servicios, on_delete=models.CASCADE, related_name="materiales", db_column="servicio_id")
    material = models.ForeignKey(
        Materiales, on_delete=models.CASCADE, related_name="servicios", db_column="material_id")
    cantidad = models.ImageField(default=1)

    class Meta:
        db_table = "servicios_has_materiales"

class Clientes(models.Model):
    persona = models.ForeignKey(Personas, on_delete=models.PROTECT, related_name="clientes", db_column="persona_id")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "clientes"

class PrecioDolar(models.Model):
    precio=models.FloatField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "precio_dolar"

class Eventos(models.Model):
    fecha_evento = models.DateTimeField()
    direccion = models.CharField(max_length=500)
    numero_personas=models.IntegerField()
    cliente = models.ForeignKey(Clientes, on_delete=models.PROTECT, related_name="eventos", db_column="cliente_id")
    completado = models.BooleanField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    PrecioDolar = models.ForeignKey(PrecioDolar, on_delete=models.PROTECT, related_name="eventos", db_column="precio_dolar_id")

    class Meta:
        db_table = "eventos"



