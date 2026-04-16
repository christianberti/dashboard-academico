-- Estructura Completa de la Base de Datos Académica

-- 1. Tabla de Carreras
CREATE TABLE IF NOT EXISTS `carreras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla del Plan de Estudios
CREATE TABLE IF NOT EXISTS `plan_estudios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_carrera` int(11) NOT NULL DEFAULT 1,
  `nombre` varchar(255) NOT NULL,
  `anio_sugerido` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_carrera`) REFERENCES `carreras` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabla de Progreso del Estudiante
CREATE TABLE IF NOT EXISTS `progreso_estudiante` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_materia` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL DEFAULT 1,
  `estado` enum('Aprobada','En Curso','Final Pendiente','Pendiente') DEFAULT 'Pendiente',
  `nota` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `progreso_estudiante_ibfk_1` FOREIGN KEY (`id_materia`) REFERENCES `plan_estudios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla de Eventos de Exámenes
CREATE TABLE IF NOT EXISTS `eventos_examenes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_progreso` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `completado` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_progreso`) REFERENCES `progreso_estudiante` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabla de Archivos de Materia
CREATE TABLE IF NOT EXISTS `archivos_materia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_progreso` int(11) NOT NULL,
  `nombre_archivo` varchar(255) NOT NULL,
  `url_archivo` text NOT NULL,
  `tipo_archivo` varchar(50) DEFAULT 'link',
  `fecha_subida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_progreso`) REFERENCES `progreso_estudiante` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DATOS INICIALES
INSERT INTO `carreras` (`id`, `nombre`) VALUES (1, 'Licenciatura en Informática');

INSERT INTO `plan_estudios` (`id`, `id_carrera`, `nombre`, `anio_sugerido`) VALUES
(149, 1, 'Expresión de Problemas y Algoritmos (EPA)', 0),
(150, 1, 'Conceptos de Organización de Computadoras (COC)', 0),
(151, 1, 'Matemática 0', 0),
(152, 1, 'Conceptos de Algoritmos, Datos y Programas', 1),
(153, 1, 'Organización de Computadoras', 1),
(154, 1, 'Matemática 1', 1),
(155, 1, 'Taller de Programación', 1),
(156, 1, 'Arquitectura de Computadoras', 1),
(157, 1, 'Matemática 2', 1),
(158, 1, 'Fundamentos de Organización de Datos', 2),
(159, 1, 'Algoritmos y Estructuras de Datos', 2),
(160, 1, 'Seminario de Lenguajes', 2),
(161, 1, 'Diseño de Bases de Datos', 2),
(162, 1, 'Ingeniería de Software 1', 2),
(163, 1, 'Orientación a Objetos 1', 2),
(164, 1, 'Introducción a los Sistemas Operativos', 2),
(165, 1, 'Taller de lecto-comprensión y Traducción en inglés', 2),
(166, 1, 'Matemática 3', 3),
(167, 1, 'Ingeniería de Software 2', 3),
(168, 1, 'Conceptos y Paradigmas de Lenguajes de Programación', 3),
(169, 1, 'Orientación a Objetos 2', 3),
(170, 1, 'Redes de Datos y Comunicaciones', 3),
(171, 1, 'Programación Concurrente', 3),
(172, 1, 'Proyecto de Software', 3),
(173, 1, 'Computabilidad y Complejidad', 3),
(174, 1, 'Teoría de la Computación y Verificación de Programas', 4);

-- Asignación inicial de progreso (Todo pendiente por defecto)
INSERT INTO `progreso_estudiante` (`id_materia`, `usuario_id`, `estado`, `nota`)
SELECT id, 1, 'Pendiente', NULL FROM `plan_estudios`;
