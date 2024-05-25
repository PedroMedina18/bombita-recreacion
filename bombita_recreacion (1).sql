-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2024 a las 22:57:13
-- Versión del servidor: 10.1.38-MariaDB
-- Versión de PHP: 7.3.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bombita_recreacion`
--
CREATE DATABASE IF NOT EXISTS `bombita_recreacion` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `bombita_recreacion`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE IF NOT EXISTS `actividades` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `nombre`, `descripcion`, `fecha_actualizacion`, `fecha_registro`) VALUES
(1, 'Pinta Caritas', 'Pinta caritas', '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE IF NOT EXISTS `auth_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE IF NOT EXISTS `auth_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `auth_permission`
--

INSERT INTO `auth_permission` (`id`, `name`, `content_type_id`, `codename`) VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add user', 4, 'add_user'),
(14, 'Can change user', 4, 'change_user'),
(15, 'Can delete user', 4, 'delete_user'),
(16, 'Can view user', 4, 'view_user'),
(17, 'Can add content type', 5, 'add_contenttype'),
(18, 'Can change content type', 5, 'change_contenttype'),
(19, 'Can delete content type', 5, 'delete_contenttype'),
(20, 'Can view content type', 5, 'view_contenttype'),
(21, 'Can add session', 6, 'add_session'),
(22, 'Can change session', 6, 'change_session'),
(23, 'Can delete session', 6, 'delete_session'),
(24, 'Can view session', 6, 'view_session'),
(25, 'Can add usuarios', 7, 'add_usuarios'),
(26, 'Can change usuarios', 7, 'change_usuarios'),
(27, 'Can delete usuarios', 7, 'delete_usuarios'),
(28, 'Can view usuarios', 7, 'view_usuarios'),
(29, 'Can add tipo documento', 8, 'add_tipodocumento'),
(30, 'Can change tipo documento', 8, 'change_tipodocumento'),
(31, 'Can delete tipo documento', 8, 'delete_tipodocumento'),
(32, 'Can view tipo documento', 8, 'view_tipodocumento'),
(33, 'Can add permisos', 9, 'add_permisos'),
(34, 'Can change permisos', 9, 'change_permisos'),
(35, 'Can delete permisos', 9, 'delete_permisos'),
(36, 'Can view permisos', 9, 'view_permisos'),
(37, 'Can add personas', 10, 'add_personas'),
(38, 'Can change personas', 10, 'change_personas'),
(39, 'Can delete personas', 10, 'delete_personas'),
(40, 'Can view personas', 10, 'view_personas'),
(41, 'Can add cargos', 11, 'add_cargos'),
(42, 'Can change cargos', 11, 'change_cargos'),
(43, 'Can delete cargos', 11, 'delete_cargos'),
(44, 'Can view cargos', 11, 'view_cargos'),
(45, 'Can add permisos cargos', 12, 'add_permisoscargos'),
(46, 'Can change permisos cargos', 12, 'change_permisoscargos'),
(47, 'Can delete permisos cargos', 12, 'delete_permisoscargos'),
(48, 'Can view permisos cargos', 12, 'view_permisoscargos'),
(49, 'Can add actividades', 13, 'add_actividades'),
(50, 'Can change actividades', 13, 'change_actividades'),
(51, 'Can delete actividades', 13, 'delete_actividades'),
(52, 'Can view actividades', 13, 'view_actividades'),
(53, 'Can add materiales', 14, 'add_materiales'),
(54, 'Can change materiales', 14, 'change_materiales'),
(55, 'Can delete materiales', 14, 'delete_materiales'),
(56, 'Can view materiales', 14, 'view_materiales'),
(57, 'Can add recreadores', 15, 'add_recreadores'),
(58, 'Can change recreadores', 15, 'change_recreadores'),
(59, 'Can delete recreadores', 15, 'delete_recreadores'),
(60, 'Can view recreadores', 15, 'view_recreadores'),
(61, 'Can add nivel', 16, 'add_nivel'),
(62, 'Can change nivel', 16, 'change_nivel'),
(63, 'Can delete nivel', 16, 'delete_nivel'),
(64, 'Can view nivel', 16, 'view_nivel'),
(65, 'Can add servicios', 17, 'add_servicios'),
(66, 'Can change servicios', 17, 'change_servicios'),
(67, 'Can delete servicios', 17, 'delete_servicios'),
(68, 'Can view servicios', 17, 'view_servicios'),
(69, 'Can add materiales actividad', 18, 'add_materialesactividad'),
(70, 'Can change materiales actividad', 18, 'change_materialesactividad'),
(71, 'Can delete materiales actividad', 18, 'delete_materialesactividad'),
(72, 'Can view materiales actividad', 18, 'view_materialesactividad'),
(73, 'Can add servicios recreadores', 19, 'add_serviciosrecreadores'),
(74, 'Can change servicios recreadores', 19, 'change_serviciosrecreadores'),
(75, 'Can delete servicios recreadores', 19, 'delete_serviciosrecreadores'),
(76, 'Can view servicios recreadores', 19, 'view_serviciosrecreadores'),
(77, 'Can add serviciosmateriales', 20, 'add_serviciosmateriales'),
(78, 'Can change serviciosmateriales', 20, 'change_serviciosmateriales'),
(79, 'Can delete serviciosmateriales', 20, 'delete_serviciosmateriales'),
(80, 'Can view serviciosmateriales', 20, 'view_serviciosmateriales'),
(81, 'Can add servicios actividades', 21, 'add_serviciosactividades'),
(82, 'Can change servicios actividades', 21, 'change_serviciosactividades'),
(83, 'Can delete servicios actividades', 21, 'delete_serviciosactividades'),
(84, 'Can view servicios actividades', 21, 'view_serviciosactividades'),
(85, 'Can add clientes', 22, 'add_clientes'),
(86, 'Can change clientes', 22, 'change_clientes'),
(87, 'Can delete clientes', 22, 'delete_clientes'),
(88, 'Can view clientes', 22, 'view_clientes'),
(89, 'Can add precio dolar', 23, 'add_preciodolar'),
(90, 'Can change precio dolar', 23, 'change_preciodolar'),
(91, 'Can delete precio dolar', 23, 'delete_preciodolar'),
(92, 'Can view precio dolar', 23, 'view_preciodolar'),
(93, 'Can add eventos', 24, 'add_eventos'),
(94, 'Can change eventos', 24, 'change_eventos'),
(95, 'Can delete eventos', 24, 'delete_eventos'),
(96, 'Can view eventos', 24, 'view_eventos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE IF NOT EXISTS `auth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE IF NOT EXISTS `auth_user_groups` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

