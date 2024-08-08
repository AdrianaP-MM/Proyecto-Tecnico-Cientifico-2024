<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

/*
 *  Clase para manejar el comportamiento de los datos de la tabla automoviles.
 */
class AutomovilHandler
{
    protected $id_automovil = null;
    protected $modelo_automovil = null; // Cambiado a VARCHAR
    protected $id_tipo_automovil = null;
    protected $color_automovil = null;
    protected $fecha_fabricacion_automovil = null;
    protected $placa_automovil = null;
    protected $imagen_automovil = null;
    protected $id_cliente = null;
    protected $fecha_registro = null;
    protected $estado_automovil = null;

    protected $search_value = null;
    protected $fecha_desde = null;
    protected $fecha_hasta  = null;

    const RUTA_IMAGEN = '../../../api/images/automoviles/';

    public function searchRows()
    {
        // Consulta SQL para buscar automóviles
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                c.dui_cliente AS dui_cliente,
                co.nombre_color AS nombre_color,
                mo.nombre_modelo_automovil AS nombre_modelo,
                ma.nombre_marca_automovil AS nombre_marca,
                a.*
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                INNER JOIN tb_colores co USING(id_color)
                INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
                INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
                WHERE estado_automovil = ?';
    
        $params = array('Activo');
    
        if ($this->search_value) {
            $sql .= ' AND (placa_automovil LIKE ?)';
            $params[] = "%{$this->search_value}%";
        }
    
        if ($this->fecha_desde && $this->fecha_hasta) {
            $sql .= ' AND fecha_registro BETWEEN ? AND ?';
            $params[] = $this->fecha_desde;
            $params[] = $this->fecha_hasta;
        } else {
            if ($this->fecha_desde) {
                $sql .= ' AND fecha_registro >= ?';
                $params[] = $this->fecha_desde;
            }
            if ($this->fecha_hasta) {
                $sql .= ' AND fecha_registro <= ?';
                $params[] = $this->fecha_hasta;
            }
        }
    
        if ($this->fecha_fabricacion_automovil) {
            $sql .= ' AND YEAR(fecha_fabricacion_automovil) = ?';
            $params[] = $this->fecha_fabricacion_automovil;
        }
    
        return Database::getRows($sql, $params);
    }
    
    public function updateRow()
    {
        // Consulta SQL para actualizar un automóvil
        $sql = 'UPDATE tb_automoviles SET 
        modelo_automovil = ?, // Cambio aquí
        id_tipo_automovil = ?,
        color_automovil = ?,
        fecha_fabricacion_automovil = ?,
        placa_automovil = ?,
        imagen_automovil = ?,
        id_cliente = ?
        WHERE id_automovil = ?'; 

        $params = array(
            $this->modelo_automovil,
            $this->id_tipo_automovil,
            $this->color_automovil,
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
        // Consulta SQL para eliminar un automóvil (marcarlo como eliminado)
        $sql = 'UPDATE tb_automoviles SET estado_automovil = "Eliminado"
            WHERE id_automovil = ?';
        $params = array($this->id_automovil);
        return Database::executeRow($sql, $params);
    }

    public function createRow()
    {
        // Consulta SQL para insertar un nuevo automóvil
        $sql = 'INSERT INTO tb_automoviles(
            modelo_automovil,
            id_tipo_automovil, 
            color_automovil,
            fecha_fabricacion_automovil,
            placa_automovil, 
            imagen_automovil,
            id_cliente,
            fecha_registro,
            estado_automovil) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), "Activo")'; 

        $params = array(
            $this->modelo_automovil,
            $this->id_tipo_automovil,
            $this->color_automovil,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $_SESSION['idUsuarioCliente'] 
        ); // Parámetros para la consulta SQL

        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }
    public function checkDuplicate($value)
    {
        // Consulta SQL para verificar duplicados
        $sql = 'SELECT id_automovil FROM tb_automoviles 
        WHERE (placa_automovil = ?)';
        $params = array(
            $value,
        ); // Parámetros para la consulta SQL

        if ($this->id_automovil) {
            $sql .= ' AND id_automovil <> ?;';
            $params[] = $this->id_automovil;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    public function readAll()
    {
        // Consulta SQL para leer todos los automóviles activos
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        co.nombre_color AS nombre_color,
        mo.nombre_modelo_automovil AS nombre_modelo,
        ma.nombre_marca_automovil AS nombre_marca,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_colores co USING(id_color)
        INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        WHERE estado_automovil = "Activo";';
        return Database::getRows($sql);
    }

    public function readAllMyCars()
    {
        // Consulta SQL para leer todos los automóviles del cliente actual, incluyendo la imagen del automóvil
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
                       c.dui_cliente AS dui_cliente,
                       a.*,
                       a.imagen_automovil
                FROM tb_automoviles a
                INNER JOIN tb_clientes c USING(id_cliente)
                WHERE estado_automovil = "Activo" AND id_cliente = ?;';
        $params = array(
            $_SESSION['idUsuarioCliente']
        );
        return Database::getRows($sql, $params);
    }
    public function readAllDelete()
    {
        // Consulta SQL para leer todos los automóviles eliminados del cliente actual
        $sql = 'SELECT c.nombres_cliente AS nombre_cliente,
        c.dui_cliente AS dui_cliente,
        co.nombre_color AS nombre_color,
        mo.nombre_modelo_automovil AS nombre_modelo,
        ma.nombre_marca_automovil AS nombre_marca,
        a.*
        FROM tb_automoviles a
        INNER JOIN tb_clientes c USING(id_cliente)
        INNER JOIN tb_colores co USING(id_color)
        INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        WHERE estado_automovil = "Eliminado" AND id_cliente = ?;';
        $params = array(
            $_SESSION['idUsuarioCliente']
        );
        return Database::getRows($sql, $params);
    }
    
    public function readDetail()
    {
        // Consulta SQL para leer el detalle de un automóvil
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
        INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        INNER JOIN tb_tipos_automoviles t USING (id_tipo_automovil)
        WHERE estado_automovil = "Activo" AND id_automovil = ?;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function readDeleteDetail()
    {
        // Consulta SQL para leer el detalle de un automóvil eliminado
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
        INNER JOIN tb_modelos_automoviles mo USING(modelo_automovil) // Cambio aquí
        INNER JOIN tb_marcas_automoviles ma USING(id_marca_automovil)
        INNER JOIN tb_tipos_automoviles t USING (id_tipo_automovil)
        WHERE estado_automovil = "Eliminado" AND id_automovil = ?;';
        $params = array(
            $this->id_automovil
        );
        return Database::getRow($sql, $params);
    }

    public function readImage()
    {
        // Consulta SQL para leer la imagen de un automóvil
        $sql = 'SELECT imagen_automovil FROM tb_automoviles WHERE id_automovil = ?';
        $params = array($this->id_automovil);
        return Database::getRow($sql, $params);
    }
    public function readTipos()
    {
        // Consulta SQL para leer los tipos de automóviles
        $sql = 'SELECT id_tipo_automovil, nombre_tipo_automovil FROM tb_tipos_automoviles';
        return Database::getRows($sql);
    }

}
?>
