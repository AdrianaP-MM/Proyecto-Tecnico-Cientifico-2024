<?php
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

// Verifica que los parámetros no sean nulos
if ($fechaInicial && $fechaFinal && $tipoAutoId) {
    // Asigna los valores capturados a las propiedades del objeto usando los métodos setter
    if ($cita->setFechaInicial($fechaInicial) && $cita->setFechaFinal($fechaFinal) && $cita->setIdTipo($tipoAutoId)) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Reporte de Servicios por Tipo de Automóvil: ' . htmlspecialchars($tipoAutoNombre) . ' y Tiempo');

        // Añadir una nueva página solo si existen registros para mostrar
        if ($dataCitas = $cita->reportTipoAutoYFecha()) {
            // Se establece la fuente antes de cualquier impresión
            $pdf->setFont('Arial', 'B', 11);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(199, 0, 57);
            // Se establece un color de texto para los encabezados (por ejemplo, blanco)
            $pdf->setTextColor(255, 255, 255);
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(35, 10, 'Modelo', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Propietario', 1, 0, 'C', 1);
            $pdf->cell(60, 10, 'Servicio', 1, 0, 'C', 1);
            $pdf->cell(20, 10, 'Cantidad', 1, 0, 'C', 1);
            $pdf->cell(40, 10, 'Fecha Cita', 1, 1, 'C', 1);

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
            // Establecer la fuente y mostrar el mensaje en la misma página sin agregar una nueva
            $pdf->setFont('Arial', '', 11);
            $pdf->setTextColor(0, 0, 0); // Color de texto negro
            $pdf->cell(0, 10, $pdf->encodeString('No hay datos para mostrar con los parámetros proporcionados'), 1, 1);
        }
    } else {
        // Establecer la fuente y mostrar el mensaje de error en la misma página sin agregar una nueva
        $pdf->setFont('Arial', '', 11);
        $pdf->setTextColor(0, 0, 0); // Color de texto negro
        $pdf->cell(0, 10, $pdf->encodeString('Parámetros inválidos para generar el reporte'), 1, 1);
    }
} else {
    // Establecer la fuente y mostrar el mensaje de parámetros insuficientes en la misma página sin agregar una nueva
    $pdf->setFont('Arial', '', 11);
    $pdf->setTextColor(0, 0, 0); // Color de texto negro
    $pdf->cell(0, 10, $pdf->encodeString('Parámetros insuficientes para generar el reporte'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte_servicios.pdf');
?>
