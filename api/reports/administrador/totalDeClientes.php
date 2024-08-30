<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/cliente_data.php');

// Se instancia la entidad correspondiente.
$cliente = new ClienteData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Total de clientes registrados');

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($dataCliente = $cliente->readAllReport()) {
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(199, 0, 57);
    // Se establece la fuente para los encabezados.
    $pdf->setFont('Arial', 'B', 11);
    // Establecer color de texto a blanco
    $pdf->setTextColor(255, 255, 255);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(35, 10, 'Fecha de registro', 1, 0, 'C', 1);
    $pdf->cell(25, 10, 'DUI', 1, 0, 'C', 1);
    $pdf->cell(35, 10, 'Nombre', 1, 0, 'C', 1);
    $pdf->cell(35, 10, 'Apellido', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Tipo de cliente', 1, 0, 'C', 1);
    $pdf->cell(20, 10, 'Estado', 1, 1, 'C', 1);
    // Se establece la fuente para los datos de los productos.
    $pdf->setFont('Arial', '', 11);
    // Establecer color de texto a blanco
    $pdf->setTextColor(0, 0, 0);
    // Se recorren los registros fila por fila.
    foreach ($dataCliente as $rowCliente) {
        // Se imprimen las celdas con los datos de los productos.
        $pdf->cell(35, 10, $pdf->encodeString($rowCliente['fecha_registro_cliente']), 1, 0);
        $pdf->cell(25, 10, $pdf->encodeString($rowCliente['dui_cliente']), 1, 0);
        $pdf->cell(35, 10, $pdf->encodeString($rowCliente['nombres_cliente']), 1, 0);
        $pdf->cell(35, 10, $pdf->encodeString($rowCliente['apellidos_cliente']), 1, 0);
        $pdf->cell(30, 10, $pdf->encodeString($rowCliente['tipo_cliente']), 1, 0);
        $pdf->cell(20, 10, $pdf->encodeString($rowCliente['estado_cliente']), 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No hay clientes para mostrar'), 1, 1);
}
// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'DARG - Gestion de clientes.pdf');

