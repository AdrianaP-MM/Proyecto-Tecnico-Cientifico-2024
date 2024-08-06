<?php
require_once('../../helpers/validator.php');

header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['action'])) {
    session_start();
    $servicioData = new ServiciosData;
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    if (isset($_SESSION['idUsuarioCliente'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $servicioData->readAll()) {
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
            default:
                $result['exception'] = 'Acceso denegado';
        }
        echo json_encode($result);
    } else {
        echo json_encode('Recurso no disponible');
    }
} else {
    echo json_encode('Acción no especificada');
}
