<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class CitasHandler
{
    protected $id_cita = null;
    protected $id_cliente = null;
    protected $fecha_registro = null;
    protected $fecha_hora_cita = null;
    protected $id_automovil = null;
    protected $movilizacion_vehiculo = null;
    protected $zona_habilitada = null;
    protected $direccion_ida = null;
    protected $direccion_regreso = null;
    protected $estado_cita = null;
    protected $search_value = null;
    protected $id_notificacion = null;

    public function searchCitaByNumber()
    {
        $sql = 'SELECT c.*, a.*, cl.*,
                CONCAT(
                CASE DAYOFWEEK(c.fecha_hora_cita)
                    WHEN 1 THEN "Domingo"
                    WHEN 2 THEN "Lunes"
                    WHEN 3 THEN "Martes"
                    WHEN 4 THEN "Miércoles"
                    WHEN 5 THEN "Jueves"
                    WHEN 6 THEN "Viernes"
                    WHEN 7 THEN "Sábado"
                END, 
                " ", DATE_FORMAT(c.fecha_hora_cita, "%d de "),
                CASE MONTH(c.fecha_hora_cita)
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
                END
                ) AS fecha_cita,
                DATE_FORMAT(c.fecha_hora_cita, "%l:%i %p") AS hora_cita,
                DATE_FORMAT(c.fecha_hora_cita, "%Y") AS anio_cita
                FROM tb_citas c
                INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
                INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
                WHERE cl.id_cliente = ? AND c.id_cita = ?';
        $params = array(
            $_SESSION['idUsuarioCliente'],
            $this->id_cita
        );
        return Database::getRow($sql, $params);
    }

    public function searchByFechaLLegada()
    {
        $sql = 'SELECT * FROM tb_citas;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function getDemandaServicioMensual()
    {
        $sql = 'WITH servicios_realizados_por_mes AS (
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
            ###AND s.fecha_aproximada_finalizacion <= CURRENT_DATE()
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
        st.nombre_servicio;';
        return Database::getRows($sql);
    }

    public function getTiempoAtencionNatural()
    {
        $sql = 'SELECT 
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
        a.id_automovil, s.nombre_servicio, t.nombre_tipo_automovil;';
        return Database::getRows($sql);
    }


    public function tiempoPorServicio()
    {
        $sql = 'SELECT * FROM vw_tiempo_servicio;';
        return Database::getRows($sql);
    }


    public function autosReparados()
    {
        $sql = 'SELECT * FROM vw_autos_reparados_por_mes;';
        return Database::getRows($sql);
    }

    public function autosAReparar()
    {
        $sql = 'SELECT * FROM vw_autos_esperados_por_mes;';
        return Database::getRows($sql);
    }

    public function autosARepararPasado()
    {
        $sql = 'SELECT * FROM vw_autos_esperados_por_mes_pasado;';
        return Database::getRows($sql);
    }

    // Método para crear una nueva cita
    public function createRow()
    {
        $sql = 'INSERT INTO tb_citas(
            estado_cita, 
            fecha_hora_cita,
            id_automovil,
            movilizacion_vehiculo,
            zona_habilitada,
            direccion_ida,
            direccion_regreso,
            fecha_registro) VALUES ("En espera", ?, ?, ?, ?, ?, ?, ?)'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->fecha_hora_cita,
            $this->id_automovil,
            $this->movilizacion_vehiculo,
            $this->zona_habilitada,
            $this->direccion_ida,
            $this->direccion_regreso,
            $this->fecha_registro
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para actualizar una cita existente
    public function updateRow()
    {
        // Consulta SQL para actualizar una cita existente
        $sql = 'UPDATE tb_citas SET
                fecha_hora_cita = ?,
                id_automovil = ?,
                movilizacion_vehiculo = ?,
                zona_habilitada = ?,
                direccion_ida = ?,
                direccion_regreso = ?
            WHERE id_cita = ?';

        // Parámetros para la consulta SQL
        $params = array(
            $this->fecha_hora_cita,
            $this->id_automovil,
            $this->movilizacion_vehiculo,
            $this->zona_habilitada,
            $this->direccion_ida,
            $this->direccion_regreso,
            $this->id_cita
        );

        // Ejecución de la consulta SQL
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar una cita existente
    public function updateEstado()
    {
        // Consulta SQL para actualizar una cita existente
        $sql = 'UPDATE tb_citas SET
                estado_cita = ?
            WHERE id_cita = ?';

        // Parámetros para la consulta SQL
        $params = array(
            $this->estado_cita,
            $this->id_cita
        );
        //Ejecución de la consulta SQL
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT c.*, a.*, cl.* FROM tb_citas c
        INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
        WHERE c.estado_cita != "Eliminada" ';
        return Database::getRows($sql);
    }

    public function readAllEspecific()
    {
        // Construcción de la consulta SQL
        $sql = 'SELECT c.*, a.*, cl.*,
                CONCAT(
                CASE DAYOFWEEK(c.fecha_hora_cita)
                    WHEN 1 THEN "Domingo"
                    WHEN 2 THEN "Lunes"
                    WHEN 3 THEN "Martes"
                    WHEN 4 THEN "Miércoles"
                    WHEN 5 THEN "Jueves"
                    WHEN 6 THEN "Viernes"
                    WHEN 7 THEN "Sábado"
                END, 
                " ", DATE_FORMAT(c.fecha_hora_cita, "%d de "),
                CASE MONTH(c.fecha_hora_cita)
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
                END
                ) AS fecha_cita,
                DATE_FORMAT(c.fecha_hora_cita, "%l:%i %p") AS hora_cita,
                DATE_FORMAT(c.fecha_hora_cita, "%Y") AS anio_cita
                FROM tb_citas c
                INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
                INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
                WHERE cl.id_cliente = ?';

        // Inicializar los parámetros con el id del cliente
        $params = array($_SESSION['idUsuarioCliente']);

        // Añadir el id_cita si está definido
        if ($this->id_cita) {
            $sql .= ' AND c.id_cita = ?';
            $params[] = $this->id_cita;
        }

        // Añadir las condiciones basadas en el estado de la cita
        if ($this->estado_cita) {
            if ($this->estado_cita == 'proximas') {
                // Solo citas aceptadas y futuras
                $sql .= ' AND c.estado_cita = "Aceptada" AND c.fecha_hora_cita > NOW()';
            } else {
                // Filtrar por el estado de cita proporcionado
                $sql .= ' AND c.estado_cita = ?';
                $params[] = $this->estado_cita;
            }
        } else {
            // Filtrar para que no incluya citas canceladas
            $sql .= ' AND c.estado_cita != "Cancelado"';
        }

        // Ejecutar la consulta con los parámetros adecuados
        return Database::getRows($sql, $params);
    }


    public function readAllNotisCitas()
    {
        $sql = 'SELECT 
        c.*, 
        a.*, 
        cl.*, 
        s.*,
        srv.nombre_servicio, -- Agregar el nombre del servicio de tb_servicios
        DATE_FORMAT(c.fecha_hora_cita, "%Y-%m-%d") AS fecha_cita, -- Mostrar la fecha en formato estándar (YYYY-MM-DD)
        DATE_FORMAT(c.fecha_hora_cita, "%l:%i %p") AS hora_cita,   -- Mostrar la hora en formato estándar (H:MM AM/PM)
        DATE_FORMAT(c.fecha_hora_cita, "%Y") AS anio_cita            -- Mostrar solo el año
        FROM tb_citas c
        INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
            LEFT JOIN tb_servicios_en_proceso s ON c.id_cita = s.id_cita
        LEFT JOIN tb_servicios srv ON s.id_servicio = srv.id_servicio -- Agregar JOIN con la nueva tabla tb_servicios
        WHERE c.estado_cita = "Aceptado"
        AND cl.id_cliente = ?
        ';

        // Inicializar los parámetros con el id del cliente
        $params = array($_SESSION['idUsuarioCliente']);

        // Añadir el id_cita si está definido
        if ($this->id_cita) {
            $sql .= ' AND c.id_cita = ?';
            $params[] = $this->id_cita;
        }

        // Ejecutar la consulta con los parámetros adecuados
        return Database::getRows($sql, $params);
    }

    public function actualizacionCitaNoti()
    {
        $sql = 'SELECT 
        n.id_notificacion,
        n.id_cita,
        n.estado_nuevo,
        n.fecha_creacion,
        a.modelo_automovil,
        c.fecha_hora_cita,
        s.nombre_servicio
        FROM 
        tb_notificaciones n
        JOIN 
        tb_citas c ON n.id_cita = c.id_cita
        JOIN 
        tb_automoviles a ON c.id_automovil = a.id_automovil
        JOIN 
        tb_clientes cl ON a.id_cliente = cl.id_cliente
        JOIN 
        tb_servicios_en_proceso sp ON c.id_cita = sp.id_cita
        JOIN 
        tb_servicios s ON sp.id_servicio = s.id_servicio
        WHERE 
        n.leido = FALSE
        AND n.estado_nuevo != "En espera"
        AND cl.id_cliente = ?
        ';
        $params = array($_SESSION['idUsuarioCliente']);
        return Database::getRows($sql, $params);
    }


    public function marcarComoLeido()
    {
        // Consulta SQL para actualizar una cita existente
        $sql = 'UPDATE tb_notificaciones SET
                leido = ?
            WHERE id_notificacion = ?';

        // Parámetros para la consulta SQL
        $params = array(
            '1',
            $this->id_notificacion
        );

        // Ejecución de la consulta SQL
        return Database::executeRow($sql, $params);
    }


    public function readOne()
    {
        $sql = 'SELECT c.*, a.*, cl.* FROM tb_citas c
        INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
        WHERE c.id_cita = ? AND c.estado_cita != "Eliminada";';
        $params = array(
            $this->id_cita
        );
        return Database::getRow($sql, $params);
    }

    public function searchCitaAuto()
    {
        $sql = 'SELECT * FROM tb_citas WHERE id_automovil = ?
        AND (estado_cita = "En espera" OR estado_cita = "Aceptado");';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function readServiciosCita()
    {
        $sql = 'SELECT s.*, ts.*, sp.*, c.*
            FROM tb_servicios_en_proceso sp
            INNER JOIN tb_servicios s ON s.id_servicio = sp.id_servicio
            INNER JOIN tb_tipos_servicios ts ON ts.id_tipo_servicio = s.id_tipo_servicio
            LEFT JOIN tb_citas c ON sp.id_cita = c.id_cita
            WHERE c.id_cita = ?;';
        $params = array(
            $this->id_cita
        );
        return Database::getRows($sql, $params);
    }

    public function searchRows()
    {
        $sql = 'SELECT c.*, a.*, cl.* FROM tb_citas c
        INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil 
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente 
        WHERE c.estado_cita = ?';
        $params = array(
            $this->search_value
        );
        return Database::getRows($sql, $params);
    }

    public function readAutomoviles()
    {
        $sql = 'SELECT id_automovil, placa_automovil FROM tb_automoviles;';
        return Database::getRows($sql);
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicate($value)
    {
        $sql = 'SELECT fecha_hora_cita 
        FROM tb_citas 
        WHERE fecha_hora_cita = ? 
        AND (estado_cita = "Aceptado" OR estado_cita = "En espera")';
        // Consulta SQL para verificar duplicados por valor (DUI o correo) excluyendo el ID actual
        $params = array(
            $value
        ); // Parámetros para la consulta SQL

        if ($this->id_cita) {
            $sql .= ' AND id_cita <> ?;';
            $params[] = $this->id_cita;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        // Consulta SQL para eliminar un automóvil basado en su ID
        $sql = 'UPDATE tb_citas SET estado_cita = "Cancelado"
            WHERE id_cita = ? AND estado_cita = "En espera"';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_cita);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }

    public function readCitasParametrizada()
    {
        $sql = 'SELECT 
        c.nombres_cliente AS nombre_cliente,
        a.modelo_automovil AS modelo_automovil,
        ci.fecha_hora_cita AS fecha_cita,
        ci.estado_cita AS estado_cita
        FROM 
        tb_citas ci
        JOIN 
        tb_automoviles a ON ci.id_automovil = a.id_automovil
        JOIN 
        tb_clientes c ON a.id_cliente = c.id_cliente
        WHERE 
        ci.estado_cita = ?
        AND c.id_cliente = ?;';
        $params = array($this->estado_cita, $this->id_cliente);
        return Database::getRows($sql, $params);
    }
}
