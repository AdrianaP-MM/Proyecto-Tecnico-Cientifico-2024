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

SELECT * FROM tb_clientes;

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

CREATE TABLE tb_usuarios_clientes
(
	id_usuario_cliente INT PRIMARY KEY AUTO_INCREMENT,
	clave_usuario_cliente VARCHAR(50) NOT NULL, /*(min-6 max-50)*/ #NN 
	estado_usuario BOOLEAN NOT NULL, #DEFAULT 1 = ACTIVO / 0 = INACTIVO
	id_cliente INT /* FK */
);

/**FOREIGN KEY**/
ALTER TABLE tb_usuarios_clientes
ADD CONSTRAINT u_fk_cliente_usuarios_clientes FOREIGN KEY (id_cliente) REFERENCES tb_clientes(id_cliente);

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