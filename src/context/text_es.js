import { servicios } from "../utils/API"

const texts={
    inputsMessage:{
        confirmPassword:"Por favor confirmar la contraseña",
        errorPassword:"Las contraseña no Coinciden",
        max500:"Máximo 500 caracteres",
        max200:"Máximo 200 caracteres",
        max300:"Máximo 300 caracteres",
        max100:"Máximo 100 caracteres",
        max50:"Máximo 50 caracteres",
        max20:"Máximo 20 caracteres",
        max16:"Máximo 16 caracteres",
        max10:"Máximo 10 caracteres",
        min8:"Minimo 8 caracteres",
        min7:"Minimo 7 caracteres",
        min5:"Minimo 5 caracteres",
        min0:"Minimo 0",
        min1:"Minimo 1",
        minRecreador:"Minimo un recreador",
        minPrecio:"Agregue un precio al servicio",
        minMonto:"Agregue un monto extra",
        minNegative:"Valor no admitido",
        step1:"Solo números enteros",
        requireName:"Se requiere un nombre",
        requireNames:"Se requiere los nombres",
        requireLastName:"Se requiere los apellidos",
        requiredDesription: "Se requiere una descripción",
        requireDate:"Se requiere la fecha de nacimiento",
        requireUser:"Se requiere el Usuario",
        requirePassword:"Se requiere la contraseña",
        requireTel:"Se requiere un número de teléfono",
        requireFechaEvent:"Se requiere la fecha del evento",
        requireRecreadores:"Se requiere el numero de recreadores",
        requireMonto:"Se requiere un monto",
        requirePersonas:"Se requiere el numero de personas",
        requireDocumento:"Se requiere el numero de recreadores",
        requiredDireccion:"Se requiere una dirección",
        requirePrecio:"Se requiere el precio",
        requireCantidadMaterial:"Se requiere la cantidad de material a utilizar",
        selectRecreadores:"Seleccione los recreadores",
        selectActividades:"Seleccione las actividades a realizar",
        selectCargo:"Seleccione un cargo",
        selectCliente:"Seleccione un cliente",
        selectMateriales:"Seleccione los materiales a utilizar",
        selectNivel:"Seleccione un Nivel",
        selecPermisos:"Seleccione los permisos del Cargo",
        selecServicios:"Seleccione los servicios que desea",
        selectValor:"Seleccione un valor",
        selectCliente:"Seleccione un cliente o cree uno nuevo",
        selectTipoDocumento:"Seleccione un tipo de documento",
        selectGenero:"Seleccione el genero",
        invalidUser:"Usuario invalido",
        invalidName:"Nombre invalido",
        invalidEmail:"Correo Electronico invalido",
        invalidPassword:"Usuario invalido",
        invalidNombres:"Nombres invalidos",
        invalidLastNames:"Apellidos invalidos",
        noneSpace:"Sin espacios al inicio o al final",
        onlyCharacter11:"Solo se admiten 11 caracteres",
    },

    successMessage:{
        registerUsuario:"Usuario Registrado",
        registerNivel:"Nivel Registrado",
        registerTipoDocumento:"Tipo de Documento Registrado",
        registerMaterial:"Material Registrado",
        registerCargo:"Cargo Registrado",
        registerActividad:"Actividad Registrado",
        registerRecreador:"Recreador Registrado",
        registerServicio:"Servicio Registrado",
        registerGenero:"Genero Registrado",
        registerSobrecargo:"Sobrecargo Registrado",
        registerEvento:"Evento Registrado",
        // -----------------------------------------------------------
        editionUsuario:"Usuario Editado",
        editionNivel:"Nivel Editado",
        editionTipoDocumento:"Tipo de Documento Editado",
        editionMaterial:"Material Editado",
        editionCargo:"Cargo Editado",
        editionCliente:"Cliente Editado",
        editionActividad:"Actividad Editado",
        editionRecreador:"Recreador Editado",
        editionServicio:"Servicio Editado",
        editionGenero:"Genero Editado",
        editionSobrecargo:"Sobrecargo Editado",
    },

    confirmMessage:{
        confirmDelete:"Confirmar la Solicitud de Eliminación",
        confirRegister:"Por favor confirmar la solicitud de Registro",
        confirEdit:"Confirmar la Solicitud de Edición",
        confirCloset:"Desea cerrar sesión",
    },

    errorMessage:{
        errorDelete:`Error de Sistema al eliminar. Intente mas tarde`,
        errorObjet:`Error información no encontrada.`,
        errorSystem:`Error de Sistema. Por favor intente mas tarde`,
        errorConexion:"Error de conexion. Por favor intente mas tarde",
        errorRequest:"No se ha obtenido una respuesta. Por favor vuelva a intentar",
        errorResponse:"Error de consulta"
    },

    label:{
        descripcion:"Descripción",
        direccion:"Direccion del Evento",
        monto:"Monto Extra",
        nombre:"Nombre",
        materiales:"Materiales",
        fotoRecreador:"Foto del Recreador",
        duracion:"Duracion",
        precio:"Precio",
        cargo:"Cargo",
        nivel:"Nivel",
        permisos:"Permisos",
        actividades:"Actividades",
        user:"Usuario",
        email:"Correo Electrónico",
        password:"Contraseña",
        personas:"Número de Personas",
        cliente:"Cliente",
        admin:"Administrador",
        birthDate:"Fecha de Nacimiento",
        password2:"Repita la Contraseña",
        tipoDocuemnto:"Tipo de Documento",
        genero:"Genero",
        cantidadTotal:"Cantidad Total",
        dataPersonaCheck:"Datos de la persona ya registrados en el sistema",
        clienteCheck:"Nuevo Cliente",
        documento:"Número de Documento",
        namesUser:"Nombres del Usuario",
        namesCliente:"Nombres del Cliente",
        recreadores:"Número de Recreadores",
        recreadoresPermitidos:"Recreadores Permitidos",
        lastNamesUser:"Apellidos del Usuario",
        lastNamesCliente:"Apellidos del Cliente",
        namesRecreador:"Nombres del Recreador",
        lastNamesRecreador:"Apellidos del Recreador",
        telPrincipal:"Teléfono Principal",
        telSecundario:"Teléfono Secundario",
        fechaEvento:"Fecha Evento",
        numeroPersonas:"Número de Personas",
    },

    placeholder:{
        telefono:"0000-000-0000",
        nombre:"Ambos Nombres",
        apellidos:"Ambos Apellidos",
        descripcion:"Describa de manera concreta el elemento",
        correo:"ejemplo@dominio.com",
        numeroDocumento:"0.000.000",
        nombreElement:"Nombre del Elemento",
        direccion:"Dirección exacta del evento",
        numeroPersonas:"Numero aproximado de asistentes al evento",
        nameActividad:"Nombre de la Actividad",
        nameCargo:"Nombre del Cargo",
        nameGenero:"Nombre del Genero",
        nameMaterial:"Nombre del Material",
        nameNivel:"Nombre de la Nivel",
        nameSobrecargos:"Nombre de la Sobrecargos",
        nameServicio:"Nombre del Servicio",
        nameTipoDocumento:"Nombre del Tipo de Documento",

    },

    pages:{
        registerServicio:{
            name:"Registrar un Servicio",
            description:"Complete el formulario para registrar un nuevo Servicio"
        },
        registerUsuairo:{
            name:"Registrar un Nuevo Usuario",
            description:"Intruduzca los datos para agregar un nuevo usuario al sistema"
        },
        registerTipoDocumento:{
            name:"Registrar un nuevo Tipo de Documento",
            description:"Intruduzca los datos para agregar un nuevo tipo de documento"
        },
        registerGenero:{
            name:"Registrar un nuevo Genero",
            description:"Intruduzca los datos para agregar un nuevo genero"
        },
        registerMaterial:{
            name:"Registrar un nuevo Material",
            description:"Intruduzca los datos para agregar un nuevo material"
        },
        registerCargos:{
            name:"Registrar un nuevo Cargo",
            description:"Intruduzca los datos para agregar un nuevo cargo"
        },
        registerNiveles:{
            name:"Registrar un nuevo Nivel",
            description:"Intruduzca los datos para agregar un nuevo nivel"
        },
        registerActividades:{
            name:"Registrar una Actividad",
            description:"Intruduzca los datos para agregar una nueva Actividad"
        },
        registerSobrecargos:{
            name:"Registrar un Sobrecargo",
            description:"Intruduzca los datos para agregar un nuevo Sobrecargo"
        },
        registerEventos:{
            name:"Registrar un Evento",
            description:"Intruduzca los datos para agregar un nuevo Evento"
        },
        registerRecreadores:{
            name:"Registrar un Nuevo Recreador",
            description:"Intruduzca los datos para agregar un nuevo recreador al sistema"
        },
        editRecreadores:{
            name:"Editar un Recreador",
            description:"Intruduzca los datos para editar un recreador en el sistema"
        },
        editActividades:{
            name:"Editar una Actividad",
            description:"Intruduzca los datos para editar una Actividad"
        },
        editCargos:{
            name:"Editar un Cargo",
            description:"Intruduzca los datos para editar un cargo"
        },
        editNiveles:{
            name:"Editar un  Nivel",
            description:"Intruduzca los datos para editar un nivel"
        },
        editSobrecargo:{
            name:"Editar un Sobrecargo",
            description:"Intruduzca los datos para editar un sobrecargo"
        },
        editMaterial:{
            name:"Editar un Material",
            description:"Intruduzca los datos para editar un material"
        },
        editTipoDocumento:{
            name:"Editar un Tipo de Documento",
            description:"Intruduzca los datos para editar un tipo de documento"
        },
        editServicio:{
            name:"Editar un  Servicio",
            description:"Intruduzca los datos para editar un nuevo servicio"
        },
        editGenero:{
            name:"Editar un Genero",
            description:"Intruduzca los datos para editar un genero"
        },
        editCliente:{
            name:"Editar un Cliente",
            description:"Intruduzca los datos para editar un cliente"
        },
        getTipoDocumentos:{
            name:"Lista de Tipos de Documentos",
            description:"Verifique los Tipos de Documentos agregados"
        },
        getClientes:{
            name:"Lista de Clientes",
            description:"Verifique los Clientes agregados"
        },
        getGeneros:{
            name:"Lista de Generos",
            description:"Verifique los Generos agregados"
        },
        getEventos:{
            name:"Lista de Eventos",
            description:"Verifique los Eventos agregados"
        },
        getNiveles:{
            name:"Lista de Niveles",
            description:"Verifique los Niveles de recreador agregados"
        },
        getSobrecargos:{
            name:"Lista de Sobrecargos",
            description:"Verifique los Sobrecargos agregados"
        },
        getMateriales:{
            name:"Lista de Materiales",
            description:"Verifique los Materiales agregados"
        },
        getCargos:{
            name:"Lista de Cargos",
            description:"Verifique los cargos agregados"
        },
        getActividades:{
            name:"Lista de Actividades",
            description:"Verifique los Actividades agregados"
        },
        getRecreadores:{
            name:"Lista de Recreadores",
            description:"Verifique los Recreadores agregados"
        },
        getServicios:{
            name:"Lista de Servicios",
            description:"Verifique los servicios agregados"
        },
        recreador:{
            name:"Información del Recreador",
            description:"Toda la información del recreador"
        },
    },

    registerMessage:{
        searchItem:"Buscar por su Item",
        searchNameDocument:"Buscar por número de Documento o Nombre",
        buttonRegisterTipoDocumento:"Agregar un Nuevo Tipo de Documento",
        buttonRegisterGenero:"Agregar un Nuevo Genero",
        buttonRegisterNivel:"Agregar un Nuevo Nivel",
        buttonRegisterMaterial:"Agregar un Nuevo Material",
        buttonRegisterCargo:"Agregar un nuevo cargo",
        buttonRegisterActividad:"Agregar una nueva actividad",
        buttonRegisterRecreador:"Agregar un nuevo recreador",
        buttonRegisterSobrecargo:"Agregar un nuevo sobrecargo",
        buttonRegisterServicio:"Agregar un nuevo servicio",
        buttonRegisterEvento:"Agregar un nuevo evento",
        buttonRegisterEventosuccessMessage:"Agregar un nuevo evento",
    }
}

export default texts