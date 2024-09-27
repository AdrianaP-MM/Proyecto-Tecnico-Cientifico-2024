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
        estado_cliente ENUM('Activo', 'Eliminado') DEFAULT 'Activo',
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

    CREATE TABLE tb_marcas_automoviles
    (
        id_marca_automovil INT AUTO_INCREMENT PRIMARY KEY,
        nombre_marca_automovil VARCHAR(50) NOT NULL
    );

    CREATE TABLE tb_tipos_automoviles
    (
        id_tipo_automovil INT auto_increment PRIMARY KEY ,
        nombre_tipo_automovil VARCHAR(80) NOT NULL
    );

    CREATE TABLE tb_automoviles
    (
        id_automovil INT PRIMARY KEY AUTO_INCREMENT,
        modelo_automovil VARCHAR(50),
        id_tipo_automovil INT, /*FK*/
        color_automovil ENUM('Rojo', 'Azul', 'Gris', 'Blanco', 'Negro', 'Amarillo', 'Verde', 'Anaranjado', 'Tornasol', 'Plata', 'Otro') NOT NULL, /*FK*/
        fecha_fabricacion_automovil YEAR NOT NULL,
        placa_automovil VARCHAR(11),
        imagen_automovil VARCHAR(25) NOT NULL,
        id_cliente INT, /*FK*/
        id_marca_automovil INT, /*FK*/
        fecha_registro DATE NOT NULL,
        estado_automovil ENUM('Activo', 'Eliminado') NOT NULL
    );

    /**FOREIGN KEY**/
    ALTER TABLE tb_automoviles
    ADD CONSTRAINT u_fk__marca_automovil FOREIGN KEY (id_marca_automovil) REFERENCES tb_marcas_automoviles(id_marca_automovil),
    ADD CONSTRAINT u_fk_tipo_automovil_automovil FOREIGN KEY (id_tipo_automovil) REFERENCES tb_tipos_automoviles(id_tipo_automovil),
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
        fecha_registro_factura DATETIME DEFAULT(CURRENT_DATE()) NOT NULL,
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
        id_servicio_en_proceso INT, /*FK*/
        precio_servicio DECIMAL NOT NULL
    );

    /**FOREIGN KEY**/
    ALTER TABLE tb_detalles_creditos_fiscales
    ADD CONSTRAINT u_fk_credito_fiscal_detalle_credito_fiscal FOREIGN KEY (id_credito_fiscal) REFERENCES tb_creditos_fiscales(id_credito_fiscal),
    ADD CONSTRAINT u_fk_servicio_detalle_credito_fiscal FOREIGN KEY (id_servicio_en_proceso) REFERENCES tb_servicios_en_proceso(id_servicio_en_proceso);
    
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

    CREATE TABLE tb_usuarios
    (
        id_usuario INT PRIMARY KEY AUTO_INCREMENT, #PK
        correo_usuario VARCHAR(200),
        clave_usuario VARCHAR(100) /*(min-8 max-50)*/,
        telefono_usuario VARCHAR(9),
        tipo_usuario ENUM('Administrador') NOT NULL
    );
    
	ALTER TABLE tb_usuarios
	ADD COLUMN dos_pasos BOOLEAN DEFAULT FALSE;
    
    ALTER TABLE tb_usuarios
	ADD COLUMN failed_attempts INT DEFAULT 0,
	ADD COLUMN last_failed_attempt DATETIME DEFAULT NULL,
	ADD COLUMN account_locked_until DATETIME DEFAULT NULL,
    ADD COLUMN fecha_ultima_modificacion  DATETIME NOT NULL;

    CREATE TABLE tb_formas_pagos_consumidores_finales
    (
        id_forma_pago_consumidores_finales INT PRIMARY KEY AUTO_INCREMENT,
        id_forma_pago INT,
        id_consumidor_final INT
    );

    ALTER TABLE tb_formas_pagos_consumidores_finales
    ADD CONSTRAINT u_fk_forma_pago_forma_pago_consumidor_final FOREIGN KEY (id_forma_pago) REFERENCES tb_formas_pagos(id_forma_pago),
    ADD CONSTRAINT u_fk_consumidor_final_forma_pago_forma_pago_consumidor_final FOREIGN KEY (id_consumidor_final) REFERENCES tb_consumidores_finales(id_consumidor_final);

    CREATE TABLE tb_notificaciones
(
    id_notificacion INT PRIMARY KEY AUTO_INCREMENT,
    id_cita INT,  -- FK a tb_citas
    estado_anterior ENUM('En espera', 'Aceptado', 'Cancelado', 'Finalizada'),
    estado_nuevo ENUM('En espera', 'Aceptado', 'Cancelado', 'Finalizada'),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_cita) REFERENCES tb_citas(id_cita)
);

--Triggers de prueba

DELIMITER $$

CREATE TRIGGER after_cita_insert
AFTER INSERT ON tb_citas
FOR EACH ROW
BEGIN
    -- Verifica si el estado de la nueva cita es 'En espera'
    IF NEW.estado_cita = 'En espera' THEN
        -- Inserta un nuevo registro en tb_notificaciones con el estado anterior como NULL
        INSERT INTO tb_notificaciones (id_cita, estado_anterior, estado_nuevo)
        VALUES (NEW.id_cita, NULL, NEW.estado_cita);
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_cita_update
AFTER UPDATE ON tb_citas
FOR EACH ROW
BEGIN
    -- Verifica si el estado de la cita ha cambiado
    IF OLD.estado_cita <> NEW.estado_cita THEN
        -- Inserta un nuevo registro en tb_notificaciones con el estado anterior y el nuevo
        INSERT INTO tb_notificaciones (id_cita, estado_anterior, estado_nuevo)
        VALUES (NEW.id_cita, OLD.estado_cita, NEW.estado_cita);
    END IF;
END $$

DELIMITER ;


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

         -- Nuevas inserciones para personas naturales
