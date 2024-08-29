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
        // Consulta SQL para insertar un nuevo servicio en proceso
        $sql = 'INSERT INTO tb_servicios_en_proceso (
                fecha_registro,
                fecha_aproximada_finalizacion,
                id_cita,
                id_servicio,
                cantidad_servicio, fecha_finalizacion
            ) VALUES (?, ?, ?, ?, ?, ?);';

        // Parámetros para la consulta SQL
        $params = array(
            $this->fecha_registro,
            $this->fecha_aproximada_finalizacion,
            $this->id_cita,
            $this->id_servicio,
            $this->cantidad_servicio,
            $this->fecha_aproximada_finalizacion
        );

        // Ejecución de la consulta SQL utilizando un método estático Database::executeRow
        return Database::executeRow($sql, $params);
    }


    public function updateRow()
    {
        $sql = 'UPDATE tb_servicios_en_proceso 
            SET fecha_aproximada_finalizacion = ?,
            fecha_finalizacion = ?,
            cantidad_servicio = ? WHERE id_servicio_en_proceso = ?;';
        $params = array(
            $this->fecha_aproximada_finalizacion,
            $this->fecha_finalizacion,
            $this->cantidad_servicio,
            $this->id_servicio_en_proceso
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

    public function readCarrosenProceso()
    {
        $sql = 'SELECT id_servicio, nombre_servicio, descripcion_servicio FROM tb_servicios WHERE id_servicio = ?; ';
        $params = array(
            $this->id_servicio
        ); // Parámetros para la consulta SQL
        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }

    public function mostrarCarrosenProceso()
    {
        $sql = 'SELECT 
        a.modelo_automovil, 
        t.nombre_tipo_automovil, 
        a.placa_automovil, 
        a.fecha_registro
        FROM tb_automoviles a
        JOIN tb_tipos_automoviles t ON a.id_tipo_automovil = t.id_tipo_automovil
        JOIN tb_citas c ON a.id_automovil = c.id_automovil
        JOIN tb_servicios_en_proceso sp ON c.id_cita = sp.id_cita
        WHERE sp.id_servicio = ? 
        AND a.id_cliente = ?';

        $params = array(
            $this->id_servicio,
            $_SESSION['idUsuarioCliente']
        );
        return Database::getRows($sql, $params); // Ejecución de la consulta SQL
    }


    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function readAll()
    {
        $sql = 'SELECT id_servicio, nombre_servicio FROM tb_servicios;';
        return Database::getRows($sql); // Ejecución de la consulta SQL
    }

    // Método para verificar Servicios en Proceso
    public function mostrarServiciosenProceso()
    {
        $sql = 'SELECT 
                sp.fecha_registro, 
                sp.fecha_aproximada_finalizacion, 
                sp.fecha_finalizacion, 
                sp.cantidad_servicio, 
                c.estado_cita, 
                a.modelo_automovil, 
                a.placa_automovil, 
                s.nombre_servicio, 
                s.descripcion_servicio
            FROM 
                tb_servicios_en_proceso sp
            JOIN 
                tb_citas c ON sp.id_cita = c.id_cita
            JOIN 
                tb_automoviles a ON c.id_automovil = a.id_automovil
            JOIN 
                tb_servicios s ON sp.id_servicio = s.id_servicio;';
        return Database::getRows($sql); // Ejecución de la consulta SQL
    }

    // Método para verificar duplicados por valor (DUI o correo) y excluyendo el ID actual
    public function checkDuplicate($id_servicio)
    {
        $sql = 'SELECT id_servicio_en_proceso FROM tb_servicios_en_proceso WHERE id_servicio = ? AND id_cita = ?;';
        // Consulta SQL para verificar duplicados por valor (DUI o correo) excluyendo el ID actual
        $params = array(
            $id_servicio,
            $this->id_cita
        ); // Parámetros para la consulta SQL

        if ($this->id_servicio_en_proceso) {
            $sql .= ' AND id_servicio_en_proceso <> ?;';
            $params[] = $this->id_servicio_en_proceso;
        }

        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }
}
