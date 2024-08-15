<?php
// Se incluye la clase para generar archivos PDF.
require_once('../../librerias/fpdf185/fpdf.php');
/*
*   Clase para definir las plantillas de los reportes del sitio privado.
*   Para más información http://www.fpdf.org/
*/
class Report extends FPDF
{
    // Constante para definir la ruta de las vistas del sitio privado.
    const SERVER_URL = 'http://localhost/ecoaprende/ecoaprende_sitioprivado/vistas_administrador/privada/';
    // Propiedad para guardar el título del reporte.
    private $title = null;

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
            $this->setTitle('DARG - Gestión de reportes', true);
            // Se establecen los margenes del documento (izquierdo, superior y derecho).
            $this->setMargins(15, 15, 15);
            // Se añade una nueva página al documento con orientación vertical y formato carta, llamando implícitamente al método header()
            $this->addPage('p', 'letter');
            // Se define un alias para el número total de páginas que se muestra en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location:' . self::CLIENT_URL);
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
        $this->image('../../imagenes/ecoaprende_logo.png', 50, 8, 28);
        $this->image('../../imagenes/ecoaprende_header.png', 150, 0, 70);
        $this->image('../../imagenes/ecoaprende_header.png', 110, 0, 70);
        $this->image('../../imagenes/ecoaprende_header_2.png', 0, 0, 20);
        $this->image('../../imagenes/ecoaprende_background.png', 15, 50, 186);
        // Se ubica el título.
        $this->cell(20);
        $this->setFont('Arial', 'B', 15);
        $this->cell(166, 10, $this->encodeString($this->title), 0, 1, 'C');
        // Se ubica la fecha y hora del servidor.
        $this->cell(20 );
        $this->setFont('Arial', '', 10);
        $this->cell(166, 10, 'Fecha/Hora: ' . date('d-m-Y H:i:s'), 0, 1, 'C');
        // Se agrega un salto de línea para mostrar el contenido principal del documento.
        $this->ln(10);
    }

    /*
    *   Se sobrescribe el método de la librería para establecer la plantilla del pie de los reportes.
    *   Se llama automáticamente en el método output()
    */
    public function footer()
    {
        $this->image('../../imagenes/ecoaprende_header_3.png', 110, 260, 70);
        $this->image('../../imagenes/ecoaprende_header_3.png', 150, 260, 70);
        // Se establece la posición para el número de página (a 15 milímetros del final).
        $this->setY(-20);
        // Se establece la fuente para el número de página.
        $this->setFont('Arial', 'I', 8);
        $this->cell(0, 10, $this->encodeString('Factura generada por: ' . $_SESSION['correo_administrador']), 0, 1, 'C');
        // Se imprime una celda con el número de página. 
        $this->cell(0, 10, $this->encodeString('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }
}