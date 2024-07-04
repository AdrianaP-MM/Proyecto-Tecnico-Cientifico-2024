<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class ClienteHandler
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


    public function searchRows()
    {
        // var_dump($this->marcas_seleccionadas);
        // $sql = 'SELECT * FROM tb_clientes 
        // WHERE tipo_cliente = ?';
        // $params = array($this->tipo_cliente);

        // if ($this->search_value) {
        //     $sql .= ' AND (
        //         CONCAT(nombres_cliente, " ", apellidos_cliente) LIKE ? OR 
        //         dui_cliente LIKE ? OR 
        //         telefono_cliente LIKE ? OR 
        //         correo_cliente LIKE ? OR 
        //         NIT_cliente LIKE ? OR 
        //         NRC_cliente LIKE ? OR
        //         NRF_cliente LIKE ?
        //     )';
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        //     $params[] = "%{$this->search_value}%";
        // }
        // if ($this->departamento_cliente) {
        //     $sql .= ' AND departamento_cliente = ?';
        //     $params[] = $this->departamento_cliente;
        // }
        // if ($this->fecha_desde && $this->fecha_hasta) {
        //     $sql .= ' AND fecha_registro_cliente BETWEEN ? AND ?';
        //     $params[] = $this->fecha_desde;
        //     $params[] = $this->fecha_hasta;
        // } else {
        //     if ($this->fecha_desde) {
        //         $sql .= ' AND fecha_registro_cliente >= ?';
        //         $params[] = $this->fecha_desde;
        //     }
        //     if ($this->fecha_hasta) {
        //         $sql .= ' AND fecha_registro_cliente <= ?';
        //         $params[] = $this->fecha_hasta;
        //     }
        // }
        // if ($this->autos_cantidad) {
        //     $sql .= ' SELECT c.*
        //                 FROM tb_clientes c
        //                 INNER JOIN (
        //                     SELECT id_cliente
        //                     FROM tb_automoviles
        //                     GROUP BY id_cliente
        //                     HAVING COUNT(*) = ?
        //                 ) a ON c.id_cliente = a.id_cliente;
        //             ';
        //     $params[] = $this->autos_cantidad;
        // }

        // if ($this->marcas_seleccionadas) {
        //     // Convertimos la cadena en un arreglo de IDs de marcas
        //     $marcas_seleccionadas = explode(',', $this->marcas_seleccionadas);

        //     // Creamos un string con el mismo número de placeholders que marcas seleccionadas
        //     $placeholders = implode(',', array_fill(0, count($marcas_seleccionadas), '?'));

        //     // Agregamos los placeholders a la consulta
        //     $sql .= ' AND EXISTS (
        //         SELECT 1 FROM tb_automoviles 
        //         INNER JOIN tb_modelos_automoviles ON tb_automoviles.id_modelo_automovil = tb_modelos_automoviles.id_modelo_automovil
        //         INNER JOIN tb_marcas_automoviles ON tb_modelos_automoviles.id_marca_automovil = tb_marcas_automoviles.id_marca_automovil
        //         WHERE tb_automoviles.id_cliente = tb_clientes.id_cliente
        //         AND tb_marcas_automoviles.id_marca_automovil IN (' . $placeholders . ')
        //     )';

        //     // Agregamos los valores de las marcas seleccionadas a los parámetros
        //     foreach ($marcas_seleccionadas as $marca) {
        //         $params[] = $marca;
        //     }
        // }

        // if ($this->servicios_seleccionados && ($this->tipo_cliente == 'Persona natural' || $this->tipo_cliente == 'Persona juridica')) {
        //     $table = ($this->tipo_cliente == 'Persona Natural') ? 'tb_detalles_consumidores_finales' : 'tb_detalles_creditos_fiscales';
        
        //     // Convertimos la cadena en un arreglo de IDs de servicios
        //     $servicios_seleccionados = explode(',', $this->servicios_seleccionados);
        
        //     // Creamos un string con el mismo número de placeholders que servicios seleccionados
        //     $placeholders = implode(',', array_fill(0, count($servicios_seleccionados), '?'));
        
        //     // Agregamos los placeholders a la consulta
        //     $sql .= ' AND EXISTS (
        //         SELECT 1
        //         FROM ' . $table . ' AS detalle
        //         INNER JOIN tb_consumidores_finales AS consumidor ON detalle.id_consumidor_final = consumidor.id_consumidor_final
        //         INNER JOIN tb_citas AS cita ON consumidor.id_cita = cita.id_cita
        //         WHERE cita.id_automovil IN (
        //             SELECT id_automovil 
        //             FROM tb_automoviles 
        //             WHERE tb_automoviles.id_cliente = tb_clientes.id_cliente
        //         )
        //         AND detalle.id_servicio IN (' . $placeholders . ')
        //     )';
        
        //     // Agregamos los valores de los servicios seleccionados a los parámetros
        //     foreach ($servicios_seleccionados as $servicio) {
        //         $params[] = $servicio;
        //     }
        // }

        // if ($this->rubro_comercial) {
        //     $sql .= ' AND rubro_comercial = ?';
        //     $params[] = $this->rubro_comercial;
        // }

        // return Database::getRows($sql, $params);
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
        id_cliente = ?,
        estado_automovil = ?
        WHERE id_automovil = ?'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->id_modelo_automovil,
            $this->id_tipo_automovil,
            $this->id_color,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_cliente,
            $this->estado_automovil,
            $this->id_automovil
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        // Consulta SQL para eliminar un cliente basado en su ID
        $sql = 'DELETE FROM tb_automoviles
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
            estado_automovil) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->id_modelo_automovil,
            $this->id_tipo_automovil,
            $this->id_color,
            $this->fecha_fabricacion_automovil,
            $this->placa_automovil,
            $this->imagen_automovil,
            $this->id_cliente,
            $this->estado_automovil
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
        $sql = 'SELECT * FROM tb_automoviles;';
        return Database::getRows($sql);
    }

    // Método para leer los clientes
    public function readMarcas()
    {
        $sql = 'SELECT id_marca_automovil, nombre_marca_automovil FROM tb_marcas_automoviles ORDER BY nombre_marca_automovil ASC;';
        return Database::getRows($sql);
    }

    // Método para leer los clientes
    public function readServicios()
    {
        $sql = 'SELECT id_servicio, nombre_servicio FROM tb_servicios ORDER BY nombre_servicio ASC;';
        return Database::getRows($sql);
    }

    // Método para leer a un cliente
    public function readOne()
    {
        $sql = 'SELECT * FROM tb_clientes WHERE id_cliente = ?';
        $params = array(
            $this->id_cliente
        );
        return Database::getRow($sql, $params);
    }
}