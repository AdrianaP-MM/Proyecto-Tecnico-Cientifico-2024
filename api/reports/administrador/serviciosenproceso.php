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
if ($dataServicios = $serviciosenProcesos->mostrarServiciosenProceso()) {

    // Organizar los datos por estado (primero "espera", luego "aceptado").
    usort($dataServicios, function ($a, $b) {
        return strcmp($a['estado_cita'], $b['estado_cita']);
    });

    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(186, 24, 27);
    // Color para los encabezados
    $pdf->setTextColor(255, 255, 255);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 9); // Aumentar el tamaño de la fuente
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(32, 8, 'Fecha Reg.', 0, 0, 'C', 1); 
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(32, 8, 'Fecha Aprox.', 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(14, 8, 'Cantidad', 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(24, 8, 'Estado', 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(24, 8, 'Modelo Auto', 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(15, 8, 'Placa', 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(49, 8, 'Servicio', 0, 1, 'C', 1);

    // Se establece un color de texto para los datos (por ejemplo, negro)
    $pdf->setTextColor(0, 0, 0);
    // Se establece la fuente para los datos de los servicios.
    $pdf->setFont('Arial', '', 9); // Aumentar el tamaño de la fuente

    // Se recorren los registros fila por fila.
    foreach ($dataServicios as $rowServicio) {
        // Se imprimen las celdas con los datos de los servicios, dejando en blanco si no existe el dato.
        $pdf->cell(33, 8, $pdf->encodeString(isset($rowServicio['fecha_registro']) ? $rowServicio['fecha_registro'] : ''), 1, 0);
        $pdf->cell(33, 8, isset($rowServicio['fecha_aproximada_finalizacion']) ? $rowServicio['fecha_aproximada_finalizacion'] : '', 1, 0);
        $pdf->cell(15, 8, isset($rowServicio['cantidad_servicio']) ? $rowServicio['cantidad_servicio'] : '', 1, 0);
        $pdf->cell(25, 8, isset($rowServicio['estado_cita']) ? $rowServicio['estado_cita'] : '', 1, 0);
        $pdf->cell(25, 8, isset($rowServicio['modelo_automovil']) ? $rowServicio['modelo_automovil'] : '', 1, 0);
        $pdf->cell(15, 8, isset($rowServicio['placa_automovil']) ? $rowServicio['placa_automovil'] : '', 1, 0);
        $pdf->cell(50, 8, $pdf->encodeString(isset($rowServicio['nombre_servicio']) ? $rowServicio['nombre_servicio'] : ''), 1, 1);
    }
} else {
    // Si no hay datos, se muestra un mensaje.
    $pdf->cell(0, 10, $pdf->encodeString('No hay servicios pendientes para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'servicios_pendientes.pdf');
