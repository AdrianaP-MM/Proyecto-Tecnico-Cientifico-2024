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
    if (isset($_SESSION['idUsuarioCliente'])) {
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
                $automovil->setFechaFabricacion($fechaFabricacion);

                // Realizar la búsqueda y verificar si hay resultados
                $result['dataset'] = $automovil->searchRows();

                if (!empty($result['dataset'])) {
                    $result['status'] = 1; // Éxito: se encontraron resultados
                } else {
                    $result['error'] = 'No hay coincidencias'; // No se encontraron resultados
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $automovil->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles' . $_SESSION['idUsuarioCliente'];
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'readTipos':
                if ($result['dataset'] = $automovil->readTipos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' tipos de automóviles registrados';
                } else {
                    $result['error'] = 'No existen tipos de automóviles registrados';
                }
                break;
                case 'createRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$automovil->setModeloAutomovil($_POST['modelo_automovil']) or
                        !$automovil->setIdTipo($_POST['id_tipo_automovil']) or
                        !$automovil->setColor($_POST['color_automovil']) or
                        !$automovil->setFechaFabricacion($_POST['fecha_fabricacion_automovil']) or
                        !$automovil->setPlaca($_POST['placa_automovil']) or
                        !$automovil->setImagen($_FILES['imagen_automovil']) or
                        !$automovil->setIdCliente($_POST['id_cliente']) // Asegúrate de que este campo sea enviado desde React Native si es necesario
                    ) {
                        $result['error'] = $automovil->getDataError();
                    } elseif ($automovil->createRow()) {
                        $result['status'] = 1;
                        $result['fileStatus'] = Validator::saveFile($_FILES['customFileW'], $automovil::RUTA_IMAGEN);
                        $result['message'] = 'Tipo de servicio creado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el tipo de servicio';
                    }
                    break;
            case 'readAllMyCars':
                if ($result['dataset'] = $automovil->readAllMyCars()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
                }
                break;
            case 'readAllDelete':
                if ($result['dataset'] = $automovil->readAllDelete()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' automóviles';
                } else {
                    $result['error'] = 'No existen automóviles registrados';
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
