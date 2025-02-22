<?php
require_once('../../helpers/validator.php');
require_once('../../models/data/servicio_data.php');

if (isset($_GET['action'])) {
    session_start();
    $servicioData = new ServiciosData;
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $servicioData->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readServicios':
                if ($result['dataset'] = $servicioData->readServicios()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readOne':
                if (!isset($_POST['id_tipo_servicio']) || !$servicioData->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = $servicioData->getDataError();
                } elseif ($result['dataset'] = $servicioData->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readGraphicGroupOfService':
                if ($result['dataset'] = $servicioData->graphicGroupOfService()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readTop10Servicios':
                if ($result['dataset'] = $servicioData->readTop10Servicios()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readOneModal':
                if (!$servicioData->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = $servicioData->getDataError();
                } elseif ($result['dataset'] = $servicioData->readOneModal()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);

                if (
                    !$servicioData->setIdTipoServicio($_POST['id_tipo_servicio']) ||
                    !$servicioData->setNombreServicio($_POST['nombre_servicio']) ||
                    !$servicioData->setDescripcionServicio($_POST['descripcion_servicio'])
                ) {
                    $result['error'] = $servicioData->getDataError();
                } elseif ($servicioData->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicio creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el servicio';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$servicioData->setIdTipoServicio($_POST['id_tipo_servicio']) ||
                    !$servicioData->setNombreServicio($_POST['nombre_servicio']) ||
                    !$servicioData->setDescripcionServicio($_POST['descripcion_servicio'])
                ) {
                    $result['error'] = $servicioData->getDataError();
                } elseif ($servicioData->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Seravicio modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar un servicio';
                }
                break;
            case 'buscarRows':
                if (!Validator::validateSearch($_POST['search']) || !$servicioData->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $servicioData->buscarRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'deleteRow':
                if (!$servicioData->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = 'ID del servicio incorrecto';
                } elseif ($servicioData->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicio eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el servicio';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        $result['exception'] = 'Acceso denegado';
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
