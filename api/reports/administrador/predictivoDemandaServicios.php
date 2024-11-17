<?php
// Activa el buffer de salida para evitar errores por salidas previas
ob_start();

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
    $totalAcumulado = 0;  // Variable para acumular los servicios realizados a lo largo del año

    // Agrupar los datos por mes
    foreach ($dataCita as $row) {
        $mes = $row['mes_nombre'] ?? 'Mes desconocido';
        $groupedByMonth[$mes][] = [
            'servicio' => $row['servicio'] ?? 'Desconocido',
            'esperados' => $row['servicios_esperados'] ?? 0,
            'realizados' => $row['servicios_realizados'] ?? 0,
        ];
    }

    // Iterar sobre los meses agrupados
    foreach ($groupedByMonth as $mes => $rows) {
        // Establecer encabezado de mes
        $pdf->setFillColor(234, 234, 234);
        $pdf->setTextColor(0, 0, 0);
        $pdf->setFont('Arial', 'B', 12);
        $pdf->cell(0, 10, $pdf->encodeString($mes), 1, 1, 'C', 1);

        // Encabezados para la tabla de datos
        $pdf->setFillColor(186, 24, 27);
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(104, 10, $pdf->encodeString('Nombre del servicio'), 1, 0, 'C', 1);
        $pdf->cell(41, 10, $pdf->encodeString('Cantidad esperada'), 1, 0, 'C', 1);
        $pdf->cell(41, 10, $pdf->encodeString('Cantidad realizada'), 1, 1, 'C', 1);

        // Datos de los servicios
        $pdf->setFillColor(255, 255, 255);
        $pdf->setTextColor(0, 0, 0);
        $pdf->setFont('Arial', '', 11);
        $totalRealizados = 0;
        foreach ($rows as $row) {
            $pdf->cell(104, 10, $pdf->encodeString($row['servicio']), 1, 0, 'C', 1);
            $pdf->cell(41, 10, $pdf->encodeString($row['esperados']), 1, 0, 'C', 1);
            $pdf->cell(41, 10, $pdf->encodeString($row['realizados']), 1, 1, 'C', 1);
            $totalRealizados += $row['realizados'];  // Acumula los servicios realizados por mes
        }

        // Actualiza el total acumulado
        $totalAcumulado += $totalRealizados;

        // Mostrar total de servicios realizados acumulados en el año actual
        $pdf->setFillColor(22, 26, 29);
        $pdf->setTextColor(255, 255, 255);
        $pdf->setFont('Arial', 'B', 11);
        $pdf->cell(104, 10, $pdf->encodeString('Total de servicios realizados en el año actual'), 1, 0, 'C', 1);
        $pdf->cell(82, 10, $pdf->encodeString($totalAcumulado), 1, 1, 'C', 1);  // Muestra el total acumulado

        // Espaciado entre bloques de meses
        $pdf->Ln();
    }
} else {
    // Inicia el reporte indicando que no hay datos.
    $pdf->startReport('Predicción del tiempo de atención por tipo de automóvil y servicio brindado.');
    // Se establece un color de relleno para el mensaje.
    $pdf->setFillColor(186, 24, 27);
    $pdf->setFont('Arial', 'B', 11);
    $pdf->cell(0, 10, $pdf->encodeString('No hay servicios para mostrar'), 1, 1, 'C', 1);
}

// Limpia el buffer y genera el PDF
ob_end_clean();
$pdf->output('I', 'reporte.pdf');
?>
