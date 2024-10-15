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
if ($dataCita = $cita->getDemandaServicioMensual()) {
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Predicción de los servicios que se esperan realizar y los realizados.');

    // Inicializar variables para el agrupamiento
    $groupedByMonth = [];

    // Agrupar los datos por mes
    foreach ($dataCita as $row) {
        $mes = $row['mes_nombre'];
        $servicio = $row['servicio'];
        $esperados = $row['servicios_esperados'];
        $realizados = $row['servicios_realizados'];

        $groupedByMonth[$mes][] = [
            'servicio' => $servicio,
            'esperados' => $esperados,
            'realizados' => $realizados
        ];
    }

    // Iterar sobre los meses agrupados
    foreach ($groupedByMonth as $mes => $rows) {
        // Encabezados para la tabla de datos
        $pdf->setFillColor(186, 24, 27);
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(104, 10, $pdf->encodeString('Nombre del servicio'), 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(40, 10, $pdf->encodeString('Cantidad esperada'), 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(40, 10, $pdf->encodeString('Cantidad realizada'), 0, 1, 'C', 1);

        // Establecer encabezado de mes
        $pdf->setFillColor(234, 234, 234);
        $pdf->setTextColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 12);
        $pdf->cell(0, 10, $pdf->encodeString($mes), 1, 1, 'C', 1);
        $pdf->setFillColor(255, 255, 255);
        $pdf->setTextColor(0, 0, 0);

        // Datos de los servicios
        $totalRealizados = 0;
        $pdf->setFont('Arial', '', 11);
        foreach ($rows as $row) {
            $pdf->cell(104, 10, $pdf->encodeString($row['servicio']), 1, 0, 'C', 1);
            $pdf->cell(41, 10, $pdf->encodeString($row['esperados']), 1, 0, 'C', 1);
            $pdf->cell(41, 10, $pdf->encodeString($row['realizados']), 1, 1, 'C', 1);
            $totalRealizados += $row['realizados'];
        }

        // Mostrar total de servicios realizados
        $pdf->setFillColor(22, 26, 29);
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(104, 10, $pdf->encodeString('Total de servicios realizados en el año actual'), 1, 0, 'C', 1);
        $pdf->cell(82, 10, $pdf->encodeString($totalRealizados), 1, 1, 'C', 1);
        $pdf->Ln();
    }
} else {
    $pdf->setFont('Arial', 'B', 11);
    $pdf->cell(0, 10, $pdf->encodeString('No hay datos para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte.pdf');
