// Constante donde está la ruta del archivo PHP
const SERVICIOS_API = 'services/privado/tipo_servicio.php';
const CONTAINER_TRABAJADORES_BODY = document.getElementById('cardsServicios');

// Constantes para establecer los elementos del formulario
const SAVE_FORM = document.getElementById('save_form'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    NOMBRE = document.getElementById('nombre_tipo_servicio'),
    IMG_SERVICIO = document.getElementById('customFileW');

const USER_API = 'services/privado/usuarios.php';
const IMAGE_INPUT = document.getElementById('customFileW');

// Constantes para establecer los elementos del componente Modal
const MODAL = new bootstrap.Modal('#staticBackdrop');

// *Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
        readServicios();
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

const nombreServicioERROR = document.getElementById('nombreServicioERROR');

NOMBRE.addEventListener('input', function () {
    checkInput(validateName(NOMBRE.value), NOMBRE, nombreServicioERROR);
});

// Método del evento para cuando se envía el formulario de guardar
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario

    const action = ID_TIPO_SERVICIO.value ? 'updateRow' : 'createRow'; // Se verifica la acción a realizar
    const formData = new FormData(SAVE_FORM); // Constante tipo objeto con los datos del formulario
    formData.append('customFileW', IMAGE_INPUT.files[0]); // Usa files[0] para obtener el archivo

    try {
        const responseData = await fetchData(SERVICIOS_API, action, formData); // Petición para guardar los datos del formulario

        if (responseData.status) { // Se comprueba si la respuesta es satisfactoria
            MODAL.hide(); // Se cierra la caja de diálogo
            sweetAlert(1, responseData.message, true); // Se muestra un mensaje de éxito
            readServicios(); // Se carga nuevamente la tabla para visualizar los cambios

            SAVE_FORM.reset(); // Se vacían los campos del formulario

            // Limpiar el campo de archivo
            IMAGE_INPUT.value = '';

            // Restablecer la imagen a la original
            const selectedImage = document.getElementById('selectedImageW');
            if (selectedImage) {
                selectedImage.src = 'https://mdbootstrap.com/img/Photos/Others/placeholder.jpg'; // La URL de la imagen original
            }
        } else {
            sweetAlert(2, responseData.error, false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al guardar el servicio:', error);
        sweetAlert(4, 'No se pudo guardar el servicio.', false);
    }
});

//Importante
//Método del evento para cuando se envía el formulario de buscar.
document
    .getElementById("searchForm")
    .addEventListener("submit", async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();

        // Constante tipo objeto con los datos del formulario de barra de busqueda.
        const formData = new FormData(document.getElementById("searchForm"));

        // Verifica qué datos se están enviando
        console.log("Form Data:", Array.from(formData.entries()));

        try {
            // Realizar una solicitud al servidor para buscar trabajadores.
            const searchData = await fetchData(SERVICIOS_API, "searchRows", formData);

            // Verifica la respuesta del servidor
            console.log("Search Data:", searchData);

            // Verificar si la búsqueda fue exitosa.
            if (searchData.status) {
                // Limpiar el contenedor de trabajadores.
                CONTAINER_TRABAJADORES_BODY.innerHTML = "";

                // Se agrega la card para agregar usuario luego de vaciar el campo
                CONTAINER_TRABAJADORES_BODY.innerHTML += `
                <div class="add-auto-card d-flex justify-content-center align-items-center">
                <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow" data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop" alt="Add Service">
            </div>
            `;

                // Verificar si se encontraron resultados.
                if (searchData.dataset.length > 0) {
                    // Dependiendo los resultados de cada línea se muestran en el contenedor.
                    for (const row of searchData.dataset) {
                        const imageUrl = `${SERVER_URL}/images/tipoServicio/${row.imagen_servicio}`;
                        const imageExists = await checkImageExists(imageUrl);
                        const imgSrc = imageExists ? imageUrl : `${SERVER_URL}/images/tipoServicio/mecanica.png`;

                        CONTAINER_TRABAJADORES_BODY.innerHTML += `
                        <div id="card" class="card-red shadow-sm z-2"">
                        <div class="img-container p-3">
                             <img src="${imgSrc}" />
                        </div>
                        <div class="text-container d-flex justify-content-center p-2">
                            <h3 class="open-sans-regular text-white">${row.nombre_tipo_servicio}</h3>
                        </div>
                    </div>
                        `;
                    }
                } else {
                    // Mostrar si no se encontró ningún resultado.
                    sweetAlert(4, "No se encontraron resultados", false);
                }
            } else {
                // Mostrar si no se encontró ningún resultado en base de un error.
                sweetAlert(4, "No se encontraron resultados", false);
            }
        } catch (error) {
            console.error("Error al buscar servicios:", error);
            // Loguea un error si este lo presenta.
        }
    });

// Método para obtener y mostrar los servicios
async function checkImageExists(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = imageUrl;
    });
}

async function readServicios() {
    try {
        const DATA = await fetchData(SERVICIOS_API, 'readAll'); // Petición para obtener los datos

        if (DATA && DATA.status) { // Se comprueba si la respuesta es satisfactoria
            for (const row of DATA.dataset) {
                const imageUrl = `${SERVER_URL}/images/tipoServicio/${row.imagen_servicio}`;
                const imageExists = await checkImageExists(imageUrl);
                const imgSrc = imageExists ? imageUrl : `${SERVER_URL}/images/tipoServicio/mecanica.png`;

                CONTAINER_TRABAJADORES_BODY.innerHTML += `
                    <div id="card" class="card-red shadow-sm z-2" onclick="gotoDetail(${row.id_tipo_servicio})">
                        <div class="img-container p-3">
                             <img src="${imgSrc}" />
                        </div>
                        <div class="text-container d-flex justify-content-center p-2">
                            <h3 class="open-sans-regular text-white">${row.nombre_tipo_servicio}</h3>
                        </div>
                    </div>
                `;
            }
        } else {
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}


function displaySelectedImage(event, elementId) {
    const selectedImage = document.getElementById(elementId);
    const fileInput = event.target;

    // Ruta de la imagen por defecto
    const defaultImage = '../../api/images/tipoServicio/mecanica.png';

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedImage.src = e.target.result;
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // Si no se ha seleccionado ninguna imagen, usa la imagen por defecto
        selectedImage.src = defaultImage;
    }
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated')
        }, false)
    })
})()


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

document
    .getElementById("nombre_tipo_servicio")
    .addEventListener("input", function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar espacios en blanco
        inputValue = inputValue.replace(/\d/g, "");

        // Asegurar que el correo electrónico no supere los 50 caracteres
        inputValue = inputValue.slice(0, 50);

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;
    });

// Función que muestra la alerta de notificación
const openNoti = async () => {
    sweetAlert(1, 'Se ha guardado con éxito', 300);
    MODAL.hide();
}
