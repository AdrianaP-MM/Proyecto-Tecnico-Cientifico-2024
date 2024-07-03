// Llamada al PHP donde se encuentra el método
const USER_API = 'services/privado/usuarios.php';

CORREO = document.getElementById('correoUsuario');
TELEFONO = document.getElementById('telefonoUsuario');
SAVE_FORM = document.getElementById('inputUsuario');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#staticBackdrop');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    readUsuarios();
});


async function readUsuarios() {
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USER_API, 'readProfile');

    if (DATA.status) {
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        CORREO.value = row.correo_usuario;
        TELEFONO.value = row.telefono_usuario;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función para abrir el modal de actualización
async function updateUsuarios() {
    // Petición para obtener los datos del registro solicitado.
    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(document.getElementById('searchForm'));
    const DATA = await fetchData(USER_API, 'editProfile', formData);

    if (DATA.status) {
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        CORREO.value = row.correo_usuario;
        TELEFONO.value = row.telefono_usuario;
    } else {
        sweetAlert(2, DATA.error, false);
    }
}

// Función para mostrar un mensaje de confirmación y redirigir
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán actualizados');
    if (RESPONSE.isConfirmed) {
        location.href = '../../vistas/privado/panel_principal.html';
    }
}

// Función para mostrar una notificación
const openNoti = async () => {
    // Llamada a la función para mostrar una notificación
    sweetAlert(1, 'Se ha actualizado con éxito', 300);
}

// Función para cerrar sesión
const openLogout = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Está seguro de cerrar la sesión?');
    if (RESPONSE.isConfirmed) {
        location.href = '../../vistas/privado/index.html';
    }
}

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();


    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(SAVE_FORM);

    // Petición para guardar los datos del formulario.
    const responseData = await fetchData(USER_API, 'editProfile', formData);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (responseData.status) {
        // Se muestra un mensaje de éxito.
        sweetAlert(1, responseData.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        readUsuarios();
    } else {
        sweetAlert(2, responseData.error, false);
    }
});

const openPassword = async () => {

    // Se abre el modal para cambiar la info del trabajador
    SAVE_MODAL.show();

    

}