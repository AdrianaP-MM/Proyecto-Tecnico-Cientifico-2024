<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');

//Esta clase es para manejar el comportamiento de los datos de la tabla Usuarios

class UsuariosHandler
{
    //Declaracion de atributos para el manejo de los datos de la tabla en la base de datos
    protected $idUsuario = null;
    protected $correoUsuario = null;
    protected $claveUsuario = null;
    protected $telefonoUsuario = null;
    protected $tipoUsuario = null;
    protected $estadoToggle = null;

    protected $accountLockedUntil = null;

    /*Metodos para administrar las cuentas de Usuarios*/

    public function getFechaUltimaModificacion($idUsuario)
    {
        // Definimos la consulta SQL para obtener la fecha de última modificación
        $sql = "SELECT fecha_ultima_modificacion FROM tb_usuarios WHERE id_usuario = ?;";

        // Establecemos los parámetros para la consulta (en este caso, el ID del usuario)
        $params = array($idUsuario);

        // Ejecuta la consulta y retorna la fecha de última modificación o null si no se encuentra
        return Database::getRow($sql, $params)['fecha_ultima_modificacion'] ?? null;
    }

    public function getIdAdministrador($correo)
    {
        $sql = 'SELECT id_usuario FROM tb_usuarios WHERE correo_usuario = ? AND tipo_usuario = "Administrador"';
        $params = array($correo);

        // Ejecuta la consulta y retorna el resultado
        return Database::getRow($sql, $params)['id_usuario'] ?? null; // Devuelve null si no se encuentra el usuario
    }

    public function getFechaCreacionClave($correoUsuario)
    {
        $sql = 'SELECT fecha_ultima_modificacion FROM tb_usuarios WHERE correo_usuario = ?';
        $params = array($correoUsuario);
        // Ejecuta la consulta y devuelve la fecha de creación de la clave
        if ($data = Database::getRow($sql, $params)) {
            return $data['fecha_ultima_modificacion'];
        } else {
            return null; // Si no se encuentra el usuario, retorna null
        }
    }

    public function resetFailedAttempts()
    {
        $sql = 'UPDATE tb_usuarios
                SET failed_attempts = 0, last_failed_attempt = NULL, account_locked_until = NULL
                WHERE correo_usuario = ?;';
        $params = array($this->correoUsuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function blockAccount()
    {
        $sql = 'UPDATE tb_usuarios
            SET account_locked_until = ?, failed_attempts = 3
            WHERE correo_usuario = ?;';
        $params = array($this->accountLockedUntil, $this->correoUsuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    public function incrementFailedAttempts()
    {
        $sql = 'UPDATE tb_usuarios
            SET failed_attempts = failed_attempts + 1, last_failed_attempt = NOW()
            WHERE correo_usuario = ?;';
        $params = array($this->correoUsuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    //getUserData
    public function getUserData()
    {
        $sql = 'SELECT *
                FROM tb_usuarios
                WHERE correo_usuario = ?';
        $params = array($this->correoUsuario);
        return Database::getRow($sql, $params);
    }

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
    public function checkPassword2($password)
    {
        $sql = 'SELECT clave_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->idUsuario);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_usuario'])) {
            return true;
        } else {
            return false;
        }
    }

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

    // Esta función es para cambiar solamente la contraseña y actualizar la fecha de modificación
    public function changePassword()
    {
        // Obtener la fecha y hora actual
        $fechaActual = date('Y-m-d H:i:s');

        // Actualizar la contraseña y la fecha de última modificación
        $sql = 'UPDATE tb_usuarios
            SET clave_usuario = ?, fecha_ultima_modificacion = ?
            WHERE id_usuario = ?';
        $params = array($this->claveUsuario, $fechaActual, $_SESSION['idAdministrador']);
        return Database::executeRow($sql, $params);
    }


    // Método para actualizar la contraseña del trabajador por ID
    public function updatePassword()
    {
        // Obtener la fecha y hora actual
        $fechaActual = date('Y-m-d H:i:s');

        $sql = 'UPDATE tb_usuarios
                SET clave_usuario = ?,
                fecha_ultima_modificacion = ?
                WHERE id_usuario = ?'; // Consulta SQL para actualizar la contraseña del trabajador por ID
        $params = array($this->claveUsuario, $fechaActual, $this->idUsuario); // Parámetros para la consulta SQL
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
        // Obtener la fecha y hora actual
        $fechaActual = date('Y-m-d H:i:s');

        // Insertar el nuevo usuario con la fecha de creación de la contraseña
        $sql = 'INSERT INTO tb_usuarios (correo_usuario, clave_usuario, telefono_usuario, tipo_usuario, fecha_ultima_modificacion)
                VALUES(?, ?, ?, "Administrador", ?)';
        $params = array($this->correoUsuario, $this->claveUsuario, $this->telefonoUsuario, $fechaActual);
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

    public function readDosPasos()
    {
        $sql = 'SELECT dos_pasos
                FROM tb_usuarios
                WHERE correo_usuario = ?';
        $params = array($this->correoUsuario);
        return Database::getRow($sql, $params);
    }

    public function readDosPasosToggle()
    {
        $sql = 'SELECT dos_pasos
                FROM tb_usuarios
                WHERE correo_usuario = ?';
        $params = array($_SESSION['aliasAdmin']);
        return Database::getRow($sql, $params);
    }

    public function updateToggle()
    {
        $sql = 'UPDATE tb_usuarios
        SET dos_pasos = ?
        WHERE correo_usuario = ?;';
        $params = array($this->estadoToggle, $_SESSION['aliasAdmin']);
        return Database::executeRow($sql, $params);
    }
}
