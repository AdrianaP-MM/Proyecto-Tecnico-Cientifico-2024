let inactivityTime;
const USER_API2 = 'services/privado/usuarios.php';

// // Función para verificar si han pasado 90 días desde la última modificación de la contraseña
// const checkPasswordExpiration = async () => {
//     const DATA = await fetchData(USER_API2, 'getPasswordLastChanged'); // Solicitar la fecha de última modificación al servidor
    
//     if (DATA.status) {
//         const lastChangedDate = new Date(DATA.fecha_ultima_modificacion); // Fecha de la última modificación
//         const currentDate = new Date();
        
//         // Calcular 90 días en milisegundos
//         const ninetyDaysInMillis = 90 * 24 * 60 * 60 * 1000;
        
//         // Si han pasado más de 90 días, cerrar la sesión
//         if (currentDate - lastChangedDate > ninetyDaysInMillis) {
//             await sweetAlert(2, 'Su contraseña ha expirado después de 90 días. Por favor, cambie su contraseña.', true);
//             handleLogout(); // Cierra la sesión si han pasado más de 90 días
//         }
//     } else {
//         sweetAlert(4, DATA.error, true); // Muestra error si no se puede obtener la fecha
//     }
// };

// Función para reiniciar el temporizador de inactividad
const resetTimer = () => {
    clearTimeout(inactivityTime);

    inactivityTime = setTimeout(async () => {
        await sweetAlert(4, 'Cierre de sesión por inactividad.');
        handleLogout(); // Cierra la sesión por inactividad
    }, 30000000); // 300000 ms = 5 minutos

    console.log('Temporizador reiniciado. Esperando 5 minutos de inactividad.');
}


// Función para cerrar la sesión
const handleLogout = async () => {
    const DATA = await fetchData(USER_API2, 'logOut');
    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
        window.location.href = 'index.html';
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

// Inicializar la verificación de inactividad y de expiración de contraseña
window.onload = () => {
    //checkPasswordExpiration(); // Verificar si la contraseña ha expirado al cargar la página
    resetTimer(); // Iniciar el temporizador de inactividad
};

document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
document.onclick = resetTimer;
