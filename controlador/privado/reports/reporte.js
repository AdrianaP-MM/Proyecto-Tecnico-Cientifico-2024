// Constantes para completar las rutas de la API.
const AUTOMOVILES_API = 'services/privado/automoviles.php';

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Se establece el título del contenido principal.
    // Llamada a la función para llenar la tabla con los registros existentes.
});

/*
*   Función para abrir un reporte automático de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openReportAutos = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/automoviles.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
}
