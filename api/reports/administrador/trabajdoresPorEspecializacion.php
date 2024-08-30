<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/trabajadores_data.php');

// Se instancia la entidad correspondiente.
$trabajador = new TrabajadoresData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Resumen de todos los trabajadores');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataTrabajador = $trabajador->readAllReporte()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(186, 24, 27);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Establecer color de texto a blanco
    $pdf->setTextColor(255, 255, 255);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(75, 10, 'Nombre del trabajador', 1, 0, 'C', 1);
    $pdf->cell(60, 10, 'Departamento', 1, 0, 'C', 1);
    $pdf->cell(45, 10, 'Fecha contratado', 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    $groupedByDate = [];
    // Agrupar los datos por especializacion
    foreach ($dataTrabajador as $rowEspecializacion) {
        $groupedByDate[$rowEspecializacion['nombre_especializacion_trabajador']][] = $rowEspecializacion;
    }
    // Iterar sobre las fechas agrupadas
    foreach ($groupedByDate as $date => $rows) {
        // Establecer color de texto a blanco
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->setFillColor(177, 167, 166);
        $pdf->cell(180, 10, $pdf->encodeString($date), 1, 1, 'C', 1);
        // Se recorren los registros fila por fila.
        foreach ($dataTrabajador as $rowAuto) {
            // Establecer color de texto a blanco
            $pdf->setTextColor(0, 0, 0);
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(75, 10, $pdf->encodeString($rowAuto['trabajador']), 1, 0, 'C');
            $pdf->cell(60, 10, $pdf->encodeString($rowAuto['departamento_trabajador']), 1, 0, 'C');
            $pdf->cell(45, 10, $rowAuto['fecha_contratacion'], 1, 1, 'C');
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay trabajadores para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'DARG - Automoviles por ano.pdf');
