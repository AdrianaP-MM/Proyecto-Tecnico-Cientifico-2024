<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/tipo_servicio_handler.php');

/*
 * Clase para manejar el encapsulamiento de los datos de la tabla tb_tipos_servicios.
 */
class TiposServiciosData extends TipoServicioHandler
{
    private $data_error = null;
    private $filename = null;

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

    // Método para establecer el nombre del tipo de servicio
    public function setNombreTipoServicio($value, $min = 1, $max = 50)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El nombre del tipo de servicio debe ser un valor alfabético';
            return false;
        } elseif (!Validator::validateLength($value, $min, $max)) {
            $this->data_error = 'El nombre del tipo de servicio debe tener una longitud entre ' . $min . ' y ' . $max;
            return false;
        } elseif ($this->checkDuplicate($value)) {
            $this->data_error = 'El nombre del tipo de servicio ingresado ya existe';
            return false;
        } else {
            $this->nombre_tipo_servicio = $value;
            return true;
        }
    }

    // Método para establecer la imagen del servicio
    public function setImagenServicio($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen_servicio = Validator::getFileName();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen_servicio = $filename;
            return true;
        } else {
            $this->imagen_servicio = 'default.png';
            return true;
        }
    }

   
    // Método para obtener el error de los datos
    public function getDataError()
    {
        return $this->data_error;
    }

    // Método para obtener el nombre del archivo de imagen
    public function getFilename()
    {
        return $this->filename;
    }

    // Método para verificar duplicados (debes implementar la lógica de verificación)
    private function checkDuplicate($value)
    {
        // Aquí deberás implementar la lógica para verificar si el nombre del tipo de servicio ya existe en la base de datos.
        // Este es un ejemplo básico, deberás adaptarlo a tus necesidades específicas.

        // Suponiendo que $this->nombre_tipo_servicio es el campo que estás verificando:
        $query = 'SELECT COUNT(*) FROM tb_tipos_servicios WHERE nombre_tipo_servicio = ?';
        $params = array($value);
        
        if ($result = Database::getRow($query, $params)) {
            if ($result[0] > 0) {
                return true; // El nombre ya existe
            } else {
                return false; // El nombre no existe
            }
        } else {
            return false; // Error en la consulta o el nombre no existe
        }
    }
}

?>