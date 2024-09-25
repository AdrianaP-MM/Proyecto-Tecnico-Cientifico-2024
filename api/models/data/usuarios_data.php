<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/usuarios_handler.php');

/**Clase para manejar el encapsulamiento de los datos de usuario**/

class UsuarioData extends UsuariosHandler
{

    //Atributo Para el manejo de errores
    private $data_error = null;

    //Funciones para validar y establecer los datos

    //Funcion para validar el id
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->idUsuario = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del usuario es incorrecto';
            return false;
        }
    }

    //Funcion para validar el correo
    public function setCorreo($value)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'Ingrese un correo válido';
            return false;
        } else {
            $this->correoUsuario = $value;
            return true;
        }
    }

    //Funcion para validar el correo
    public function setNumeroTelefonico($value)
    {
        if (!Validator::validatePhone($value)) {
            $this->data_error = 'Ingrese un número telefónico válido. Asegúrese de que inicie con 2, 6 o 7.';
            return false;
        } else {
            $this->telefonoUsuario = $value;
            return true;
        }
    }

    //Funcion para validar la clave
    public function setTipoUsuario($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese un tipo de usuario valido';
            return false;
        } else {
            $this->tipoUsuario = $value;
            return true;
        }
    }

    //Funcion para validar la clave
    public function setClave($value)
    {
        if (Validator::validatePassword($value)) {
            $this->claveUsuario = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }

    //Funcion para obtener el error
    public function getDataError()
    {
        return $this->data_error;
    }
}
