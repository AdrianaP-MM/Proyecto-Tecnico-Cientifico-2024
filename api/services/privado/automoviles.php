<?php
// Se incluye la clase del modelo.
require_once('../../models/data/automoviles_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $automovil = new AutomovilData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'Entre' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                // Verificar si $_POST['search'] está definido
                // Obtener el valor de búsqueda
                $searchValue = $_POST['search'];
                $fechaDesde = isset($_POST['fecha_desde']) ? $_POST['fecha_desde'] : '';
                $fechaHasta = isset($_POST['fecha_hasta']) ? $_POST['fecha_hasta'] : '';
                $fechaFabricacion = isset($_POST['fecha_fabricacion']) ? $_POST['fecha_fabricacion'] : '';

                // Establecer el valor de búsqueda en el objeto automovil
                $automovil->setSearchValue($searchValue);
                $automovil->setFechaDesde($fechaDesde);
                $automovil->setFechaHasta($fechaHasta);
                $automovil->setFechaFabricacion2($fechaFabricacion);

                // Realizar la búsqueda y verificar si hay resultados
                $result['dataset'] = $automovil->searchRows();

                if (!empty($result['dataset'])) {
                    $result['status'] = 1; // Éxito: se encontraron resultados
                } else {
                    $result['error'] = 'No hay coincidencias'; // No se encontraron resultados
                }
                break;
            case 'createRow':
                $result['Entre'] = "SI";
                $_POST = Validator::validateForm($_POST);
                $result['Entre'] = "AQUÍ NO ESTA EL ERROR";
                print_r($_POST);
                if (
                    !$automovil->setModeloAutomovil($_POST['input_modelo_auto']) or
                    !$automovil->setIdTipo($_POST['input_tipo_auto']) or
                    !$automovil->setColor($_POST['input_color_auto']) or
                    !$automovil->setFechaFabricacion($_POST['input_fecha_auto']) or
                    !$automovil->setPlaca($_POST['input_placa']) or
                    !$automovil->setImagen($_FILES['customFile2'], $automovil->getFilename()) or
                    !$automovil->setIdCliente($_POST['input_duiP']) or
                    !$automovil->setIdMarcaAutomovil($_POST['input_marca_auto'])
                ) {
                    $result['Entre'] = "SIs";
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->createRowAdmin()) {
                    $result['status'] = 1;
                    $result['message'] = 'Automóvil agregado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['customFile2'], $automovil::RUTA_IMAGEN);
                } else {
                    $result['error'] = $automovil->getDataError();
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $automovil->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'readTipos':
                if ($result['dataset'] = $automovil->readTipos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'readMarcas':
                if ($result['dataset'] = $automovil->readMarcas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;

            case 'readClientes':
                if ($result['dataset'] = $automovil->readClientes()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'readOne':
                if (!$automovil->setId($_POST['idAuto'])) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($result['dataset'] = $automovil->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'automovil inexistente';
                }
                break;
            case 'readDetail':
                if (!$automovil->setId($_POST['idAuto'])) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($result['dataset'] = $automovil->readDetail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'automovil inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$automovil->setIdModelo($_POST['input_modelo_auto']) or
                    !$automovil->setIdTipo($_POST['input_tipo_auto']) or
                    !$automovil->setIdColor($_POST['input_color_auto']) or
                    !$automovil->setFechaFabricacion2($_POST['fechanInput']) or
                    !$automovil->setPlaca($_POST['input_placa']) or
                    !$automovil->setImagen($_FILES['customFile2'], $automovil->getFilename()) or
                    !$automovil->setIdCliente($_POST['input_duiP']) or
                    !$automovil->setId($_POST['idAutomovil'])
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Automóvil modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['customFile2'], $automovil::RUTA_IMAGEN, $automovil->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el automóvil';
                }
                break;
            case 'deleteRow':
                if (
                    !$automovil->setId($_POST['idAuto'])
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Automóvil eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el automóvil';
                }
                break;
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}

/*Case que quite por si acaso peta todo

case 'readModelos':
                if ($result['dataset'] = $automovil->readModelos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;

                case 'readColores':
                if ($result['dataset'] = $automovil->readColores()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;

*/