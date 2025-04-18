const SERVICIOS_API = 'services/privado/servicio.php';
const USER_API = 'services/privado/usuarios.php';
const TIPOS_API = 'services/privado/tipo_servicio.php';
const SERVICIO_DATA_CONTAINER = document.getElementById('ServicioDataContainer');
const CONTAINER_BOTONES = document.getElementById('containerBotones');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal(document.getElementById("staticBackdrop"));
const SAVE_MODAL_2 = new bootstrap.Modal(document.getElementById("staticBackdrop2"));

const SAVE_FORM = document.getElementById('save_form'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    CURRENTIMG = document.getElementById('currentImage'),
    NOMBRE_SERVICIO = document.getElementById('nombre_servicio'),
    DESCRIPCION_SERVICIO = document.getElementById('descripcion_servicio');


// Constantes para establecer los elementos del formulario
const SAVE_FORM_2 = document.getElementById('save_form_2'),
    NOMBRE = document.getElementById('nombre_tipo_servicio'),
    IMG_SERVICIO = document.getElementById('selectedImageW');

const IMAGE_INPUT = document.getElementById('customFileW');
const SEARCH_INPUT = document.getElementById('search');

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

const nombreDetalleServicioERROR = document.getElementById('nombreDetalleServicioERROR');
const descripcionDetalleServicioERROR = document.getElementById('descripcionDetalleServicioERROR');
const nombreServicioERROR = document.getElementById('nombreServicioERROR');

NOMBRE_SERVICIO.addEventListener('input', function () {
    checkInput(validateName(NOMBRE_SERVICIO.value), NOMBRE_SERVICIO, nombreDetalleServicioERROR);
});

DESCRIPCION_SERVICIO.addEventListener('input', function () {
    checkInput(validateName(DESCRIPCION_SERVICIO.value), DESCRIPCION_SERVICIO, descripcionDetalleServicioERROR);
});

NOMBRE.addEventListener('input', function () {
    checkInput(validateName(NOMBRE.value), NOMBRE, nombreServicioERROR);
});


// Función para llenar los datos del servicio específico
const fillServiceData = async (id_tipo_servicio = Number(getQueryParam('id_tipo_servicio'))) => {
    let html;
    const FORM = new FormData();
    FORM.append('id_tipo_servicio', id_tipo_servicio);

    const DATA = await fetchData(SERVICIOS_API, 'readOne', FORM);
    SERVICIO_DATA_CONTAINER.innerHTML = "";

    // Se agrega la card para agregar usuario luego de vaciar el campo
    SERVICIO_DATA_CONTAINER.innerHTML += `
            <div class="add-auto-card d-flex justify-content-center align-items-center mx-3">
                <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow"
                onclick="openCreate()">
            </div>`;

    if (DATA.status) {
        const html = DATA.dataset.map(row => `
            <div class="card envelope-card mx-2" onclick="openUpdate(${row.id_servicio})">
                <div class="card-body">
                    <h5 class="card-title">${row.nombre_servicio}</h5>
                    <p class="card-text">${row.descripcion_servicio}</p>
                </div>
            </div>
        `).join(''); // .join('') para convertir el array en un string

        // Inserta el HTML generado en el contenedor especificado.
        SERVICIO_DATA_CONTAINER.innerHTML += html;
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
            <button type="button" class="btn btn-secondary btnCancel2 me-5" 
                                    onclick="openDelete(${ID_TIPO_SERVICIO.value})">Eliminar</button>
        `;
    } else {
        sweetAlert(2, DATA.error, false);
    }
};

// Función para mostrar la imagen seleccionada en un elemento de imagen.
function displaySelectedImage(event, elementId) {
    // Obtiene el elemento de imagen según su ID.
    const selectedImage = document.getElementById(elementId);
    // Obtiene el elemento de entrada de archivo del evento.
    const fileInput = event.target;

    // Verifica si hay archivos seleccionados y al menos uno.
    if (fileInput.files && fileInput.files[0]) {
        // Crea una instancia de FileReader para leer el contenido del archivo.
        const reader = new FileReader();

        // Define el evento que se ejecutará cuando la lectura sea exitosa.
        reader.onload = function (e) {
            // Establece la fuente de la imagen como el resultado de la lectura (base64).
            selectedImage.src = e.target.result;
        };

        // Inicia la lectura del contenido del archivo como una URL de datos.
        reader.readAsDataURL(fileInput.files[0]);
    }
}


// Función para abrir el modal de actualización
const openUpdateService = async () => {
    // Obtener el valor del ID de tipo servicio adecuadamente según la acción
    let idTipoServicio;
    idTipoServicio = Number(getQueryParam('id_tipo_servicio')); // Obtener ID para crear
    // Se abre el modal para cambiar la info del trabajador
    SAVE_MODAL_2.show();
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const formData = new FormData();
    formData.append("id_tipo_servicio", idTipoServicio); // Asegúrate de que 'id' sea el valor correcto del ID del trabajador

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(TIPOS_API, "readOne", formData);

    if (DATA.status) {
        // Se prepara el formulario.
        SAVE_FORM_2.reset();
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL_2.show();
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        NOMBRE.value = row.nombre_tipo_servicio;
        IMG_SERVICIO.src = SERVER_URL.concat('images/tipoServicio/', row.imagen_servicio);
        CURRENTIMG.value = row.imagen_servicio;


        const botonTres = document.getElementById("btnDelete");
        if (botonTres) {
            botonTres.remove();
        }

        CONTAINER_BOTONES.innerHTML += `
            <button id="btnDelete" type="button" class="btn btn-dark mx-2" onclick="openDeleteServicio(${idTipoServicio})">Eliminar</button>
        `;
    } else {
        sweetAlert(2, DATA.error, false);
    }
};

//Método del evento para cuando se envía el formulario de buscar.
document
    .getElementById("searchForm")
    .addEventListener("submit", async (event) => {
        // Se evita recargar la página web después de enviar el formulario.
        event.preventDefault();
        if (SEARCH_INPUT.value === '') {
            await fillServiceData();
        }
        else {
            let idTipoServicio;
            idTipoServicio = Number(getQueryParam('id_tipo_servicio')); // Obtener ID para crear

            // Constante tipo objeto con los datos del formulario de barra de busqueda.
            const formData = new FormData(document.getElementById("searchForm"));
            formData.append("id_tipo_servicio", idTipoServicio);

            try {
                // Realizar una solicitud al servidor para buscar trabajadores.
                const searchData = await fetchData(SERVICIOS_API, "buscarRows", formData);
                // Limpiar el contenedor de trabajadores.
                SERVICIO_DATA_CONTAINER.innerHTML = "";

                // Se agrega la card para agregar usuario luego de vaciar el campo
                SERVICIO_DATA_CONTAINER.innerHTML += `
                    <div class="add-auto-card d-flex justify-content-center align-items-center mx-3">
                        <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow"
                        onclick="openCreate()">
                    </div>`;

                // Verificar si la búsqueda fue exitosa.
                if (searchData.status) {
                    // Verificar si se encontraron resultados.
                    if (searchData.dataset.length > 0) {
                        // Dependiendo los resultados de cada línea se muestran en el contenedor.
                        for (const row of searchData.dataset) {
                            SERVICIO_DATA_CONTAINER.innerHTML += `
                            <div class="card envelope-card mx-2" onclick="openUpdate(${row.id_servicio})">
                                <div class="card-body">
                                    <h5 class="card-title">${row.nombre_servicio}</h5>
                                    <p class="card-text">${row.descripcion_servicio}</p>
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


// Función para abrir el modal de eliminación
const openDelete = async (id) => {

    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const response = await confirmAction2(
        "¿Desea eliminar el servicio de forma permanente?"
    );
    // Se verifica la respuesta del mensaje.
    if (response.isConfirmed) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const formData = new FormData();
        formData.append("id_tipo_servicio", id);

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

            location.reload();
        } else {
            if (!DATA.exception) {
                sweetAlert(2, DATA.error, false);
            }
            else {
                sweetAlert(2, 'El servicio esta siendo utilizado, por lo que no se puede eliminar.', false);
            }
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
            await sweetAlert(1, responseData.message, true); // Se muestra un mensaje de éxito
            fillServiceData(); // Se carga nuevamente la tabla para visualizar los cambios
            location.reload();
        } else {
            sweetAlert(2, responseData.error, false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al guardar el servicio:', error);
        sweetAlert(4, 'No se pudo guardar el servicio.', false);
    }
});



// Método del evento para cuando se envía el formulario de guardar
SAVE_FORM_2.addEventListener('submit', async (event) => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario

    const formData = new FormData(SAVE_FORM_2); // Constante tipo objeto con los datos del formulario
    formData.append('imagen_servicio', IMAGE_INPUT.files[0]); // Usa files[0] para obtener el archivo
    // Obtener el valor del ID de tipo servicio adecuadamente según la acción
    let idTipoServicio;
    idTipoServicio = Number(getQueryParam('id_tipo_servicio')); // Obtener ID para crear
    formData.append('id_tipo_servicio', idTipoServicio);

    // Verificar si se seleccionó un archivo en el input de la imagen.
    const fileInput = document.getElementById('customFileW');
    if (fileInput.files.length === 0) {
        // No hay imagen seleccionada, asignar la imagen actual almacenada en el input oculto.
        const currentImage = document.getElementById('currentImage').value;
        formData.append('imagenActual', currentImage); // Enviar el nombre de la imagen actual para manejarlo en PHP.
    }

    try {
        const responseData = await fetchData(TIPOS_API, 'updateRow', formData); // Petición para guardar los datos del formulario
        if (responseData.status) { // Se comprueba si la respuesta es satisfactoria
            SAVE_MODAL_2.hide(); // Se cierra la caja de diálogo
            await sweetAlert(1, responseData.message, true); // Se muestra un mensaje de éxito

            SAVE_FORM_2.reset(); // Se vacían los campos del formulario

            // Limpiar el campo de archivo
            IMAGE_INPUT.value = '';

            location.reload();
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
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
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

    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

function goBack() {
    window.history.back();
}

// Función que muestra la alerta de confirmación
const openClose = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        SAVE_MODAL.hide();
        SAVE_MODAL_2.hide();
        location.reload();
    }
}