INSERT INTO tb_clientes (fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente, estado_cliente)
VALUES 
    ('2021-03-12', '234567890', '33334444', 'cliente6@ejemplo.com', 'Luis', 'Castro', 'Persona natural', 'Sonsonate', '2333-333333-333-0', 'Activo'),
    ('2020-08-19', '345678901', '44445555', 'cliente7@ejemplo.com', 'Elena', 'Morales', 'Persona natural', 'Ahuachapán', '3444-444444-444-0', 'Activo'),
    ('2019-11-25', '456789012', '55556666', 'cliente8@ejemplo.com', 'Ricardo', 'Mendoza', 'Persona natural', 'Usulután', '4555-555555-555-0', 'Activo'),
    ('2022-04-10', '567890123', '66667777', 'cliente9@ejemplo.com', 'Gabriela', 'Hernández', 'Persona natural', 'Chalatenango', '5666-666666-666-0', 'Activo'),
    ('2023-06-15', '678901234', '88889999', 'cliente10@ejemplo.com', 'Francisco', 'Ortiz', 'Persona natural', 'La Paz', '6777-777777-777-0', 'Activo');

    -- Nuevas inserciones para personas jurídicas
INSERT INTO tb_clientes (fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente, NRC_cliente, NRF_cliente, rubro_comercial, estado_cliente)
VALUES 
    ('2021-02-14', '00000005', '33331111', 'cliente16@ejemplo.com', 'Servicios Globales', 'E', 'Persona juridica', 'La Unión', '6666-666666-666-6', '35435436', '27483590235', 'Automotriz', 'Activo'),
    ('2020-09-21', '00000006', '44441111', 'cliente17@ejemplo.com', 'Comercializadora XYZ', 'E', 'Persona juridica', 'Morazán', '7777-777777-777-7', '46464546', '37494610294', 'Belleza', 'Activo'),
    ('2019-12-03', '00000007', '55551111', 'cliente18@ejemplo.com', 'Industria ABC', 'E', 'Persona juridica', 'Cuscatlán', '8888-888888-888-8', '54545455', '47394560295', 'Calzado', 'Activo'),
    ('2022-05-18', '00000008', '66661111', 'cliente19@ejemplo.com', 'Tecnologías S.A.', 'E', 'Persona juridica', 'San Vicente', '9999-999999-999-9', '64646465', '57483670296', 'Alimenticio', 'Activo'),
    ('2023-07-22', '00000009', '77771111', 'cliente20@ejemplo.com', 'Consultores XY', 'E', 'Persona juridica', 'Santa Ana', '0000-111111-111-0', '74657466', '67492780397', 'Automotriz', 'Activo');
        
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

   -- Inserts para automóviles asociados a clientes
    INSERT INTO tb_automoviles (modelo_automovil, id_tipo_automovil, color_automovil, fecha_fabricacion_automovil, placa_automovil, imagen_automovil, id_cliente, id_marca_automovil, fecha_registro, estado_automovil)
    VALUES 
    ('Modelo A', 1, 'Rojo', 2023, 'PQR123', 'imagen_auto1.jpg', 1, 1, '2023-01-15', 'Activo'),
    ('Modelo B', 2, 'Azul', 2022, 'ABC456', 'imagen_auto2.jpg', 2, 2, '2022-11-30', 'Activo'),
    ('Modelo C', 3, 'Gris', 2023, 'XYZ789', 'imagen_auto3.jpg', 3, 3, '2023-05-20', 'Activo'),
    ('Modelo D', 1, 'Blanco', 2022, 'DEF012', 'imagen_auto4.jpg', 4, 1, '2023-02-10', 'Activo'),
    ('Modelo E', 2, 'Negro', 2023, 'GHI345', 'imagen_auto5.jpg', 5, 2, '2023-07-05', 'Activo'),
    ('Modelo F', 3, 'Amarillo', 2022, 'JKL678', 'imagen_auto6.jpg', 6, 3, '2022-12-18', 'Activo'),
    ('Modelo G', 1, 'Verde', 2023, 'MNO901', 'imagen_auto7.jpg', 7, 1, '2023-04-01', 'Activo'),
    ('Modelo H', 2, 'Anaranjado', 2022, 'PQR234', 'imagen_auto8.jpg', 8, 2, '2023-03-15', 'Activo'),
    ('Modelo I', 3, 'Tornasol', 2023, 'STU567', 'imagen_auto9.jpg', 9, 3, '2023-06-20', 'Activo'),
    ('Modelo J', 1, 'Plata', 2023, 'VWX890', 'imagen_auto10.jpg', 10, 1, '2023-08-10', 'Activo');

-- Nuevas inserciones para tb_automoviles
INSERT INTO tb_automoviles (modelo_automovil, id_tipo_automovil, color_automovil, fecha_fabricacion_automovil, placa_automovil, imagen_automovil, id_cliente, id_marca_automovil, fecha_registro, estado_automovil)
VALUES 
    ('Modelo K', 4, 'Plata', 2024, 'YZA123', 'imagen_auto11.jpg', 1, 4, '2024-01-10', 'Activo'),
    ('Modelo L', 5, 'Negro', 2024, 'BCD456', 'imagen_auto12.jpg', 2, 5, '2024-02-15', 'Activo'),
    ('Modelo M', 6, 'Rojo', 2024, 'EFG789', 'imagen_auto13.jpg', 3, 6, '2024-03-20', 'Activo'),
    ('Modelo N', 7, 'Blanco', 2024, 'HIJ012', 'imagen_auto14.jpg', 4, 7, '2024-04-25', 'Activo'),
    ('Modelo O', 8, 'Gris', 2024, 'KLM345', 'imagen_auto15.jpg', 5, 8, '2024-05-30', 'Activo');

