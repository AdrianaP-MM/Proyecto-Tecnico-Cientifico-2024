// Tiempo máximo de inactividad en milisegundos (ejemplo: 30 minutos)
// Convertir minutos a milisegundos
var minutos = 1;
var inactivity_timeout = minutos * 60 * 1000; // minutos en milisegundos

// Variable para almacenar el tiempo de la última acción del usuario
var last_activity_time = Date.now();

// Función para verificar la inactividad
function checkInactivity() {
    var current_time = Date.now();
    var inactive_time = current_time - last_activity_time;

    if (inactive_time > inactivity_timeout) {
        // Redirigir o cerrar sesión aquí
        window.location.href = 'logout.php'; // Archivo PHP para cerrar sesión
    } else {
        // Actualizar el tiempo de la última acción
        last_activity_time = current_time;
    }
}

// Ejecutar la función checkInactivity cada minuto
setInterval(checkInactivity, 60000); // Cada 1 minuto (60000 milisegundos)
