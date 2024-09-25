let inactivityTime; 
const USER_API2 = 'services/privado/usuarios.php';

// Función para reiniciar el temporizador
const resetTimer = () => {
    clearTimeout(inactivityTime);

    inactivityTime = setTimeout(() => {
        console.log('Cierre de sesión por inactividad.');
        handleLogout(); // Cambiar el nombre de la función aquí
    }, 30000000); // 300000 ms = 5 minutos

    console.log('Temporizador reiniciado. Esperando 5 minutos de inactividad.');
}

// Función de cierre de sesión
const handleLogout = async () => { // Cambiar el nombre de la función aquí
    const DATA = await fetchData(USER_API2, 'logOut');
    if (DATA.status) {
        sweetAlert(1, DATA.message, true);
        window.location.href = 'index.html';
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

window.onload = resetTimer;
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
document.onclick = resetTimer;
