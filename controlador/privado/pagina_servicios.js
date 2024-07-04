// Constante donde está la ruta del archivo PHP
const SERVICIOS_API = 'services/privado/tipo_servicio.php';
const CONTAINER_TRABAJADORES_BODY = document.getElementById('cardsServicios');

// Constantes para establecer los elementos del formulario
const SAVE_FORM = document.getElementById('save_form'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    NOMBRE = document.getElementById('nombre_tipo_servicio'),
    IMG_SERVICIO = document.getElementById('customFileW');


    const IMAGE_INPUT = document.getElementById('customFileW');

// Constantes para establecer los elementos del componente Modal
const MODAL = new bootstrap.Modal('#staticBackdrop');

// *Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    readServicios();
});

// Método del evento para cuando se envía el formulario de guardar
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario

    const action = ID_TIPO_SERVICIO.value ? 'updateRow' : 'createRow'; // Se verifica la acción a realizar
    const formData = new FormData(SAVE_FORM); // Constante tipo objeto con los datos del formulario
    formData.append('customFileW',  IMAGE_INPUT.value);

    try {
        const responseData = await fetchData(SERVICIOS_API, action, formData); // Petición para guardar los datos del formulario

        if (responseData.status) { // Se comprueba si la respuesta es satisfactoria
            MODAL.hide(); // Se cierra la caja de diálogo
            sweetAlert(1, responseData.message, true); // Se muestra un mensaje de éxito
            readServicios(); // Se carga nuevamente la tabla para visualizar los cambios
        } else {
            sweetAlert(2, responseData.error, false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al guardar el servicio:', error);
        sweetAlert(4, 'No se pudo guardar el servicio.', false);
    }
});

// Método para obtener y mostrar los servicios
async function readServicios() {
    try {
        const DATA = await fetchData(SERVICIOS_API, 'readAll'); // Petición para obtener los datos

        if (DATA && DATA.status) { // Se comprueba si la respuesta es satisfactoria
            DATA.dataset.forEach(row => {
                CONTAINER_TRABAJADORES_BODY.innerHTML += `
                    <div class="card-red shadow-sm z-2" onclick="gotoDetail(${row.id_tipo_servicio})">
                        <div class="content z-3">
                            <h4 class="open-sans-light-italic">Más información</h4>
                        </div>
                        <div class="img-container p-3">
                             <img src="${SERVER_URL}/images/tipoServicio/${row.imagen_servicio}" />
                        </div>
                        <div class="text-container d-flex justify-content-center p-2">
                            <h3 class="open-sans-regular text-white">${row.nombre_tipo_servicio}</h3>
                        </div>
                    </div>
                `;
            });
        } else {
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}

// Función para mostrar la imagen seleccionada en un elemento de imagen
function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImage.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

// Función para ir hacia la página de detalles del servicio
function gotoDetail(id_tipo_servicio) {
    location.href = `../../vistas/privado/pagina_detalle_servicios.html?id_tipo_servicio=${id_tipo_servicio}`;
}

// Función que muestra la alerta de confirmación
const openClose = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
    }
}

// Función que muestra la alerta de notificación
const openNoti = async () => {
    sweetAlert(1, 'Se ha guardado con éxito', 300);
    MODAL.hide();
}