CREATE TABLE IF NOT EXISTS `cargos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  `administrador` tinyint(1) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `cargos`
--

INSERT INTO `cargos` (`id`, `nombre`, `descripcion`, `administrador`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 'Admin2', 'admin two', 1, '2024-01-29 18:13:14.948600', '2024-01-29 18:13:14.948600'),
(2, 'Admin3', 'admin tree', 0, '2024-01-29 18:14:57.921600', '2024-01-29 18:14:57.921600'),
(3, 'Careds', 'ESTE ES PRUEBA', 1, '2024-02-04 16:50:51.962000', '2024-02-04 16:50:51.962000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE IF NOT EXISTS `clientes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `persona_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientes_persona_id_6f576c2b_fk_personas_id` (`persona_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE IF NOT EXISTS `django_content_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `django_content_type`
--

INSERT INTO `django_content_type` (`id`, `app_label`, `model`) VALUES
(1, 'admin', 'logentry'),
(13, 'API', 'actividades'),
(11, 'API', 'cargos'),
(22, 'API', 'clientes'),
(24, 'API', 'eventos'),
(14, 'API', 'materiales'),
(18, 'API', 'materialesactividad'),
(16, 'API', 'nivel'),
(9, 'API', 'permisos'),
(12, 'API', 'permisoscargos'),
(10, 'API', 'personas'),
(23, 'API', 'preciodolar'),
(15, 'API', 'recreadores'),
(17, 'API', 'servicios'),
(21, 'API', 'serviciosactividades'),
(20, 'API', 'serviciosmateriales'),
(19, 'API', 'serviciosrecreadores'),
(8, 'API', 'tipodocumento'),
(7, 'API', 'usuarios'),
(3, 'auth', 'group'),
(2, 'auth', 'permission'),
(4, 'auth', 'user'),
(5, 'contenttypes', 'contenttype'),
(6, 'sessions', 'session');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE IF NOT EXISTS `django_migrations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `django_migrations`
--

INSERT INTO `django_migrations` (`id`, `app`, `name`, `applied`) VALUES
(1, 'contenttypes', '0001_initial', '2024-01-29 15:42:27.354600'),
(2, 'auth', '0001_initial', '2024-01-29 15:42:35.782600'),
(3, 'admin', '0001_initial', '2024-01-29 15:42:38.101600'),
(4, 'admin', '0002_logentry_remove_auto_add', '2024-01-29 15:42:38.169600'),
(5, 'admin', '0003_logentry_add_action_flag_choices', '2024-01-29 15:42:38.203600'),
(6, 'contenttypes', '0002_remove_content_type_name', '2024-01-29 15:42:39.926600'),
(7, 'auth', '0002_alter_permission_name_max_length', '2024-01-29 15:42:40.731600'),
(8, 'auth', '0003_alter_user_email_max_length', '2024-01-29 15:42:41.682600'),
(9, 'auth', '0004_alter_user_username_opts', '2024-01-29 15:42:41.859600'),
(10, 'auth', '0005_alter_user_last_login_null', '2024-01-29 15:42:42.530600'),
(11, 'auth', '0006_require_contenttypes_0002', '2024-01-29 15:42:42.625600'),
(12, 'auth', '0007_alter_validators_add_error_messages', '2024-01-29 15:42:42.685600'),
(13, 'auth', '0008_alter_user_username_max_length', '2024-01-29 15:42:46.066600'),
(14, 'auth', '0009_alter_user_last_name_max_length', '2024-01-29 15:42:47.400600'),
(15, 'auth', '0010_alter_group_name_max_length', '2024-01-29 15:42:48.378600'),
(16, 'auth', '0011_update_proxy_permissions', '2024-01-29 15:42:48.475600'),
(17, 'auth', '0012_alter_user_first_name_max_length', '2024-01-29 15:42:49.697600'),
(18, 'sessions', '0001_initial', '2024-01-29 15:42:50.192600'),
(19, 'API', '0001_initial', '2024-01-29 16:25:02.674600'),
(20, 'API', '0002_auto_20240129_1216', '2024-01-29 16:46:16.019600'),
(21, 'API', '0003_auto_20240129_1454', '2024-01-29 19:25:00.775600'),
(22, 'API', '0004_auto_20240129_1945', '2024-01-30 00:15:52.920600'),
(23, 'API', '0005_auto_20240207_1758', '2024-02-07 22:29:45.701400'),
(24, 'API', '0006_actividades_materiales_nivel_recreadores', '2024-02-08 15:56:42.001200'),
(25, 'API', '0007_alter_nivel_table', '2024-02-08 17:33:21.778000'),
(26, 'API', '0008_materialesactividad_servicios_serviciosactividades_serviciosmateriales_serviciosrecreadores', '2024-02-15 22:03:56.632600'),
(27, 'API', '0009_alter_servicios_numero_recreadores', '2024-03-12 10:19:46.268000'),
(28, 'API', '0010_auto_20240313_1215', '2024-03-13 16:45:27.253000'),
(29, 'API', '0011_auto_20240313_1216', '2024-03-13 16:46:46.353000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE IF NOT EXISTS `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE IF NOT EXISTS `eventos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `fecha_evento` datetime(6) NOT NULL,
  `direccion` varchar(500) NOT NULL,
  `numero_personas` int(11) NOT NULL,
  `completado` tinyint(1) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `precio_dolar_id` bigint(20) NOT NULL,
  `cliente_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventos_precio_dolar_id_e1099602_fk_precio_dolar_id` (`precio_dolar_id`),
  KEY `eventos_cliente_id_03b6be23_fk_clientes_id` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales`
--

CREATE TABLE IF NOT EXISTS `materiales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `total` int(11) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `materiales`
--

INSERT INTO `materiales` (`id`, `nombre`, `descripcion`, `total`, `fecha_actualizacion`, `fecha_registro`) VALUES
(1, 'Pintura Para Pintar Caritas', 'Pintura de cara', 50, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000'),
(2, 'Paquete De Globo 50 Unidades', 'Paquete de globos para globo magia de 50 Unidades', 50, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000'),
(6, 'Prueba 4', 'dasdasd', 54, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materiales_has_actvidades`
--

CREATE TABLE IF NOT EXISTS `materiales_has_actvidades` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `actividad_id` bigint(20) NOT NULL,
  `material_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `materiales_has_actvi_actividad_id_c85a288a_fk_actividad` (`actividad_id`),
  KEY `materiales_has_actvidades_material_id_a9cb7a13_fk_materiales_id` (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `materiales_has_actvidades`
--

INSERT INTO `materiales_has_actvidades` (`id`, `actividad_id`, `material_id`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles`
--

CREATE TABLE IF NOT EXISTS `niveles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `niveles`
--

INSERT INTO `niveles` (`id`, `nombre`, `descripcion`, `fecha_actualizacion`, `fecha_registro`) VALUES
(1, 'Basi Cordi', 'Nivel basico para principiantes recien iniciados', '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE IF NOT EXISTS `permisos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Cargos', 'Permiso destinado para aquellos con autorizacion para registrar, eliminar y editar los cargos en el sistema'),
(2, 'Usuarios', 'Permiso destinado para aquellos con autorizacion para registrar, eliminar y editar los usuarios del sistema');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos_has_cargos`
--

CREATE TABLE IF NOT EXISTS `permisos_has_cargos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cargo_id` bigint(20) NOT NULL,
  `permiso_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `persmisos_has_cargos_cargo_id_6d60a3d4_fk_cargos_id` (`cargo_id`),
  KEY `persmisos_has_cargos_permiso_id_88b93ceb_fk_permisos_id` (`permiso_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `permisos_has_cargos`
--

INSERT INTO `permisos_has_cargos` (`id`, `cargo_id`, `permiso_id`) VALUES
(1, 2, 1),
(2, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE IF NOT EXISTS `personas` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombres` varchar(200) NOT NULL,
  `apellidos` varchar(200) NOT NULL,
  `numero_documento` bigint(20) NOT NULL,
  `telefono_principal` bigint(20) NOT NULL,
  `telefono_secundario` bigint(20) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `tipo_documento_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  UNIQUE KEY `personas_telefono_principal_90a7767a_uniq` (`telefono_principal`),
  UNIQUE KEY `personas_correo_228cdb14_uniq` (`correo`),
  KEY `personas_tipo_documento_id_0d212d43_fk_tipo_documento_id` (`tipo_documento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id`, `nombres`, `apellidos`, `numero_documento`, `telefono_principal`, `telefono_secundario`, `correo`, `fecha_registro`, `fecha_actualizacion`, `tipo_documento_id`) VALUES
(1, 'Pedro Egnis', 'Medina Camacho', 30565353, 4241250451, 41654789, 'medinapedrito@gmail.com', '2024-01-30 04:05:26.623000', '2024-01-30 04:05:26.623000', 1),
(3, 'Emilys Nazareth', 'Hoyos Zambrano', 29565353, 4241150451, 416541789, 'medinadsdsdsdo@gmail.com', '2024-01-30 04:07:34.682000', '2024-01-30 04:07:34.682000', 1),
(4, 'Josue Ramirez', 'Lopez Soza', 30457896, 4241254785, 4241458965, 'sdasdasdads@gmail.com', '2024-02-06 05:36:41.751000', '2024-02-06 05:36:41.751000', 1),
(6, 'Adeleiny Nazareth', 'Medina Camacho', 30871725, 4241250452, 0, 'adeleinymedina@gmail.com', '2024-02-11 03:15:20.076000', '2024-02-11 03:15:20.076000', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `precio_dolar`
--

CREATE TABLE IF NOT EXISTS `precio_dolar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `precio` double NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recreadores`
--

CREATE TABLE IF NOT EXISTS `recreadores` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `inhabilitado` tinyint(1) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `nivel_id` bigint(20) NOT NULL,
  `persona_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `persona_id` (`persona_id`),
  KEY `recreadores_nivel_id_2646afe4_fk_nivel_id` (`nivel_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `recreadores`
--

INSERT INTO `recreadores` (`id`, `inhabilitado`, `fecha_nacimiento`, `fecha_registro`, `fecha_actualizacion`, `nivel_id`, `persona_id`) VALUES
(1, 0, '2005-07-31', '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000', 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE IF NOT EXISTS `servicios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `precio` double NOT NULL,
  `duracion` bigint(20) NOT NULL,
  `numero_recreadores` int(11) NOT NULL,
  `descripcion` varchar(300) DEFAULT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_has_actvidades`
--

CREATE TABLE IF NOT EXISTS `servicios_has_actvidades` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `actividad_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicios_has_actvidades_actividad_id_6b0c4309_fk_actividades_id` (`actividad_id`),
  KEY `servicios_has_actvidades_servicio_id_383f758b_fk_servicios_id` (`servicio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_has_materiales`
--

CREATE TABLE IF NOT EXISTS `servicios_has_materiales` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cantidad` varchar(100) NOT NULL,
  `material_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicios_has_materiales_material_id_df5656d4_fk_materiales_id` (`material_id`),
  KEY `servicios_has_materiales_servicio_id_d7fb6192_fk_servicios_id` (`servicio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios_has_recreadores`
--

CREATE TABLE IF NOT EXISTS `servicios_has_recreadores` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `recreador_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicios_has_recrea_recreador_id_26ba07e7_fk_recreador` (`recreador_id`),
  KEY `servicios_has_recreadores_servicio_id_63f5d836_fk_servicios_id` (`servicio_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_documentos`
--

CREATE TABLE IF NOT EXISTS `tipo_documentos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tipo_documentos`
--

INSERT INTO `tipo_documentos` (`id`, `nombre`, `descripcion`, `fecha_registro`, `fecha_actualizacion`) VALUES
(1, 'V', 'Cedula Venezolana', '2024-01-30 03:41:17.874000', '2024-01-30 03:41:17.874000'),
(2, 'E', 'Cedula Extranjero', '2024-01-30 03:41:30.799000', '2024-01-30 03:41:30.799000'),
(3, 'J', 'RIF de Venezuela', '2024-01-30 03:41:53.090000', '2024-01-30 03:41:53.090000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(20) NOT NULL,
  `contraseña` varchar(200) NOT NULL,
  `inhabilitado` tinyint(1) NOT NULL,
  `cargo_id` bigint(20) NOT NULL,
  `persona_id` bigint(20) NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `persona_id` (`persona_id`),
  KEY `usuarios_cargo_id_0c8a3f58_fk_cargos_id` (`cargo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `contraseña`, `inhabilitado`, `cargo_id`, `persona_id`, `fecha_actualizacion`, `fecha_registro`) VALUES
(1, 'AMINISTRADOR', 'pbkdf2:sha256:260000$kpA53lsj6RRYc6xjDFynBUhVdlJZbu$e90674e591371b207ff35003f8eee1fc17d6893ad6ff6b3d7a41cd4d9f7b7955', 0, 1, 1, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000'),
(2, 'AMINISTRADOR2', 'pbkdf2:sha256:260000$beCdbVByma0uV1hdG1xP9qNtTEJPQt$23bba2e363c89f4601d6e16f5ec70b53bebc63a6bd34321d7e10ba7c1bd9c95b', 0, 2, 3, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000'),
(3, 'Ramirez123', 'pbkdf2:sha256:260000$Cnrgv4ZgpwkxoCS49FNVTjTzAsEHKq$7ecac68a6381305bea96334d3e2e3d854f87c2777bf438c02a9b2a2ed54ea71d', 0, 2, 4, '2024-02-11 03:15:20.424000', '2024-02-11 03:15:20.424000');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_persona_id_6f576c2b_fk_personas_id` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`);

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_cliente_id_03b6be23_fk_clientes_id` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `eventos_precio_dolar_id_e1099602_fk_precio_dolar_id` FOREIGN KEY (`precio_dolar_id`) REFERENCES `precio_dolar` (`id`);

--
-- Filtros para la tabla `materiales_has_actvidades`
--
ALTER TABLE `materiales_has_actvidades`
  ADD CONSTRAINT `materiales_has_actvi_actividad_id_c85a288a_fk_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`),
  ADD CONSTRAINT `materiales_has_actvidades_material_id_a9cb7a13_fk_materiales_id` FOREIGN KEY (`material_id`) REFERENCES `materiales` (`id`);

--
-- Filtros para la tabla `permisos_has_cargos`
--
ALTER TABLE `permisos_has_cargos`
  ADD CONSTRAINT `persmisos_has_cargos_cargo_id_6d60a3d4_fk_cargos_id` FOREIGN KEY (`cargo_id`) REFERENCES `cargos` (`id`),
  ADD CONSTRAINT `persmisos_has_cargos_permiso_id_88b93ceb_fk_permisos_id` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`);

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `personas_tipo_documento_id_0d212d43_fk_tipo_documento_id` FOREIGN KEY (`tipo_documento_id`) REFERENCES `tipo_documentos` (`id`);

--
-- Filtros para la tabla `recreadores`
--
ALTER TABLE `recreadores`
  ADD CONSTRAINT `recreadores_nivel_id_2646afe4_fk_nivel_id` FOREIGN KEY (`nivel_id`) REFERENCES `niveles` (`id`),
  ADD CONSTRAINT `recreadores_persona_id_d6a6b4c3_fk_personas_id` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`);

--
-- Filtros para la tabla `servicios_has_actvidades`
--
ALTER TABLE `servicios_has_actvidades`
  ADD CONSTRAINT `servicios_has_actvidades_actividad_id_6b0c4309_fk_actividades_id` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`),
  ADD CONSTRAINT `servicios_has_actvidades_servicio_id_383f758b_fk_servicios_id` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);

--
-- Filtros para la tabla `servicios_has_materiales`
--
ALTER TABLE `servicios_has_materiales`
  ADD CONSTRAINT `servicios_has_materiales_material_id_df5656d4_fk_materiales_id` FOREIGN KEY (`material_id`) REFERENCES `materiales` (`id`),
  ADD CONSTRAINT `servicios_has_materiales_servicio_id_d7fb6192_fk_servicios_id` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);

--
-- Filtros para la tabla `servicios_has_recreadores`
--
ALTER TABLE `servicios_has_recreadores`
  ADD CONSTRAINT `servicios_has_recrea_recreador_id_26ba07e7_fk_recreador` FOREIGN KEY (`recreador_id`) REFERENCES `recreadores` (`id`),
  ADD CONSTRAINT `servicios_has_recreadores_servicio_id_63f5d836_fk_servicios_id` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_cargo_id_0c8a3f58_fk_cargos_id` FOREIGN KEY (`cargo_id`) REFERENCES `cargos` (`id`),
  ADD CONSTRAINT `usuarios_persona_id_0d01091e_fk_personas_id` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
