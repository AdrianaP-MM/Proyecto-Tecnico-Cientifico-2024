<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/facturas_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla USUARIO.
 */
class FacturasData extends FacturasHandler
{
    private $data_error = null;

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

    // Método para obtener el error de los datos.
    public function getDataError()
    {
        return $this->data_error;
    }
}
