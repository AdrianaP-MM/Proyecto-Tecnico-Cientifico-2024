<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/servicio_data.php');

// Se instancia la entidad correspondiente.
$cita = new ServiciosData;

// Captura los parámetros de la URL
$duiCliente = isset($_GET['dui']) ? $_GET['dui'] : null;
$idServicio = isset($_GET['tipo']) ? $_GET['tipo'] : null;

// Verifica que los parámetros no sean nulos
if ($duiCliente && $idServicio) {
    // Asigna los valores capturados a las propiedades del objeto usando los métodos setter
    if ($cita->setIdCliente($duiCliente) && $cita->setIdServicio($idServicio)) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Citas de cliente por servicio');

        // Obtener los datos del reporte
        if ($dataCitas = $cita->readReportFrecuenciaServicio()) {
            // Establecer la fuente antes de cualquier impresión
            $pdf->setFont('Arial', 'B', 11);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(186, 24, 27);
            // Restablecer el color del texto a blanco en los encabezados de la tabla.
            $pdf->setTextColor(255, 255, 255);
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(39, 10, 'Nombre del cliente', 0, 0, 'C', 1);
            $pdf->cell(1, 5, '', 0, 0, 'C');
            $pdf->cell(49, 10, $pdf->encodeString('Modelo del automóvil'), 0, 0, 'C', 1);
            $pdf->cell(1, 5, '', 0, 0, 'C');
            $pdf->cell(50, 10, 'Nombre del servicio', 0, 0, 'C', 1);
            $pdf->cell(1, 5, '', 0, 0, 'C');
            $pdf->cell(39, 10, 'Fecha de cita', 0, 1, 'C', 1);
            // Restablecer el color del texto a negro en los campos de la tabla.
            $pdf->setTextColor(0, 0, 0);
            // Se establece la fuente para los datos de los productos.
            $pdf->setFont('Arial', '', 11);

            // Se recorren los registros fila por fila.
            foreach ($dataCitas as $rowCita) {
                // Se imprimen las celdas con los datos de los productos.
                $pdf->cell(40, 10, $pdf->encodeString($rowCita['nombres_cliente'] . ' ' . $rowCita['apellidos_cliente']), 1, 0);
                $pdf->cell(50, 10, $pdf->encodeString($rowCita['modelo_automovil']), 1, 0);
                $pdf->cell(50, 10, $pdf->encodeString($rowCita['nombre_servicio']), 1, 0);
                $pdf->cell(40, 10, $pdf->encodeString($rowCita['fecha_cita']), 1, 1);
            }
        } else {
            // Establecer la fuente y mostrar el mensaje en la misma página sin agregar una nueva
            $pdf->setFont('Arial', '', 11);
            $pdf->cell(0, 10, $pdf->encodeString('No hay citas para mostrar con los parámetros proporcionados'), 1, 1);
        }
    } else {
        // Establecer la fuente y mostrar el mensaje de error en la misma página sin agregar una nueva
        $pdf->setFont('Arial', '', 11);
        $pdf->cell(0, 10, $pdf->encodeString('Parámetros inválidos para generar el reporte'), 1, 1);
    }
} else {
    // Establecer la fuente y mostrar el mensaje de parámetros insuficientes en la misma página sin agregar una nueva
    $pdf->setFont('Arial', '', 11);
    $pdf->cell(0, 10, $pdf->encodeString('Parámetros insuficientes para generar el reporte'), 1, 1);
}

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'citas.pdf');
?>