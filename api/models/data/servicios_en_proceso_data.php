<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/servicios_en_proceso_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class ServiciosProcesoData extends ServiciosProcesoHandler
{
    private $data_error = null;
    private $filename = null;

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }

    
    public function setIdServicioEnProceso($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_servicio_en_proceso = $value;
            return true;
        } else {
            $this->id_servicio_en_proceso = 'El identificador del servicio en proceso es incorrecto';
            return false;
        }
    }

    public function setIdCita($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_cita = $value;
            return true;
        } else {
            $this->id_cita = 'El identificador de la cita es incorrecto';
            return false;
        }
    }

    public function setFechaRegistro($value)
    {
        $this->fecha_registro = $value;
        return true;
    }

    public function setFechaAproxFinalizacion($value)
    {
        $this->fecha_aproximada_finalizacion = $value;
        return true;
    }

    public function setFechaFinalizacion($value)
    {
        $this->fecha_finalizacion = $value;
        return true;
    }

    public function setIdServicio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_servicio = $value;
            return true;
        } else {
            $this->id_servicio = 'El identificador del servicio es incorrecto';
            return false;
        }
    }

    public function setCantidadServicio($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->cantidad_servicio = $value;
            return true;
        } else {
            $this->cantidad_servicio = 'La cantidad del servicio debe ser un valor númerico';
            return false;
        }
    }
}
