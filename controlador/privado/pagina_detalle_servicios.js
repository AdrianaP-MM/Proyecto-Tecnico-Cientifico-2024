const SERVICIOS_API = 'services/privado/servicio.php';
const SERVICIO_DATA_CONTAINER = document.getElementById('ServicioDataContainer');
const CONTAINER_BOTONES = document.getElementById('containerBotones');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal(document.getElementById("staticBackdrop"));

const SAVE_FORM = document.getElementById('save_form'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    NOMBRE_SERVICIO = document.getElementById('nombre_servicio'),
    DESCRIPCION_SERVICIO = document.getElementById('descripcion_servicio');


// Función para obtener parámetros de la URL
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};

// Función principal para abrir el formulario de creación
async function openCreate() {
    // Se prepara el formulario.
    SAVE_FORM.reset();
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();

    const botonTres = document.getElementById("btnDelete");
    if (botonTres) {
        botonTres.remove();
    }
    number = 1;
}

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    const id_tipo_servicio = Number(getQueryParam('id_tipo_servicio'));
    if (id_tipo_servicio) {
        // Llama a la función para llenar los datos del servicio específico.
        await fillServiceData(id_tipo_servicio);
    } else {
        console.error('ID del servicio no especificado en los parámetros de la URL.');
    }
});



// Función para llenar los datos del servicio específico
const fillServiceData = async (id_tipo_servicio = Number(getQueryParam('id_tipo_servicio'))) => {
    // Limpia el contenedor antes de cargar nuevos datos.
    SERVICIO_DATA_CONTAINER.innerHTML = '';
    let html;

    const FORM = new FormData();
    FORM.append('id_tipo_servicio', id_tipo_servicio);

    const DATA = await fetchData(SERVICIOS_API, 'readOne', FORM);
    if (DATA.status) {
        const html = DATA.dataset.map(row => `
            <div class="col">
                <div class="card envelope-card" onclick="openUpdate(${row.id_servicio})">
                    <div class="card-body">
                        <h5 class="card-title">${row.nombre_servicio}</h5>
                        <p class="card-text">${row.descripcion_servicio}</p>
                    </div>
                </div>
            </div>
        `).join(''); // .join('') para convertir el array en un string

        // Inserta el HTML generado en el contenedor especificado.
        SERVICIO_DATA_CONTAINER.innerHTML = html;
    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
            await sweetAlert(4, DATA.error, true);
            location.href = 'index.html';
        } else {
            sweetAlert(4, DATA.error, true);
        }
    }
};

// Función para abrir el modal de actualización
const openUpdate = async (id) => {
    // Se abre el modal para cambiar la info del trabajador
    SAVE_MODAL.show();
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const formData = new FormData();
    formData.append("id_tipo_servicio", id); // Asegúrate de que 'id' sea el valor correcto del ID del trabajador

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(SERVICIOS_API, "readOneModal", formData);

    if (DATA.status) {
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        
        ID_TIPO_SERVICIO.value = id;
        NOMBRE_SERVICIO.value = row.nombre_servicio;
        DESCRIPCION_SERVICIO.value = row.descripcion_servicio;

        const botonTres = document.getElementById("btnDelete");
        if (botonTres) {
            botonTres.remove();
        }

        CONTAINER_BOTONES.innerHTML += `
              <button id="btnDelete" type="button" class="btn btn-dark mx-2" onclick="openDelete(${ID_TIPO_SERVICIO.value})">Eliminar</button>
        `;
    } else {
        sweetAlert(2, DATA.error, false);
    }
};

// Función para abrir el modal de eliminación
const openDelete = async (id) => {
    console.log('ID recibido para eliminar:', id); // Depuración

    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const response = await confirmAction2(
        "¿Desea eliminar al trabajador de forma permanente?"
    );
    // Se verifica la respuesta del mensaje.
    if (response.isConfirmed) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const formData = new FormData();
        formData.append("id_tipo_servicio", id);

        // Depuración: Mostrar todos los pares clave-valor en el formData
        for (let pair of formData.entries()) {
            console.log("Datos recibidos del form"+ pair[0] + ': ' + pair[1]);
        }

        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(SERVICIOS_API, "deleteRow", formData);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            SAVE_MODAL.hide();
            fillServiceData();
            // Eliminar el botón con id BotonTres
            const botonTres = document.getElementById("btnDelete");
            if (botonTres) {
                botonTres.remove();
            }
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
};


// Método del evento para cuando se envía el formulario de guardar
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario

    const action = ID_TIPO_SERVICIO.value ? 'updateRow' : 'createRow'; // Se verifica la acción a realizar
    const formData = new FormData(SAVE_FORM); // Constante tipo objeto con los datos del formulario

    // Obtener el valor del ID de tipo servicio adecuadamente según la acción
    let idTipoServicio;
    if (action === 'createRow') {
        idTipoServicio = Number(getQueryParam('id_tipo_servicio')); // Obtener ID para crear
    } else if (action === 'updateRow') {
        idTipoServicio = ID_TIPO_SERVICIO.value; // Obtener ID para actualizar
    }

    formData.append('id_tipo_servicio', idTipoServicio);

    try {
        const responseData = await fetchData(SERVICIOS_API, action, formData); // Petición para guardar los datos del formulario

        if (responseData.status) { // Se comprueba si la respuesta es satisfactoria
            SAVE_MODAL.hide(); // Se cierra la caja de diálogo
            sweetAlert(1, responseData.message, true); // Se muestra un mensaje de éxito
            fillServiceData(); // Se carga nuevamente la tabla para visualizar los cambios
        } else {
            sweetAlert(2, responseData.error, false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al guardar el servicio:', error);
        sweetAlert(4, 'No se pudo guardar el servicio.', false);
    }
});



// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {

    loadTemplate();

    // Agregar un evento de teclado al input del nombre del servicio
    NOMBRE_SERVICIO.addEventListener('input', function (event) {
        // Obtener el valor actual del input
        const valorInput = event.target.value;

        // Verificar si el valor contiene algún número
        if (/\d/.test(valorInput)) {
            // Si el valor contiene números, mostrar una alerta y borrar el contenido
            sweetAlert(3, 'El nombre del servicio no puede contener números', false);
            event.target.value = ''; // Borrar el contenido del input
        }
    });
});

function goBack() {
    window.history.back();
}

// Función que muestra la alerta de confirmación
const openClose = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        SAVE_MODAL.hide();
    }
}