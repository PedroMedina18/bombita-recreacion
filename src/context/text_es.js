
const texts={
    
    inputsMessage:{
        confirmPassword:"Por favor confirmar la contraseña",
        errorPassword:"Las contraseñas no coinciden",
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
        minRecreador:"Mínimo un recreador",
        minPrecio:"Agregue un precio al servicio",
        minMonto:"Agregue un monto extra",
        minNegative:"Valor no admitido",
        step1:"Solo números enteros",
        requiredName:"Se requiere un nombre",
        requiredNames:"Se requiere los nombres",
        requiredDescripcion:"Se requiere una descripción",
        requiredPregunta:"Pregunta requerida",
        requiredLastName:"Se requiere los apellidos",
        requiredOpinion:"Se requiere una opinión",
        requiredDesription: "Se requiere una descripción",
        requiredDate:"Se requiere la fecha de nacimiento",
        requiredUser:"Se requiere el usuario",
        requiredPassword:"Se requiere la contraseña",
        requiredTel:"Se requiere un número de teléfono",
        requiredFechaEvent:"Se requiere la fecha del evento",
        requiredRecreadores:"Se requiere el número de recreadores",
        requiredMonto:"Se requiere un monto",
        requiredPersonas:"Se requiere el número de personas",
        requiredDocumento:"Se requiere el número de recreadores",
        requiredDireccion:"Se requiere una dirección",
        requiredPrecio:"Se requiere el precio",
        requiredCantidadMaterial:"Se requiere la cantidad de material",
        selectRecreadores:"Seleccione los recreadores",
        selectRegistro:"Seleccione el tipo de registro",
        selectActividades:"Seleccione las actividades a realizar",
        selectCargo:"Seleccione un cargo",
        selectCliente:"Seleccione un cliente",
        selectMateriales:"Seleccione los materiales a utilizar",
        selectNivel:"Seleccione un nivel",
        selecPermisos:"Seleccione los permisos del cargo",
        selecServicios:"Seleccione los servicios que desea",
        selectValor:"Seleccione un valor",
        selectCliente:"Seleccione un cliente o cree uno nuevo",
        selectTipoDocumento:"Seleccione un tipo de documento",
        selectGenero:"Seleccione el género",
        invalidUser:"Usuario invalido",
        invalidCantidad:"Cantidad invalida",
        invalidName:"Nombre invalido",
        invalidEmail:"Correo electrónico invalido",
        invalidPassword:"Contraseña invalido",
        invalidNombres:"Nombres inválidos",
        invalidLastNames:"Apellidos inválidos",
        invalidMonto:"Monto invalido",
        invalidDocument:"Número de documento invalido",
        invalidTel:"Teléfono invalido",
        noneSpace:"Sin espacios al inicio o al final",
        cantidadNegativa:"Cantidad negativa",
        onlyCharacter11:"Son 11 caracteres",
        fechaMenor:'Fecha inválida debe ser mayor'
    },

    successMessage:{
        registerUsuario:"Usuario registrado",
        registerNivel:"Nivel registrado",
        registerTipoDocumento:"Tipo de documento registrado",
        registerMaterial:"Material registrado",
        registerCargo:"Cargo registrado",
        registerActividad:"Actividad registrado",
        registerRecreador:"Recreador registrado",
        registerServicio:"Servicio registrado",
        registerGenero:"Género registrado",
        registerSobrecosto:"Sobrecosto registrado",
        registerEvento:"Evento registrado",
        registerMetodoPago:"Metodo de pago registrado",
        registerEventoRecreadores:"Recreadores asignados",
        registerPago:"Pago registrado",
        registerPregunta:"Pregunta registrado",
        registerRegistroMaterial:"Registro de inventario completo",
        // -----------------------------------------------------------
        editionUsuario:"Usuario editado",
        editionNivel:"Nivel editado",
        editionTipoDocumento:"Tipo de documento editado",
        editionMaterial:"Material editado",
        editionCargo:"Cargo editado",
        editionCliente:"Cliente editado",
        editionActividad:"Actividad editado",
        editionRecreador:"Recreador editado",
        editionServicio:"Servicio editado",
        editContraseña:"Contraseña editada",
        editionGenero:"Género editado",
        editionSobrecosto:"Sobrecosto editado",
        editionMetodoPago:"Método de pago editado",
        editionEventoRecreadores:"Recreadores actualizados",
        editionPregunta:"Pregunta actualizados",
        // -+------------------
        eventoCancelado:"Evento cancelado",
        eventoCompletado:"Evento completado",
        userDisabled: "Usuario deshabilitado",
        recreadorDisabled: "Recreador deshabilitado",
    },

    confirmMessage:{
        confirmDelete:"Confirmar la solicitud de eliminación",
        confirmRegister:"Por favor confirmar la solicitud de registro",
        confirmRegisterRecreadores:"Desea asignar estos recreadores al evento",
        confirmEditRecreadores:"Desea cambiar los recreadores del evento",
        confirmEdit:"Confirmar la solicitud de edición",
        confirmCloset:"Desea cerrar sesión",
        confirmPassword:"Desea cambiar la contraseña del usuario",
        confirmPago:"Desea registrar este pago",
        confirmCancelarEvento:"Desea cancelar el evento? Esta acción no es reversible",
        confirmCompletar:"Se Completo el evento",
        inactividad:"No se ha detectado ninguna actividad por un periodo prolongado de tiempo el sistema cerrara sesión por seguridad"
    },

    errorMessage:{
        errorDelete:`Error de Sistema al eliminar. Intente más tarde`,
        errorCargoProtect:`Error cargo de administrador protegido`,
        errorObjet:`Error información no encontrada.`,
        errorSystem:`Error de sistema. Por favor intente más tarde`,
        errorConexion:"Error de conexión. Por favor intente más tarde",
        errorRequest:"No se ha obtenido una respuesta. Por favor vuelva a intentar",
        errorResponse:"Error de consulta",
        errorResponseCargo:"Error. No se pudo buscar el cargo, comuníquese con el administrador",
        errorMonto:"El monto presentado supera el monto a cancelar",
        errorNotPago:"No sé a añadido ninguna forma de pago",
        errorNotTotal:"No sé a completado el monto a cancelar",
        errorRecreadoresRepeat:"Recreadores duplicados",
        errorRecreadoresFaltantes:"Asigne todos los recreadores faltantes",
        errorUsuarioProtect:"Usuario protegido",
        errorUsuarioActual:"Usuario actualmente en uso",
        errorUserPasswor:"Este usuario es administrador no se puede cambiar la contraseña"
    },

    label:{
        descripcion: "Descripción",
        direccion: "Dirección del Evento",
        monto: "Monto Extra",
        nombre: "Nombre",
        materiales: "Materiales",
        fotoRecreador: "Foto del Recreador",
        duracion: "Duración",
        precio: "Precio",
        cargo: "Cargo",
        nivel: "Nivel",
        permisos: "Permisos",
        actividades: "Actividades",
        user:"Usuario",
        email: "Correo Electrónico",
        password: "Contraseña",
        personas: "Número de Personas",
        cliente: "Cliente",
        admin:"Administrador",
        birthDate: "Fecha de Nacimiento",
        password2:"Repita la Contraseña",
        tipoDocuemnto: "Tipo de Documento",
        genero: "Género",
        cantidadTotal:"Cantidad Total",
        dataPersonaCheck:"Datos de la persona ya registrados en el sistema",
        clienteCheck:"Nuevo Cliente",
        documento: "Número de Documento",
        namesUser:"Nombres del Usuario",
        namesCliente:"Nombres del Cliente",
        recreadores: "Número de Recreadores",
        recreador: "Recreador",
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
        opinion:"¿Cuál es su Opinión del Evento?"
    },

    placeholder:{
        telefono:"0000-000-0000",
        nombre:"Ambos nombres",
        apellidos:"Ambos apellidos",
        descripcion:"Describa de manera concreta el elemento",
        correo:"ejemplo@dominio.com",
        numeroDocumento:"0.000.000",
        nombreElement:"Nombre del elemento",
        direccion:"Dirección exacta del evento",
        buscarClientes:"Buscar clientes",
        buscarRecreadores:"Buscar recreadores",
        numeroPersonas:"Número aproximado de asistentes al evento",
        nameActividad:"Nombre de la actividad",
        nameCargo:"Nombre del cargo",
        nameGenero:"Nombre del género",
        nameMetodoPago:"Nombre del método de pago",
        nameMaterial:"Nombre del material",
        nameNivel:"Nombre del nivel",
        nameSobrecostos:"Nombre de los sobrecostos",
        nameServicio:"Nombre del servicio",
        nameTipoDocumento:"Nombre del tipo de documento",
        usuario:"Nombre de usuario único",
        password:"Contraseña",
        repeatPassword:"Repita contraseña",
        opinion: "¿Cuá es su opinión del evento?"
    },

    pages:{
        registerServicio:{
            name:"Registrar un servicio",
            description:"Complete el formulario para registrar un nuevo servicio"
        },
        registerUsuario:{
            name:"Registrar un nuevo usuario",
            description:"Introduzca los datos para agregar un nuevo usuario al sistema"
        },
        registerTipoDocumento:{
            name:"Registrar un nuevo tipo de documento",
            description:"Introduzca los datos para agregar un nuevo tipo de documento"
        },
        registerGenero:{
            name:"Registrar un nuevo género",
            description:"Introduzca los datos para agregar un nuevo género"
        },
        registerMaterial:{
            name:"Registrar un nuevo material",
            description:"Introduzca los datos para agregar un nuevo material"
        },
        registerCargos:{
            name:"Registrar un nuevo cargo",
            description:"Introduzca los datos para agregar un nuevo cargo"
        },
        registerNiveles:{
            name:"Registrar un nuevo nivel",
            description:"Introduzca los datos para agregar un nuevo nivel"
        },
        registerActividades:{
            name:"Registrar una actividad",
            description:"Introduzca los datos para agregar una nueva actividad"
        },
        registerSobrecostos:{
            name:"Registrar un sobrecosto",
            description:"Introduzca los datos para agregar un nuevo sobrecosto"
        },
        registerEventos:{
            name:"Registrar un evento",
            description:"Introduzca los datos para agregar un nuevo evento"
        },
        registerRecreadores:{
            name:"Registrar un nuevo recreador",
            description:"Introduzca los datos para agregar un nuevo recreador al sistema"
        },
        registerMetodoPago:{
            name:"Registrar un nuevo método de pago",
            description:"Introduzca los datos para agregar un nuevo método de pago al sistema"
        },
        registerPregunta:{
            name:"Registrar una nueva pregunta",
            description:"¿Qué pregunta desea registrar?"
        },
        editRecreador:{
            name:"Editar un recreador",
            description:"Introduzca los datos para editar un recreador en el sistema"
        },
        editPregunta:{
            name:"Editar una pregunta",
            description:"Complete para editar"
        },
        editUsuario:{
            name:"Editar un nuevo usuario",
            description:"Introduzca los datos para editar un usuario en el sistema"
        },
        editActividad:{
            name:"Editar una actividad",
            description:"Introduzca los datos para editar una actividad"
        },
        editMetodoPago:{
            name:"Editar un método de pago",
            description:"Introduzca los datos para editar un método de pago"
        },
        editCargo:{
            name:"Editar un cargo",
            description:"Introduzca los datos para editar un cargo"
        },
        editNivel:{
            name:"Editar un Nivel",
            description:"Introduzca los datos para editar un nivel"
        },
        editSobrecosto:{
            name:"Editar un sobrecosto",
            description:"Introduzca los datos para editar un sobrecosto"
        },
        editMaterial:{
            name:"Editar un material",
            description:"Introduzca los datos para editar un material"
        },
        editTipoDocumento:{
            name:"Editar un tipo de documento",
            description:"Introduzca los datos para editar un tipo de documento"
        },
        editServicio:{
            name:"Editar un servicio",
            description:"Introduzca los datos para editar un nuevo servicio"
        },
        editGenero:{
            name:"Editar un género",
            description:"Introduzca los datos para editar un género"
        },
        editCliente:{
            name:"Editar un cliente",
            description:"Introduzca los datos para editar un cliente"
        },
        getTipoDocumentos:{
            name:"Lista de tipos de documentos",
            description:"Verifique los tipos de documentos agregados"
        },
        getClientes:{
            name:"Lista de clientes",
            description:"Verifique los clientes agregados"
        },
        getPreguntas:{
            name:"Lista de preguntas",
            description:"Verifique las preguntas agregadas"
        },
        getGeneros:{
            name:"Lista de géneros",
            description:"Verifique los géneros agregados"
        },
        getEventos:{
            name:"Lista de eventos",
            description:"Verifique los rventos agregados"
        },
        getNiveles:{
            name:"Lista de niveles",
            description:"Verifique los niveles de recreadores agregados"
        },
        getSobrecostos:{
            name:"Lista de sobrecostos",
            description:"Verifique los sobrecostos agregados"
        },
        getMateriales:{
            name:"Lista de materiales",
            description:"Verifique los materiales agregados"
        },
        getCargos:{
            name:"Lista de cargos",
            description:"Verifique los cargos agregados"
        },
        getActividades:{
            name:"Lista de actividades",
            description:"Verifique las actividades agregadas"
        },
        getInventario:{
            name:"Registros de inventario",
            description:"Verifique los registros de inventario del material"
        },
        getRecreadores:{
            name:"Lista de recreadores",
            description:"Verifique los recreadores agregados"
        },
        getServicios:{
            name:"Lista de servicios",
            description:"Verifique los servicios agregados"
        },
        getMetodosPago:{
            name:"Lista de los métodos de pago",
            description:"Verifique los métodos de pagos agregados"
        },
        getUsuarios:{
            name:"Lista de usuario",
            description:"Verifique los usuarios agregados"
        },
        getDolar:{
            name:"Lista de precios del dólar BCV",
            description:"Verifique los registros agregados"
        },
        recreador:{
            name:"Información del recreador",
            description:"Toda la información del recreador"
        },
        cargo:{
            name:"Información del cargo",
            description:"Toda la información del cargo"
        },
        pagos:{
            name:"Registrar pagos de eventos",
        },
        evento:{
            name:"Información del evento",
            description:"Toda la información del evento"
        },
        cliente:{
            name:"Información del cliente",
            description:"Toda la información del cliente"
        },
        servicio:{
            name:"Información del servicio",
            description:"Toda la información del servicio"
        },
        recreadores_eventos:{
            name:"Recreadores del evento",
            description:"Recreadores asignados al evento"
        },
        evaluacion:{
            name:"Evaluación del evento",
            description:"Complete la evaluación del evento"
        },
        calendarEvents:{
            name:"Calendario de eventos",
            description:"Calendario de los próximos eventos"
        },
        passwordUser:{
            name:"Actualización de contraseña",
            description:"Complete los campos para actualizar la contraseña"
        },
        manual:{
            name:"Descripción de interfaces",
            description:"Descripción y guía de las diferentes interfaces del sistema"
        },
        alertCancel:{
            name:"Motivo por el que se cancela el evento",
        },
    },

    registerMessage:{
        searchItem:"Buscar por código",
        searchUser:"Buscar por código o usuario",
        searchClient:"Buscar por código o nombre",
        searchClientEvent:"Buscar por código o cliente",
        searchNameDocument:"Buscar por número de documento o nombre",
        buttonRegisterTipoDocumento:"Agregar un nuevo tipo de documento",
        buttonRegisterGenero:"Agregar un nuevo género",
        buttonRegisterNivel:"Agregar un nuevo nivel",
        buttonRegisterMaterial:"Agregar un nuevo material",
        buttonRegisterCargo:"Agregar un nuevo cargo",
        buttonRegisterActividad:"Agregar una nueva actividad",
        buttonRegisterRecreador:"Agregar un nuevo recreador",
        buttonRegisterSobrecosto:"Agregar un nuevo sobrecosto",
        buttonRegisterMetodoPago:"Agregar un nuevo método de pago",
        buttonRegisterServicio:"Agregar un nuevo servicio",
        buttonRegisterPregunta:"Agregar una nueva pregunta",
        buttonRegisterEvento:"Agregar un nuevo evento",
        buttonRegisterEventosuccessMessage:"Agregar un nuevo evento",
        buttonRegisterUser:"Agregar un nuevo usuario",
        buttonInactividad:"Extender sesión",
        buttonRegisterInventario:"Actualizar inventario de material"
    },

    tootlip:{
        eliminar:"Eliminar registro",
        editar:"Editar registro",
        data:"Información del registro",
        cargo:"Información del cargo",
        nivel:"Información del nivel",
        cliente:"Información del cliente",
        tipo_documento:"Información del tipo de documento",
        metodo_pago:"Información del metodo de pago",
        evento:"Información del evento",
        genero:"Información del genero",
        recreador:"Información del recreador",
        addRecreador:"Recreadores del evento",
        addpagos:"Registrar Pagos",
        cancelEvent:"Cancelar Evento",
        usuario:"Información del usuario",
        editUsuario:"Editar usuario",
        password:"Actualizar contraseña del usuario",
        material:"Información del material",
        sobrecosto:"Información del sobrecosto",
        servicio:"Información del servicio",
        addServicios:"Añadir servicios",
        addSobrecostos:"Añadir sobrecostos",
        disable:"Deshabilitar",
        enable:"Habilitar",
        detailInventario:"Detalles de Inventario"
    }
}


export default texts