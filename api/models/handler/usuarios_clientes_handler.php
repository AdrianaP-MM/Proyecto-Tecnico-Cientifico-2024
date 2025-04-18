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
    protected $dui_cliente = null;
    protected $telefono_cliente = null;
    protected $nombres_cliente = null;
    protected $apellidos_cliente = null;
    protected $tipo_cliente = null;
    protected $departamento_cliente = null;
    protected $NIT_cliente = null;
    protected $NRC_cliente = null;
    protected $NRF_cliente = null;
    protected $rubro_comercial = null;
    protected $estado_cliente = null;
    protected $fto_cliente = null;

    /*Metodos para administrar las cuentas de Usuarios*/

    const RUTA_IMAGEN = '../../../api/images/clientes/';

    //Esta funcion edita los datos del usuario
    public function editProfile()
    {
        $sql = 'UPDATE tb_clientes SET
        dui_cliente = ?,
        telefono_cliente = ?,
        correo_cliente = ?,
        nombres_cliente = ?,
        apellidos_cliente = ?,
        departamento_cliente = ?,
        NIT_cliente = ?,
        NRC_cliente = ?,
        NRF_cliente = ?,
        rubro_comercial = ?,
        fto_cliente = ?
        WHERE id_cliente = ?;';

        $params = array(
            $this->dui_cliente,
            $this->telefono_cliente,
            $this->correo_usuario,
            $this->nombres_cliente,
            $this->apellidos_cliente,
            $this->departamento_cliente,
            $this->NIT_cliente,
            $this->NRC_cliente,
            $this->NRF_cliente,
            $this->rubro_comercial,
            $this->fto_cliente,
            $this->id_cliente
        );

        return Database::executeRow($sql, $params);
    }

    //Funcion que valida el correo
    public function checkCorreo()
    {
        $sql = 'SELECT cl.* FROM tb_clientes cl WHERE cl.correo_cliente = ?;'; // Consulta SQL para verificar un usuario con ese correo
        $params = array($this->correo_usuario); // Parámetros para la consulta SQL
        return Database::getRow($sql, $params); // Ejecución de la consulta SQL
    }

    //Funcion que actualiza exclusivamente la contraseña
    public function updatePassword()
    {
        $sql = 'UPDATE tb_clientes
        SET clave_usuario_cliente = ?
        WHERE id_cliente = (
            SELECT id_cliente
            FROM tb_clientes
            WHERE correo_cliente = ?);'; // Consulta SQL para verificar un usuario con ese correo
        $params = array($this->clave_usuario_cliente, $this->correo_usuario); // Parámetros para la consulta SQL
        return Database::executeRow($sql, $params); // Ejecución de la consulta SQL
    }

    //Funcion que valida el inicio de sesion
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_cliente, correo_cliente, clave_usuario_cliente, estado_cliente
            FROM tb_clientes 
            WHERE correo_cliente = ?;';
        $params = array($username);
        if (!($data = Database::getRow($sql, $params))) {
            return false;
        } elseif ($data['estado_cliente'] === 'Eliminado') {
            // Si el estado del cliente es 'Eliminado', no permitimos el inicio de sesión
            return false;
        } elseif (password_verify($password, $data['clave_usuario_cliente'])) {
            $_SESSION['idUsuarioCliente'] = $data['id_cliente'];
            $_SESSION['aliasAdmin'] = $data['correo_cliente'];
            return true;
        } else {
            return false;
        }
    }

    public function readProfile()
    {
        $sql = 'SELECT * FROM tb_clientes WHERE id_cliente = ?';
        $params = array($_SESSION['idUsuarioCliente']);
        return Database::getRow($sql, $params);
    }
    /*El registro lleva primero de llenar los campos NRC, NRF y rubro comercial si es persona juridica.
        Despues el nombre, correo, contraseña, telefono, DUI, NIT
    */

    //Registro persona natural
    public function createRowPersonaNatural()
    {
        $sql = 'INSERT INTO tb_clientes(fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, clave_usuario_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente)
                VALUES(NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->dui_cliente, $this->telefono_cliente, $this->correo_usuario, $this->clave_usuario_cliente, $this->nombres_cliente, $this->apellidos_cliente, $this->tipo_cliente, $this->departamento_cliente, $this->NIT_cliente);
        return Database::executeRow($sql, $params);
    }

    //Registro persona juridica
    public function createRowPersonaJuridica()
    {
        $sql = 'INSERT INTO tb_clientes(fecha_registro_cliente, dui_cliente, telefono_cliente, correo_cliente, clave_usuario_cliente, nombres_cliente, apellidos_cliente, tipo_cliente, departamento_cliente, NIT_cliente, NRC_cliente, NRF_cliente, rubro_comercial)
                VALUES(NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->dui_cliente, $this->telefono_cliente, $this->correo_usuario, $this->clave_usuario_cliente, $this->nombres_cliente, $this->apellidos_cliente, $this->tipo_cliente, $this->departamento_cliente, $this->NIT_cliente, $this->NRC_cliente, $this->NRF_cliente, $this->rubro_comercial);
        return Database::executeRow($sql, $params);
    }

    //Valdiar el duplicado de info de cliente especificamente del dui, correo, telefono y NIT 
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
}
