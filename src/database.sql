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