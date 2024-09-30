import { servicios } from "../utils/API"

const texts={
    
    inputsMessage:{
        confirmPassword:"Por favor confirmar la contraseña",
        errorPassword:"Las contraseña no coinciden",
        max500:"Máximo 500 caracteres",
        max200:"Máximo 200 caracteres",
        max300:"Máximo 300 caracteres",
        max100:"Máximo 100 caracteres",
        max50:"Máximo 50 caracteres",
        max20:"Máximo 20 caracteres",
        max16:"Máximo 16 caracteres",
        max10:"Máximo 10 caracteres",
        max9:"Máximo 9 caracteres",
        min8:"Minimo 8 caracteres",
        min7:"Minimo 7 caracteres",
        min10:"Minimo 10 caracteres",
        min5:"Minimo 5 caracteres",
        min4:"Minimo 4 caracteres",
        min3:"Minimo 3 caracteres",
        min0:"Minimo 0",
        min1:"Minimo 1",
        minRecreador:"Minimo un recreador",
        minPrecio:"Agregue un precio al servicio",
        minMonto:"Agregue un monto extra",
        minNegative:"Valor no admitido",
        step1:"Solo números enteros",
        requireName:"Se requiere un nombre",
        requireNames:"Se requiere los nombres",
        requireDescripcion:"Se requiere una descripción",
        selectRegistro:"Seleccione el tipo de Registro",
        requirePregunta:"Pregunta Requeridad",
        requireLastName:"Se requiere los apellidos",
        requiredOpinion:"Se requiere una Opinión",
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
        requireCantidadMaterial:"Se requiere la cantidad de material",
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
        selectGenero:"Seleccione el género",
        invalidUser:"Usuario invalido",
        invalidCantidad:"Cantidad invalida",
        invalidName:"Nombre invalido",
        invalidEmail:"Correo Electronico invalido",
        invalidPassword:"Contraseña invalido",
        invalidNombres:"Nombres invalidos",
        invalidLastNames:"Apellidos invalidos",
        invalidMonto:"Monto invalido",
        invalidDocument:"Número de Documento Invalido",
        invalidTel:"Teléfono Invalido",
        noneSpace:"Sin espacios al inicio o al final",
        cantidadNegativa:"Cantidad Negativa",
        onlyCharacter11:"Son 11 caracteres",
        fechaMenor:'Fecha inválida debe ser mayor'
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
        registerGenero:"Género Registrado",
        registerSobrecosto:"Sobrecosto Registrado",
        registerEvento:"Evento Registrado",
        registerMetodoPago:"Metodo de Pago Registrado",
        registerEventoRecreadores:"Recreadores Asignados",
        registerPago:"Pago Registrado",
        registerPregunta:"Pregunta Registrado",
        registerRegistroMaterial:"Registro de Inventario Completo",
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
        editContraseña:"Contraseña Editada",
        editionGenero:"Género Editado",
        editionSobrecosto:"Sobrecosto Editado",
        editionMetodoPago:"Metodo de Pago Editado",
        editionEventoRecreadores:"Recreadores Actualizados",
        editionPregunta:"Pregunta Actualizados",
        // -+------------------
        eventoCancelado:"Evento Cancelado",
        eventoCompletado:"Evento Completado",
        userDisabled: "Usuario Desabilitado",
        recreadorDisabled: "Recreador Desabilitado",
    },

    confirmMessage:{
        confirmDelete:"Confirmar la solicitud de eliminación",
        confirmRegister:"Por favor confirmar la solicitud de registro",
        confirmRegisterRecreadores:"Desea asignar estos recreadores al evento",
        confirmEditRecreadores:"Desea cambiar los  recreadores del evento",
        confirmEdit:"Confirmar la solicitud de edición",
        confirmCloset:"Desea cerrar sesión",
        confirmPassword:"Desea cambiar la contraseña del usuario",
        confirmPago:"Desea registrar este pago",
        confirmCancelarEvento:"Desea Cancelar el evento? Esta acción no es reversible",
        confirmCompletar:"Se Completo el Evento",
        inactividad:"No se ha detectado ninguna actividad por un periodo prolongado de tiempo el sistema cerrara sesión por seguridad"
    },

    errorMessage:{
        errorDelete:`Error de Sistema al eliminar. Intente mas tarde`,
        errorCargoProtect:`Error Cargo de Administrador Protejido`,
        errorObjet:`Error información no encontrada.`,
        errorSystem:`Error de Sistema. Por favor intente mas tarde`,
        errorConexion:"Error de conexion. Por favor intente mas tarde",
        errorRequest:"No se ha obtenido una respuesta. Por favor vuelva a intentar",
        errorResponse:"Error de consulta",
        errorResponseCargo:"Error. No se pudo buscar el cargo, comuniquese con el administrador",
        errorMonto:"El monto presentado supera el monto a cancelar",
        errorNotPago:"No se a añadido ninguna forma de pago",
        errorNotTotal:"No se a compleato el monto a cancelar",
        errorRecreadoresRepeat:"Recreadores Duplicados",
        errorRecreadoresFaltantes:"Asigne todos los recreadores faltantes",
        errorUsuarioProtect:"Usuario Protejido",
        errorUsuarioActual:"Usuario Actualmente en uso",
        errorUserPasswor:"Este usuario es Administrador no se puede cambiar la contraseña"
    },

    label:{
        descripcion:"Descripción",
        direccion:"Dirección del Evento",
        monto:"Monto Extra",
        nombre:"Nombre",
        materiales:"Materiales",
        fotoRecreador:"Foto del Recreador",
        duracion:"Duración",
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
        genero:"Género",
        cantidadTotal:"Cantidad Total",
        dataPersonaCheck:"Datos de la persona ya registrados en el sistema",
        clienteCheck:"Nuevo Cliente",
        documento:"Número de Documento",
        namesUser:"Nombres del Usuario",
        namesCliente:"Nombres del Cliente",
        recreadores:"Número de Recreadores",
        recreador:"Recreador",
        recreadoresPermitidos:"Recreadores Permitidos",
        recreadoresPermitidos:"Recreadores Permitidos",
        lastNamesUser:"Apellidos del Usuario",
        lastNamesCliente:"Apellidos del Cliente",
        namesRecreador:"Nombres del Recreador",
        lastNamesRecreador:"Apellidos del Recreador",
        telPrincipal:"Teléfono Principal",
        telSecundario:"Teléfono Secundario",
        fechaEvento:"Fecha Evento",
        numeroPersonas:"Número de Personas",
        opinion:"¿Cúal es su Opinion del Evento?"
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
        buscarClientes:"Buscar Clientes",
        buscarRecreadores:"Buscar Recreadores",
        numeroPersonas:"Numero aproximado de asistentes al evento",
        nameActividad:"Nombre de la Actividad",
        nameCargo:"Nombre del Cargo",
        nameGenero:"Nombre del Género",
        nameMetodoPago:"Nombre del Metodo de Pago",
        nameMaterial:"Nombre del Material",
        nameNivel:"Nombre de la Nivel",
        nameSobrecostos:"Nombre de la Sobrecostos",
        nameServicio:"Nombre del Servicio",
        nameTipoDocumento:"Nombre del Tipo de Documento",
        usuario:"Nombre de Usuario unico",
        password:"Contraseña",
        repeatPassword:"Repita Contraseña",
        opinion:"Diganos su opinion del evento"
    },

    pages:{
        registerServicio:{
            name:"Registrar un Servicio",
            description:"Complete el formulario para registrar un nuevo Servicio"
        },
        registerUsuario:{
            name:"Registrar un nuevo Usuario",
            description:"Introduzca los datos para agregar un nuevo usuario al sistema"
        },
        registerTipoDocumento:{
            name:"Registrar un nuevo Tipo de Documento",
            description:"Introduzca los datos para agregar un nuevo tipo de documento"
        },
        registerGenero:{
            name:"Registrar un nuevo Género",
            description:"Introduzca los datos para agregar un nuevo género"
        },
        registerMaterial:{
            name:"Registrar un nuevo Material",
            description:"Introduzca los datos para agregar un nuevo material"
        },
        registerCargos:{
            name:"Registrar un nuevo Cargo",
            description:"Introduzca los datos para agregar un nuevo cargo"
        },
        registerNiveles:{
            name:"Registrar un nuevo Nivel",
            description:"Introduzca los datos para agregar un nuevo nivel"
        },
        registerActividades:{
            name:"Registrar una Actividad",
            description:"Introduzca los datos para agregar una nueva Actividad"
        },
        registerSobrecostos:{
            name:"Registrar un Sobrecosto",
            description:"Introduzca los datos para agregar un nuevo Sobrecosto"
        },
        registerEventos:{
            name:"Registrar un Evento",
            description:"Introduzca los datos para agregar un nuevo Evento"
        },
        registerRecreadores:{
            name:"Registrar un Nuevo Recreador",
            description:"Introduzca los datos para agregar un nuevo recreador al sistema"
        },
        registerMetodoPago:{
            name:"Registrar un Nuevo Metodo de Pago",
            description:"Introduzca los datos para agregar un nuevo metodo de pago al sistema"
        },
        registerPregunta:{
            name:"Registrar una Nueva Pregunta",
            description:"¿Qué Pregunta desea Registrar?"
        },
        editRecreador:{
            name:"Editar un Recreador",
            description:"Introduzca los datos para editar un recreador en el sistema"
        },
        editPregunta:{
            name:"Editar una Pregunta",
            description:"Complete para Editar"
        },
        editUsuario:{
            name:"Editar un nuevo Usuario",
            description:"Introduzca los datos para editar un usuario en el sistema"
        },
        editActividad:{
            name:"Editar una Actividad",
            description:"Introduzca los datos para editar una Actividad"
        },
        editMetodoPago:{
            name:"Editar un Metodo de Pago",
            description:"Introduzca los datos para editar un Metodo de Pago"
        },
        editCargo:{
            name:"Editar un Cargo",
            description:"Introduzca los datos para editar un cargo"
        },
        editNivel:{
            name:"Editar un  Nivel",
            description:"Introduzca los datos para editar un nivel"
        },
        editSobrecosto:{
            name:"Editar un Sobrecosto",
            description:"Introduzca los datos para editar un sobrecosto"
        },
        editMaterial:{
            name:"Editar un Material",
            description:"Introduzca los datos para editar un material"
        },
        editTipoDocumento:{
            name:"Editar un Tipo de Documento",
            description:"Introduzca los datos para editar un tipo de documento"
        },
        editServicio:{
            name:"Editar un  Servicio",
            description:"Introduzca los datos para editar un nuevo servicio"
        },
        editGenero:{
            name:"Editar un Género",
            description:"Introduzca los datos para editar un género"
        },
        editCliente:{
            name:"Editar un Cliente",
            description:"Introduzca los datos para editar un cliente"
        },
        getTipoDocumentos:{
            name:"Lista de Tipos de Documentos",
            description:"Verifique los Tipos de Documentos agregados"
        },
        getClientes:{
            name:"Lista de Clientes",
            description:"Verifique los Clientes agregados"
        },
        getPreguntas:{
            name:"Lista de Preguntas",
            description:"Verifique las Preguntas agregadas"
        },
        getGeneros:{
            name:"Lista de Géneros",
            description:"Verifique los Géneros agregados"
        },
        getEventos:{
            name:"Lista de Eventos",
            description:"Verifique los Eventos agregados"
        },
        getNiveles:{
            name:"Lista de Niveles",
            description:"Verifique los Niveles de recreador agregados"
        },
        getSobrecostos:{
            name:"Lista de Sobrecostos",
            description:"Verifique los Sobrecostos agregados"
        },
        getMateriales:{
            name:"Lista de Materiales",
            description:"Verifique los Materiales agregados"
        },
        getCargos:{
            name:"Lista de Cargos",
            description:"Verifique los Cargos agregados"
        },
        getActividades:{
            name:"Lista de Actividades",
            description:"Verifique las Actividades agregados"
        },
        getInventario:{
            name:"Registros de Inventario",
            description:"Verifique los registros de inventario del material"
        },
        getRecreadores:{
            name:"Lista de Recreadores",
            description:"Verifique los Recreadores agregados"
        },
        getServicios:{
            name:"Lista de Servicios",
            description:"Verifique los Servicios agregados"
        },
        getMetodosPago:{
            name:"Lista de los metodos de pago",
            description:"Verifique los Metodos de Pagos agregados"
        },
        getUsuarios:{
            name:"Lista de Usuario",
            description:"Verifique los Usuarios agregados"
        },
        getDolar:{
            name:"Lista de Precios del Dolar BCV",
            description:"Verifique los registros agregados"
        },
        recreador:{
            name:"Información del Recreador",
            description:"Toda la información del Recreador"
        },
        cargo:{
            name:"Información del Cargo",
            description:"Toda la información del Cargo"
        },
        pagos:{
            name:"Registrar Pagos de Eventos",
        },
        evento:{
            name:"Informacion del Evento",
            description:"Toda la información del evento"
        },
        cliente:{
            name:"Informacion del Cliente",
            description:"Toda la información del cliente"
        },
        servicio:{
            name:"Informacion del Servicio",
            description:"Toda la información del servicio"
        },
        recreadores_eventos:{
            name:"Recreadores del Evento",
            description:"Recreadores Asignados al Evento"
        },
        evaluacion:{
            name:"Evaluación del Evento",
            description:"Complete la evaluación del evento"
        },
        calendarEvents:{
            name:"Calendario de Eventos",
            description:"Calendario de los proximos Eventos"
        },
        passwordUser:{
            name:"Actualización de Contraseña",
            description:"Complete los campos para actualizar la contraseña"
        },
    },

    registerMessage:{
        searchItem:"Buscar por código",
        searchUser:"Buscar por código o usuario",
        searchClient:"Buscar por código o nombre",
        searchClientEvent:"Buscar por código o cliente",
        searchNameDocument:"Buscar por número de documento o nombre",
        buttonRegisterTipoDocumento:"Agregar un nuevo Tipo de Documento",
        buttonRegisterGenero:"Agregar un nuevo Género",
        buttonRegisterNivel:"Agregar un nuevo Nivel",
        buttonRegisterMaterial:"Agregar un nuevo Material",
        buttonRegisterCargo:"Agregar un nuevo Cargo",
        buttonRegisterActividad:"Agregar una nueva Actividad",
        buttonRegisterRecreador:"Agregar un nuevo Recreador",
        buttonRegisterSobrecosto:"Agregar un nuevo Sobrecosto",
        buttonRegisterMetodoPago:"Agregar un nuevo Metodo de Pago",
        buttonRegisterServicio:"Agregar un nuevo Servicio",
        buttonRegisterPregunta:"Agregar un nuevo Pregunta",
        buttonRegisterEvento:"Agregar un nuevo evento",
        buttonRegisterEventosuccessMessage:"Agregar un nuevo Evento",
        buttonRegisterUser:"Agregar un nuevo Usuario",
        buttonInactividad:"Extender sesión",
        buttonRegisterInventario:"Actualizar Inventario de Material"
    }
}

export default texts