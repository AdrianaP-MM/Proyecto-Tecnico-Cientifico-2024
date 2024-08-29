<?php
// Se incluye la clase del modelo.
require_once('../../models/data/trabajadores_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $trabajador = new TrabajadoresData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                //Accion buscar trabajadores por su nombre y DUI
            case 'searchRows':
                if (!Validator::validateSearch($_POST['search'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $trabajador->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Accion para seleccionar a todos los trabajadores existentes de la base 
            case 'readAll':
                if ($result['dataset'] = $trabajador->readAll()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen trabajadores para mostrar';
                }
                break;
            case 'readEspecializaciones':
                if ($result['dataset'] = $trabajador->readEspecializaciones()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No datos que mostrar';
                }
                break;
                // Accion para seleccionar a un trabajador en especifico de la base
            case 'readOne':
                if (!$trabajador->setIdTrabajador($_POST['idTrabajador'])) {
                    $result['error'] = $trabajador->getDataError();
                } elseif ($result['dataset'] = $trabajador->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cliente inexistente';
                }
                break;
                // Acción para agregar a un trabajador a la base.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                //print_r($_POST);
                if (
                    !$trabajador->setDUI($_POST['input_dui_empleados']) or
                    !$trabajador->setNIT($_POST['input_nit_empleados']) or
                    !$trabajador->setNombre($_POST['input_nombre_empleados']) or
                    !$trabajador->setApellido($_POST['input_apellido_empleados']) or
                    !$trabajador->setTelefono($_POST['input_telefono_empleados']) or
                    !$trabajador->setCorreo($_POST['input_correo_empleados']) or
                    !$trabajador->setDepartamento($_POST['departamento_trabajador']) or
                    !$trabajador->setIdEspecializacionTrabajador($_POST['especializacion_trabajador']) or
                    !$trabajador->setFechaContratacion($_POST['fecha_contratacion']) or
                    !$trabajador->setSalarioBase($_POST['input_salario_empleados'])
                    //!$trabajador->setFtoTrabajador($_FILES['fto_trabajador2'])

                ) {
                    $result['error'] = $trabajador->getDataError();
                } elseif ($trabajador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Trabajador creado correctamente';
                } else {
                    $result['error'] = 'Ocurrio un problema con ingresar un trabajador';
                }
                break;
                // Acción para actualizar al trabajador.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$trabajador->setDUI($_POST['input_dui_empleados']) or
                    !$trabajador->setNIT($_POST['input_nit_empleados']) or
                    !$trabajador->setNombre($_POST['input_nombre_empleados']) or
                    !$trabajador->setApellido($_POST['input_apellido_empleados']) or
                    !$trabajador->setTelefono($_POST['input_telefono_empleados']) or
                    !$trabajador->setCorreo($_POST['input_correo_empleados']) or
                    !$trabajador->setDepartamento($_POST['departamento_trabajador']) or
                    !$trabajador->setIdEspecializacionTrabajador($_POST['especializacion_trabajador']) or
                    !$trabajador->setFechaContratacion($_POST['fecha_contratacion']) or
                    !$trabajador->setSalarioBase($_POST['input_salario_empleados']) or
                    //!$trabajador->setFtoTrabajador($_FILES['fto_trabajador']) or
                    !$trabajador->setIdTrabajador($_POST['idTrabajador'])
                ) {
                    $result['error'] = $trabajador->getDataError();
                } elseif ($trabajador->updateRow()) {
                    $result['status'] = 1;
                    //  $result['fileStatus'] = Validator::saveFile($_FILES['fto_trabajador'], $trabajador::RUTA_IMAGEN);
                    $result['message'] = 'Trabajador modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar un trabajador';
                }
                break;
                // Acción eliminar a un trabajador
            case 'deleteRow':
                if (!$trabajador->setIdTrabajador($_POST['idTrabajador'])) {
                    $result['error'] = $trabajador->getDataError();
                } elseif ($trabajador->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Trabajador removido correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al remover el trabajador';
                }
                break;
            case 'empleadosPorMesEspecialidad':
                if (!$trabajador->setAgnoContratacion($_POST['agno_contratacion'])) {
                    $result['error'] = $trabajador->getDataError();
                } elseif ($result['dataset'] = $trabajador->empleadosPorMesyEsp()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen empleados';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        $result['error'] = 'Acción no disponible fuera de la sesión';
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
