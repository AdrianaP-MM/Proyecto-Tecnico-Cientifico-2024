<?php
// Inicia el buffer de salida
ob_start();
session_start(); // Asegúrate de iniciar la sesión si se usa $_SESSION

// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/automoviles_data.php');

// Se instancia la entidad correspondiente.
$cita = new AutomovilData;

// Captura los parámetros de la URL
$fechaInicial = isset($_GET['fecha_inicial']) ? $_GET['fecha_inicial'] : null;
$fechaFinal = isset($_GET['fecha_final']) ? $_GET['fecha_final'] : null;
$tipoAutoId = isset($_GET['tipo_auto']) ? $_GET['tipo_auto'] : null;
$tipoAutoNombre = isset($_GET['tipo_auto_nombre']) ? $_GET['tipo_auto_nombre'] : null;

// Inicializa variable para verificar si se debe añadir una página
$shouldAddPage = false;

// Verifica que los parámetros no sean nulos
if ($fechaInicial && $fechaFinal && $tipoAutoId) {
    // Asigna los valores capturados a las propiedades del objeto usando los métodos setter
    if ($cita->setFechaInicial($fechaInicial) && $cita->setFechaFinal($fechaFinal) && $cita->setIdTipo($tipoAutoId)) {
        // Leer los datos del reporte
        $dataCitas = $cita->reportTipoAutoYFecha();
        // Verificar si hay datos
        if ($dataCitas) {
            // Marcar que se debe añadir una página
            $shouldAddPage = true;
        }
    }
}

// Añadir una página solo si hay datos para mostrar o si hay un mensaje a mostrar
if ($shouldAddPage || !$fechaInicial || !$fechaFinal || !$tipoAutoId) {
    

    if ($shouldAddPage) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Reporte de Servicios por Tipo de Automóvil: ' . htmlspecialchars($tipoAutoNombre) . ' y Tiempo');

        // Establecer la fuente antes de cualquier impresión
        $pdf->setFont('Arial', 'B', 11);
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(186, 24, 27);
        // Se establece un color de texto para los encabezados (por ejemplo, blanco)
        $pdf->setTextColor(255, 255, 255);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(34, 10, 'Modelo', 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(29, 10, 'Propietario', 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(60, 10, 'Servicio', 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(19, 10, 'Cantidad', 0, 0, 'C', 1);
        $pdf->cell(1, 5, '', 0, 0, 'C');
        $pdf->cell(39, 10, 'Fecha Cita', 0, 1, 'C', 1);

        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Arial', '', 11);
        // Se establece un color de texto para los datos (por ejemplo, negro)
        $pdf->setTextColor(0, 0, 0);

        // Se recorren los registros fila por fila.
        foreach ($dataCitas as $rowCita) {
            // Imprimir cada celda con un borde y alineación
            $pdf->cell(35, 10, $pdf->encodeString($rowCita['modelo']), 1);
            $pdf->cell(30, 10, $pdf->encodeString($rowCita['nombre_propietario']), 1);
            $pdf->cell(60, 10, $pdf->encodeString($rowCita['nombre_servicio']), 1);
            $pdf->cell(20, 10, $rowCita['cantidad_servicios'], 1, 0, 'C');
            $pdf->cell(40, 10, $pdf->encodeString($rowCita['fecha_cita']), 1);
            // Salto de línea después de cada fila de datos
            $pdf->Ln();
        }
    } else {
        $pdf->AddPage(); // Añade una página solo si se debe mostrar contenido o mensaje
        // Si no hay datos, mostrar el mensaje correspondiente
        $pdf->setFont('Arial', '', 11);
        $pdf->setTextColor(0, 0, 0); // Color de texto negro

        if (!$fechaInicial || !$fechaFinal || !$tipoAutoId) {
            $pdf->cell(0, 10, $pdf->encodeString('Parámetros insuficientes para generar el reporte'), 0, 1);
        } elseif (!$cita->setFechaInicial($fechaInicial) || !$cita->setFechaFinal($fechaFinal) || !$cita->setIdTipo($tipoAutoId)) {
            $pdf->cell(0, 10, $pdf->encodeString('Parámetros inválidos para generar el reporte'), 0, 1);
        } else {
            $pdf->cell(0, 10, $pdf->encodeString('No hay datos para mostrar con los parámetros proporcionados'), 0, 1);
        }
    }
}

// Limpia el buffer de salida
ob_end_clean();

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'Reporte automoviles: Tipo y rango de fechas.pdf');
?>
