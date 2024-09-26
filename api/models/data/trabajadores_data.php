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
       // Si el valor es el mismo que ya está en la base de datos, saltar la validación
       if ($this->id_trabajador && $value === $this->dui_trabajador) {
           return true; // No es necesario volver a validar el mismo valor
       }
   
       // Validar el formato del DUI
       if (!Validator::validateDUI($value)) {
           $this->data_error = 'El DUI debe tener el formato adecuado';
           return false;
       } elseif ($this->checkDuplicate($value, 'dui_trabajador')) { // Revisa si ya existe el DUI
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
    // Si el valor es el mismo que ya está en la base de datos, saltar la validación
    if ($this->id_trabajador && $value === $this->telefono_trabajador) {
        return true; // No es necesario volver a validar el mismo valor
    }

    // Validar el formato del teléfono
    if (!Validator::validatePhone($value)) {
        $this->data_error = 'El teléfono debe tener el formato adecuado';
        return false;
    } elseif ($this->checkDuplicate($value, 'telefono_trabajador')) { // Revisa si ya existe el teléfono
        $this->data_error = 'El teléfono ingresado ya existe';
        return false;
    } else {
        $this->telefono_trabajador = $value;
        return true;
    }
}


// Método para establecer el correo del cliente
public function setCorreo($value)
{
    // Si el valor es el mismo que ya está en la base de datos, saltar la validación
    if ($this->id_trabajador && $value === $this->correo_trabajador) {
        return true; // No es necesario volver a validar el mismo valor
    }

    // Validar el formato del correo
    if (!Validator::validateEmail($value)) {
        $this->data_error = 'El correo debe tener un formato válido';
        return false;
    } elseif ($this->checkDuplicate($value, 'correo_trabajador')) { // Revisa si ya existe el correo
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
    public function setNIT($value, $id = null, $min = 17, $max = 17)
    {
        // Permitir que el valor sea nulo
        if (is_null($value) || $value === '') {
            $this->NIT_trabajador = null;
            return true;
        }
    
        // Validar la longitud exacta (17 caracteres)
        if (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El NIT debe tener exactamente ' . $min . ' caracteres.';
            return false;
        }
    
        // Si el NIT ya existe, retornamos un error
        if ($this->checkDuplicate($value, 'NIT_trabajador', $id)) { // Se pasa el campo 'NIT_trabajador' como segundo parámetro
            $this->data_error = 'El NIT ingresado ya existe';
            return false;
        }
    
        // Si todo está bien, asignamos el NIT
        $this->NIT_trabajador = $value;
        return true;
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
    
    public function setAgnoContratacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->agno_contratacion = $value;
            return true;
        } else {
            $this->data_error = 'El año de contratación debe ser un valor númerico';
            return false;
        }
    }

    // Función para validar el nombre del archivo
    public function setFilename()
    {
        // if ($data = $this->readFilename()) {
        //     $this->filename = $data['Fto_trabajador'];
        //     return true;
        // } else {
        //     $this->data_error = 'Foto de trabajador inexistente';
        //     return false;
        // }
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
