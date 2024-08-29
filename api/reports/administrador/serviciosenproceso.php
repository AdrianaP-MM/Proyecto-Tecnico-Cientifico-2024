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
    usort($dataServicios, function($a, $b) {
        return strcmp($a['estado_cita'], $b['estado_cita']);
    });

    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 433, 203);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 7); // Se reduce el tamaño de la fuente
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(18, 6, 'Fecha Reg.', 1, 0, 'C', 1); // Reducir el ancho de las columnas
    $pdf->cell(22, 6, 'Fecha Aproximada', 1, 0, 'C', 1);
    $pdf->cell(14, 6, 'Cantidad', 1, 0, 'C', 1);
    $pdf->cell(20, 6, 'Estado Cita', 1, 0, 'C', 1);
    $pdf->cell(24, 6, 'Modelo Auto', 1, 0, 'C', 1);
    $pdf->cell(18, 6, 'Placa', 1, 0, 'C', 1);
    $pdf->cell(26, 6, 'Servicio', 1, 0, 'C', 1);
    $pdf->cell(38, 6, 'Descripcion Servicio', 1, 1, 'C', 1);

    // Se establece la fuente para los datos de los servicios.
    $pdf->setFont('Arial', '', 7); // Se reduce el tamaño de la fuente

    // Se recorren los registros fila por fila.
    foreach ($dataServicios as $rowServicio) {
        // Se imprimen las celdas con los datos de los servicios, dejando en blanco si no existe el dato.
        $pdf->cell(18, 6, $pdf->encodeString(isset($rowServicio['fecha_registro']) ? $rowServicio['fecha_registro'] : ''), 1, 0);
        $pdf->cell(22, 6, isset($rowServicio['fecha_aproximada_finalizacion']) ? $rowServicio['fecha_aproximada_finalizacion'] : '', 1, 0);
        $pdf->cell(14, 6, isset($rowServicio['cantidad_servicio']) ? $rowServicio['cantidad_servicio'] : '', 1, 0);
        $pdf->cell(20, 6, isset($rowServicio['estado_cita']) ? $rowServicio['estado_cita'] : '', 1, 0);
        $pdf->cell(24, 6, isset($rowServicio['modelo_automovil']) ? $rowServicio['modelo_automovil'] : '', 1, 0);
        $pdf->cell(18, 6, isset($rowServicio['placa_automovil']) ? $rowServicio['placa_automovil'] : '', 1, 0);
        $pdf->cell(26, 6, isset($rowServicio['nombre_servicio']) ? $rowServicio['nombre_servicio'] : '', 1, 0);
        $pdf->cell(38, 6, isset($rowServicio['descripcion_servicio']) ? $rowServicio['descripcion_servicio'] : '', 1, 1);
    }
} else {
    // Si no hay datos, se muestra un mensaje.
    $pdf->cell(0, 10, $pdf->encodeString('No hay servicios para mostrar'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'servicios_pendientes.pdf');
?>
