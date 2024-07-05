<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class ServiciosProcesoHandler
{
    protected $id_servicio_en_proceso = null;
    protected $fecha_registro = null;
    protected $fecha_aproximada_finalizacion = null;
    protected $fecha_finalizacion = null;
    protected $id_cita = null;
    protected $id_servicio = null;
    protected $cantidad_servicio = null;

    // Método para crear una nueva cita
    public function createRow()
    {
        $sql = 'INSERT INTO tb_servicios_en_proceso(
            fecha_registro,
            fecha_aproximada_finalizacion,
            id_cita,
            id_servicio, 
            cantidad_servicio) VALUES (?,?,?,?,?);'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->fecha_registro,
            $this->fecha_aproximada_finalizacion,
            $this->id_cita,
            $this->id_servicio,
            $this->cantidad_servicio
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_servicios_en_proceso 
            SET fecha_aproximada_finalizacion = ?,
            fecha_finalizacion = ?,
            cantidad_servicio = ? WHERE id_cita = ? AND id_servicio = ?;'; 
        $params = array(
            $this->fecha_aproximada_finalizacion,
            $this->fecha_finalizacion,
            $this->cantidad_servicio,
            $this->id_cita,
            $this->id_servicio
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_servicios_en_proceso WHERE id_servicio = ? AND id_cita = ?;'; 
        $params = array(
            $this->id_servicio,
            $this->id_cita
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }


    public function readOne()
    {
        $sql = 'SELECT * FROM tb_servicios_en_proceso WHERE id_servicio = ? AND id_cita = ?; ';
        $params = array(
            $this->id_servicio,
            $this->id_cita
        ); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function readAll()
    {
        $sql = 'SELECT id_servicio, nombre_servicio FROM tb_servicios;';
        return Database::getRows($sql); // Ejecución de la consulta SQL
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicate($id_servicio, $id_cita)
    {
        $sql = 'SELECT id_servicio_en_proceso FROM tb_servicios_en_proceso WHERE id_servicio ? AND id_cita = ?';
        // Consulta SQL para verificar duplicados por valor (DUI o correo) excluyendo el ID actual
        $params = array(
            $id_servicio,
            $id_cita
        ); // Parámetros para la consulta SQL

        if ($this->id_servicio_en_proceso) {
            $sql .= ' AND id_servicio_en_proceso <> ?;';
            $params[] = $this->id_servicio_en_proceso;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }
}
