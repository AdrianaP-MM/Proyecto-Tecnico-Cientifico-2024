<?php
// Se inclueye la clase de entrada
require_once('../../models/data/usuarios_data.php');
require_once('../mandar_correo.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $usuario = new UsuarioData;
    $mandarCorreo = new mandarCorreo;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'getPasswordLastChanged':
                // Suponiendo que tienes el ID de usuario o el correo almacenado en la sesión
                $idUsuario = $_SESSION['idAdministrador'];
                $fechaUltimaModificacion = $usuario->getFechaUltimaModificacion($idUsuario);

                if ($fechaUltimaModificacion) {
                    $result['status'] = 1;
                    $result['fecha_ultima_modificacion'] = $fechaUltimaModificacion;
                } else {
                    $result['error'] = 'Error al obtener la fecha de última modificación de la contraseña.';
                }
                break;
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $usuario->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setClave($_POST['claveUsuario']) or
                    !$usuario->setNumeroTelefonico($_POST['telefonoUsuario'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'usuario creado correctamente';
                } else {
                    $result['error'] = 'Ocurrio un problema con ingresar un admin';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen usuarios';
                }
                break;
            case 'readDosPasosToggle':
                if ($result['dataset'] = $usuario->readDosPasosToggle()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen usuarios';
                }
                break;
            case 'readOne':
                if (!$usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($result['dataset'] = $usuario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setId($_POST['idUsuario']) or
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setClave($_POST['claveUsuario']) or
                    !$usuario->setNumeroTelefonico($_POST['telefonoUsuario']) or
                    !$usuario->setTipoUsuario($_POST['tipoUsuario'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador actualizado';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar un admin';
                }
                break;
            case 'updateToggle':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setEstadoToggle($_POST['estadoToggle'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->updateToggle()) {
                    $result['status'] = 1;
                    $result['message'] = 'Seguridad modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrio un problema al modificar la seguridad';
                }
                break;
            case 'deleteRow':
                if ($_POST['idAdministrador'] == $_SESSION['idAdministrador']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$usuario->setId($_POST['idAdministrador'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el administrador';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['aliasAdmin'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['aliasAdmin'];
                } else {
                    $result['error'] = 'Alias de administrador no encontrado';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $usuario->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                // Ejemplo básico de manejo de datos en PHP
                if (
                    !$usuario->setCorreo($_POST['correoUsuario']) or
                    !$usuario->setNumeroTelefonico($_POST['telefonoUsuario'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['correoUsuario'] = $_POST['correoUsuario'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;

            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$usuario->setClave($_POST['claveNueva'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            case 'changePasswordDos':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->checkPassword($_POST['input_contra_actual'])) { // Aquí debería coincidir con el campo enviado del formulario
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['input_contra'] != $_POST['input_repetircontra']) { // Comparar la nueva contraseña y la confirmación
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$usuario->setClave($_POST['input_contra'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($usuario->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;

            case 'resetFailedAttempts':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = 'Correo electrónico incorrecto';
                } elseif ($result['dataset'] = $usuario->resetFailedAttempts()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico inexistente';
                }
                break;

            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setCorreo($_POST['registro_input_correo']) or
                    !$usuario->setClave($_POST['registro_input_contrasena']) or
                    !$usuario->setNumeroTelefonico($_POST['registro_input_telefono'])
                ) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($_POST['registro_input_contrasena'] != $_POST['registro_input_contrasena2']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                // Comprobar si la contraseña ha expirado
                $fechaCreacionClave = $usuario->getFechaCreacionClave($_POST['correoLogin']); // Asegúrate de que este valor sea correcto
                $fechaCreacionClave = date('Y-m-d H:i:s', strtotime($fechaCreacionClave)); // Formato de la fecha de creación
                $fechaLimite = date('Y-m-d H:i:s', strtotime($fechaCreacionClave . ' + 90 days'));

                // Obtener la fecha y hora actual en el mismo formato
                $fechaActual = date('Y-m-d H:i:s');

                // Comparar las fechas
                if (new DateTime($fechaActual) > new DateTime($fechaLimite)) {
                    $result['error'] = 'Su contraseña ha expirado. Por favor, cambie su contraseña.'; // Mensaje de error
                    break;
                } else {
                    // Comprobar si el usuario existe y las credenciales son correctas
                    if ($usuario->checkUser($_POST['correoLogin'], $_POST['claveLogin'])) {
                        // Aquí solo se crea la sesión si la contraseña no ha expirado
                        $_SESSION['idAdministrador'] = $usuario->getIdAdministrador($_POST['correoLogin']); // Asegúrate de que esta función retorne el ID correcto
                        $result['status'] = 1; // Indicar que se ha iniciado sesión correctamente
                        $result['message'] = 'Autenticación correcta';
                    } else {
                        $result['error'] = 'Credenciales incorrectas'; // Mensaje de error para credenciales incorrectas
                    }
                }
                break;

            case 'getUserData':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($result['dataset'] = $usuario->getUserData()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'resetFailedAttempts':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = 'Correo electrónico incorrecto';
                } elseif ($result['dataset'] = $usuario->resetFailedAttempts()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico inexistente';
                }
                break;
            case 'blockAccount':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$usuario->setCorreo($_POST['correoLogin']) or
                    !$usuario->setAccountLockedUntil($_POST['accountLockedUntil'])
                ) {
                    $result['error'] = 'Ocurrio un error al recibir el correo y el tiempo.';
                } elseif ($result['dataset'] = $usuario->blockAccount()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrio un error al intentar bloquear la cuenta.';
                }
                break;
            case 'incrementFailedAttempts':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = 'Correo electrónico incorrecto';
                } elseif ($result['dataset'] = $usuario->incrementFailedAttempts()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico inexistente';
                }
                break;
            case 'searchMail':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['Input_Correo2'])) {
                    $result['error'] = 'Correo electrónico incorrecto.';
                } elseif ($result['dataset'] = $usuario->checkMail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico no encontrado.';
                }
                break;
                //ENVIAR CODIGO 
            case 'enviarCodigoRecuperacion':
                // Generar un código de recuperación
                $codigoRecuperacion = $mandarCorreo->generarCodigoRecuperacion();

                // Preparar el cuerpo del correo electrónico
                $correoDestino = $_POST['Input_Correo2'];
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
            case 'changePasswordLogin':
                $_POST = Validator::validateForm($_POST);
                // Intentar configurar la nueva contraseña y el ID del trabajador
                if (!$usuario->setClave($_POST['claveTrabajador']) || !$usuario->setId($_POST['idTrabajador'])) {
                    // Si ocurre un error al configurar, devuelve el error
                    $result['error'] = $usuario->getDataError();
                } else {
                    // Comprobación de la contraseña actual
                    if ($usuario->checkPassword2($_POST['claveTrabajador'])) {
                        // Si la nueva contraseña es igual a la anterior, se rechaza la actualización
                        $result['error'] = 'La nueva contraseña coincide con la anterior, por favor, ingrese una contraseña diferente.';
                    } else {
                        // Comprobar si la nueva contraseña coincide con la confirmación
                        if ($_POST['claveTrabajador'] != $_POST['confirmarTrabajador']) {
                            $result['error'] = 'Las contraseñas no coinciden';
                        } else {
                            // Si todo está bien, se intenta actualizar la contraseña
                            if ($usuario->updatePassword()) {
                                // Si la actualización es exitosa, devuelve un mensaje de éxito
                                $result['status'] = 1;
                                $result['message'] = 'Se ha actualizado correctamente la contraseña';
                            } else {
                                // Si ocurre un error durante la actualización, se muestra este mensaje
                                $result['error'] = 'Ocurrió un problema al modificar la contraseña';
                            }
                        }
                    }
                }
                break;

            case 'readDosPasos':
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = $usuario->getDataError();
                } elseif ($result['dataset'] = $usuario->readDosPasos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario no encontrado';
                }
                break;
            case 'enviarCodigoDosPasos':
                // Generar un código de recuperación
                $codigoRecuperacion = $mandarCorreo->generarCodigoRecuperacion();

                // Preparar el cuerpo del correo electrónico
                $correoDestino = $_POST['correoLogin'];
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
            case 'searchMailDosPasos':
                $_POST = Validator::validateForm($_POST);
                if (!$usuario->setCorreo($_POST['correoLogin'])) {
                    $result['error'] = 'Correo electrónico incorrecto';
                } elseif ($result['dataset'] = $usuario->checkMail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Correo electrónico inexistente';
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
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
