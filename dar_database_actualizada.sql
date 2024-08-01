DROP DATABASE IF EXISTS darg_database;

CREATE DATABASE darg_database;
USE darg_database;

CREATE TABLE tb_clientes
(
	id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    fecha_registro_cliente DATE,
	dui_cliente VARCHAR(10) NOT NULL,
	telefono_cliente VARCHAR(9) NOT NULL,
	correo_cliente VARCHAR(50) NOT NULL,
    clave_usuario_cliente VARCHAR(100) DEFAULT('00000000'),
	nombres_cliente VARCHAR(50) NOT NULL ,
	apellidos_cliente VARCHAR(50) NOT NULL,
	tipo_cliente ENUM('Persona natural','Persona juridica') NOT NULL,
	departamento_cliente ENUM('Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad', 'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador', 'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'),
	NIT_cliente VARCHAR(18) NULL,
	NRC_cliente VARCHAR(11) NULL,
    NRF_cliente VARCHAR(25) NULL,
    rubro_comercial ENUM('Alimenticio','Automotriz', 'Belleza', 'Calzado') NULL,
    estado_cliente ENUM('Activo', 'Eliminado'),
    fto_cliente VARCHAR(50)
);

/**UNIQUE**/
ALTER TABLE tb_clientes
  ADD CONSTRAINT u_dui_cliente UNIQUE (dui_cliente),
  ADD CONSTRAINT u_telefono_cliente UNIQUE (telefono_cliente),
  ADD CONSTRAINT u_correo_cliente UNIQUE (correo_cliente),
  ADD CONSTRAINT u_NIT_cliente UNIQUE (NIT_cliente),
  ADD CONSTRAINT u_NRC_cliente UNIQUE (NRC_cliente),
  ADD CONSTRAINT u_NRF_cliente UNIQUE (NRF_cliente);

CREATE TABLE tb_marcas_automoviles
(
	id_marca_automovil INT AUTO_INCREMENT PRIMARY KEY,
	nombre_marca_automovil VARCHAR(50) NOT NULL
);

