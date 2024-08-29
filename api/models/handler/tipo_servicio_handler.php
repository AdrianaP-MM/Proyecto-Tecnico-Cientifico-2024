<?php
// Se incluye la clase para manejar la conexión a la base de datos.
require_once('../../helpers/database.php');

/*
 * Clase para manejar los datos de la tabla tb_tipos_servicios.
 */
class TipoServicioHandler
{
    // Propiedades de la clase.
    protected $id_tipo_servicio = null;
    protected $nombre_tipo_servicio = null;
    protected $imagen_servicio = null;
    protected $search_value = null;

    const RUTA_IMAGEN = '../../../api/images/tipoServicio/';

    // Método para leer todos los registros.
    public function readAll()
    {
        $sql = 'SELECT id_tipo_servicio, nombre_tipo_servicio, imagen_servicio FROM tb_tipos_servicios';
        return Database::getRows($sql);
    }

    // Método para leer un solo registro por ID.
    public function readOne()
    {
        $sql = 'SELECT id_tipo_servicio, nombre_tipo_servicio, imagen_servicio FROM tb_tipos_servicios WHERE id_tipo_servicio = ?';
        $params = array($this->id_tipo_servicio);
        return Database::getRow($sql, $params);
    }

    // Método para crear un nuevo registro.
    public function createRow()
    {
        $sql = 'INSERT INTO 
        tb_tipos_servicios 
        (nombre_tipo_servicio, imagen_servicio) VALUES (?, ?)';
        $params = array($this->nombre_tipo_servicio, $this->imagen_servicio);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar un registro existente.
    public function updateRow()
    {
        $sql = 'UPDATE tb_tipos_servicios SET nombre_tipo_servicio = ?, imagen_servicio = ? WHERE id_tipo_servicio = ?';
        $params = array($this->nombre_tipo_servicio, $this->imagen_servicio, $this->id_tipo_servicio);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un registro.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_tipos_servicios WHERE id_tipo_servicio = ?';
        $params = array($this->id_tipo_servicio);
        return Database::executeRow($sql, $params);
    }

    // Método para buscar registros.
    public function searchRows()
    {
        //Valores que se introducen la barra de busqueda 
        $value = '%' . Validator::getSearchValue() . '%';

        $sql = 'SELECT id_tipo_servicio, nombre_tipo_servicio, imagen_servicio 
                FROM tb_tipos_servicios 
                WHERE nombre_tipo_servicio LIKE ?;';

        $params = array($value);
        return Database::getRows($sql, $params);
    }



    public function checkDuplicated($value)
    {
        $sql = 'SELECT COUNT(*) as count FROM tb_tipos_servicios WHERE nombre_tipo_servicio = ?';
        $params = array($value);
        $result = Database::getRow($sql, $params);
        // Retorna true si el count es mayor que 0, de lo contrario, false.
        return $result['count'] > 0;
    }
}
