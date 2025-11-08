-- Esquema y tablas
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres;
SET search_path TO public;

CREATE TABLE roles ( id SERIAL PRIMARY KEY, nombre VARCHAR(50) UNIQUE NOT NULL );
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY, nombre VARCHAR(100) NOT NULL, apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL, id_rol INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE
);
CREATE TABLE ofertas (
  id SERIAL PRIMARY KEY, id_empresa INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(120) NOT NULL, descripcion TEXT NOT NULL, tipo_practica VARCHAR(50) NOT NULL DEFAULT 'Profesional',
  fecha_publicacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, estado VARCHAR(30) NOT NULL DEFAULT 'Activa'
);

-- Seed base
INSERT INTO roles (nombre) VALUES ('Estudiante'),('Empresa'),('Coordinador'),('Admin') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO usuarios (nombre, apellido, correo, password_hash, id_rol)
VALUES ('Empresa','Demo','empresa@demo.com','$2a$10$qVbYvQXn/Jx6HYP.3C6IYO64oMfU5FfElNDqLr2wXasQFXVuwSqtW',(SELECT id FROM roles WHERE nombre='Empresa'))
ON CONFLICT (correo) DO NOTHING;
