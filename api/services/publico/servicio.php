<?php
require_once ('../../helpers/validator.php');

header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['action'])) {
    session_start();
    $servicioData = new ServiciosData;
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);

    if (isset($_SESSION['idAdministrador'])) {
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
            case 'readOneModal':
                if (!$servicioData->setIdTipoServicio($_POST['id_tipo_servicio'])) {
                    $result['error'] = $servicioData->getDataError();
                } elseif ($result['dataset'] = $servicioData->readOneModal()) {
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


class ServiciosData {
    private $idTipoServicio;
    private $dataError;

    public function setIdTipoServicio($id) {
        if ($id > 0) {
            $this->idTipoServicio = $id;
            return true;
        } else {
            $this->dataError = 'ID de servicio inválido';
            return false;
        }
    }

    public function getDataError() {
        return $this->dataError;
    }

    public function readAll() {
        // Aquí deberías realizar la conexión a la base de datos y realizar la consulta.
        $conn = new mysqli('localhost', 'username', 'password', 'database');
        if ($conn->connect_error) {
            return false;
        }
        
        $query = "SELECT * FROM tb_tipos_servicios";
        $result = $conn->query($query);
        
        if ($result->num_rows > 0) {
            $data = array();
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $conn->close();
            return $data;
        } else {
            $conn->close();
            return false;
        }
    }

    public function readOne() {
        // Implementar esta función si es necesario
    }

    public function readOneModal() {
        // Implementar esta función si es necesario
    }
}
?>
