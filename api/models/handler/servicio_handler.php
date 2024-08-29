<?php
// Se incluye la clase para manejar la conexión a la base de datos.
require_once('../../helpers/database.php');

/*
 * Clase para manejar los datos de la tabla tb_servicios.
 */
class ServicioHandler
{
    // Propiedades de la clase.
    protected $id_servicio = null;
    protected $id_cliente = null;
    protected $id_tipo_servicio = null;
    protected $nombre_servicio = null;
    protected $descripcion_servicio = null;

    // Método para leer todos los registros.
    public function readAll()
    {
        $sql = 'SELECT id_servicio, id_tipo_servicio, nombre_servicio, descripcion_servicio FROM tb_servicios';
        return Database::getRows($sql);
    }

    public function readReportFrecuenciaServicio()
    {
        $sql = 'SELECT 
        c.nombres_cliente,
        c.apellidos_cliente,
        s.nombre_servicio,
        a.modelo_automovil,
        ct.fecha_hora_cita AS fecha_cita
        FROM 
        tb_citas ct
        INNER JOIN 
        tb_automoviles a ON ct.id_automovil = a.id_automovil
        INNER JOIN 
        tb_clientes c ON a.id_cliente = c.id_cliente
        INNER JOIN 
        tb_servicios s ON ct.id_servicio = s.id_servicio
        WHERE 
        c.id_cliente = ?
        AND s.id_servicio = ?
        ORDER BY 
        ct.fecha_hora_cita;';
        $params = array($this->id_cliente, $this->id_servicio);
        return Database::getRows($sql, $params);
    }

    public function readServicios()
    {
        $sql = 'SELECT id_servicio, nombre_servicio FROM tb_servicios';
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

    //Método para leer la cantidad de servicios que hay por el grupo de servicios
    public function graphicGroupOfService()
    {
        // Consulta SQL para leer todos los automóviles activos
        $sql = 'SELECT * FROM vw_cantidad_servicios_por_tipo;';
        return Database::getRows($sql);
    }

    public function readTop10Servicios()
    {
        $sql = 'SELECT * FROM vw_top_10_servicios';
        return Database::getRows($sql);
    }

    // Método para buscar registros.
    public function searchRows()
    {
        // Valores que se introducen en la barra de búsqueda
        $value = '%' . Validator::getSearchValue() . '%';

        $sql = 'SELECT id_servicio, nombre_servicio, descripcion_servicio 
            FROM tb_servicios 
            WHERE nombre_servicio LIKE ?;';

        $params = array($value);
        return Database::getRows($sql, $params);
    }
}
