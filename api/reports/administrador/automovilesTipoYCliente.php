<?php
// Inicia el buffer de salida
ob_start();
session_start(); // Asegúrate de iniciar la sesión si se usa $_SESSION

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

// Inicializar variable para verificar si se debe añadir una página
$shouldAddPage = false;

// Verificar los parámetros
if ($estadoCita && $duiCliente) {
    // Asigna los valores capturados a las propiedades del objeto usando los métodos setter
    if ($cita->setEstadoCita($estadoCita) && $cita->setIdCliente($duiCliente)) {
        // Leer los datos de las citas
        $dataCitas = $cita->readCitasParametrizada();
        // Verificar si hay datos
        if ($dataCitas) {
            // Marcar que se debe añadir una página
            $shouldAddPage = true;
        }
    }
}

// Añadir una página solo si hay datos para mostrar
if ($shouldAddPage) {
    // Se inicia el reporte con el encabezado del documento.
    $pdf->startReport('Citas de cliente por estado');

    // Establecer la fuente antes de cualquier impresión
    $pdf->setFont('Arial', 'B', 11);
    // Se establece un color de relleno para los encabezados.
    $pdf->setFillColor(186, 24, 27);
    // Se establece un color para el texto de los encabezados (por ejemplo, blanco)
    $pdf->setTextColor(255, 255, 255);
    // Se imprimen las celdas con los encabezados.
    $pdf->cell(65, 10, 'Nombre del cliente', 1, 0, 'C', 1);
    $pdf->cell(50, 10, 'Modelo del automovil', 1, 0, 'C', 1);
    $pdf->cell(40, 10, 'Fecha de cita', 1, 0, 'C', 1);
    $pdf->cell(30, 10, 'Estado de cita', 1, 1, 'C', 1);

    // Se establece la fuente para los datos de las citas.
    $pdf->setFont('Arial', '', 11);
    // Se establece un color de texto para los datos (por ejemplo, negro)
    $pdf->setTextColor(0, 0, 0);
    // Se recorren los registros fila por fila.
    foreach ($dataCitas as $rowCita) {
        $estado = $rowCita['estado_cita'];
        // Se imprimen las celdas con los datos de las citas.
        $pdf->cell(65, 10, $pdf->encodeString($rowCita['nombre_cliente']), 1, 0);
        $pdf->cell(50, 10, $pdf->encodeString($rowCita['modelo_automovil']), 1, 0);
        $pdf->cell(40, 10, $pdf->encodeString($rowCita['fecha_cita']), 1, 0);
        $pdf->cell(30, 10, $estado, 1, 1);
    }
} else {
    // Si no hay datos, añadir una página y mostrar el mensaje correspondiente
    $pdf->AddPage(); // Añade una página para mostrar el mensaje
    // Establecer la fuente y mostrar el mensaje de parámetros insuficientes o error
    $pdf->setFont('Arial', '', 11);
    $pdf->setTextColor(0, 0, 0); // Color de texto negro

    if (!$estadoCita || !$duiCliente) {
        $pdf->setFont('Arial', '', 11);
        $pdf->cell(0, 10, $pdf->encodeString('Parámetros insuficientes para generar el reporte'), 1, 1);
    } elseif (!$cita->setEstadoCita($estadoCita) || !$cita->setIdCliente($duiCliente)) {
        $pdf->setFont('Arial', '', 11);
        $pdf->cell(0, 10, $pdf->encodeString('Parámetros inválidos para generar el reporte'), 1, 1);
    } else {
        $pdf->setFont('Arial', '', 11);
        $pdf->cell(0, 10, $pdf->encodeString('No hay citas para mostrar con los parámetros proporcionados'), 1, 1);
    }
}

// Limpia el buffer de salida
ob_end_clean();

// Se llama implícitamente al método footer() y se envía el documento al navegador web.
$pdf->output('I', 'Reporte citas: Tipo automovil y cliente.pdf');
?>
