<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/servicios_en_proceso_data.php');

// Se instancia la entidad correspondiente.
$serviciosenProcesos = new ServiciosProcesoData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Servicios pendientes');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataServicios = $serviciosenProcesos->readAll()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 192, 203);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(40, 10, 'Fecha registro', 1, 0, 'C', 1);
    $pdf->cell(60, 10, 'Fecha aproximada finalización', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Fecha finalización', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Cantidad servicio', 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los servicios.
    $pdf->setFont('Arial', '', 11);
    // Se recorren los registros fila por fila.
    foreach ($dataServicios as $rowServicio) {
        // Se imprimen las celdas con los datos de los servicios.
        $pdf->cell(40, 10, $pdf->encodeString($rowServicio['fecha_registro']), 1, 0);
        $pdf->cell(60, 10, $rowServicio['fecha_aproximada_finalizacion'], 1, 0);
        $pdf->cell(40, 10, $rowServicio['fecha_finalizacion'], 1, 0);
        $pdf->cell(30, 10, $rowServicio['cantidad_servicio'], 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay servicios para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'servicios_pendientes.pdf');
?>
