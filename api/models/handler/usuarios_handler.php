<?php
// Se incluye la clase para trabajar con la base de datos.
require_once ('../../helpers/database.php');

//Esta clase es para manejar el comportamiento de los datos de la tabla Usuarios

class UsuariosHandler
{
    //Declaracion de atributos para el manejo de los datos de la tabla en la base de datos
    protected $idUsuario = null;
    protected $correoUsuario = null;
    protected $claveUsuario = null;
    protected $telefonoUsuario = null;
    protected $tipoUsuario = null;

    /*Metodos para administrar las cuentas de Usuarios*/

    
    //Esta funcion valida las credenciales en el inicio de sesion
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_usuario, correo_usuario, clave_usuario
                FROM tb_usuarios
                WHERE  correo_usuario = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);
        
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif (password_verify($password, $data['clave_usuario'])) {
            $_SESSION['idAdministrador'] = $data['id_usuario'];
            $_SESSION['aliasAdmin'] = $data['correo_usuario'];
            return true;
        } else {
            return false;
        }
    }

    //Esta funcion valida que la contraseña del usuario coincida con la de la base de datos
    public function checkPassword($password)    
    {
        $sql = 'SELECT clave_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idAdministrador']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_usuario'])) {
            return true;
        } else {
            return false;
        }
    }

    //Esta funcion es para cambiar solamente la contraseña
    public function changePassword()
    {
        $sql = 'UPDATE tb_usuarios
                SET clave_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->claveUsuario, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }

    // Método para actualizar la contraseña del trabajador por ID
    public function updatePassword()
    {
        $sql = 'UPDATE tb_usuarios
                SET clave_usuario = ?
                WHERE id_usuario = ?'; // Consulta SQL para actualizar la contraseña del trabajador por ID
        $params = array($this->claveUsuario, $this->idUsuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    //Esta funcion muestra los datos del usuario
    public function readProfile()
    {
        $sql = 'SELECT id_usuario, correo_usuario, telefono_usuario, tipo_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idAdministrador']);
        return Database::getRow($sql, $params);
    }

    //Esta funcion edita los datos del usuario
    public function editProfile()
    {
        $sql = 'UPDATE tb_usuarios
                SET correo_usuario = ?, telefono_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->correoUsuario, $this->telefonoUsuario, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }


    //Esta funcion verifica los datos duplicados
    public function checkDuplicate($value)
    {
        $sql = 'SELECT id_usuario
                FROM tb_usuarios
                WHERE id_usuario = ? OR correo_usuario = ?';
        $params = array($value, $value);
        return Database::getRow($sql, $params);
    }

    public function checkMail()
    {
        $sql = 'SELECT id_usuario, correo_usuario
                FROM tb_usuarios
                WHERE  correo_usuario = ?'; // Consulta SQL para verificar correo existente
        $params = array($this->correoUsuario); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }


    /*Metodos para realizar las operaciones SCRUD*/

    //Search
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_usuario, correo_usuario, telefono_usuario
                FROM tb_usuarios
                WHERE correo_usuario LIKE ? OR id_usuario LIKE ?
                ORDER BY correo_usuario';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    //Create
    public function createRow()
    {
        $sql = 'INSERT INTO tb_usuarios (correo_usuario, clave_usuario, telefono_usuario, tipo_usuario)
                VALUES(?, ?, ?, "Administrador")';
        $params = array($this->correoUsuario, $this->claveUsuario, $this->telefonoUsuario);
        return Database::executeRow($sql, $params);
    }

    //ReadAll
    public function readAll()
    {
        $sql = 'SELECT id_usuario, correo_usuario, telefono_usuario, tipo_usuario
                FROM tb_usuarios
                ORDER BY correo_usuario';
        return Database::getRow($sql);
    }

    //ReadOne
    public function readOne()
    {
        $sql = 'SELECT id_usuario, correo_usuario, telefono_usuario, tipo_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->idUsuario);
        return Database::getRow($sql, $params);
    }

    //Update
    public function updateRow()
    {
        $sql = 'UPDATE tb_usuarios
                SET correo_usuario = ?,
                clave_usuario = ?, 
                telefono_usuario = ?,
                tipo_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->correoUsuario, $this->claveUsuario, $this->telefonoUsuario, $this->tipoUsuario, $this->idUsuario);
        return Database::executeRow($sql, $params);
    }

    //Delete
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->idUsuario);
        return Database::executeRow($sql, $params);
    }

    

}