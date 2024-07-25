<?php
// Se inclueye la clase de entrada
require_once ('../../models/data/usuarios_clientes_data.php');
require_once ('../mandar_correo.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuarioCliente = new UsuariosClientesData;
    $mandarCorreo = new mandarCorreo;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuarioCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'checkCorreo':
                $_POST = Validator::validateForm($_POST);
                if (!$usuarioCliente->setCorreo($_POST['user_correo'])) {
                    $result['error'] = 'Correo electrónico incorrecto';
                } elseif ($result['dataset'] = $usuarioCliente->checkCorreo()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico inexistente';
                }
                break;
            case 'enviarCodigoRecuperacion':
                // Generar un código de recuperación
                $codigoRecuperacion = $mandarCorreo->generarCodigoRecuperacion();

                // Preparar el cuerpo del correo electrónico
                $correoDestino = $_POST['user_correo'];
                $asunto = 'Código de recuperación';
                // Enviar el correo electrónico y verificar si hubo algún error
                $envioExitoso = $mandarCorreo->enviarCorreoPassword($correoDestino, $asunto, $codigoRecuperacion);

                if ($envioExitoso === true) {
                    $result['status'] = 1;
                    $result['codigo'] = $codigoRecuperacion;
                    $result['message'] = 'Código de recuperación enviado correctamente';
                } else {
                    $result['status'] = 0;
                    $result['error'] = 'Error al enviar el correo: ' . $envioExitoso;
                }
                break;
            case 'updatePassword':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuarioCliente->setClave($_POST['user_contra']) or
                    !$usuarioCliente->setCorreo($_POST['user_correo'])
                ) {
                    $result['error'] = $usuarioCliente->getDataError();
                } elseif ($usuarioCliente->updatePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Se ha actualizado correctamente la contraseña';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar la contraseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print (json_encode($result));
} else {
    print (json_encode('Recurso no disponible'));
}
