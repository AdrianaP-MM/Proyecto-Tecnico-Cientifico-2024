<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/citas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class CitasData extends CitasHandler
{
    private $data_error = null;
    private $filename = null;

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

    public function setIdCita($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cita = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la cita es incorrecto';
            return false;
        }
    }

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

    public function setIdAutomovil($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del automovil es incorrecto';
            return false;
        }
    }

    public function setFechaHora($value)
    {
        if ($this->checkDuplicate($value)) {
            $this->data_error = 'Esta fecha y hora exacta ya existe agendada';
            return false;
        } else {
            $this->fecha_hora_cita = $value;
            return true;
        }
    }

    public function setFechaRegistro($value)
    {
        $this->fecha_registro = $value;
        return true;
    }

    public function setMovilizacion($value)
    {
        if (Validator::validateAlphabetic($value)) {
            $this->movilizacion_vehiculo = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la movilizacion es incorrecto';
            return false;
        }
    }

    public function setZona($value)
    {
        if (Validator::validateAlphabetic($value)) {
            $this->zona_habilitada = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la zona es incorrecto';
            return false;
        }
    }

    // Método para establecer la ida 
    public function setIda($value, $min = 10, $max = 250)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->direccion_ida = $value;
            return true;
        } else {
            $this->data_error = 'La dirección de ida debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    // Método para establecer el regreso
    public function setRegreso($value, $min = 10, $max = 250)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->direccion_regreso = $value;
            return true;
        } else {
            $this->data_error = 'La dirección de regreso debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        }
    }

    public function setSearchValue($value)
    {
        $this->search_value = $value;
        return true;
    }

    public function setEstadoCita($value)
    {
        $this->estado_cita = $value;
        return true;
    }

}
