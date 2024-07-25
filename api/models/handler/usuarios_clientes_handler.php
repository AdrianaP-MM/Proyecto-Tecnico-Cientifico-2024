<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

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

    //Funcion que valida el correo
    public function checkCorreo()
    {
        $sql = 'SELECT uc.*
        FROM tb_usuarios_clientes AS uc
        JOIN tb_clientes AS c ON uc.id_cliente = c.id_cliente
        WHERE c.correo_cliente = ?;'; // Consulta SQL para verificar un usuario con ese correo
        $params = array($this->correo_usuario); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }

    //Funcion que actualiza exclusivamente la contraseña
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

    //Funcion que valida el inicio de sesion
    public function checkUser($username, $password)
    {
        $sql = 'SELECT u.id_cliente, u.correo_cliente, c.clave_usuario_cliente 
        FROM tb_clientes u 
        JOIN tb_usuarios_clientes c 
        ON u.id_cliente = c.id_cliente 
        WHERE u.correo_cliente = ?;';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_usuario_cliente'])) {
            $_SESSION['idUsuarioCliente'] = $data['id_cliente'];
            $_SESSION['aliasAdmin'] = $data['correo_cliente'];
            return true;
        } else {
            return false;
        }
    }

    

    /*El registro lleva primero de llenar los campos NRC, NRF y rubro comercial si es persona juridica.
        Despues el nombre, correo, contraseña, telefono, DUI, NIT
    */

    //Registro persona natural
    public function createRow()
    {
        $sql = 'INSERT INTO tb_clientes (nombres_cliente  , correo_cliente  , clave_usuario_cliente , telefono_cliente, dui_cliente, NIT_cliente, fecha_registro_cliente)
                VALUES(?, ?, ?, ?, ?, ?, ?, NOW())';
        $params = array($this->nombreUsuario, $this->correo_usuario, $this->clave_usuario_cliente, $this->telefono_cliente, $this->dui_cliente, $this->NIT_cliente);
        return Database::executeRow($sql, $params);
    }

    //El insert a ambas tablas se puede hacer simultaneamente

    //Registro persona juridica

}
