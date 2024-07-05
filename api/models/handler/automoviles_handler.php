<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class AutomovilHandler
{
    protected $id_automovil = null;
    protected $id_modelo_automovil = null;
    protected $id_tipo_automovil = null;
    protected $id_color = null;
    protected $fecha_fabricacion_automovil = null;
    protected $placa_automovil = null;
    protected $imagen_automovil = null;
    protected $id_cliente = null;
    protected $fecha_registro = null;
    protected $estado_automovil = null;

    protected $search_value = null;

    const RUTA_IMAGEN = '../../../api/images/automoviles/';

    public function searchRows()
    {
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                c.dui_cliente AS dui_cliente,
                co.nombre_color AS nombre_color,
                mo.nombre_modelo_automovil AS nombre_modelo,
                ma.nombre_marca_automovil AS nombre_marca,
                a.*
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                INNER JOIN tb_colores co USING(id_color)
                INNER JOIN tb_modelos_automoviles mo USING(id_modelo_automovil)
                INNER JOIN tb_marcas_automoviles ma USING (id_marca_automovil)
                WHERE estado_automovil = ?';

        $params = array('Activo');

        if ($this->search_value) {
            $sql .= ' AND (placa_automovil LIKE ?)';
            $params[] = "%{$this->search_value}%";
        }

        return Database::getRows($sql, $params);
    }


    public function updateRow()
    {
        $sql = 'UPDATE tb_automoviles SET 
        id_modelo_automovil = ?,
        id_tipo_automovil = ?,
        id_color = ?,
        fecha_fabricacion_automovil = ?,
        placa_automovil = ?,
        imagen_automovil = ?,
        id_cliente = ?
        WHERE id_automovil = ?'; // Consulta SQL para insertar un nuevo automóvil
        $params = array(
            $this->id_modelo_automovil,
            $this->id_tipo_automovil,
            $this->id_color,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_cliente,
            $this->id_automovil
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        // Consulta SQL para eliminar un automóvil basado en su ID
        $sql = 'UPDATE tb_automoviles SET estado_automovil = "Eliminado"
            WHERE id_automovil = ?';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_automovil);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }

    // Método para crear un nuevo cliente
    public function createRow()
    {
        $sql = 'INSERT INTO tb_automoviles(
            id_modelo_automovil, 
            id_tipo_automovil, 
            id_color,
            fecha_fabricacion_automovil,
            placa_automovil, 
            imagen_automovil,
            id_cliente,
            fecha_registro,
            estado_automovil) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), "Activo")'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->id_modelo_automovil,
            $this->id_tipo_automovil,
            $this->id_color,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_cliente
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_automovil FROM tb_automoviles 
        WHERE (placa_automovil = ?)';
        // Consulta SQL para verificar duplicados por valor (DUI o correo) excluyendo el ID actual
        $params = array(
            $value,
        ); // Parámetros para la consulta SQL

        if ($this->id_automovil) {
            $sql .= ' AND id_automovil <> ?;';
            $params[] = $this->id_automovil;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para leer los automóviles
    public function readAll()
    {
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        co.nombre_color AS nombre_color,
        mo.nombre_modelo_automovil AS nombre_modelo,
        ma.nombre_marca_automovil AS nombre_marca,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_colores co USING(id_color)
        INNER JOIN tb_modelos_automoviles mo USING(id_modelo_automovil)
        INNER JOIN tb_marcas_automoviles ma USING (id_marca_automovil)
        WHERE estado_automovil = "Activo";';
        return Database::getRows($sql);
    }

    // Método para leer los automóviles
    public function readDetail()
    {
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        co.nombre_color AS nombre_color,
        mo.nombre_modelo_automovil AS nombre_modelo,
        ma.nombre_marca_automovil AS nombre_marca,
        t.nombre_tipo_automovil AS nombre_tipo,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_colores co USING(id_color)
        INNER JOIN tb_modelos_automoviles mo USING(id_modelo_automovil)
        INNER JOIN tb_marcas_automoviles ma USING (id_marca_automovil)
        INNER JOIN tb_tipos_automoviles t USING (id_tipo_automovil)
        WHERE estado_automovil = "Activo" AND id_automovil = ?;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    // Método para leer los clientes
    public function readModelos()
    {
        $sql = 'SELECT id_modelo_automovil, nombre_modelo_automovil FROM tb_modelos_automoviles ORDER BY nombre_modelo_automovil ASC;';
        return Database::getRows($sql);
    }

    // Método para leer los clientes
    public function readTipos()
    {
        $sql = 'SELECT id_tipo_automovil, nombre_tipo_automovil FROM tb_tipos_automoviles ORDER BY nombre_tipo_automovil ASC;';
        return Database::getRows($sql);
    }

    // Método para leer los clientes
    public function readColores()
    {
        $sql = 'SELECT id_color, nombre_color FROM tb_colores ORDER BY nombre_color ASC;';
        return Database::getRows($sql);
    }

    // Método para leer los clientes
    public function readClientes()
    {
        $sql = 'SELECT id_cliente, dui_cliente FROM tb_clientes ORDER BY dui_cliente ASC;';
        return Database::getRows($sql);
    }

    // Método para leer a un cliente
    public function readOne()
    {
        $sql = 'SELECT * FROM tb_automoviles WHERE id_automovil = ?';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }
}
