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
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(255, 192, 203);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(30, 10, 'Fecha Registro', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Fecha Aproximada', 1, 0, 'C', 1);
    $pdf->cell(20, 10, 'Cantidad', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Estado Cita', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Modelo Automovil', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Placa', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Servicio', 1, 0, 'C', 1);
    $pdf->cell(50, 10, 'Descripcion Servicio', 1, 1, 'C', 1);

    // Se establece la fuente para los datos de los servicios.
    $pdf->setFont('Arial', '', 11);

    // Se recorren los registros fila por fila.
    foreach ($dataServicios as $rowServicio) {
        // Se imprimen las celdas con los datos de los servicios, dejando en blanco si no existe el dato.
        $pdf->cell(30, 10, $pdf->encodeString(isset($rowServicio['fecha_registro']) ? $rowServicio['fecha_registro'] : ''), 1, 0);
        $pdf->cell(40, 10, isset($rowServicio['fecha_aproximada_finalizacion']) ? $rowServicio['fecha_aproximada_finalizacion'] : '', 1, 0);
        $pdf->cell(20, 10, isset($rowServicio['cantidad_servicio']) ? $rowServicio['cantidad_servicio'] : '', 1, 0);
        $pdf->cell(30, 10, isset($rowServicio['estado_cita']) ? $rowServicio['estado_cita'] : '', 1, 0);
        $pdf->cell(40, 10, isset($rowServicio['modelo_automovil']) ? $rowServicio['modelo_automovil'] : '', 1, 0);
        $pdf->cell(30, 10, isset($rowServicio['placa_automovil']) ? $rowServicio['placa_automovil'] : '', 1, 0);
        $pdf->cell(40, 10, isset($rowServicio['nombre_servicio']) ? $rowServicio['nombre_servicio'] : '', 1, 0);
        $pdf->cell(50, 10, isset($rowServicio['descripcion_servicio']) ? $rowServicio['descripcion_servicio'] : '', 1, 1);
    }
} else {
    // Si no hay datos, se muestra un mensaje.
    $pdf->cell(0, 10, $pdf->encodeString('No hay servicios para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'servicios_pendientes.pdf');
?>
