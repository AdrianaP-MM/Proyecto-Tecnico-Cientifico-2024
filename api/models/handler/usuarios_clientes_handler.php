<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');

//Esta clase es para manejar el comportamiento de los datos de la tabla Usuarios

class UsuariosClientesHandler
{
    //Declaracion de atributos para el manejo de los datos de la tabla en la base de datos
    protected $id_usuario_cliente = null;
    protected $clave_usuario_cliente = null;
    protected $estado_usuario = null;
    protected $id_cliente = null;
    protected $correo_usuario = null;

    /*Metodos para administrar las cuentas de Usuarios*/
    public function checkCorreo()
    {
        $sql = 'SELECT uc.*
        FROM tb_usuarios_clientes AS uc
        JOIN tb_clientes AS c ON uc.id_cliente = c.id_cliente
        WHERE c.correo_cliente = ?;'; // Consulta SQL para verificar un usuario con ese correo
        $params = array($this->correo_usuario); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function updatePassword()
    {
        $sql = 'UPDATE tb_usuarios_clientes
        SET clave_usuario_cliente = ?
        WHERE id_cliente = (
            SELECT id_cliente
            FROM tb_clientes
            WHERE correo_cliente = ?
        );'; // Consulta SQL para verificar un usuario con ese correo
        $params = array($this->clave_usuario_cliente, $this->correo_usuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }
}