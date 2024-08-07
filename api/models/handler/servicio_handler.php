<?php
// Se incluye la clase para manejar la conexión a la base de datos.
require_once ('../../helpers/database.php');

/*
 * Clase para manejar los datos de la tabla tb_servicios.
 */
class ServicioHandler
{
    // Propiedades de la clase.
    protected $id_servicio = null;
    protected $id_tipo_servicio = null;
    protected $nombre_servicio = null;
    protected $descripcion_servicio = null;

    // Método para leer todos los registros.
    public function readAll()
    {
        $sql = 'SELECT id_servicio, id_tipo_servicio, nombre_servicio, descripcion_servicio FROM tb_servicios';
        return Database::getRows($sql);
    }

    // Método para leer un solo registro por ID.
    public function readOne()
    {
        $sql = 'SELECT id_servicio, id_tipo_servicio, nombre_servicio, descripcion_servicio FROM tb_servicios WHERE id_tipo_servicio = ?';
        $params = array($this->id_tipo_servicio);
        return Database::getRows($sql, $params);
    }

    public function readOneModal()
    {
        $sql = 'SELECT id_tipo_servicio, nombre_servicio, descripcion_servicio FROM tb_servicios WHERE id_servicio = ?';
        $params = array($this->id_tipo_servicio);
        return Database::getRow($sql, $params);
    }

    // Método para crear un nuevo registro.
    public function createRow()
    {
        $sql = 'INSERT INTO tb_servicios (id_tipo_servicio, nombre_servicio, descripcion_servicio) VALUES (?, ?, ?)';
        $params = array($this->id_tipo_servicio, $this->nombre_servicio, $this->descripcion_servicio);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar un registro existente.
    // Método para actualizar un registro existente.
    public function updateRow()
    {
        $sql = 'UPDATE tb_servicios SET nombre_servicio = ?, descripcion_servicio = ? WHERE id_servicio = ?';
        $params = array($this->nombre_servicio, $this->descripcion_servicio, $this->id_tipo_servicio);
        return Database::executeRow($sql, $params);
    }


    // Método para eliminar un registro.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_servicios WHERE id_servicio = ?';
        $params = array($this->id_tipo_servicio);
        return Database::executeRow($sql, $params);
    }
}
?>