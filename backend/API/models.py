from django.db import models

# Create your models here.



# Tabla con los permisos propios del sistema
class Permisos(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table="permisos"

# Tabla con los cargos del sistema principal funcion determinar que puede hacer cada usuario
class Cargos(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=500, null=True, blank=True)
    administrador = models.BooleanField()
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="cargos"

# Tabla intermedia entre los cargos y los permisos
class PermisosCargos(models.Model):
    permisos=models.ForeignKey(Permisos, on_delete=models.CASCADE, related_name="cargos", db_column="permiso_id")
    cargos = models.ForeignKey(Cargos, on_delete=models.CASCADE, related_name="permisos", db_column="cargo_id")

    class Meta:
        db_table="permisos_has_cargos"

# Tabla base de las personas o entidades
class TipoDocumento(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=200, null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="tipo_documento"

# Tabla base de las personas o entidades
class Personas(models.Model):
    nombres = models.CharField(max_length=200)
    apellidos = models.CharField(max_length=200)
    numero_documento = models.BigIntegerField(unique=True)
    telefono_principal = models.BigIntegerField(unique=True)
    telefono_secundario = models.BigIntegerField()
    correo = models.EmailField(max_length=100, null=True, blank=True, unique=True)
    tipo_documento = models.ForeignKey(TipoDocumento, on_delete=models.PROTECT, related_name="personas", db_column="tipo_documento_id")
    fecha_registro = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table="personas"

# Tabla base de las personas o entidades
class Usuarios(models.Model):
    persona = models.OneToOneField(Personas, on_delete=models.PROTECT, related_name="usuario", db_column="persona_id")
    usuario = models.CharField(max_length=20, unique=True)
    contraseña = models.CharField(max_length=200)
    inhabilitado = models.BooleanField(default=False)
    cargo = models.ForeignKey(Cargos, on_delete=models.PROTECT, related_name="usuarios", db_column="cargo_id")

    class Meta:
        db_table="usuarios"