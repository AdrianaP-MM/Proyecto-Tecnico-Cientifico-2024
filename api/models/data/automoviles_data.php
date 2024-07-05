<?php
// Se incluye la clase para validar los datos de entrada.
require_once ('../../helpers/validator.php');
// Se incluye la clase padre.
require_once ('../../models/handler/automoviles_handler.php');
/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla CATEGORIA.
 */
class AutomovilData extends AutomovilHandler
{
    /*
     *  Atributos adicionales.
     */
    private $data_error = null;
    private $filename = null;

    /*
     *  Métodos para validar y establecer los datos.
     */
    // Identificador
    public function setId($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de el automóvil es incorrecto';
            return false;
        }
    }

    public function setIdModelo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_modelo_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de el modelo del automóvil es incorrecto';
            return false;
        }
    }

    public function setIdTipo($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_tipo_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del tipo del automóvil es incorrecto';
            return false;
        }
    }

    public function setIdColor($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_color = $value;
            return true;
        } else {
            $this->data_error = 'El identificador del color es incorrecto';
            return false;
        }
    }

    // Validación y asignación de la fecha de inicio de la jornada.
    public function setFechaFabricacion($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_fabricacion_automovil = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de inicio no es valida';
            return false;
        }
    }

    
    // Validación y asignación de la fecha de inicio de la jornada.
    public function setFechaFabricacion2($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->fecha_fabricacion_automovil = $value;
            return true;
        } else {
            $this->data_error = 'La fecha es incorrecto';
            return false;
        }
    }

    public function setImagen($file, $filename = null)
    {
        if (Validator::validateImageFile($file, 1000)) {
            $this->imagen_automovil = Validator::getFilename();
            return true;
        } elseif (Validator::getFileError()) {
            $this->data_error = Validator::getFileError();
            return false;
        } elseif ($filename) {
            $this->imagen_automovil = $filename;
            return true;
        } else {
            $this->data_error = 'default.png';
            return true;
        }
    }

    //Método para validar dependiendo del dato que se utiliza, asimismo asignarle los valores de los atributos
    public function setPlaca($value)
    {
        $this->placa_automovil = $value;
        return true;
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

    //alidación y asignación de la fecha de inicio de la jornada.

    // Validación y asignación del estado del pedido.
    public function setEstado($value, $activo = "Activo", $eliminado = "Eliminado")
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } elseif ($value = $activo || $eliminado) {
            $this->estado_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe ser entre ' . $activo . ' o ' . $eliminado;
            return false;
        }
    }

   /* public function setFilename()
    {
        if ($data = $this->readFilename()) {
            $this->filename = $data['imagen_categoria'];
            return true;
        } else {
            $this->data_error = 'Categoría inexistente';
            return false;
        }
    }*/

    /*
     *  Métodos para obtener los atributos adicionales.
     */
    public function getDataError()
    {
        return $this->data_error;
    }

    public function getFilename()
    {
        return $this->filename;
    }

    public function setSearchValue($value)
    {
        $this->search_value = $value;
        return true;
    }

    public function setFechaDesde($value)
    {
        $this->fecha_desde = $value;
        return true;
    }

    public function setFechaHasta($value)
    {
        $this->fecha_hasta = $value;
        return true;
    }

}
