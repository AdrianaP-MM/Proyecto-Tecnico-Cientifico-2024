<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/automoviles_data.php');

// Se instancia la entidad correspondiente.
$auto = new AutomovilData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Automóviles según su año de fabricación');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataAutos = $auto->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(186, 24, 27);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Establecer color de texto a blanco
    $pdf->setTextColor(255, 255, 255);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(120, 10, 'Modelo', 1, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(30, 10, 'Placa', 1, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(28, 10, 'Estado', 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    $groupedByDate = [];
    // Agrupar los datos por fecha
    foreach ($dataAutos as $rowFecha) {
        $groupedByDate[$rowFecha['fecha_fabricacion_automovil']][] = $rowFecha;
    }
    // Iterar sobre las fechas agrupadas
    foreach ($groupedByDate as $date => $rows) {
        // Establecer color de texto a blanco
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->setFillColor(177, 167, 166);
        $pdf->cell(180, 10, $pdf->encodeString($date), 1, 1, 'C', 1);
        // Se recorren los registros fila por fila.
        foreach ($dataAutos as $rowAuto) {
            // Establecer color de texto a blanco
            $pdf->setTextColor(0, 0, 0);
            $estado = $rowAuto['estado_automovil'];
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(120, 10, $pdf->encodeString($rowAuto['modelo_automovil']), 1, 0, 'C');
            $pdf->cell(30, 10, $rowAuto['placa_automovil'], 1, 0, 'C');
            $pdf->cell(30, 10, $estado, 1, 1, 'C');
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay autos para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'DARG - Automoviles por ano.pdf');
