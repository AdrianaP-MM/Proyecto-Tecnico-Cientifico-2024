<?php
// Se incluye la clase del modelo.
require_once('../../models/data/automoviles_data.php');



// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $automovil = new AutomovilData;
    // Se declara e inicialdeleteRowiza un arreglo para guardar el resultado que retorna la API.
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
            case 'readMarcas':
                if ($result['dataset'] = $automovil->readMarcas()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' marcas de autom贸viles registrados';
                } else {
                    $result['error'] = 'No existen tipos de autom贸viles registrados';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                $IMG = isset($_FILES['imagen_automovil']) ? $_FILES['imagen_automovil'] : null;
                if (
                    !$automovil->setModeloAutomovil($_POST['modelo_automovil']) or
                    !$automovil->setIdTipo($_POST['id_tipo_automovil']) or
                    !$automovil->setColor($_POST['color_automovil']) or
                    !$automovil->setFechaFabricacion($_POST['fecha_fabricacion_automovil']) or
                    !$automovil->setPlaca($_POST['placa_automovil']) or
                    !$automovil->setIdMarcaAutomovil($_POST['id_marca_automovil']) or
                    ($IMG && !$automovil->setImagen($IMG))
                ) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->createRow()) {
                    $result['status'] = 1;
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagen_automovil'], $automovil::RUTA_IMAGEN);
                    $result['message'] = 'Carro creado correctamente';
                } else {
                    $result['error'] = 'Ocurrio un problema al insertar el automovil';
                }
                break;
                case 'updateRow':
                    // Validar y limpiar los datos del formulario
                    $_POST = Validator::validateForm($_POST);
                    $IMG = isset($_FILES['imagen_automovil']) ? $_FILES['imagen_automovil'] : null;
                
                    // Agregar log para verificar el ID del automóvil
                    error_log('ID del automóvil recibido: ' . $_POST['id_automovil']);
                
                    // Asignar los valores al objeto de automóvil
                    if (
                        !$automovil->setModeloAutomovil($_POST['modelo_automovil']) or
                        !$automovil->setIdTipo($_POST['id_tipo_automovil']) or
                        !$automovil->setColor($_POST['color_automovil']) or
                        !$automovil->setFechaFabricacion($_POST['fecha_fabricacion_automovil']) or
                        !$automovil->setPlaca($_POST['placa_automovil']) or
                        !$automovil->setIdMarcaAutomovil($_POST['id_marca_automovil']) or
                        !$automovil->setIdCliente($_POST['id_cliente']) or
                        !$automovil->setId($_POST['id_automovil']) or
                        ($IMG && !$automovil->setImagen($IMG))
                    ) {
                        if ($IMG) {
                            if (move_uploaded_file($IMG['tmp_name'], 'ruta/destino/' . $IMG['name'])) {
                                echo 'Imagen subida con éxito';
                            } else {
                                echo 'Error al subir la imagen';
                            }
                        }
                        
                        // Si hay algún error en los datos, almacenar el mensaje de error
                        $result['error'] = $automovil->getDataError();
                    } elseif ($automovil->updateRow()) {
                        // Si la actualización es exitosa, almacenar el estado de la imagen y el mensaje de éxito
                        $result['status'] = 1;
                        $result['message'] = 'Automóvil modificado correctamente';
                        if ($IMG) {
                            $result['fileStatus'] = Validator::saveFile($IMG, $automovil::RUTA_IMAGEN);
                        }
                    } else {
                        // Si ocurre un problema al actualizar, almacenar el mensaje de error
                        $result['error'] = 'Ocurrió un problema al modificar el automóvil';
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
            case 'deleteRow':
                if (!$automovil->setId($_POST['idAuto'])) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($automovil->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Carro eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el carro';
                }
                break;
            case 'searchAutosByPlaca':
                if (!$automovil->setPlaca($_POST['search_value'])) {
                    $result['error'] = $automovil->getDataError();
                } elseif ($result['dataset'] = $automovil->searchAutosByPlaca()) {
                    $result['status'] = 1;
                    $result['message'] = 'Carro encontrado.';
                } else {
                    $result['error'] = 'No se encontró el automóvil.';
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
