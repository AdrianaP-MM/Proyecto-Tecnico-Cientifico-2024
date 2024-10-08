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
        dui_trabajador VARCHAR(10) NOT NULL,  #NN U 
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
        ('Microbus'),
        ('Motocicleta'),
        ('Wagon'),
        ('Crossover'),
        ('Roadster'),
        ('Camioneta'),
        ('Van'),
        ('Deportivo'),
        ('Furgoneta'),
        ('Microcar'),
        ('Limusina'),
        ('Camión ligero'),
        ('Camión de carga'),
        ('Furgoneta refrigerada'),
        ('Autobús'),
        ('Tráiler'),
        ('Otro');


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

    INSERT INTO tb_especializaciones_trabajadores (nombre_especializacion_trabajador, pago_por_especializacion)
    VALUES
    ('Adaptación de vehículos para accesibilidad', 70.00),
    ('Aire acondicionado automotriz', 60.00),
    ('Calibración y mantenimiento de sistemas de carga para vehículos eléctricos', 70.00),
    ('Cambio y mantenimiento de aceite', 45.00),
    ('Diagnóstico electrónico', 70.00),
    ('Electricidad automotriz', 60.00),
    ('Electrónica y sistemas de navegación', 65.00),
    ('Enderezado y reparación de carrocería', 60.00),
    ('Especialista en vehículos híbridos y eléctricos', 75.00),
    ('Instalación de rampas y equipos especializados', 65.00),
    ('Instalación de sistemas de audio', 60.00),
    ('Instalación de sistemas de iluminación LED y faros', 55.00),
    ('Instalación de sistemas de rastreo GPS', 60.00),
    ('Instalación de sistemas de seguridad', 55.00),
    ('Inspección y certificación de vehículos comerciales', 75.00),
    ('Limpieza y desinfección de vehículos de transporte de alimentos', 45.00),
    ('Mantenimiento de flotas', 70.00),
    ('Mantenimiento de flotas comerciales', 80.00),
    ('Mecánica general', 50.00),
    ('Pintura y acabados', 55.00),
    ('Reparación de motores', 65.00),
    ('Reparación de remolques', 55.00),
    ('Reparación de sistemas de combustible', 55.00),
    ('Reparación de sistemas de escape', 50.00),
    ('Reparación de sistemas hidráulicos', 70.00),
    ('Reparación de transmisiones automáticas', 65.00),
    ('Reparación de vehículos refrigerados', 75.00),
    ('Restauración de vehículos clásicos', 80.00),
    ('Soldadura automotriz', 50.00),
    ('Sistema de dirección', 55.00),
    ('Sistema de frenos', 55.00),
    ('Sistemas de suspensión', 55.00),
    ('Taller de llantas y alineación', 50.00),
    ('Tintado de ventanas y películas de protección', 50.00),
    ('Transmisión y embrague', 60.00);

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
    
-- USADO EN GRAFICO PREDICTIVO 1 (ADRIANA)
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
#--------------------------------------------------------------------------------- USADO EN GRAFICO PARAMETRIZADO 3 (ADRIANA)
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
##TOTAL ESPERADO 4 AUTOMATICOS 4 PARAMETRIZADOS 2 PREDICTIVOS
## TOTAL GENERAL 10
## TOTAL GENERAL 10

##---------------------------------------------------- REPORTES PREDICTIVOS (Adriana)

WITH servicios_realizados_por_mes AS (
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
            AND YEAR(s.fecha_aproximada_finalizacion) = YEAR(CURRENT_DATE()) -- Solo para el año actual
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
            s.fecha_aproximada_finalizacion IS NOT NULL
            AND s.fecha_aproximada_finalizacion < CURRENT_DATE() -- Cualquier fecha pasada
            AND YEAR(s.fecha_aproximada_finalizacion) < YEAR(CURRENT_DATE()) -- Solo años anteriores
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
        servicios_esperados_por_mes se ON meses.mes = se.mes AND st.id_servicio = se.id_servicio
    LEFT JOIN
        servicios_realizados_por_mes sr ON meses.mes = sr.mes AND st.id_servicio = sr.id_servicio
    GROUP BY
        meses.mes,
        st.nombre_servicio
    ORDER BY
        meses.mes,
        st.nombre_servicio;


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

DELIMITER;

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
END$$

DELIMITER;