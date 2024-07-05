<?php
// Se incluye la clase para validar los datos de entrada.
require_once ('../../helpers/validator.php');
// Se incluye la clase padre.
require_once ('../../models/handler/trabajadores_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class TrabajadoresData extends TrabajadoresHandler
{

    private $data_error = null;
    private $filename = null;

    //Metodo para establecer el id del trabajador
    public function setIdTrabajador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_trabajador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del trabajador es incorrecto';
            return false;
        }
    }

    //Metodo para establecer la especializacion del trabajador
    public function setIdEspecializacionTrabajador($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_especializacion_trabajador = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la especializacion es incorrecto';
            return false;
        }
    }

    // Método para establecer el DUI del trabajador
    public function setDUI($value)
    {
        if (!Validator::validateDUI($value)) {
            $this->data_error = 'El DUI debe tener el formato (2, 6, 7)########-#';
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El DUI ingresado ya existe';
            return false;
        } else {
            $this->dui_trabajador = $value;
            return true;
        }
    }


    // Método para establecer el teléfono del trabajador
    public function setTelefono($value)
    {
        if (!Validator::validatePhone($value)) {
            $this->data_error = 'El telèfono no es válido';
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El telèfono ingresado ya existe';
            return false;
        } else {
            $this->telefono_trabajador = $value;
            return true;
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
            $this->correo_trabajador = $value;
            return true;
        }
    }


    //Metodo para establecer el departamento del trabajador
    public function setDepartamento($value, $min = 2, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El departamento debe ser un valor alfabético';
            return false;
        } elseif (Validator::validateLength($value, $min, $max)) {
            $this->departamento_trabajador = $value;
            return true;
        } else {
            $this->data_error = 'El departamento debe tener una longitud entre ' . $min . ' y ' . $max;
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
            $this->nombres_trabajador = $value;
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
            $this->apellidos_trabajador = $value;
            return true;
        } else {
            $this->data_error = 'El apellido debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el NIT del cliente
    public function setNIT($value, $min = 17, $max = 17)
    {
        if (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El NIT debe tener una longitud de entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El NIT ingresado ya existe';
            return false;
        } else {
            $this->NIT_trabajador = $value;
            return true;
        }
    }

    // Método para establecer el rubro del cliente
    public function setFechaContratacion($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_contratacion = $value;
            return true;
        } else {
            $this->data_error = 'La fecha esta en formato incorrecto';
            return false;
        }
    }

    //Hacer la validacion para el dinero
    public function setSalarioBase($value)
    {
        if (Validator::validateMoney($value)) {
            $this->salario_base = $value;
            return true;
        } else {
            $this->data_error = 'El salario base no tiene el formato correcto';
            return false;
        }
    }
 
    //Ver si se puede dejar esta validacion de imagen
    public function setFtoTrabajador($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 150)) {
            $this->Fto_trabajador = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->Fto_trabajador = $filename;
            return true;
        } else {
            $this->Fto_trabajador = 'default.png';
            return true;
        }
    }

    // Función para validar el nombre del archivo
    public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['Fto_trabajador'];
            return true;
        } else {
            $this->data_error = 'Foto de trabajador inexistente';
            return false;
        }
    }


    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }
}
