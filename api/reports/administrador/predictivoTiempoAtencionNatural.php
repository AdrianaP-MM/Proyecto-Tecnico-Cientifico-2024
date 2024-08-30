<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/citas_data.php');

// Se instancia la entidad correspondiente.
$cita = new CitasData;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCita = $cita->getTiempoAtencionNatural()) {
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Predicción del tiempo de atención por tipo de automóvil y servicio brindado.');
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(186, 24, 27);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Establecer color de texto a blanco
    $pdf->setTextColor(255, 255, 255);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(60, 10, $pdf->encodeString('Automóvil atendido'), 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(60, 10, $pdf->encodeString('Servicio realizado'), 0, 0, 'C', 1);
    $pdf->cell(1, 5, '', 0, 0, 'C');
    $pdf->cell(70, 10, $pdf->encodeString('Tiempo esperado de finalización'), 0, 1, 'C', 1); // Celda de texto

    $pdf->setFont('Arial', '', 11);
    $groupedByTipo = [];
    // Agrupar los datos por tipo
    foreach ($dataCita as $rowTipo) {
        $tipo = $rowTipo['Tipo'];
        $groupedByTipo[$tipo][] = $rowTipo;
    }

    // Iterar sobre los tipos agrupados
    foreach ($groupedByTipo as $tipo => $rows) {
        // Mostrar el tipo de automóvil
        $pdf->setFillColor(234, 234, 234);
        $pdf->setTextColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(192, 10, strtoupper($tipo), 1, 1, 'C', true);
        
        $totalMinutes = 0;
        $count = 0;

        // Mostrar los datos de cada automóvil
        foreach ($rows as $rowAuto) {
            $pdf->setFillColor(255, 255, 255);
            $pdf->setFont('Arial', '', 11);
            $pdf->cell(61, 10, $pdf->encodeString($rowAuto['Automovil']), 1, 0, 'C', true);
            $pdf->cell(60, 10, $pdf->encodeString($rowAuto['Servicio_Realizado']), 1, 0, 'C', true);
            $pdf->cell(71, 10, $pdf->encodeString($rowAuto['Tiempo_Promedio']), 1, 1, 'C', true);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay autos para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte.pdf');
?>