-- Inserciones para automóviles asociados a clientes
INSERT INTO tb_automoviles (modelo_automovil, id_tipo_automovil, color_automovil, fecha_fabricacion_automovil, placa_automovil, imagen_automovil, id_cliente, id_marca_automovil, fecha_registro, estado_automovil)
VALUES 
    ('Modelo K', 1, 'Rojo', 2024, 'ABC123', 'imagen_auto11.jpg', 1, 1, '2024-01-01', 'Activo'),
    ('Modelo L', 2, 'Azul', 2024, 'DEF456', 'imagen_auto12.jpg', 2, 2, '2024-01-02', 'Activo'),
    ('Modelo M', 3, 'Gris', 2024, 'GHI789', 'imagen_auto13.jpg', 3, 3, '2024-01-03', 'Activo'),
    ('Modelo N', 1, 'Blanco', 2024, 'JKL012', 'imagen_auto14.jpg', 4, 1, '2024-01-04', 'Activo'),
    ('Modelo O', 2, 'Negro', 2024, 'MNO345', 'imagen_auto15.jpg', 5, 2, '2024-01-05', 'Activo'),
    ('Modelo P', 3, 'Amarillo', 2024, 'PQR678', 'imagen_auto16.jpg', 6, 3, '2024-01-06', 'Activo'),
    ('Modelo Q', 1, 'Verde', 2024, 'STU901', 'imagen_auto17.jpg', 7, 1, '2024-01-07', 'Activo'),
    ('Modelo R', 2, 'Anaranjado', 2024, 'VWX234', 'imagen_auto18.jpg', 8, 2, '2024-01-08', 'Activo'),
    ('Modelo S', 3, 'Tornasol', 2024, 'YZA567', 'imagen_auto19.jpg', 9, 3, '2024-01-09', 'Activo'),
    ('Modelo T', 1, 'Plata', 2024, 'BCD890', 'imagen_auto20.jpg', 10, 1, '2024-01-10', 'Activo');

-- Inserciones para automóviles (cubre año pasado)
INSERT INTO tb_automoviles (modelo_automovil, id_tipo_automovil, color_automovil, fecha_fabricacion_automovil, placa_automovil, imagen_automovil, id_cliente, id_marca_automovil, fecha_registro, estado_automovil)
VALUES 
    ('Modelo K', 1, 'Rojo', 2022, 'XYZ999', 'imagen_auto11.jpg', 1, 1, '2022-01-10', 'Activo'),
    ('Modelo L', 2, 'Azul', 2021, 'LMN456', 'imagen_auto12.jpg', 2, 2, '2022-02-20', 'Activo'),
    ('Modelo M', 3, 'Gris', 2022, 'OPQ789', 'imagen_auto13.jpg', 3, 3, '2022-03-15', 'Activo'),
    ('Modelo N', 1, 'Blanco', 2022, 'RST012', 'imagen_auto14.jpg', 4, 1, '2022-04-05', 'Activo'),
    ('Modelo O', 2, 'Negro', 2021, 'UVW345', 'imagen_auto15.jpg', 5, 2, '2022-05-10', 'Activo');


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
        (5, 'Revisión y limpieza de bornes', 'Limpieza y ajuste de bornes de batería'),
        (6, 'Cambio de aceite de motor', 'Cambio de aceite de motor de alto rendimiento'),
        (6, 'Revisión de alineación de ruedas', 'Inspección y ajuste de alineación de ruedas'),
        (7, 'Reparación de motor turbo', 'Reparación y ajuste de motores turboalimentados'),
        (8, 'Limpieza de sistema de inyección', 'Limpieza profunda del sistema de inyección de combustible');

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

    -- Nuevas inserciones para tb_citas
