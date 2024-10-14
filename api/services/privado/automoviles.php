<?php
// Se incluye la clase del modelo.
require_once('../../models/data/automoviles_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    session_start(); // Inicia la sesión.
    // Se instancia la clase correspondiente.
    $automovil = new AutomovilData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'searchRows':
                // Obtener el valor de búsqueda
                $searchValue = isset($_POST['search']) ? $_POST['search'] : '';

                // Establecer el valor de búsqueda en el objeto automovil
                $automovil->setSearchValue($searchValue);

                // Buscar clientes con los criterios definidos.
                if ($result['dataset'] = $automovil->searchRows()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay coincidencias.';
                }
                break;
            case 'searchRowsByMarcas':
                // Obtener el valor de búsqueda
                $searchValue = isset($_POST['searchMarca']) ? $_POST['searchMarca'] : '';

                // Establecer el valor de búsqueda en el objeto automovil
                $automovil->setSearchValue($searchValue);

                // Buscar clientes con los criterios definidos.
                if ($result['dataset'] = $automovil->searchRowsByMarcas()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay coincidencias.';
                }
                break;
            case 'searchRowsByFecha':
                // Obtener el valor de búsqueda
                $searchValue = isset($_POST['searchFecha']) ? $_POST['searchFecha'] : '';

                // Establecer el valor de búsqueda en el objeto automovil
                $automovil->setSearchValue($searchValue);

                // Buscar clientes con los criterios definidos.
                if ($result['dataset'] = $automovil->searchRowsByFecha()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay coincidencias.';
                }
                break;
            case 'searchRowsByTipos':
                // Obtener el valor de búsqueda
                $searchValue = isset($_POST['searchTipo']) ? $_POST['searchTipo'] : '';

                // Establecer el valor de búsqueda en el objeto automovil
                $automovil->setSearchValue($searchValue);

                // Buscar clientes con los criterios definidos.
                if ($result['dataset'] = $automovil->searchRowsByTipos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay coincidencias.';
                }
                break;
            case 'createRow':
                // Validar los datos del formulario
                $_POST = Validator::validateForm($_POST);

                // Obtener el ID del cliente basado en el DUI
                $IdCliente = $automovil->getIdCliente($_POST['label_dui']);

                if (!$IdCliente) {
                    $result['error'] = 'No existe el DUI del cliente en la base de datos.';
                    break;
                }
                if (
                    !$automovil->setModeloAutomovil($_POST['input_modelo_auto']) or
                    !$automovil->setIdTipo($_POST['input_tipo_auto']) or
                    !$automovil->setColor($_POST['input_color_auto']) or
                    !$automovil->setFechaFabricacion($_POST['input_fecha_auto']) or
                    !$automovil->setPlaca($_POST['input_placa']) or
                    !$automovil->setImagen($_FILES['customFile2'], $automovil->getFilename()) or
                    !$automovil->setIdCliente($IdCliente) or  // Aquí se usa la variable $IdCliente
                    !$automovil->setIdMarcaAutomovil($_POST['input_marca_auto'])
                ) {
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
            case 'createMarcaAutomovil':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$automovil->setMarcaAutomovil($_POST['input_marca_automovil'])
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->createMarcaAutomovil()) {
                    $result['status'] = 1;
                    $result['message'] = 'Marca agregada correctamente';
                } else {
                    $result['error'] = $automovil->getDataError();
                }
                break;
            case 'updateRowMarcaAutomovil':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$automovil->setMarcaAutomovil($_POST['input_marca_automovil']) or
                    !$automovil->setIdMarcaAutomovil($_POST['input_id_marca_automovil'])
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->updateRowMarcaAutomovil()) {
                    $result['status'] = 1;
                    $result['message'] = 'Marca modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el automóvil';
                }
                break;
            case 'deleteRowMarcaAutomovil':
                if (
                    !$automovil->setIdMarcaAutomovil($_POST['input_id_marca_automovil'])
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->deleteRowMarcaAutomovil()) {
                    $result['status'] = 1;
                    $result['message'] = 'Marca eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el automóvil';
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
            case 'readAllMarcasAutomoviles':
                if ($result['dataset'] = $automovil->readAllMarcasAutomoviles()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'searchRowsMarcasAutomoviles':
                if (!Validator::validateSearch($_POST['searchMarca'])) {
                    $result['error'] = Validator::getSearchError();
                } elseif ($result['dataset'] = $automovil->searchRowsMarcasAutomoviles()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'readGraphicCarsByType':
                if ($result['dataset'] = $automovil->graphicCarsByType()) {
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
                    !$automovil->setModeloAutomovil($_POST['input_modelo_auto']) or
                    !$automovil->setIdTipo($_POST['input_tipo_auto']) or
                    !$automovil->setColor($_POST['input_color_auto']) or
                    !$automovil->setFechaFabricacion($_POST['fechanInput']) or
                    !$automovil->setPlaca($_POST['input_placa']) or
                    !$automovil->setImagen($_FILES['customFile2'], $automovil->getFilename()) or
                    !$automovil->setIdMarcaAutomovil($_POST['input_marca_auto']) or
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
    print (json_encode($result));
} else {
    // Si no se envió una acción válida, se devuelve un mensaje de recurso no disponible.
    print (json_encode('Recurso no disponible'));
}
