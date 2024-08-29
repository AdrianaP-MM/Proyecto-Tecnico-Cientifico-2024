<?php
// Se incluye la clase para generar archivos PDF.
require_once('../../libraries/fpdf185/fpdf.php');

/*
*   Clase para definir las plantillas de los reportes del sitio privado.
*   Para más información http://www.fpdf.org/
*/
class WorkOrderReport extends FPDF
{
    // Propiedad para guardar el título del reporte.
    private $title = null;

    // Constante para definir la ruta de las vistas del sitio privado.
    const SERVER_URL = 'http://localhost/proyecto-tecnico-cientifico-2024/vistas/privado/';

    /*
    *   Método para iniciar el reporte con el encabezado del documento.
    *   Parámetros: $title (título del reporte).
    *   Retorno: ninguno.
    */
    public function startReport($title)
    {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en los reportes.
        session_start();
        // Se verifica si un administrador ha iniciado sesión para generar el documento, de lo contrario se direcciona a la página web principal.
        if (isset($_SESSION['idAdministrador'])) {
            // Se asigna el título del documento a la propiedad de la clase.
            $this->title = $title;
            // Se establece el título del documento (true = utf-8).
            $this->setTitle('Taller Revolution - Orden de Trabajo', true);
            // Se establecen los márgenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('P', 'Letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('Location: ' . self::SERVER_URL);
            exit(); // Asegúrate de detener la ejecución después de redirigir.
        }
    }

    /*
    *   Método para codificar una cadena de alfabeto español a UTF-8.
    *   Parámetros: $string (cadena).
    *   Retorno: cadena convertida.
    */
    public function encodeString($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del encabezado de los reportes.
    *   Se llama automáticamente en el método addPage()
    */
    public function header()
    {
        // Se establece el logo.
        $this->image('../../imagenes/revolution_logo.png', 15, 10, 28);
        $this->setFont('Arial', 'B', 15);
        // Se ubica el título en el centro.
        $this->cell(190, 10, $this->encodeString($this->title), 0, 1, 'C');
        $this->ln(5); // Salto de línea
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        // Se establece la posición para el número de página (a 15 milímetros del final).
        $this->setY(-15);
        // Se establece la fuente para el número de página.
        $this->setFont('Arial', 'I', 8);
        // Se imprime una celda con el número de página.
        $this->cell(0, 10, $this->encodeString('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }

    /*
    *   Método para agregar la información del cliente.
    *   Parámetros: información del cliente.
    *   Retorno: ninguno.
    */
    public function addClientInfo($clientName, $carBrand, $carModel, $plateNumber, $vinNumber, $carColor, $mileage)
    {
        $this->setFont('Arial', '', 12);
        $this->cell(100, 7, $this->encodeString("Cliente: $clientName"), 0, 1);
        $this->cell(100, 7, $this->encodeString("Marca: $carBrand"), 0, 0);
        $this->cell(90, 7, $this->encodeString("Modelo: $carModel"), 0, 1);
        $this->cell(100, 7, $this->encodeString("Placa: $plateNumber"), 0, 0);
        $this->cell(90, 7, $this->encodeString("VIN: $vinNumber"), 0, 1);
        $this->cell(100, 7, $this->encodeString("Color: $carColor"), 0, 0);
        $this->cell(90, 7, $this->encodeString("Kilometraje: $mileage km"), 0, 1);
        $this->ln(10); // Salto de línea
    }

    /*
    *   Método para agregar el trabajo realizado.
    *   Parámetros: $workPerformed (array de trabajos realizados).
    *   Retorno: ninguno.
    */
    public function addWorkPerformed($workPerformed)
    {
        $this->setFont('Arial', 'B', 12);
        $this->cell(190, 7, $this->encodeString("Trabajo Realizado:"), 1, 1, 'C');
        $this->setFont('Arial', '', 12);
        foreach ($workPerformed as $work) {
            $this->cell(130, 7, $this->encodeString($work['description']), 1);
            $this->cell(60, 7, "$" . number_format($work['price'], 2), 1, 1, 'R');
        }
        $this->ln(10); // Salto de línea
    }
}

// Datos de ejemplo
$clientName = "Ana Pérez Hernández";
$carBrand = "Chevrolet";
$carModel = "Aveo";
$plateNumber = "123ABC";
$vinNumber = "1HGBH41JXMN109186";
$carColor = "Rojo";
$mileage = "120000";

$workPerformed = [
    ["description" => "Cambio de aceite", "price" => 500],
    ["description" => "Revisión de frenos", "price" => 300],
    ["description" => "Alineación y balanceo", "price" => 400],
];

// Crear y generar el reporte
$pdf = new WorkOrderReport();
$pdf->startReport('Orden de Trabajo');
$pdf->addClientInfo($clientName, $carBrand, $carModel, $plateNumber, $vinNumber, $carColor, $mileage);
$pdf->addWorkPerformed($workPerformed);
$pdf->output();
?>
