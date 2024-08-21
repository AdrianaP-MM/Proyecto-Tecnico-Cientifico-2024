<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/citas_data.php');

// Se instancia la entidad correspondiente.
$cita = new CitasData;

// Captura los parámetros de la URL
$estadoCita = isset($_GET['estado']) ? $_GET['estado'] : null;
$duiCliente = isset($_GET['dui']) ? $_GET['dui'] : null;

// Verifica que los parámetros no sean nulos
if ($estadoCita && $duiCliente) {
    // Asigna los valores capturados a las propiedades del objeto usando los métodos setter
    if ($cita->setEstadoCita($estadoCita) && $cita->setIdCliente($duiCliente)) {
        // Se inicia el reporte con el encabezado del documento.
        $pdf->startReport('Citas de cliente por estado');

        // Añadir una nueva página solo si existen registros para mostrar
        if ($dataCitas = $cita->readCitasParametrizada()) {
            $pdf->addPage(); // Agrega una página solo si hay datos

            // Establecer la fuente antes de cualquier impresión
            $pdf->setFont('Arial', 'B', 11);
            // Se establece un color de relleno para los encabezados.
            $pdf->setFillColor(255, 192, 203);
            // Se imprimen las celdas con los encabezados.
            $pdf->cell(126, 10, 'Modelo', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Placa', 1, 0, 'C', 1);
            $pdf->cell(30, 10, 'Estado', 1, 1, 'C', 1);
            // Se establece la fuente para los datos de los productos.
            $pdf->setFont('Arial', '', 11);
            // Se recorren los registros fila por fila.
            foreach ($dataCitas as $rowAuto) {
                $estado = $rowAuto['estado_cita'];
                // Se imprimen las celdas con los datos de los productos.
                $pdf->cell(126, 10, $pdf->encodeString($rowAuto['modelo_automovil']), 1, 0);
                $pdf->cell(30, 10, $rowAuto['placa_automovil'], 1, 0);
                $pdf->cell(30, 10, $estado, 1, 1);
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
