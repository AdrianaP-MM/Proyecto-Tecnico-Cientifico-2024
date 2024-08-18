<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/automoviles_data.php');

// Se instancia la entidad correspondiente.
$puto = new AutomovilData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Automoviles totales');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataAutos = $puto->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255,192,203);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(126, 10, 'Modelo', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Placa', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    // Se recorren los registros fila por fila.
    foreach ($dataAutos as $rowAuto) {
        $estado = $rowAuto['estado_automovil'];
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(126, 10, $pdf->encodeString($rowAuto['modelo_automovil']), 1, 0);
        $pdf->cell(30, 10, $rowAuto['placa_automovil'], 1, 0);
        $pdf->cell(30, 10, $estado, 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay autos para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'libros.pdf');
?>
