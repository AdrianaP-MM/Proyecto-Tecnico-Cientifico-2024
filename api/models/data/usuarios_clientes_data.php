<?php
// Se incluye la clase para validar los datos de entrada.
require_once ('../../helpers/validator.php');
// Se incluye la clase padre.
require_once ('../../models/handler/usuarios_clientes_handler.php');

/**Clase para manejar el encapsulamiento de los datos de usuario**/
class UsuariosClientesData extends UsuariosClientesHandler
{
    //Atributo Para el manejo de errores
    private $data_error = null;

    //Funciones para validar y establecer los datos
    public function setCorreo($value)
    {
        if(!Validator::validateEmail($value)){
            $this->data_error = 'Ingrese un correo válido';
            return false;
        } else{
            $this->correo_usuario = $value;
            return true;
        }
    }

    //Funcion para obtener el error
    public function getDataError()
    {
        return $this->data_error;
    }
}