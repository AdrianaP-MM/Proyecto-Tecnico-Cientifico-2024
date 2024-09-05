<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/usuarios_clientes_handler.php');

/**Clase para manejar el encapsulamiento de los datos de usuario**/
class UsuariosClientesData extends UsuariosClientesHandler
{
    //Atributo Para el manejo de errores
    private $data_error = null;

    //Funcion para validar el id
    public function setIdCliente($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

    //Funciones para validar y establecer los datos
    public function setCorreo($value)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'Ingrese un correo válido';
            return false;
        } else {
            $this->correo_usuario = $value;
            return true;
        }
    }

    public function setCorreoRow($value, $min = 8, $max = 50)
    {
        if (!Validator::validateEmail($value)) {
            $this->data_error = 'El correo no es válido';
            return false;
        } elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El correo debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El correo ingresado ya existe';
            return false;
        } else {
            $this->correo_usuario = $value;
            return true;
        }
    }

    public function setClave($value)
    {
        if (Validator::validatePassword($value)) {
            $this->clave_usuario_cliente = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            $this->data_error = Validator::getPasswordError();
            return false;
        }
    }

    public function setDUI($value)
    {
        if (!Validator::validateDUI($value)) {
            $this->data_error = 'El DUI debe tener el formato (2, 6, 7)########-#';
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El DUI ingresado ya existe';
            return false;
        } else {
            $this->dui_cliente = $value;
            return true;
        }
    }

    public function setTelefono($value)
    {
        if (!Validator::validatePhone($value)) {
            $this->data_error = 'Ingrese un telefono valido 0000-0000 y que inicie con 2, 6 o 7';
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El telèfono ingresado ya existe';
            return false;
        } else {
            $this->telefono_cliente = $value;
            return true;
        }
    }

    public function setNombres($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese apellidos validos';
            return false;
        } else {
            $this->nombres_cliente = $value;
            return true;
        }
    }

    public function setApellidos($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese apellidos validos';
            return false;
        } else {
            $this->apellidos_cliente = $value;
            return true;
        }
    }

    public function setTipoCliente($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese un tipo cliente de los mostrados anteriormente';
            return false;
        } else {
            $this->tipo_cliente = $value;
            return true;
        }
    }

    public function setDepartamento($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese un departemento disponible';
            return false;
        } else {
            $this->departamento_cliente = $value;
            return true;
        }
    }

    public function setNIT($value, $min = 17, $max = 17)
    {
        if (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El NIT debe tener una longitud de entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El NIT ingresado ya existe';
            return false;
        } else {
            $this->NIT_cliente = $value;
            return true;
        }
    }

    public function setNRC($value, $min = 8, $max = 15)
    {
        if (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El NRC debe tener una longitud de entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El NRC ingresado ya existe';
            return false;
        } else {
            $this->NRC_cliente = $value;
            return true;
        }
    }

    public function setNRF($value, $min = 11, $max = 11)
    {
        if (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El NRF debe tener una longitud de entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El NRF ingresado ya existe';
            return false;
        } else {
            $this->NRF_cliente = $value;
            return true;
        }
    }

    public function setRubro($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El rubro debe ser un valor alfabético';
            return false;
        } else {
            $this->rubro_comercial = $value;
            return true;
        }
    }

    public function setEstado($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } else {
            $this->estado_cliente = $value;
            return true;
        }
    }

    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->fto_cliente = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->fto_cliente = $filename;
            return true;
        } else {
            $this->fto_cliente = 'default.png';
            return true;
        }
    }

    //Funcion para obtener el error
    public function getDataError()
    {
        return $this->data_error;
    }
}
