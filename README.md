# Sistema Automatizado de control administrativo de eventos recreativos

integrantes:
Pedro Medina C.I. 30.565.353
Emilys Hoyos C.I. 29.828.557

# Tecnologias y Herramientas Utilizadas:

* Node
* React
* Python 3.8 
* Django
* MySql
* Xampp


# Instalacion:

- Descargar el proyecto

- Instalar las dependencias tanto las del frontend como las de backend

*Archivos de dependencias*
./package.json  | npm install
./backend/requirements.txt  | pip install -r requirements.txt

- Cargar la base de datos del proyecto

- Completar las variables de entorno del backen en un archivo .env

-------------------------------------------------------------------------------------
* SECRET_KEY = *Clave Secreta de django* [recomendacion: django-insecure-2&h!hmk-3ilmrw8+t!b39ulhawokq55%0t(^gg)*6!!re]
* KEYZIP= *Clave Secreta para encriptar los respaldos* 
* NAME_BASE_DATOS= *Nombre de la base de datos*  [recomendacion: bombita_recreacion]
* USER= *Usuario de la base de datos* 
* PASSWORD= *Password de la base de datos* 
* PORT=*Puerto de ejecucion de la base de datos*  [recomendacion: 3306]
* HOST= *Host de ejecucion de la base de datos*  [recomendacion: 127.0.0.1]
* TOKEN= *Clave secreta del jwt* 
* URL= *Url de ejecuion del backend para presentar las imagenes*  [recomendacion: http://127.0.0.1:8000/] 
* RUTA_RAIZ= *Clave Raiz del sistema*  [recomendacion: C:]
* CORREO= *Correo electronico para mandar correos*
* PASSWORDCORREO= *Clave secreta dada por google para aplicaciones externas*
----------------------------------------------------------------------------------------------

- Iniciar el proyecto con los comandos

* frontent | npm run dev

* backend | python manage.py runserver

# ADVERTENCIAS

- Recuerde crear su entorno virtual para ejecutar el proyecto en python

- En caso de conflictos revisar el settings del backend o las variables de entorno

- Si cambia los puertos de ejecucion por defecto del proyecto corregir la ruta de conexion entre el frontend y el backend el mismo esta en el archivo ./src/utils/API.jsx

# NOTAS

- Rutas por defecto del proyecto

* frontent | http://127.0.0.1:5173/

* backend | http://127.0.0.1:8000/API/v1/[RUTA]

- Puertos de Ejecucion

* frontent | 5173

* backend | 8000

- Usuario y Contraseña de Acceso

Usuario: Administrador1  
Clave: Password123

