<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class CitasHandler
{
    protected $id_cita = null;
    protected $fecha_registro = null;
    protected $fecha_hora_cita = null;
    protected $id_automovil = null;
    protected $movilizacion_vehiculo = null;
    protected $zona_habilitada = null;
    protected $direccion_ida = null;
    protected $direccion_regreso = null;
    protected $estado_cita = null;
    protected $search_value = null;

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
    WHERE c.estado_cita != "Cancelado" 
    AND cl.id_cliente = ?';

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
            WHERE id_cita = ?';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_cita);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }
}
