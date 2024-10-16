<?php
// Se incluye la clase del modelo.
require_once('../../models/data/tipo_servicio_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    session_start(); // Inicia la sesión.
    // Se instancia la clase correspondiente.
    $tipoServicio = new TiposServiciosData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $tipoServicio->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen tipos de servicios para mostrar';
                }
                break;
            case 'readOne':
                if (!$tipoServicio->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = $tipoServicio->getDataError();
                } elseif ($result['dataset'] = $tipoServicio->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Tipo de servicio inexistente';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$tipoServicio->setNombreTipoServicio($_POST['nombre_tipo_servicio']) or
                    !$tipoServicio->setImagenServicio($_FILES['customFileW'])
                ) {
                    $result['error'] = $tipoServicio->getDataError();
                } elseif ($tipoServicio->createRow()) {
                    $result['status'] = 1;
                    $result['fileStatus'] = Validator::saveFile($_FILES['customFileW'], $tipoServicio::RUTA_IMAGEN);
                    $result['message'] = 'Tipo de servicio creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el tipo de servicio';
                }
                break;

            case 'updateRow':
                $_POST = Validator::validateForm($_POST);

                // Verificar si se seleccionó una nueva imagen
                $imagenSeleccionada = isset($_FILES['customFileW']) && $_FILES['customFileW']['error'] == UPLOAD_ERR_OK;

                // Si no se seleccionó una nueva imagen, usar la imagen actual
                if (!$imagenSeleccionada) {
                    // Usar el nombre de la imagen actual
                    $tipoServicio->setImagenActual($_POST['imagenActual']);
                } else {
                    // Procesar la nueva imagen
                    if (!$tipoServicio->setImagenServicio($_FILES['customFileW'], $tipoServicio->getFilename())) {
                        $result['error'] = $tipoServicio->getDataError();
                        break;
                    }
                }

                if (
                    !$tipoServicio->setIdTipoServicio($_POST['id_tipo_servicio']) or
                    !$tipoServicio->setNombreTipoServicio($_POST['nombre_tipo_servicio'])
                ) {
                    $result['error'] = $tipoServicio->getDataError();
                } elseif ($tipoServicio->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de servicio modificado correctamente';
                    if ($imagenSeleccionada) {
                        $result['fileStatus'] = Validator::changeFile($_FILES['customFileW'], $tipoServicio::RUTA_IMAGEN, $tipoServicio->getFilename());
                    }
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el tipo de servicio';
                }
                break;
            case 'deleteRow':
                if (!$tipoServicio->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = $tipoServicio->getDataError();
                } elseif ($tipoServicio->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Tipo de servicio eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el tipo de servicio';
                }
                break;

                //Importante
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $tipoServicio->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión, debe ingresar para continuar';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión, debe ingresar para continuar';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    // Si no se envió una acción válida, se devuelve un mensaje de recurso no disponible.
    print(json_encode('Recurso no disponible'));
}
