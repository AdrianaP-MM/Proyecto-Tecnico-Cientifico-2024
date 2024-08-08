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
    if (isset($_SESSION['idUsuarioCliente'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'readAllEspecific':
                if ($result['dataset'] = $cita->readAllEspecific()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen citas del cliente para mostrar';
                }
                break;
                case 'readOne':
                    if (!$cita->setIdCita($_POST['id_cita'])) {
                        $result['error'] = $cita->getDataError();
                    } elseif ($result['dataset'] = $cita->readAllEspecific()) {
                        $result['status'] = 1;
                        $result['error'] = 'Ya tienes una cita con ese automovil';
                    } else {
                        $result['error'] = 'Cita inexistente';
                    }
                    break;
                case 'searchCitaAuto': //No puede agregar una cita con el mismo carro 
                    if (!$cita->setIdAutomovil($_POST['id_automovil'])) {
                        $result['error'] = $cita->getDataError();
                    } elseif ($result['dataset'] = $cita->searchCitaAuto()) {
                        $result['status'] = 1;
                        $result['error'] = 'Ya tienes una cita con ese automovil';
                    } else {
                        $result['error'] = 'Cita inexistente';
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
                case 'updateRow': //MMM actualizar, SOLO si está en espera, si necesita cambiar algun detalle despúes de eso, entonces
                    //Tiene que comunicarse con el taller, si quiere cancelarla, lo tiene que hacer el taller
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
                case 'deleteRow':
                    if (!$cita->setIdCita($_POST['id_cita'])) {
                        $result['error'] = $cliente->getDataError();
                    } elseif ($cita->deleteRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Cita eliminada correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al eliminar la cita';
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
