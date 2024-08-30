<?php
// Se incluye la clase con las plantillas para generar reportes.
require_once('../../helpers/report.php');

// Se instancia la clase para crear el reporte.
$pdf = new Report;

// Se incluyen las clases para la transferencia y acceso a datos.
require_once('../../models/data/automoviles_data.php');

// Se instancia la entidad correspondiente.
$auto = new AutomovilData;

// Se inicia el reporte con el encabezado del documento.
$pdf->startReport('Estado del automóvil, servicios y cantidad de visitas');

// Se obtiene el ID del automóvil desde la solicitud GET.
// Se obtiene el ID del automóvil desde la solicitud GET.
$id_automovil = isset($_GET['auto']) ? $_GET['auto'] : null;

// Se verifica si existen registros para mostrar, de lo contrario se imprime un mensaje.
if ($id_automovil) {
    // Llama a la función con el ID del automóvil.
    $dataAutos = $auto->reportEstadoAutomovil($id_automovil);

    if ($dataAutos) {
        // Se establece un color de relleno para los encabezados.
        $pdf->setFillColor(186, 24, 27);
        // Se establece la fuente para los encabezados.
        $pdf->setFont('Arial', 'B', 11);
        // Se imprimen las celdas con los encabezados.
        $pdf->cell(30, 10, 'Estado', 1, 0, 'C', 1);
        $pdf->cell(126, 10, 'Servicio', 1, 0, 'C', 1);
        $pdf->cell(30, 10, 'Veces reparado', 1, 1, 'C', 1);
        // Se establece la fuente para los datos de los productos.
        $pdf->setFont('Arial', '', 11);
        // Se recorren los registros fila por fila.
        foreach ($dataAutos as $rowAuto) {
            $estado = $rowAuto['Estado_Automovil']; // Cambiado para que coincida con el alias en la consulta SQL
            // Se imprimen las celdas con los datos de los productos.
            $pdf->cell(30, 10, $pdf->encodeString($estado), 1, 0);
            $pdf->cell(126, 10, $pdf->encodeString($rowAuto['Servicio']), 1, 0);
            $pdf->cell(30, 10, $rowAuto['Veces_Reparado'], 1, 1);
        }
    } else {
        $pdf->cell(0, 10, $pdf->encodeString('No hay autos para mostrar'), 1, 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->encodeString('No se ha proporcionado un ID de automóvil'), 1, 1);
}


// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'reporte_automoviles.pdf');
?>
