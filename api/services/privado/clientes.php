<?php
// Se incluye la clase del modelo.
require_once('../../models/data/cliente_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    session_start(); // Inicia la sesión.
    // Se instancia la clase correspondiente.
    $cliente = new ClienteData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    // Verifica si el usuario ha iniciado sesión.
    if (isset($_SESSION['idAdministrador'])) {
        $result['session'] = 1; // Indica que hay una sesión activa.
        switch ($_GET['action']) {
            case 'readAll':
                if ($result['dataset'] = $cliente->readAll($_POST['tipo_cliente'])) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen clientes para mostrar';
                }
                break;
            case 'readMarcas':
                if ($result['dataset'] = $cliente->readMarcas()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen marcas para mostrar';
                }
                break;
            case 'readServicios':
                if ($result['dataset'] = $cliente->readServicios()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen servicios para mostrar';
                }
                break;
            case 'readOne':
                if (!$cliente->setId($_POST['id_cliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Cliente inexistente';
                }
                break;
            case 'readClientesMesTipos':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setFechaRegistro($_POST['fecha_registro'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->readClientesMesTipos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen clientes para mostrar';
                }
                break;
            case 'readClientesMasCitas':
                if ($result['dataset'] = $cliente->readClientesMasCitas()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen clientes para mostrar';
                }
                break;
            case 'readClientesRegistrados':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setAño($_POST['año']) or
                    !$cliente->setMes($_POST['mes']) or
                    !$cliente->setDepartamento($_POST['departamento'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->readClientesRegistrados()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No existen clientes para mostrar';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                //print_r($_POST);
                // Validaciones comunes para ambos tipos de cliente
                if (
                    !$cliente->setDUI($_POST['input_dui']) or
                    !$cliente->setNIT($_POST['input_nit']) or
                    !$cliente->setTelefono($_POST['input_telefono']) or
                    !$cliente->setDepartamento($_POST['input_departamento']) or
                    !$cliente->setNombre($_POST['input_nombre']) or
                    !$cliente->setApellido($_POST['input_apellido']) or
                    !$cliente->setCorreo($_POST['input_correo']) or
                    !$cliente->setFechaRegistro($_POST['fecha_registro']) or
                    !$cliente->setTipoCliente($_POST['tipo_cliente']) or
                    !$cliente->setEstado($_POST['estado_cliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } else {
                    // Validaciones específicas para cada tipo de cliente
                    if ($_POST['tipo_cliente'] == 'Persona natural') {
                        if (!$cliente->createRow()) {
                            $result['error'] = 'Ocurrió un problema al crear el Cliente natural';
                        } else {
                            $result['status'] = 1;
                            $result['message'] = 'Cliente natural creado correctamente';
                        }
                    } else {
                        if (
                            !$cliente->setNRF($_POST['input_nrf']) or
                            !$cliente->setNRC($_POST['input_nrc']) or
                            !$cliente->setRubro($_POST['input_rubro_comercial'])
                        ) {
                            $result['error'] = $cliente->getDataError();
                        } elseif (!$cliente->createRow()) {
                            $result['error'] = 'Ocurrió un problema al crear el Cliente jurídico';
                        } else {
                            $result['status'] = 1;
                            $result['message'] = 'Cliente jurídico creado correctamente';
                        }
                    }
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                //print_r($_POST);
                // Validaciones comunes para ambos tipos de cliente
                if (
                    !$cliente->setId($_POST['id_cliente']) or
                    !$cliente->setDUI($_POST['input_dui']) or
                    !$cliente->setNIT($_POST['input_nit']) or
                    !$cliente->setTelefono($_POST['input_telefono']) or
                    !$cliente->setDepartamento($_POST['input_departamento']) or
                    !$cliente->setNombre($_POST['input_nombre']) or
                    !$cliente->setApellido($_POST['input_apellido']) or
                    !$cliente->setCorreo($_POST['input_correo']) or
                    !$cliente->setTipoCliente($_POST['tipo_cliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } else {
                    // Validaciones específicas para cada tipo de cliente
                    if ($_POST['tipo_cliente'] == 'Persona natural') {
                        if (!$cliente->updateRow()) {
                            $result['error'] = 'Ocurrió un problema al modificar el Cliente natural';
                        } else {
                            $result['status'] = 1;
                            $result['message'] = 'Cliente natural modificado correctamente';
                        }
                    } else {
                        if (
                            !$cliente->setNRF($_POST['input_nrf']) or
                            !$cliente->setNRC($_POST['input_nrc']) or
                            !$cliente->setRubro($_POST['input_rubro_comercial'])
                        ) {
                            $result['error'] = $cliente->getDataError();
                        } elseif (!$cliente->updateRow()) {
                            $result['error'] = 'Ocurrió un problema al modificar el Cliente jurídico';
                        } else {
                            $result['status'] = 1;
                            $result['message'] = 'Cliente jurídico modificado correctamente';
                        }
                    }
                }
                break;
            case 'deleteRow':
                if (!$cliente->setId($_POST['id_cliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cliente eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el cliente';
                }
                break;
            case 'searchRows':
                //print_r($_POST);
                if (!$cliente->setTipoCliente($_POST['tipo_cliente'])) {
                    $result['error'] = $cliente->getDataError();
                } else {
                    // Obtener los valores de búsqueda si están definidos.
                    $searchValue = isset($_POST['search']) ? $_POST['search'] : '';
                    $departamento = isset($_POST['departamento_cliente']) ? $_POST['departamento_cliente'] : '';

                    $fechaDesde = isset($_POST['fecha_desde']) ? $_POST['fecha_desde'] : '';
                    $fechaHasta = isset($_POST['fecha_hasta']) ? $_POST['fecha_hasta'] : '';

                    $autosCantidad = isset($_POST['autos_cantd']) ? $_POST['autos_cantd'] : '';
                    $autosMarcas = isset($_POST['autos_marcas']) ? $_POST['autos_marcas'] : '';

                    $servicios = isset($_POST['servicios']) ? $_POST['servicios'] : '';
                    $rubro = isset($_POST['rubro_cliente']) ? $_POST['rubro_cliente'] : '';

                    $cliente->setSearchValue($searchValue);
                    $cliente->setDepartamento($departamento);

                    $cliente->setFechaDesde($fechaDesde);
                    $cliente->setFechaHasta($fechaHasta);

                    $cliente->setAutosCantidad($autosCantidad);
                    $cliente->setMarcasAutomovil($autosMarcas);

                    $cliente->setServicios($servicios);
                    $cliente->setRubro($rubro);

                    // Buscar clientes con los criterios definidos.
                    if ($result['dataset'] = $cliente->searchRows()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'No hay coincidencias';
                    }
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
