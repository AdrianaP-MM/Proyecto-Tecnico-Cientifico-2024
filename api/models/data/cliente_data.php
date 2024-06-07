<?php
// Se incluye la clase para validar los datos de entrada.
require_once ('../../helpers/validator.php');
// Se incluye la clase padre.
require_once ('../../models/handler/cliente_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class ClienteData extends ClienteHandler
{

    private $data_error = null;
    private $filename = null;

    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del cliente es incorrecto';
            return false;
        }
    }

    // Método para establecer el DUI del cliente
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

    // Método para establecer el NIT del cliente
    public function setNIT($value, $min = 17, $max = 18)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->NIT_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El NIT debe tener una longitud de ' . $min;
            return false;
        }
    }

    // Método para establecer el NRC del cliente
    public function setNRC($value, $min = 11, $max = 11)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->NRC_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El NRC debe tener una longitud de ' . $min;
            return false;
        }
    }
    public function setNRF($value, $min = 11, $max = 11)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->NRF_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El NRF debe tener una longitud de ' . $min;
            return false;
        }
    }

    // Método para establecer el teléfono del cliente
    public function setTelefono($value)
    {
        if (Validator::validatePhone($value)) {
            $this->telefono_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El teléfono debe tener el formato (2, 6, 7)###-####';
            return false;
        }
    }

    // Método para establecer el departamento del cliente
    public function setDepartamento($value)
    {
        if (Validator::validateAlphabetic($value)) {
            $this->departamento_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del departamento es incorrecto';
            return false;
        }
    }

    // Método para establecer el nombre del cliente
    public function setNombre($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->nombres_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El nombre debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el apellido del cliente
    public function setApellido($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El apellido debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->apellidos_cliente = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el correo del cliente
    public function setCorreo($value, $min = 8, $max = 50)
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
            $this->correo_cliente = $value;
            return true;
        }
    }

    // Método para establecer el rubro del cliente
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

    // Método para establecer el rubro del cliente
    public function setFechaRegistro($value)
    {
        $this->fecha_registro_cliente = $value;
        return true;
    }

    // Método para establecer el tipo del cliente
    public function setTipoCliente($value)
    {
        $this->tipo_cliente = $value;
        return true;
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

    public function setFechaInicio($value)
    {
        $this->fecha_inicio = $value;
        return true;
    }

    public function setFechaFin($value)
    {
        $this->fecha_fin = $value;
        return true;
    }

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
