<?php
// Se incluye la clase del modelo.
require_once('../../models/data/servicios_en_proceso_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    session_start(); // Inicia la sesión.
    // Se instancia la clase correspondiente.
    $servicio = new ServiciosProcesoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $servicio->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen citas para mostrar';
                }
                break;
            case 'readOne':
                if (
                    !$servicio->setIdServicio($_POST['id_servicio']) or
                    !$servicio->setIdCita($_POST['id_cita'])
                ) {
                    $result['error'] = $servicio->getDataError();
                } elseif ($result['dataset'] = $servicio->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Servicio inexistente';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$servicio->setFechaRegistro($_POST['fecha_registro']) or
                    !$servicio->setFechaAproxFinalizacion($_POST['fecha_aprox_finalizacion']) or
                    //!$servicio->setFechaFinalizacion($_POST['fecha_finalizacion']) or
                    !$servicio->setIdCita($_POST['id_cita']) or
                    !$servicio->setIdServicio($_POST['input_servicios']) or
                    !$servicio->setCantidadServicio($_POST['cantidad_servicio'])
                ) {
                    $result['error'] = $servicio->getDataError();
                } elseif ($servicio->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicio creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el servicio';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$servicio->setFechaAproxFinalizacion($_POST['fecha_aprox_finalizacion']) or
                    !$servicio->setFechaFinalizacion($_POST['fecha_finalizacion']) or
                    !$servicio->setIdCita($_POST['id_cita']) or
                    !$servicio->setIdServicio($_POST['id_Servicio']) or
                    !$servicio->setCantidadServicio($_POST['cantidad_servicio'])
                ) {
                    $result['error'] = $servicio->getDataError();
                } elseif ($servicio->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicio creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el servicio';
                }
                break;
            case 'deleteRow':
                if (
                    !$servicio->setIdCita($_POST['id_cita']) or
                    !$servicio->setIdServicio($_POST['id_servicio'])
                ) {
                    $result['error'] = $servicio->getDataError();
                } elseif ($servicio->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Servicio eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el servicio';
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
