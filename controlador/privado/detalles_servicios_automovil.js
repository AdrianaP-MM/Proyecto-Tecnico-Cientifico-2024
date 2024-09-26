const CARDS_SERVICIOS = document.getElementById('container-cards');
const DETAILS = document.getElementById('contenedor-details');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    loadTemplate();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

function goBack() {
    window.history.back();
}
function showDetails() {
    CARDS_SERVICIOS.classList.add('d-none');
    DETAILS.classList.remove('d-none');
}

function Return() {
    CARDS_SERVICIOS.classList.remove('d-none');
    DETAILS.classList.add('d-none');
}