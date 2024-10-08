<?php
// Se incluye la clase del modelo.
require_once('../../models/data/citas_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    session_start(); // Inicia la sesión.
    // Se instancia la clase correspondiente.
    $cita = new CitasData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $cita->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen citas para mostrar';
                }
                break;
            case 'readOne':
                if (!$cita->setIdCita($_POST['id_cita'])) {
                    $result['error'] = $cita->getDataError();
                } elseif ($result['dataset'] = $cita->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cliente inexistente';
                }
                break;
            case 'readAutomoviles':
                if ($result['dataset'] = $cita->readAutomoviles()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen citas para mostrar';
                }
                break;
            case 'readServiciosCita':
                if (!$cita->setIdCita($_POST['id_cita'])) {
                    $result['error'] = $cita->getDataError();
                } elseif ($result['dataset'] = $cita->readServiciosCita()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Servicios inexistentes';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cita->setFechaHora($_POST['fecha_hora_cita']) or
                    !$cita->setIdAutomovil($_POST['input_automovil']) or
                    !$cita->setMovilizacion($_POST['input_movilizacion']) or
                    !$cita->setZona($_POST['input_zona']) or
                    !$cita->setIda($_POST['input_ida']) or
                    !$cita->setRegreso($_POST['input_regreso']) or
                    !$cita->setFechaRegistro($_POST['fecha_registro'])
                ) {
                    $result['error'] = $cita->getDataError();
                } elseif ($cita->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cita creada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear la cita';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cita->setIdCita($_POST['id_cita']) or
                    !$cita->setFechaHora($_POST['fecha_hora_cita']) or
                    !$cita->setIdAutomovil($_POST['input_automovil_UPDATE']) or
                    !$cita->setMovilizacion($_POST['input_movilizacion_UPDATE']) or
                    !$cita->setZona($_POST['input_zona_UPDATE']) or
                    !$cita->setIda($_POST['input_ida_UPDATE']) or
                    !$cita->setRegreso($_POST['input_regreso_UPDATE'])
                ) {
                    $result['error'] = $cita->getDataError();
                } elseif ($cita->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cita actualizada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al actualizar la cita';
                }
                break;
            case 'updateEstado':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cita->setIdCita($_POST['id_cita']) or
                    !$cita->setEstadoCita($_POST['estado_cita'])
                ) {
                    $result['error'] = $cita->getDataError();
                } elseif ($cita->updateEstado()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cita actualizada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al actualizar la cita';
                }
                break;
            case 'searchRows':
                if (!$cita->setSearchValue($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $cita->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'deleteRow':
                if (!$cita->setIdCita($_POST['id_cita'])) {
                    $result['error'] = $cita->getDataError();
                } elseif ($cita->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cita eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar la cita';
                }
                break;
            case 'autosReparados':
                if ($result['dataset'] = $cita->autosReparados()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen autos para contar';
                }
                break;
            case 'autosAReparar':
                if ($result['dataset'] = $cita->autosAReparar()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen autos para contar(2)';
                }
                break;
            case 'autosARepararPasado':
                if ($result['dataset'] = $cita->autosARepararPasado()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen autos para contar(3)';
                }
                break;
            case 'tiempoPorServicio':
                if ($result['dataset'] = $cita->tiempoPorServicio()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios';
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
