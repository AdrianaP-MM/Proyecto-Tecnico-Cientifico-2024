<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class ClienteHandler
{
    protected $id_cliente = null;
    protected $fecha_registro_cliente = null;
    protected $dui_cliente = null;
    protected $telefono_cliente = null;
    protected $correo_cliente = null;
    protected $nombres_cliente = null;
    protected $apellidos_cliente = null;
    protected $tipo_cliente = null;
    protected $departamento_cliente = null;
    protected $NIT_cliente = null;
    protected $NRC_cliente = null;
    protected $NRF_cliente = null;
    protected $rubro_comercial = null;
    protected $estado_cliente = null;
    protected $fecha_desde = null;
    protected $fecha_hasta = null;
    protected $search_value = null;
    protected $autos_cantidad = null;
    protected $mes_cliente = null;
    protected $año_cliente = null;

    protected $marcas_seleccionadas = null;
    protected $servicios_seleccionados = null;

    public function serviciosClienteNatural()
    {
        $sql = 'CALL sp_servicios_solicitados_por_consumidor_final(?);';
        $params = array($this->id_cliente);
        return Database::getRows($sql, $params);
    }

    public function serviciosClienteJuridico()
    {
        $sql = 'CALL sp_servicios_solicitados_por_credito_fiscal(?);';
        $params = array($this->id_cliente);
        return Database::getRows($sql, $params);
    }

    public function searchRows()
    {
        //var_dump($this->marcas_seleccionadas);
        $sql = 'SELECT * FROM tb_clientes 
        WHERE tipo_cliente = ? AND estado_cliente != "Eliminado"';
        $params = array($this->tipo_cliente);

        if ($this->search_value) {
            $sql .= ' AND (
                CONCAT(nombres_cliente, " ", apellidos_cliente) LIKE ? OR 
                dui_cliente LIKE ? OR 
                telefono_cliente LIKE ? OR 
                correo_cliente LIKE ? OR 
                NIT_cliente LIKE ? OR 
                NRC_cliente LIKE ? OR
                NRF_cliente LIKE ?
            )';
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
            $params[] = "%{$this->search_value}%";
        }

        if ($this->departamento_cliente) {
            $sql .= ' AND departamento_cliente = ?';
            $params[] = $this->departamento_cliente;
        }
        if ($this->fecha_desde && $this->fecha_hasta) {
            $sql .= ' AND fecha_registro_cliente BETWEEN ? AND ?';
            $params[] = $this->fecha_desde;
            $params[] = $this->fecha_hasta;
        } else {
            if ($this->fecha_desde) {
                $sql .= ' AND fecha_registro_cliente >= ?';
                $params[] = $this->fecha_desde;
            }
            if ($this->fecha_hasta) {
                $sql .= ' AND fecha_registro_cliente <= ?';
                $params[] = $this->fecha_hasta;
            }
        }

        if ($this->marcas_seleccionadas) {
            // Convertimos la cadena en un arreglo de IDs de marcas
            $marcas_seleccionadas = explode(',', $this->marcas_seleccionadas);

            // Creamos un string con el mismo número de placeholders que marcas seleccionadas
            $placeholders = implode(',', array_fill(0, count($marcas_seleccionadas), '?'));

            // Agregamos los placeholders a la consulta
            $sql .= ' AND EXISTS (
                SELECT 1 FROM tb_automoviles 
                INNER JOIN tb_marcas_automoviles ON tb_automoviles.id_marca_automovil = tb_marcas_automoviles.id_marca_automovil
                WHERE tb_automoviles.id_cliente = tb_clientes.id_cliente
                AND tb_marcas_automoviles.id_marca_automovil IN (' . $placeholders . ')
            )';

            // Agregamos los valores de las marcas seleccionadas a los parámetros
            foreach ($marcas_seleccionadas as $marca) {
                $params[] = $marca;
            }
        }

        if ($this->rubro_comercial) {
            $sql .= ' AND rubro_comercial = ?';
            $params[] = $this->rubro_comercial;
        }

        return Database::getRows($sql, $params);
    }

    public function updateRow()
    {
        $sql = 'UPDATE tb_clientes SET 
        dui_cliente = ?,
        telefono_cliente = ?,
        correo_cliente = ?,
        nombres_cliente = ?,
        apellidos_cliente = ?,
        tipo_cliente = ?,
        departamento_cliente = ?,
        NIT_cliente = ?,
        NRC_cliente = ?,
        NRF_cliente = ?,
        rubro_comercial = ?
        WHERE id_Cliente = ?'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->dui_cliente,
            $this->telefono_cliente,
            $this->correo_cliente,
            $this->nombres_cliente,
            $this->apellidos_cliente,
            $this->tipo_cliente,
            $this->departamento_cliente,
            $this->NIT_cliente,
            $this->NRC_cliente,
            $this->NRF_cliente,
            $this->rubro_comercial,
            $this->id_cliente
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function deleteRow()
    {
        // Consulta SQL para eliminar un cliente basado en su ID
        $sql = 'UPDATE tb_clientes
        SET estado_cliente = "Eliminado" WHERE id_cliente = ?;';
        // Parámetros de la consulta SQL, usando el ID del cliente proporcionado por la clase
        $params = array($this->id_cliente);
        // Ejecuta la consulta de eliminación y devuelve el resultado
        return Database::executeRow($sql, $params);
    }

    // Método para crear un nuevo cliente
    public function createRowNatural()
    {
        $sql = 'INSERT INTO tb_clientes(
            fecha_registro_cliente, 
            dui_cliente, 
            telefono_cliente,
            correo_cliente,
            nombres_cliente, 
            apellidos_cliente,
            departamento_cliente,
            tipo_cliente,
            estado_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->fecha_registro_cliente,
            $this->dui_cliente,
            $this->telefono_cliente,
            $this->correo_cliente,
            $this->nombres_cliente,
            $this->apellidos_cliente,
            $this->departamento_cliente,
            $this->tipo_cliente,
            $this->estado_cliente
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function createRowJuridico()
    {
        $sql = 'INSERT INTO tb_clientes(
            fecha_registro_cliente, 
            dui_cliente, 
            telefono_cliente,
            correo_cliente,
            nombres_cliente, 
            apellidos_cliente,
            departamento_cliente,
            NIT_cliente,
            NRC_cliente,
            NRF_cliente,
            rubro_comercial,
            tipo_cliente,
            estado_cliente) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; // Consulta SQL para insertar un nuevo cliente
        $params = array(
            $this->fecha_registro_cliente,
            $this->dui_cliente,
            $this->telefono_cliente,
            $this->correo_cliente,
            $this->nombres_cliente,
            $this->apellidos_cliente,
            $this->departamento_cliente,
            $this->NIT_cliente,
            $this->NRC_cliente,
            $this->NRF_cliente,
            $this->rubro_comercial,
            $this->tipo_cliente,
            $this->estado_cliente
        ); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_cliente FROM tb_clientes 
        WHERE (dui_cliente = ? OR correo_cliente = ? OR telefono_cliente = ? OR NIT_cliente = ? OR NRC_cliente = ? OR NRF_cliente = ?)';
        // Consulta SQL para verificar duplicados por valor (DUI o correo) excluyendo el ID actual
        $params = array(
            $value,
            $value,
            $value,
            $value,
            $value,
            $value,
        ); // Parámetros para la consulta SQL

        if ($this->id_cliente) {
            $sql .= ' AND id_cliente <> ?;';
            $params[] = $this->id_cliente;
        }

        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    // Método para leer los clientes
    public function readAll($TipoPersona)
    {
        $sql = 'SELECT * FROM tb_clientes WHERE tipo_cliente = ? AND estado_cliente != "Eliminado";';
        $params = array(
            $TipoPersona
        );
        return Database::getRows($sql, $params);
    }


    // Método para mostrar todos los clientes
    public function readAllReport()
    {
        $sql = 'SELECT * FROM tb_clientes;';
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

    public function readClientesMesTipos()
    {
        $sql = 'SELECT * 
        FROM vw_clientes_por_mes_y_tipo
        WHERE año_registro = ?
        ORDER BY mes ASC, tipo_cliente;
        ';
        $params = array(
            $this->fecha_registro_cliente
        );
        return Database::getRows($sql, $params);
    }

    public function readClientesMasCitas()
    {
        $sql = 'SELECT * FROM vista_clientes_cantidad_citas;';
        return Database::getRows($sql);
    }


    public function readClientesRegistrados()
    {
        // Formateamos la fecha para usarla en la consulta
        $fecha_formato = "$this->año_cliente-$this->mes_cliente";


        $sql = "SELECT 
                    count(id_cliente) cantidad, departamento_cliente
                FROM 
                    tb_clientes
                WHERE 
                    DATE_FORMAT(fecha_registro_cliente, '%Y-%m') = ?
                    AND departamento_cliente = ?
                    group by departamento_cliente
                ORDER BY 
                    fecha_registro_cliente ASC;";
        $params = array($fecha_formato, $this->departamento_cliente);
        return Database::getRows($sql, $params);
    }
}