INSERT INTO tb_citas (fecha_registro, fecha_hora_cita, id_automovil, movilizacion_vehiculo, zona_habilitada, direccion_ida, direccion_regreso, estado_cita)
VALUES 
    ('2023-08-01', '2023-08-10 10:00:00', 7, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 7, San Salvador', 'Calle 7, San Salvador', 'Finalizada'),
    ('2023-08-02', '2023-08-11 11:00:00', 8, 'Yo solo llevo el auto', 'Aguilares', 'Calle 8, San Salvador', 'Calle 8, San Salvador', 'Aceptado'),
    ('2023-08-03', '2023-08-12 12:00:00', 9, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 9, San Salvador', NULL, 'Cancelado'),
    ('2023-08-04', '2023-08-13 13:00:00', 10, 'Yo solo regreso el auto', 'Aguilares', 'Calle 10, San Salvador', 'Calle 10, San Salvador', 'En espera'),
    ('2023-08-05', '2023-08-14 14:00:00', 1, 'Yo solo llevar el auto', 'Ayutuxtepeque', 'Calle 1, San Salvador', 'Calle 1, San Salvador', 'Finalizada');

    -- Inserciones para citas
INSERT INTO tb_citas (fecha_registro, fecha_hora_cita, id_automovil, movilizacion_vehiculo, zona_habilitada, direccion_ida, direccion_regreso, estado_cita)
VALUES 
    ('2024-01-05', '2024-01-10 09:00:00', 1, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 11, San Salvador', 'Calle 11, San Salvador', 'Finalizada'),
    ('2024-01-15', '2024-01-20 10:00:00', 2, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 12, San Salvador', 'Calle 12, San Salvador', 'Finalizada'),
    ('2024-02-05', '2024-02-12 11:00:00', 3, 'Yo solo llevo el auto', 'Aguilares', 'Calle 13, San Salvador', NULL, 'Finalizada'),
    ('2024-02-25', '2024-02-28 12:00:00', 4, 'Yo llevo el auto y lo traigo de regreso', 'Aguilares', 'Calle 14, San Salvador', 'Calle 14, San Salvador', 'Finalizada'),
    ('2024-03-15', '2024-03-18 13:00:00', 5, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 15, San Salvador', 'Calle 15, San Salvador', 'Finalizada'),
    ('2024-03-20', '2024-03-25 14:00:00', 6, 'Yo solo llevo el auto', 'Aguilares', 'Calle 16, San Salvador', NULL, 'Finalizada'),
    ('2024-04-05', '2024-04-10 15:00:00', 7, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 17, San Salvador', 'Calle 17, San Salvador', 'Finalizada'),
    ('2024-04-15', '2024-04-20 16:00:00', 8, 'Yo solo regreso el auto', 'Aguilares', 'Calle 18, San Salvador', 'Calle 18, San Salvador', 'Finalizada'),
    ('2024-05-10', '2024-05-15 17:00:00', 9, 'Yo solo llevo el auto', 'Ayutuxtepeque', 'Calle 19, San Salvador', NULL, 'Finalizada'),
    ('2024-05-20', '2024-05-25 18:00:00', 10, 'Yo llevo el auto y lo traigo de regreso', 'Aguilares', 'Calle 20, San Salvador', 'Calle 20, San Salvador', 'Finalizada');

    -- Inserciones para citas del año pasado
INSERT INTO tb_citas (fecha_registro, fecha_hora_cita, id_automovil, movilizacion_vehiculo, zona_habilitada, direccion_ida, direccion_regreso, estado_cita)
VALUES 
    ('2022-01-01', '2022-01-10 10:00:00', 1, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 1, San Salvador', 'Calle 1, San Salvador', 'Finalizada'),
    ('2022-02-02', '2022-02-11 11:00:00', 2, 'Yo solo regreso el auto', 'Aguilares', 'Calle 2, San Salvador', 'Calle 2, San Salvador', 'Finalizada'),
    ('2022-03-03', '2022-03-12 12:00:00', 3, 'Yo solo llevo el auto', 'Ayutuxtepeque', 'Calle 3, San Salvador', NULL, 'Finalizada'),
    ('2022-04-04', '2022-04-13 13:00:00', 4, 'Yo llevo el auto y lo traigo de regreso', 'Aguilares', 'Calle 4, San Salvador', 'Calle 4, San Salvador', 'Finalizada'),
    ('2022-05-05', '2022-05-14 14:00:00', 5, 'Yo solo regreso el auto', 'Ayutuxtepeque', 'Calle 5, San Salvador', 'Calle 5, San Salvador', 'Finalizada');



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

-- Inserciones para servicios en proceso
INSERT INTO tb_servicios_en_proceso (id_servicio_en_proceso, id_cita, id_servicio)
VALUES 
    (1, 1, 1),  -- Cambio de aceite sintético en cita 1
    (2, 1, 2),  -- Cambio de aceite convencional en cita 1
    (3, 2, 3),  -- Alineación de ruedas en cita 2
    (4, 2, 4),  -- Balanceo de llantas en cita 2
    (5, 3, 5),  -- Revisión de frenos delanteros en cita 3
    (6, 4, 6),  -- Revisión de frenos traseros en cita 4
    (7, 4, 7),  -- Cambio de llantas delanteras en cita 4
    (8, 5, 8),  -- Cambio de llantas traseras en cita 5
    (9, 6, 9),  -- Reemplazo de batería en cita 6
    (10, 7, 10),-- Revisión y limpieza de bornes en cita 7
    (11, 8, 11),-- Cambio de aceite de motor en cita 8
    (12, 9, 12),-- Revisión de alineación de ruedas en cita 9
    (13, 10, 13),-- Reparación de motor turbo en cita 10
    (14, 1, 14),-- Limpieza de sistema de inyección en cita 1
    (15, 2, 1); -- Cambio de aceite sintético en cita 2 (para duplicado en top 10)

    -- Inserciones para tb_especializaciones_trabajadores
INSERT INTO tb_especializaciones_trabajadores (nombre_especializacion_trabajador, pago_por_especializacion)
VALUES 
    ('Mecánico General', 500.00),
    ('Electricista Automotriz', 550.00),
    ('Técnico en Suspensión', 530.00),
    ('Especialista en Motores', 600.00),
    ('Pintor Automotriz', 520.00);

-- Inserciones para tb_trabajadores (Datos de 2022)
INSERT INTO tb_trabajadores (id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base)
VALUES 
    (2, '543927644', '40494891', 'robin01@hotmail.com', 'Vickie', 'Burgess', 'East Johnburgh', '7384-498963-439-3', '2020-12-06', 594.33),
    (1, '308856981', '16851057', 'xrodriguez@yahoo.com', 'Matthew', 'Glass', 'Rhondafort', '2863-508653-488-0', '2023-03-20', 638.01),
    (5, '636037774', '49141630', 'herreraerika@white-evans.org', 'Michele', 'Conley', 'South Scottshire', '6616-757490-108-7', '2021-12-01', 595.73),
    (1, '487842491', '14330495', 'joshua68@davis.biz', 'Samantha', 'Jones', 'Lake Autumn', '8439-885386-597-1', '2022-12-11', 603.33),
    (5, '150590133', '84794197', 'katherine15@yahoo.com', 'Gabriel', 'Vaughn', 'New Jaredhaven', '9323-658057-965-0', '2024-04-22', 604.36),
    (2, '849815787', '47259906', 'julie97@hotmail.com', 'Joseph', 'Rogers', 'North Meganton', '7441-901171-776-7', '2021-10-10', 616.26),
    (3, '146243898', '51875858', 'emadden@lara-jones.com', 'Melissa', 'Mcdonald', 'Aprilfort', '7931-160353-452-6', '2022-07-01', 637.61),
    (4, '346931698', '96474653', 'pjohnson@choi.com', 'Garrett', 'Weaver', 'Lake Benjamin', '1811-422927-640-6', '2021-04-06', 638.21),
    (4, '968932781', '63992893', 'jcollins@rodriguez.com', 'William', 'Johnson', 'East April', '7146-638042-912-3', '2022-10-05', 591.96),
    (3, '361014114', '30821162', 'imartin@gmail.com', 'Angela', 'Ramos', 'Lake Pamela', '7168-174031-655-8', '2023-10-18', 605.55);


-- Inserciones para tb_trabajadores (Datos de 2023)
INSERT INTO tb_trabajadores (id_especializacion_trabajador, dui_trabajador, telefono_trabajador, correo_trabajador, nombres_trabajador, apellidos_trabajador, departamento_trabajador, NIT_trabajador, fecha_contratacion, salario_base)
VALUES 
    (2, '467147969', '88476733', 'marshsamantha@jacobs.com', 'Christopher', 'Hays', 'New Keithland', '9060-433011-994-0', '2024-08-11', 593.76),
    (4, '261625641', '21652424', 'fmcintyre@gmail.com', 'Joseph', 'Robertson', 'North Andre', '7838-404280-540-5', '2024-05-01', 625.48),
    (1, '155645057', '77829279', 'rachel97@hotmail.com', 'Andrew', 'Alvarez', 'Riversburgh', '8173-581541-111-0', '2024-08-18', 618.82),
    (4, '121647002', '29054540', 'johnmartin@martinez.org', 'Thomas', 'Pope', 'North Edwardberg', '6673-100837-619-8', '2024-01-22', 595.58),
    (5, '271447962', '90090280', 'darrellgonzales@hale-johnson.org', 'Marissa', 'Crawford', 'North Rodney', '7273-221035-186-3', '2024-05-14', 625.42),
    (1, '329030882', '22064937', 'bmurphy@hotmail.com', 'Samuel', 'Harris', 'New Angelabury', '5428-917946-803-3', '2024-02-02', 608.44),
    (3, '335884471', '68719770', 'kaitlynkeith@thornton.com', 'Martin', 'Rodriguez', 'Parkerstad', '3380-427439-841-0', '2024-08-16', 629.40),
    (4, '639581419', '68352187', 'erica51@barnes.com', 'Brittany', 'Goodman', 'Arnoldmouth', '5640-662126-234-6', '2024-06-12', 636.26),
    (4, '884769699', '95427727', 'claudiajimenez@gmail.com', 'Mary', 'Roberts', 'Wademouth', '5253-964811-392-6', '2024-05-20', 633.26);
        
        
#--------------------------------------------------------------------------------- USADO EN GRAFICO PREDICTIVO 1 (ADRIANA)
CREATE VIEW vw_autos_reparados_por_mes AS
WITH meses AS (
    SELECT 1 AS mes UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5 UNION ALL
    SELECT 6 UNION ALL
    SELECT 7 UNION ALL
    SELECT 8 UNION ALL
    SELECT 9 UNION ALL
    SELECT 10 UNION ALL
    SELECT 11 UNION ALL
    SELECT 12
)
SELECT 
    m.mes,
    COALESCE(COUNT(a.id_automovil), 0) AS autos_reparados
FROM 
    meses m
LEFT JOIN tb_citas c
    ON MONTH(c.fecha_hora_cita) = m.mes
    AND YEAR(c.fecha_hora_cita) = YEAR(CURDATE())
    AND c.estado_cita = "Finalizada"
LEFT JOIN tb_automoviles a
    ON c.id_automovil = a.id_automovil
GROUP BY 
    m.mes
ORDER BY 
    m.mes;
    
#--------------------------------------------------------------------------------- USADO EN GRAFICO PREDICTIVO 1 (ADRIANA)
CREATE VIEW vw_autos_esperados_por_mes AS
WITH historico_reparaciones AS (
    SELECT 
        MONTH(c.fecha_hora_cita) AS mes,
        YEAR(c.fecha_hora_cita) AS ano,
        COUNT(a.id_automovil) AS autos_reparados
    FROM 
        tb_citas c
    JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
    WHERE 
        c.estado_cita = "Finalizada" 
    GROUP BY 
        YEAR(c.fecha_hora_cita), MONTH(c.fecha_hora_cita)
),
promedio_reparaciones AS (
    SELECT 
        mes,
        AVG(autos_reparados) AS autos_esperados
    FROM 
        historico_reparaciones
    GROUP BY 
        mes
)
SELECT 
    m.mes,
    COALESCE(p.autos_esperados, 0) AS autos_esperados
FROM 
    (SELECT 1 AS mes UNION ALL
     SELECT 2 UNION ALL
     SELECT 3 UNION ALL
     SELECT 4 UNION ALL
     SELECT 5 UNION ALL
     SELECT 6 UNION ALL
     SELECT 7 UNION ALL
     SELECT 8 UNION ALL
     SELECT 9 UNION ALL
     SELECT 10 UNION ALL
     SELECT 11 UNION ALL
     SELECT 12) m
LEFT JOIN 
    promedio_reparaciones p
    ON m.mes = p.mes
ORDER BY 
    m.mes;
    
/*
SELECT * FROM tb_citas
SELECT * FROM vw_autos_reparados_por_mes;
DROP VIEW vw_autos_reparados_por_mes;
INSERT INTO tb_citas (fecha_registro, fecha_hora_cita, id_automovil, movilizacion_vehiculo, zona_habilitada, direccion_ida, direccion_regreso, estado_cita)
VALUES 
('2023-01-01', '2012-6-10 10:00:00', 1, 'Yo llevo el auto y lo traigo de regreso', 'Ayutuxtepeque', 'Calle 1, San Salvador', 'Calle 1, San Salvador', 'Finalizada');
SELECT * FROM vw_autos_esperados_por_mes_pasado;
DROP VIEW vw_autos_esperados_por_mes;*/ 
## USADO EN GRAFICO PREDICTIVO 1 (ADRIANA)
CREATE VIEW vw_autos_esperados_por_mes_pasado AS
WITH historico_reparaciones AS (
    SELECT 
        MONTH(c.fecha_hora_cita) AS mes,
        COUNT(a.id_automovil) AS autos_reparados
    FROM 
        tb_citas c
    JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
    WHERE 
        c.estado_cita = "Finalizada"
        AND YEAR(c.fecha_hora_cita) = YEAR(CURDATE()) - 1 -- Filtra solo el año pasado
    GROUP BY 
        MONTH(c.fecha_hora_cita)
),
promedio_reparaciones AS (
    SELECT 
        mes,
        AVG(autos_reparados) AS autos_esperados
    FROM 
        historico_reparaciones
    GROUP BY 
        mes
)
SELECT 
    m.mes,
    COALESCE(p.autos_esperados, 0) AS autos_esperados
FROM 
    (SELECT 1 AS mes UNION ALL
     SELECT 2 UNION ALL
     SELECT 3 UNION ALL
     SELECT 4 UNION ALL
     SELECT 5 UNION ALL
     SELECT 6 UNION ALL
     SELECT 7 UNION ALL
     SELECT 8 UNION ALL
     SELECT 9 UNION ALL
     SELECT 10 UNION ALL
     SELECT 11 UNION ALL
     SELECT 12) m
LEFT JOIN 
    promedio_reparaciones p
    ON m.mes = p.mes
ORDER BY 
    m.mes;
    
#---------------------------------------------------------------------------------  USADO EN GRAFICO PARAMETRIZADO 1 (AXEL)
CREATE VIEW vw_clientes_por_mes_y_tipo AS
WITH meses AS (
    SELECT 1 AS mes UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4 UNION ALL
    SELECT 5 UNION ALL
    SELECT 6 UNION ALL
    SELECT 7 UNION ALL
    SELECT 8 UNION ALL
    SELECT 9 UNION ALL
    SELECT 10 UNION ALL
    SELECT 11 UNION ALL
    SELECT 12
),
tipos_cliente AS (
    SELECT DISTINCT tipo_cliente
    FROM tb_clientes
    WHERE estado_cliente = 'Activo'
)
SELECT 
    m.mes,
    t.tipo_cliente,
    EXTRACT(YEAR FROM c.fecha_registro_cliente) AS año_registro,
    COALESCE(COUNT(c.id_cliente), 0) AS cantidad_clientes
FROM meses m
CROSS JOIN tipos_cliente t
LEFT JOIN tb_clientes c
    ON MONTH(c.fecha_registro_cliente) = m.mes
    AND c.tipo_cliente = t.tipo_cliente
    AND c.estado_cliente = 'Activo'
GROUP BY 
    m.mes,
    t.tipo_cliente,
    EXTRACT(YEAR FROM c.fecha_registro_cliente)
ORDER BY 
    m.mes ASC,
    t.tipo_cliente;

#---------------------------------------------------------------------------------  USADO EN GRAFICO PARAMETRIZADO 2 (AXEL)
CREATE VIEW vw_top_10_servicios AS
WITH servicio_conteo AS (
    SELECT 
        s.nombre_servicio,
        COUNT(sep.id_servicio_en_proceso) AS conteo
    FROM 
        tb_servicios_en_proceso sep
    JOIN 
        tb_servicios s ON sep.id_servicio = s.id_servicio
    GROUP BY 
        s.nombre_servicio
),
top_10 AS (
    SELECT 
        nombre_servicio,
        conteo
    FROM 
        servicio_conteo
    ORDER BY 
        conteo DESC
    LIMIT 10
),
otros AS (
    SELECT 
        'Otros' AS nombre_servicio,
        SUM(conteo) AS conteo
    FROM 
        servicio_conteo
    WHERE 
        nombre_servicio NOT IN (SELECT nombre_servicio FROM top_10)
)
SELECT 
    nombre_servicio AS servicio,
    conteo
FROM 
    top_10
UNION ALL
SELECT 
    nombre_servicio AS servicio,
    conteo
FROM 
    otros;

#--------------------------------------------------------------------------------- USADO EN GRAFICO AUTOMATICO 1 (MELANIE)
CREATE VIEW vw_autos_por_tipo AS SELECT COUNT(id_automovil) AS total,
    nombre_tipo_automovil AS tipo FROM tb_automoviles a INNER JOIN tb_tipos_automoviles t ON t.id_tipo_automovil = a.id_tipo_automovil
    GROUP BY nombre_tipo_automovil;
    
#--------------------------------------------------------------------------------- USADO EN GRAFICO AUTOMATICO 2 (EMILY)
CREATE VIEW vw_cantidad_servicios_por_tipo AS SELECT COUNT(id_servicio) AS total,
    nombre_tipo_servicio AS nombre FROM tb_servicios s INNER JOIN tb_tipos_servicios ts ON s.id_tipo_servicio = ts.id_tipo_servicio
    GROUP BY nombre_tipo_servicio;
    
#--------------------------------------------------------------------------------- USADO EN GRAFICO PREDICTIVO 2 (ADRIANA)
CREATE VIEW vw_tiempo_servicio AS
SELECT 
    s.nombre_servicio AS servicio_reparacion,
    AVG(TIMESTAMPDIFF(MINUTE, sp.fecha_registro, sp.fecha_finalizacion)) AS tiempo_estimado_minutos
FROM 
    tb_servicios_en_proceso sp
JOIN 
    tb_servicios s ON sp.id_servicio = s.id_servicio
JOIN 
    tb_citas c ON sp.id_cita = c.id_cita
WHERE 
    sp.fecha_finalizacion IS NOT NULL
    AND c.estado_cita = 'Finalizada'
GROUP BY 
    s.nombre_servicio;


   SELECT * FROM vw_tiempo_servicio;
    SELECT * FROM tb_servicios_en_proceso;
    SELECT * FROM tb_citas;
#--------------------------------------------------------------------------------- USADO EN GRAFICO PREDICTIVO 2 (ADRIANA)
    
CREATE VIEW vw_tiempo_servicio_por_tipo_carro AS
SELECT 
    t.nombre_tipo_automovil AS tipo_carro,
    s.nombre_servicio AS servicio_reparacion,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, sp.fecha_registro, sp.fecha_finalizacion) / 60), 2) AS tiempo_estimado
FROM 
    tb_servicios_en_proceso sp
JOIN 
    tb_servicios s ON sp.id_servicio = s.id_servicio
JOIN 
    tb_citas c ON sp.id_cita = c.id_cita
JOIN 
    tb_automoviles a ON c.id_automovil = a.id_automovil
JOIN 
    tb_tipos_automoviles t ON a.id_tipo_automovil = t.id_tipo_automovil
WHERE 
    sp.fecha_finalizacion IS NOT NULL
    AND c.estado_cita = 'Finalizada'
GROUP BY 
    t.nombre_tipo_automovil, s.nombre_servicio;

    UPDATE tb_citas SET estado_cita = 'Finalizada' WHERE id_cita = 6;
    
    INSERT INTO tb_servicios_en_proceso (
                fecha_registro,
                fecha_aproximada_finalizacion,
                id_cita,
                id_servicio,
                cantidad_servicio, fecha_finalizacion
            ) VALUES ('2024-05-29 10:30:00', '2024-05-29 12:30:00', 2, 5, 1, '2024-05-29 12:30:00');

SELECT * FROM tb_tipos_servicios;

#--------------------------------------------------------------------------------- USADO EN GRAFICO PARAMETRIZADO 3 (ADRIANA)
SELECT * FROM tb_trabajadores;

DELIMITER //
CREATE PROCEDURE GetEmpleadosPorMesYEspecialidad(IN año INT)
BEGIN
    SELECT 
        m.mes,
        e.nombre_especializacion_trabajador AS especializacion,
        COALESCE(ep.cantidad_empleados, 0) AS cantidad_empleados
    FROM 
        (SELECT 1 AS mes UNION ALL
         SELECT 2 UNION ALL
         SELECT 3 UNION ALL
         SELECT 4 UNION ALL
         SELECT 5 UNION ALL
         SELECT 6 UNION ALL
         SELECT 7 UNION ALL
         SELECT 8 UNION ALL
         SELECT 9 UNION ALL
         SELECT 10 UNION ALL
         SELECT 11 UNION ALL
         SELECT 12) m
    CROSS JOIN 
        (SELECT DISTINCT nombre_especializacion_trabajador
         FROM tb_especializaciones_trabajadores) e
    LEFT JOIN 
        (SELECT 
            MONTH(t.fecha_contratacion) AS mes,
            et.nombre_especializacion_trabajador AS especializacion,
            COUNT(t.id_trabajador) AS cantidad_empleados
         FROM 
            tb_trabajadores t
         JOIN 
            tb_especializaciones_trabajadores et ON t.id_especializacion_trabajador = et.id_especializacion_trabajador
         WHERE 
            YEAR(t.fecha_contratacion) = año
         GROUP BY 
            MONTH(t.fecha_contratacion), et.nombre_especializacion_trabajador) ep
    ON 
        m.mes = ep.mes AND e.nombre_especializacion_trabajador = ep.especializacion
    ORDER BY 
        m.mes, e.nombre_especializacion_trabajador;
END //
DELIMITER ;
#--------------------------------------------------------------------------------- USADO EN GRAFICO AUTOMATICO 4 (DANIEL)

CREATE VIEW vista_clientes_cantidad_citas AS
SELECT 
    c.id_cliente,
    CONCAT(c.nombres_cliente, ' ', c.apellidos_cliente) AS nombre_completo_cliente,
    COUNT(ct.id_cita) AS cantidad_citas
FROM 
    tb_clientes c
JOIN 
    tb_automoviles a ON c.id_cliente = a.id_cliente
JOIN 
    tb_citas ct ON a.id_automovil = ct.id_automovil
GROUP BY 
    c.id_cliente, nombre_completo_cliente
ORDER BY 
    cantidad_citas DESC;
    
CALL GetEmpleadosPorMesYEspecialidad(2023);

#--------------------------------------------------------------------------------- USADO EN GRAFICO PARAMETRIZADO 4 (ADRIANA)

SELECT * FROM tb_detalles_creditos_fiscales;
SELECT * FROM tb_detalles_consumidores_finales;

SELECT * FROM tb_citas;
SELECT * FROM tb_automoviles;
SELECT * FROM tb_clientes;

DELIMITER //
CREATE PROCEDURE sp_servicios_solicitados_por_consumidor_final(IN idCliente INT)
BEGIN
    SELECT 
        s.nombre_servicio, 
        COUNT(*) AS cantidad_solicitudes, 
        c.id_cliente 
    FROM 
        tb_detalles_consumidores_finales dcf
        JOIN tb_servicios_en_proceso sp ON dcf.id_servicio_en_proceso = sp.id_servicio_en_proceso 
        JOIN tb_servicios s ON sp.id_servicio = s.id_servicio 
        JOIN tb_citas ci ON sp.id_cita = ci.id_cita 
        JOIN tb_automoviles a ON ci.id_automovil = a.id_automovil 
        JOIN tb_clientes c ON a.id_cliente = c.id_cliente 
    WHERE 
        c.id_cliente = idCliente 
    GROUP BY 
        s.nombre_servicio, 
        c.id_cliente;
END //
DELIMITER ;
    
CALL sp_servicios_solicitados_por_consumidor_final(1);


SELECT * FROM tb_clientes;
SELECT * FROM tb_citas;
SELECT * FROM tb_automoviles;

SELECT * FROM tb_consumidores_finales;
SELECT * FROM tb_creditos_fiscales;
/*
INSERT INTO tb_consumidores_finales (numero_factura, fecha_registro_factura, venta_a_cuenta_de, duracion_garantia, nota, id_cita, estado_consumidor_final) VALUES
##('001', NOW(), 'CONTADO', 2, 'nota', 1, 'Completado'),
##('002', '2025-08-29', 'TARJETA', 2,'nota', '1', 'Completado'),
##('003', '2024-08-30 14:30:00', 'TARJETA', 2, 'nota', 11, 'Completado')
##('004', '2024-08-30 14:30:00', 'TARJETA', 2, 'nota', 11, 'Completado')
('005', '2024-08-31 14:30:00', 'TARJETA', 2, 'nota', 12, 'Completado');

INSERT INTO tb_creditos_fiscales (numero_factura, fecha_registro_factura, venta_a_cuenta_de, duracion_garantia, nota, id_cita, nombre_emisor, dui_emisor, estado_credito_fiscal) VALUES
('001', NOW(), 'CONTADO', 2, 'nota', 6, 'Pancho', '12345628-9','Completado');

SELECT * FROM tb_detalles_consumidores_finales;

INSERT INTO tb_detalles_consumidores_finales(id_consumidor_final, id_servicio_en_proceso, precio_servicio) VALUES
(1, 1, 20);

SELECT * FROM tb_detalles_creditos_fiscales;
INSERT INTO tb_detalles_creditos_fiscales(id_credito_fiscal, id_Servicio_en_proceso, precio_servicio) VALUES 
(1, 9, 20);
SELECT * FROM tb_servicios_en_proceso;*/
#---------------------------------------------------------
DELIMITER //
CREATE PROCEDURE sp_servicios_solicitados_por_credito_fiscal(IN idCliente INT)
BEGIN
    SELECT 
        s.nombre_servicio, 
        COUNT(*) AS cantidad_solicitudes, 
        c.id_cliente 
    FROM 
        tb_detalles_creditos_fiscales dcf
        JOIN tb_servicios_en_proceso sp ON dcf.id_servicio_en_proceso = sp.id_servicio_en_proceso 
        JOIN tb_servicios s ON sp.id_servicio = s.id_servicio 
        JOIN tb_citas ci ON sp.id_cita = ci.id_cita 
        JOIN tb_automoviles a ON ci.id_automovil = a.id_automovil 
        JOIN tb_clientes c ON a.id_cliente = c.id_cliente 
    WHERE 
        c.id_cliente = idCliente 
    GROUP BY 
        s.nombre_servicio, 
        c.id_cliente;
END // 
DELIMITER ;
CALL sp_servicios_solicitados_por_credito_fiscal(6);

##TOTAL ESPERADO 4 AUTOMATICOS 4 PARAMETRIZADOS 2 PREDICTIVOS
## TOTAL GENERAL 10
## TOTAL GENERAL 10


WITH servicios_por_mes AS (
    SELECT
        MONTH(s.fecha_aproximada_finalizacion) AS mes,
        YEAR(s.fecha_aproximada_finalizacion) AS anio,
        s.id_servicio,
        SUM(s.cantidad_servicio) AS servicios_realizados
    FROM
        tb_servicios_en_proceso s
    INNER JOIN
        tb_citas c ON s.id_cita = c.id_cita
    WHERE
        s.fecha_aproximada_finalizacion IS NOT NULL
        AND s.fecha_aproximada_finalizacion <= CURRENT_DATE()
    GROUP BY
        YEAR(s.fecha_aproximada_finalizacion),
        MONTH(s.fecha_aproximada_finalizacion),
        s.id_servicio
),
servicios_esperados_por_mes AS (
    SELECT
        MONTH(s.fecha_aproximada_finalizacion) AS mes,
        YEAR(s.fecha_aproximada_finalizacion) AS anio,
        s.id_servicio,
        SUM(s.cantidad_servicio) AS servicios_esperados
    FROM
        tb_servicios_en_proceso s
    INNER JOIN
        tb_citas c ON s.id_cita = c.id_cita
    WHERE
        s.fecha_aproximada_finalizacion > CURRENT_DATE()
    GROUP BY
        YEAR(s.fecha_aproximada_finalizacion),
        MONTH(s.fecha_aproximada_finalizacion),
        s.id_servicio
),
servicios_totales AS (
    SELECT DISTINCT
        s.id_servicio,
        s.nombre_servicio
    FROM
        tb_servicios s
)
SELECT
    CASE meses.mes
        WHEN 1 THEN "Enero"
        WHEN 2 THEN "Febrero"
        WHEN 3 THEN "Marzo"
        WHEN 4 THEN "Abril"
        WHEN 5 THEN "Mayo"
        WHEN 6 THEN "Junio"
        WHEN 7 THEN "Julio"
        WHEN 8 THEN "Agosto"
        WHEN 9 THEN "Septiembre"
        WHEN 10 THEN "Octubre"
        WHEN 11 THEN "Noviembre"
        WHEN 12 THEN "Diciembre"
    END AS mes_nombre,
    st.nombre_servicio AS servicio,
    IFNULL(se.servicios_esperados, 0) AS servicios_esperados,
    IFNULL(sr.servicios_realizados, 0) AS servicios_realizados
FROM
    (
        SELECT 1 AS mes UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION
        SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) AS meses
CROSS JOIN
    servicios_totales st
LEFT JOIN
    servicios_esperados_por_mes se ON meses.mes = se.mes AND YEAR(CURRENT_DATE()) = se.anio AND st.id_servicio = se.id_servicio
LEFT JOIN
    servicios_por_mes sr ON meses.mes = sr.mes AND YEAR(CURRENT_DATE()) = sr.anio AND st.id_servicio = sr.id_servicio
ORDER BY
    meses.mes,
    st.nombre_servicio;



SELECT * FROM tb_citas;
SELECT * FROM tb_Servicios_en_proceso;
SELECT * FROM tb_servicios;


INSERT INTO tb_servicios_en_proceso (
                fecha_registro,
                fecha_aproximada_finalizacion,
                id_cita,
                id_servicio,
                cantidad_servicio, fecha_finalizacion
            ) VALUES ('2023-05-29 10:30:00', '2023-05-29 15:30:00', 2, 6, 2, '2023-05-29 10:30:00');


SELECT 
    CONCAT(a.modelo_automovil, " - ", a.placa_automovil) AS "Automovil",
    s.nombre_servicio AS "Servicio_Realizado",
    CONCAT(
        FLOOR(avg_service_time / 1440), " días ",
        FLOOR((avg_service_time % 1440) / 60), " horas y ",
        ROUND(avg_service_time % 60), " minutos"
    ) AS "Tiempo_Promedio",
    t.nombre_tipo_automovil AS "Tipo"
FROM 
    tb_automoviles a
JOIN 
    tb_citas c ON a.id_automovil = c.id_automovil
JOIN 
    tb_tipos_automoviles t ON a.id_tipo_automovil = t.id_tipo_automovil
JOIN 
    tb_servicios_en_proceso se ON c.id_cita = se.id_cita
JOIN 
    tb_servicios s ON se.id_servicio = s.id_servicio
JOIN (
    SELECT 
        a.id_automovil,
        s.id_servicio,
        AVG(TIMESTAMPDIFF(MINUTE, se.fecha_registro, COALESCE(se.fecha_finalizacion, se.fecha_aproximada_finalizacion))) AS avg_service_time
    FROM 
        tb_automoviles a
    JOIN 
        tb_citas c ON a.id_automovil = c.id_automovil
    JOIN 
        tb_servicios_en_proceso se ON c.id_cita = se.id_cita
    JOIN 
        tb_servicios s ON se.id_servicio = s.id_servicio
    WHERE 
        se.fecha_finalizacion IS NOT NULL
    GROUP BY 
        a.id_automovil, s.id_servicio
) avg_service_data ON a.id_automovil = avg_service_data.id_automovil AND s.id_servicio = avg_service_data.id_servicio
GROUP BY 
    a.id_automovil, s.nombre_servicio, t.nombre_tipo_automovil;



