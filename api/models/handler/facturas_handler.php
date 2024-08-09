<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */

class FacturasHandler
{
    protected $id_cita = null;

    public function readData()
    {
        $sql = 'SELECT cl.*, ci.*, am.*
        FROM tb_clientes cl
        INNER JOIN tb_automoviles am ON am.id_cliente = cl.id_cliente
        INNER JOIN tb_citas ci ON ci.id_automovil = am.id_automovil
        WHERE ci.id_cita = ?;';
        $params = array(
            $this->id_cita
        ); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params);
    }
}
