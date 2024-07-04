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
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente;';
        return Database::getRows($sql);
    }


    public function readOne()
    {
        $sql = 'SELECT c.*, a.*, cl.* FROM tb_citas c
        INNER JOIN tb_automoviles a ON c.id_automovil = a.id_automovil
        INNER JOIN tb_clientes cl ON a.id_cliente = cl.id_cliente
        WHERE c.id_cita = ?';
        $params = array(
            $this->id_cita
        );
        return Database::getRow($sql, $params);
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
        $sql = 'SELECT fecha_hora_cita FROM tb_citas WHERE fecha_hora_cita = ? AND estado_cita == "Aceptado" OR estado_cita == "En espera"';
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
}
