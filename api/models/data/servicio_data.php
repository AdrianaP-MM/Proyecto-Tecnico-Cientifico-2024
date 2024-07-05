<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase para manejar los datos de la tabla tb_servicios.
require_once('../../models/handler/servicio_handler.php');

/*
 * Clase para manejar el encapsulamiento de los datos de la tabla tb_servicios.
 */
class ServiciosData extends ServicioHandler
{
    private $data_error = null;

    // Método para establecer el ID del servicio
    public function setIdServicio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_servicio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del servicio es incorrecto';
            return false;
        }
    }

    // Método para establecer el ID del tipo de servicio
    public function setIdTipoServicio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_tipo_servicio = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo de servicio es incorrecto';
            return false;
        }
    }

    

    // Método para establecer el nombre del servicio
    public function setNombreServicio($value, $min = 1, $max = 50)
    {
        if (!Validator::validateAlphanumeric($value)) {
            $this->data_error = 'El nombre del servicio debe ser alfanumérico';
            return false;
        } elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El nombre del servicio debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        } else {
            $this->nombre_servicio = $value;
            return true;
        }
    }

    // Método para establecer la descripción del servicio
    public function setDescripcionServicio($value, $min = 1, $max = 255)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'La descripción del servicio debe ser un texto válido';
            return false;
        } elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'La descripción del servicio debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        } else {
            $this->descripcion_servicio = $value;
            return true;
        }
    }

    // Método para obtener el error de los datos
    public function getDataError()
    {
        return $this->data_error;
    }
}
?>