CREATE TABLE tb_modelos_automoviles
(
	id_modelo_automovil INT AUTO_INCREMENT PRIMARY KEY,
	id_marca_automovil INT,
	nombre_modelo_automovil VARCHAR(50) NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_modelos_automoviles
ADD CONSTRAINT u_fk_marca_automovil_modelo_automovil FOREIGN KEY (id_marca_automovil) REFERENCES tb_marcas_automoviles(id_marca_automovil);

CREATE TABLE tb_tipos_automoviles
(
	id_tipo_automovil INT auto_increment PRIMARY KEY ,
	nombre_tipo_automovil VARCHAR(80) NOT NULL
);

CREATE TABLE tb_colores
(
	id_color INT PRIMARY KEY AUTO_INCREMENT,
	nombre_color VARCHAR(50) NOT NULL
);

CREATE TABLE tb_automoviles
(
	id_automovil INT PRIMARY KEY AUTO_INCREMENT,
	id_modelo_automovil INT, /*FK*/
	id_tipo_automovil INT, /*FK*/
	id_color INT, /*FK*/
	fecha_fabricacion_automovil YEAR NOT NULL,
	placa_automovil VARCHAR(8),
	imagen_automovil VARCHAR(25) NOT NULL,
	id_cliente INT, /*FK*/
	fecha_registro DATE NOT NULL,
    estado_automovil ENUM('Activo', 'Eliminado') NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_automoviles
  ADD CONSTRAINT u_fk_modelo_automovil_automovil FOREIGN KEY (id_modelo_automovil) REFERENCES tb_modelos_automoviles(id_modelo_automovil),
  ADD CONSTRAINT u_fk_tipo_automovil_automovil FOREIGN KEY (id_tipo_automovil) REFERENCES tb_tipos_automoviles(id_tipo_automovil),
  ADD CONSTRAINT u_fk_color_automovil FOREIGN KEY (id_color) REFERENCES tb_colores(id_color),
  ADD CONSTRAINT u_fk_cliente_automovil FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente);
  
  ALTER TABLE tb_automoviles 
  ADD CONSTRAINT u_placa UNIQUE(placa_automovil);

CREATE TABLE tb_tipos_servicios
(
	id_tipo_servicio INT PRIMARY KEY AUTO_INCREMENT,
	nombre_tipo_servicio VARCHAR(50),
    imagen_servicio VARCHAR(25)
);

CREATE TABLE tb_servicios
(
	id_servicio INT PRIMARY KEY AUTO_INCREMENT,
	id_tipo_servicio INT, /*FK*/
    nombre_servicio VARCHAR(50) NOT NULL,
	descripcion_servicio VARCHAR(50) NOT NULL 
);



/**FOREIGN KEY**/
ALTER TABLE tb_servicios
ADD CONSTRAINT u_fk_tipo_servicio_servicio FOREIGN KEY (id_tipo_servicio) REFERENCES tb_tipos_servicios(id_tipo_servicio);

CREATE TABLE tb_formas_pagos
(
	id_forma_pago INT PRIMARY KEY AUTO_INCREMENT,
	nombre_forma_pago VARCHAR(100)
);

CREATE TABLE tb_citas
(
	id_cita INT PRIMARY KEY AUTO_INCREMENT,
    fecha_registro DATE NOT NULL,
    fecha_hora_cita DATETIME NOT NULL,
    id_automovil INT /**FK**/,
    movilizacion_vehiculo ENUM('Yo llevo el auto y lo traigo de regreso', 'Yo solo regreso el auto', 'Yo solo llevo el auto'),
    zona_habilitada ENUM('Ayutuxtepeque',  'Aguilares') NULL,  
	direccion_ida VARCHAR(250) NULL,  
	direccion_regreso VARCHAR(250) NULL,
    estado_cita ENUM('En espera', 'Aceptado', 'Cancelado', 'Finalizada') /**(Automáticamente se borre en 24 horas )**/ NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_citas
ADD CONSTRAINT u_fk_automovil_cita FOREIGN KEY (id_automovil) REFERENCES tb_automoviles(id_automovil);

CREATE TABLE tb_servicios_en_proceso
(
	id_servicio_en_proceso INT PRIMARY KEY AUTO_INCREMENT,
	fecha_registro DATETIME NOT NULL, 
	fecha_aproximada_finalizacion DATETIME NOT NULL,  
	fecha_finalizacion DATETIME NULL, /*La misma que la aproximada, ahi ven si la actualizan después */
	id_cita INT, /* FK */
	id_servicio INT,
    cantidad_servicio INT NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_servicios_en_proceso
ADD CONSTRAINT u_fk_cita_servicio_en_proceso FOREIGN KEY (id_cita) REFERENCES tb_citas(id_cita),
ADD CONSTRAINT u_fk_servicio_servicio_en_proceso FOREIGN KEY (id_servicio) REFERENCES tb_servicios(id_servicio);

CREATE TABLE tb_consumidores_finales
(
	id_consumidor_final INT PRIMARY KEY AUTO_INCREMENT,
	numero_factura VARCHAR(5) NOT NULL,
	fecha_registro_factura DATE DEFAULT(CURRENT_DATE()) NOT NULL,
	venta_a_cuenta_de ENUM('CONTADO','TARJETA'),
	duracion_garantia INT,
    nota VARCHAR(100),
	id_cita INT /*FK*/,
	estado_consumidor_final ENUM('En espera', 'Cancelado', 'Completado') NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_consumidores_finales
ADD CONSTRAINT u_fk_cita_consumidor_final FOREIGN KEY (id_cita) REFERENCES tb_citas(id_cita);

CREATE TABLE tb_detalles_consumidores_finales
(
	id_detalle_consumidor_final INT PRIMARY KEY AUTO_INCREMENT,
	id_consumidor_final INT, /*FK*/
	id_servicio_en_proceso INT, /*FK*/
	precio_servicio DECIMAL NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_detalles_consumidores_finales
ADD CONSTRAINT u_fk_consumidor_final_detalle_consumidor_final FOREIGN KEY (id_consumidor_final) REFERENCES tb_consumidores_finales(id_consumidor_final),
ADD CONSTRAINT u_fk_servicio_detalle_consumidor_final FOREIGN KEY (id_servicio_en_proceso) REFERENCES tb_servicios_en_proceso(id_servicio_en_proceso);

CREATE TABLE tb_creditos_fiscales
(
	id_credito_fiscal INT PRIMARY KEY AUTO_INCREMENT,
	numero_factura VARCHAR(5) NOT NULL,
	fecha_registro_factura DATE DEFAULT(CURRENT_DATE()),
	venta_a_cuenta_de ENUM('Contado','Tarjeta'),
	duracion_garantia INT,
    nota VARCHAR(100),
	id_cita  INT, /**FK**/
    nombre_emisor VARCHAR(25) NULL,
    dui_emisor VARCHAR(10) NOT NULL,
    estado_credito_fiscal ENUM('En espera', 'Cancelado', 'Completado') NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_creditos_fiscales
ADD CONSTRAINT u_fk_cita_credito_fiscal FOREIGN KEY (id_cita) REFERENCES tb_citas(id_cita),
ADD CONSTRAINT u_dui_emisor UNIQUE (dui_emisor);
/**Constraint**/

CREATE TABLE tb_detalles_creditos_fiscales 
(
	id_detalle_credito_fiscal INT PRIMARY KEY AUTO_INCREMENT,
    id_credito_fiscal INT , /**FK**/
    id_servicio INT , /**FK**/
    cantidad_servicio INT NOT NULL,
    precio_servicio DECIMAL NOT NULL
);

/**FOREIGN KEY**/
ALTER TABLE tb_detalles_creditos_fiscales
ADD CONSTRAINT u_fk_credito_fiscal_detalle_credito_fiscal FOREIGN KEY (id_credito_fiscal) REFERENCES tb_creditos_fiscales(id_credito_fiscal),
ADD CONSTRAINT u_fk_servicio_detalle_credito_fiscal FOREIGN KEY (id_servicio) REFERENCES tb_servicios(id_servicio);
  
CREATE TABLE tb_seguimientos_consumidores_finales
(
	id_seguimiento_consumidor_final INT PRIMARY KEY AUTO_INCREMENT,
	id_consumidor_final  INT /* FK */, 
	fecha_seguimiento DATE NOT NULL, #NN
	descripcion_seguimiento VARCHAR(500) NOT NULL #NN
);

/**FOREIGN KEY**/
ALTER TABLE tb_seguimientos_consumidores_finales
ADD CONSTRAINT u_fk_consumidor_final_seguimiento_consumidor_final FOREIGN KEY (id_consumidor_final) REFERENCES tb_consumidores_finales(id_consumidor_final);

CREATE TABLE tb_seguimientos_creditos_fiscales
(
	id_seguimiento_credito_fiscal INT PRIMARY KEY AUTO_INCREMENT,
	fecha_seguimiento DATE NOT NULL, #NN
	descripcion_seguimiento VARCHAR(500) NOT NULL, #NN
	id_consumidor_final INT /* FK */
);

/**FOREIGN KEY**/
ALTER TABLE tb_seguimientos_creditos_fiscales
ADD CONSTRAINT u_fk_seguimiento_credito_fiscal_consumidor_final FOREIGN KEY (id_consumidor_final) REFERENCES tb_consumidores_finales(id_consumidor_final);

/*
CREATE TABLE tb_usuarios_clientes
(
	id_usuario_cliente INT PRIMARY KEY AUTO_INCREMENT,
	estado_usuario BOOLEAN NOT NULL,
	id_cliente INT 
);

ALTER TABLE tb_usuarios_clientes
ADD CONSTRAINT fk_cliente_usuarios_clientes FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente);

ALTER TABLE tb_usuarios_clientes
ADD CONSTRAINT u_cliente_usuarios_clientes UNIQUE (id_cliente);
*/

CREATE TABLE tb_especializaciones_trabajadores
(
	id_especializacion_trabajador INT PRIMARY KEY AUTO_INCREMENT,
	nombre_especializacion_trabajador VARCHAR(100) NOT NULL, #NN
	pago_por_especializacion DECIMAL NOT NULL #NN
);

CREATE TABLE tb_trabajadores
(
	id_trabajador INT PRIMARY KEY AUTO_INCREMENT, #PK
	id_especializacion_trabajador INT NOT NULL, /*FK*/
	dui_trabajador VARCHAR(9) NOT NULL,  #NN U 
	telefono_trabajador VARCHAR(9) NOT NULL, #NN U
	correo_trabajador VARCHAR(50) NOT NULL, #NN U 
	nombres_trabajador VARCHAR(50) NOT NULL, #NN
	apellidos_trabajador VARCHAR(50) NOT NULL, #NN
	departamento_trabajador ENUM('Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Libertad', 'La Paz', 'La Unión', 'Morazán', 'San Miguel', 'San Salvador', 'San Vicente', 'Santa Ana', 'Sonsonate', 'Usulután'),  
	NIT_trabajador VARCHAR(18) NULL, #N U
	fecha_contratacion DATE NOT NULL, 
	salario_base DECIMAL(5, 2) NOT NULL
    /*Fto_trabajador VARCHAR(50)*/
);

SELECT * FROM tB_trabajadores;

/**FOREIGN KEY**/
ALTER TABLE tb_trabajadores
ADD CONSTRAINT u_fk_especializacion_trabajador_trabajador FOREIGN KEY (id_especializacion_trabajador) REFERENCES tb_especializaciones_trabajadores(id_especializacion_trabajador),
ADD CONSTRAINT u_dui_trabajador UNIQUE (dui_trabajador),
ADD CONSTRAINT u_telefono_trabajador UNIQUE (telefono_trabajador),
ADD CONSTRAINT u_correo_trabajador UNIQUE (correo_trabajador),
ADD CONSTRAINT u_NIT_trabajador UNIQUE (NIT_trabajador);
    /**Constraint**/

CREATE TABLE tb_usuarios
(
	id_usuario INT PRIMARY KEY AUTO_INCREMENT, #PK
    correo_usuario VARCHAR(200),
	clave_usuario VARCHAR(100) /*(min-6 max-50)*/,
    telefono_usuario VARCHAR(9),
    tipo_usuario ENUM('Administrador') NOT NULL
);

SELECT * FROM tb_usuarios;

CREATE TABLE tb_formas_pagos_consumidores_finales
(
	id_forma_pago_consumidores_finales INT PRIMARY KEY AUTO_INCREMENT,
    id_forma_pago INT,
    id_consumidor_final INT
);

ALTER TABLE tb_formas_pagos_consumidores_finales
ADD CONSTRAINT u_fk_forma_pago_forma_pago_consumidor_final FOREIGN KEY (id_forma_pago) REFERENCES tb_formas_pagos(id_forma_pago),
ADD CONSTRAINT u_fk_consumidor_final_forma_pago_forma_pago_consumidor_final FOREIGN KEY (id_consumidor_final) REFERENCES tb_consumidores_finales(id_consumidor_final);

-- Inserciones para personas naturales
INSERT INTO tb_clientes (fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente, estado_cliente)
VALUES 
    ('2023-01-15', '001234567', '22223333', 'cliente1@ejemplo.com', 'Juan', 'Pérez', 'Persona natural', 'San Salvador', '1222-222222-222-0','Activo'),
    ('2022-11-30', '123456789', '77778888', 'cliente2@ejemplo.com', 'María', 'González', 'Persona natural', 'La Libertad','1222-262222-222-0', 'Activo'),
    ('2023-05-20', '987654321', '24446666', 'cliente3@ejemplo.com', 'Pedro', 'Ramírez', 'Persona natural', 'Santa Ana','1222-224422-222-0', 'Activo'),
    ('2023-02-10', '555566667', '21212121', 'cliente4@ejemplo.com', 'Ana', 'López', 'Persona natural', 'San Miguel','1444-242222-222-0', 'Activo'),
    ('2023-07-05', '888888888', '25252525', 'cliente5@ejemplo.com', 'Carlos', 'Martínez', 'Persona natural', 'San Vicente','1222-222222-666-0', 'Activo');

-- Inserciones para personas jurídicas
INSERT INTO tb_clientes (fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente, NRC_cliente, NRF_cliente, rubro_comercial, estado_cliente)
VALUES 
    ('2023-01-15', '00000000', '22220000', 'cliente11@ejemplo.com', 'Empresa XYZ', 'E', 'Persona juridica', 'San Salvador', '1222-222222-222-2', '12121212', '34343456345', 'Alimenticio', 'Activo'),
    ('2022-11-30', '00000001', '77770000', 'cliente12@ejemplo.com', 'Corporación ABC', 'E', 'Persona juridica', 'La Libertad', '2222-222222-222-2', '65643534', '81316435678', 'Automotriz', 'Activo'),
    ('2023-05-20', '00000002', '24440000', 'cliente13@ejemplo.com', 'Fábrica S.A.', 'E', 'Persona juridica', 'Santa Ana', '3333-333333-333-3', '20436755', '00964738291', 'Belleza', 'Activo'),
    ('2023-02-10', '00000003', '21210000', 'cliente14@ejemplo.com', 'Importadora AAA', 'E', 'Persona juridica', 'San Miguel', '4444-444444-444-4', '63520984', '9453376281', 'Calzado', 'Activo'),
    ('2023-07-05', '00000004', '25250000', 'cliente15@ejemplo.com', 'Consultores B.B.', 'E', 'Persona juridica', 'San Vicente', '5555-555555-555-5', '284530093', '16437283971', 'Alimenticio', 'Activo');
    
    


-- Inserts para marcas de automóviles
INSERT INTO tb_marcas_automoviles (nombre_marca_automovil)
VALUES 
    ('Toyota'),
    ('Honda'),
    ('Ford'),
    ('Chevrolet'),
    ('Nissan'),
    ('BMW'),
    ('Mercedes-Benz'),
    ('Audi'),
    ('Volkswagen'),
    ('Hyundai');

-- Inserts para modelos de automóviles
INSERT INTO tb_modelos_automoviles (id_marca_automovil, nombre_modelo_automovil)
VALUES 
    (1, 'Corolla'),
    (1, 'Camry'),
    (1, 'RAV4'),
    (2, 'Civic'),
    (2, 'Accord'),
    (2, 'CR-V'),
    (3, 'Fiesta'),
    (3, 'Mustang'),
    (3, 'Explorer'),
    (4, 'Cruze'),
    (4, 'Malibu'),
    (4, 'Equinox'),
    (5, 'Altima'),
    (5, 'Sentra'),
    (5, 'Rogue'),
    (6, '3 Series'),
    (6, 'X5'),
    (6, '5 Series'),
    (7, 'C-Class'),
    (7, 'E-Class'),
    (7, 'GLE'),
    (8, 'A4'),
    (8, 'Q5'),
    (8, 'A6'),
    (9, 'Golf'),
    (9, 'Passat'),
    (9, 'Tiguan'),
    (10, 'Elantra'),
    (10, 'Sonata'),
    (10, 'Tucson');


-- Inserts para tipos de automóviles
INSERT INTO tb_tipos_automoviles (nombre_tipo_automovil)
VALUES 
    ('Sedan'),
    ('SUV'),
    ('Pickup'),
    ('Hatchback'),
    ('Coupé'),
    ('Convertible'),
    ('Minivan'),
    ('Wagon'),
    ('Crossover'),
    ('Electric');

-- Inserts para colores de automóviles
INSERT INTO tb_colores (nombre_color)
VALUES 
    ('Rojo'),
    ('Azul'),
    ('Blanco'),
    ('Negro'),
    ('Gris'),
    ('Plateado'),
    ('Verde'),
    ('Amarillo'),
    ('Naranja'),
    ('Morado');

-- Inserts para automóviles asociados a clientes
INSERT INTO tb_automoviles (id_modelo_automovil, id_tipo_automovil, id_color, fecha_fabricacion_automovil, placa_automovil, imagen_automovil, id_cliente, fecha_registro, estado_automovil)
VALUES 
    (1, 1, 1, '2023', 'PQR123', 'imagen_auto1.jpg', 1, '2023-01-15', 'Activo'),
    (2, 2, 2, '2022', 'ABC456', 'imagen_auto2.jpg', 2, '2022-11-30', 'Activo'),
    (3, 3, 3, '2023', 'XYZ789', 'imagen_auto3.jpg', 3, '2023-05-20', 'Activo'),
    (4, 1, 4, '2022', 'DEF012', 'imagen_auto4.jpg', 4, '2023-02-10', 'Activo'),
    (5, 2, 5, '2023', 'GHI345', 'imagen_auto5.jpg', 5, '2023-07-05', 'Activo'),
    (6, 3, 6, '2022', 'JKL678', 'imagen_auto6.jpg', 6, '2022-12-18', 'Activo'),
    (7, 1, 7, '2023', 'MNO901', 'imagen_auto7.jpg', 7, '2023-04-01', 'Activo'),
    (8, 2, 8, '2022', 'PQR234', 'imagen_auto8.jpg', 8, '2023-03-15', 'Activo'),
    (9, 3, 9, '2023', 'STU567', 'imagen_auto9.jpg', 9, '2023-06-20', 'Activo'),
    (10, 1, 10, '2023', 'VWX890', 'imagen_auto10.jpg', 10, '2023-08-10', 'Activo');

-- Inserts para tipos de servicios
INSERT INTO tb_tipos_servicios (nombre_tipo_servicio, imagen_servicio)
VALUES 
    ('Cambio de aceite', 'cambio_aceite.jpg'),
    ('Alineación y balanceo', 'alineacion_balanceo.jpg'),
    ('Revisión de frenos', 'revision_frenos.jpg'),
    ('Cambio de llantas', 'cambio_llantas.jpg'),
    ('Servicio de batería', 'servicio_bateria.jpg'),
    ('Revisión de motor', 'revision_motor.jpg'),
    ('Mantenimiento preventivo', 'mantenimiento_preventivo.jpg'),
    ('Diagnóstico general', 'diagnostico_general.jpg'),
    ('Limpieza de inyectores', 'limpieza_inyectores.jpg'),
    ('Servicio de aire acondicionado', 'servicio_aire_acondicionado.jpg');

-- Inserts para servicios
INSERT INTO tb_servicios (id_tipo_servicio, nombre_servicio, descripcion_servicio)
VALUES 
    (1, 'Cambio de aceite sintético', 'Cambio de aceite sintético y filtro'),
    (1, 'Cambio de aceite convencional', 'Cambio de aceite convencional y filtro'),
    (2, 'Alineación de ruedas', 'Alineación de las cuatro ruedas'),
    (2, 'Balanceo de llantas', 'Balanceo de las llantas del vehículo'),
    (3, 'Revisión de frenos delanteros', 'Inspección y cambio de frenos delanteros'),
    (3, 'Revisión de frenos traseros', 'Inspección y cambio de frenos traseros'),
    (4, 'Cambio de llantas delanteras', 'Cambio de las llantas delanteras del vehículo'),
    (4, 'Cambio de llantas traseras', 'Cambio de las llantas traseras del vehículo'),
    (5, 'Reemplazo de batería', 'Instalación de una nueva batería'),
    (5, 'Revisión y limpieza de bornes', 'Limpieza y ajuste de bornes de batería');

-- Inserts para formas de pago
INSERT INTO tb_formas_pagos (nombre_forma_pago)
VALUES 
    ('Efectivo'),
    ('Tarjeta de crédito'),
    ('Tarjeta de débito'),
    ('Transferencia bancaria'),
    ('Cheque'),
    ('PayPal'),
    ('Apple Pay'),
    ('Google Pay'),
    ('Crédito de la tienda'),
    ('Pago móvil');

-- Inserts para citas
INSERT INTO tb_citas (fecha_registro, fecha_hora_cita, id_automovil, movilizacion_vehiculo, zona_habilitada, direccion_ida, direccion_regreso, estado_cita)
VALUES 
    ('2023-01-01', '2023-01-10 10:00:00', 1, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 1, San Salvador', 'Calle 1, San Salvador', 'En espera'),
    ('2023-01-02', '2023-01-11 11:00:00', 2, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 2, San Salvador', 'Calle 2, San Salvador', 'Aceptado'),
    ('2023-01-03', '2023-01-12 12:00:00', 3, 'Yo solo llevo el auto', 'Aguilares', 'Calle 3, San Salvador', NULL, 'Cancelado'),
    ('2023-01-04', '2023-01-13 13:00:00', 4, 'Yo llevo el auto y lo traigo de regreso', 'Aguilares', 'Calle 4, San Salvador', 'Calle 4, San Salvador', 'Finalizada'),
    ('2023-01-05', '2023-01-14 14:00:00', 5, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 5, San Salvador', 'Calle 5, San Salvador', 'En espera'),
    ('2023-01-06', '2023-01-15 15:00:00', 6, 'Yo solo llevo el auto', 'Aguilares', 'Calle 6, San Salvador', NULL, 'Aceptado'),
    ('2023-01-07', '2023-01-16 16:00:00', 7, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 7, San Salvador', 'Calle 7, San Salvador', 'Cancelado'),
    ('2023-01-08', '2023-01-17 17:00:00', 8, 'Yo solo regreso el auto', 'Aguilares', 'Calle 8, San Salvador', 'Calle 8, San Salvador', 'Finalizada'),
    ('2023-01-09', '2023-01-18 18:00:00', 9, 'Yo solo llevo el auto', 'Ayutuxtepeque', 'Calle 9, San Salvador', NULL, 'En espera'),
    ('2023-01-10', '2023-01-19 19:00:00', 10, 'Yo llevo el auto y lo traigo de regreso', 'Aguilares', 'Calle 10, San Salvador', 'Calle 10, San Salvador', 'Aceptado');

INSERT INTO tb_especializaciones_trabajadores (nombre_especializacion_trabajador, pago_por_especializacion)
VALUES
    ('Mecánica general', 50.00),
    ('Electricidad automotriz', 60.00),
    ('Pintura y acabados', 55.00),
    ('Reparación de motores', 65.00),
    ('Sistema de frenos', 55.00),
    ('Transmisión y embrague', 60.00),
    ('Sistemas de suspensión', 55.00),
    ('Aire acondicionado automotriz', 60.00),
    ('Sistema de dirección', 55.00),
    ('Diagnóstico electrónico', 70.00);
    