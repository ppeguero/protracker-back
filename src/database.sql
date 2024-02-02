CREATE DATABASE gestor_proyectos;

USE gestor_proyectos;

CREATE TABLE rol(
	id_rol INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    correo VARCHAR(100),
    contraseña VARCHAR(100),
    token TEXT,
    id_rol_id INT,
    FOREIGN KEY (id_rol_id) REFERENCES rol(id_rol)
);

CREATE TABLE equipo(
id_equipo INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100)
);

CREATE TABLE estado(
id_estado INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100)
);

CREATE TABLE proyecto (
    id_proyecto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion VARCHAR(100),
    fecha_inicio DATETIME,
    id_usuario_id INT,
	id_estado_id INT,
    id_equipo_id INT,
    FOREIGN KEY (id_usuario_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_estado_id) REFERENCES estado(id_estado),
    FOREIGN KEY (id_equipo_id) REFERENCES equipo(id_equipo)
);

CREATE TABLE especialidad(
	id_especialidad INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100)
);

CREATE TABLE miembro (
    id_miembro INT PRIMARY KEY AUTO_INCREMENT,
	id_usuario_id INT,
    id_equipo_id INT,
    id_especialidad_id INT,
    FOREIGN KEY (id_usuario_id) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_especialidad_id) REFERENCES especialidad(id_especialidad),
    FOREIGN KEY (id_equipo_id) REFERENCES equipo(id_equipo)
);

CREATE TABLE tarea (
    id_tarea INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion VARCHAR(100),
    fecha_de_entrega DATETIME,
    fecha_limite DATETIME,
	ruta_documento VARCHAR(100),
    id_proyecto_id INT,
	id_estado_id INT,
    id_miembro_id INT,
    FOREIGN KEY (id_proyecto_id) REFERENCES proyecto(id_proyecto),
    FOREIGN KEY (id_estado_id) REFERENCES estado(id_estado),
    FOREIGN KEY (id_miembro_id) REFERENCES miembro(id_miembro)
);

CREATE TABLE recurso (
    id_recurso INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    descripcion VARCHAR(100),
    tipo VARCHAR(100),
    cantidad DECIMAL(5,2)
);

CREATE TABLE solicitud_recurso (
    id_solicitud_recurso INT PRIMARY KEY AUTO_INCREMENT,
    cantidad DECIMAL(5,2),
    razon_de_solicitud VARCHAR(100),
	fecha_de_inicio DATETIME,
    fecha_retorno DATETIME,
    aprobado bool,
    id_recurso_id INT,
    id_proyecto_id INT,
    id_miembro_id INT,
	FOREIGN KEY (id_recurso_id) REFERENCES recurso(id_recurso),
    FOREIGN KEY (id_proyecto_id) REFERENCES proyecto(id_proyecto),
    FOREIGN KEY (id_miembro_id) REFERENCES miembro(id_miembro)
);

DROP TABLE recurso;

-- STORED PROCEDURE - MANUEL PASOS
-- Obtener la tarea de un usuario en especifico
DELIMITER //
CREATE PROCEDURE SP_GetUserTasks(ID_USUARIO INT)
BEGIN
    SELECT tarea.id_tarea, tarea.nombre, tarea.descripcion, tarea.fecha_de_entrega, tarea.fecha_limite, tarea.ruta_documento,
           proyecto.nombre AS nombre_proyecto, estado.nombre AS estado_tarea
    FROM tarea
    JOIN proyecto ON tarea.id_proyecto_id = proyecto.id_proyecto
    JOIN estado ON tarea.id_estado_id = estado.id_estado
    JOIN miembro ON tarea.id_miembro_id = miembro.id_miembro
    JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
    WHERE usuario.id_usuario = ID_USUARIO;
END
// DELIMITER ;

CALL SP_GetUserTasks(1);

-- Actualizar el estado de una tarea
DELIMITER //
CREATE PROCEDURE SP_CompleteTask (ID_TAREA INT)
BEGIN
    UPDATE tarea SET id_estado_id = 2 WHERE id_tarea = ID_TAREA;
END 
// DELIMITER ;

-- ESTADISTICAS

-- Total de TareasCompletadas
CREATE VIEW VW_TareasCompletadas AS
SELECT 
    COUNT(*) AS TareasCompletadas,
    ROUND(AVG(CASE WHEN id_estado_id = 2 THEN 1 ELSE 0 END) * 100) AS PromedioCompletadas
FROM tarea;

SELECT * FROM V	W_TareasCompletadas;

-- Equipos trabajando
CREATE VIEW VW_EquiposTrabajando AS
SELECT
    COUNT(DISTINCT equipo.id_equipo) AS total_equipos,
    COUNT(DISTINCT miembro.id_miembro) AS cantidad_miembros_trabajando
FROM equipo
LEFT JOIN miembro ON equipo.id_equipo = miembro.id_equipo_id
WHERE miembro.id_miembro IS NOT NULL;

SELECT * FROM VW_EquiposTrabajando;

CREATE VIEW VW_ProyectosEnProceso AS
SELECT
    COUNT(proyecto.id_proyecto) AS cantidad_proyectos_en_proceso
FROM proyecto
WHERE proyecto.id_estado_id = 2;

SELECT * FROM VW_ProyectosEnProceso;


-- Total de miembros

CREATE VIEW VW_TotalMiembros AS
SELECT
    COUNT(DISTINCT miembro.id_miembro) AS total_miembros
FROM miembro;

SELECT * FROM VW_TotalMiembros;

-- Ver Nombre del miembro con su equipo
CREATE VIEW VW_MiembrosEquipos AS
SELECT 
    miembro.id_miembro,
    usuario.nombre AS nombre_miembro,
    equipo.nombre AS nombre_equipo,
    especialidad.nombre AS especialidad
FROM miembro
JOIN usuario ON miembro.id_usuario_id = usuario.id_usuario
JOIN equipo ON miembro.id_equipo_id = equipo.id_equipo
JOIN especialidad ON miembro.id_especialidad_id = especialidad.id_especialidad;