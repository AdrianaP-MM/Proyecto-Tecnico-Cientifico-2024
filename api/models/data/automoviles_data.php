<?php
// Se incluye la clase para validar los datos de entrada.
require_once('../../helpers/validator.php');
// Se incluye la clase padre.
require_once('../../models/handler/automoviles_handler.php');

/*
 *  Clase para manejar el encapsulamiento de los datos de la tabla AUTOMOVIL.
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
            $this->data_error = 'El identificador del automóvil es incorrecto';
            return false;
        }
    }

    public function setModeloAutomovil($value, $min = 1, $max = 50)
    {
        if (Validator::validateLength($value, $min, $max)) {
            $this->modelo_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El modelo del automóvil es incorrecto.';
            return false;
        }
    }

    public function setMarcaAutomovil($value)
    {
        // Primero valida si el valor cumple con los requisitos de formato.
        if (Validator::validateString($value)) {
            // Si el formato es válido, verifica si no hay duplicados.
            if ($this->checkDuplicate($value)) {
                $this->nombre_marca_automovil = $value;
                return true;
            } else {
                $this->data_error = 'La marca de automóvil ya existe.';
                return false;
            }
        } else {
            $this->data_error = 'La marca de automóvil es incorrecta.';
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

    public function setImagenActual($value)
    {
        // Asigna el nombre de la imagen actual al atributo correspondiente
        $this->imagen_automovil = $value;
        return true;
    }

    public function setIdMarcaAutomovil($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->id_marca_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El identificador de la marca del automóvil es incorrecto. Asegúrese de seleccionar una marca';
            return false;
        }
    }

    public function setColor($value)
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'Ingrese un departemento disponible';
            return false;
        } else {
            $this->color_automovil = $value;
            return true;
        }
    }


    // Validación y asignación de la fecha de fabricación.
    public function setFechaFabricacion($value)
    {
        if (Validator::validateNaturalNumber($value)) {
            $this->fecha_fabricacion_automovil = $value;
            return true;
        } else {
            $this->data_error = 'La fecha de fabricación no es válida';
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
            $this->imagen_automovil = 'default.png';
            return true;
        }
    }

    // Método para validar y asignar la placa del automóvil.
    public function setPlaca($value)
    {
        if (!Validator::validatePlaca($value)) {
            $this->data_error = 'Ingrese una placa disponible';
            return false;
        } else {
            $this->placa_automovil = $value;
            return true;
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

    // Validación y asignación del estado del automóvil.
    public function setEstado($value, $activo = "Activo", $eliminado = "Eliminado")
    {
        if (!Validator::validateAlphabetic($value)) {
            $this->data_error = 'El estado debe ser un valor alfabético';
            return false;
        } elseif ($value === $activo || $value === $eliminado) { // Comparación correcta
            $this->estado_automovil = $value;
            return true;
        } else {
            $this->data_error = 'El estado debe ser entre ' . $activo . ' o ' . $eliminado;
            return false;
        }
    }

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
        if (Validator::validateDate($value)) {
            $this->fecha_desde = $value;
            return true;
        } else {
            $this->data_error = 'El formato de fecha es incorrecto';
            return false;
        }
    }

    public function setFechaHasta($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_hasta = $value;
            return true;
        } else {
            $this->data_error = 'El formato de fecha es incorrecto';
            return false;
        }
    }

    public function setFechaInicial($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_inicial = $value;
            return true;
        } else {
            $this->data_error = 'El formato de fecha es incorrecto';
            return false;
        }
    }

    public function setFechaFinal($value)
    {
        if (Validator::validateDate($value)) {
            $this->fecha_final = $value;
            return true;
        } else {
            $this->data_error = 'El formato de fecha es incorrecto';
            return false;
        }
    }
}
