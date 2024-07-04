//Constante donde esta la ruta del archivo php
const SERVICIOS_API = 'services/privado/tipo_servicio.php';

// Constante para establecer el cuerpo de la tabla.
const CONTAINER_TRABAJADORES_BODY = document.getElementById('cardsServicios');



const ADD_FORM = document.getElementById('addForm'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    NOMBRE = document.getElementById('input_nombre'),
    imagen = document.getElementById('input_imagen');

// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#staticBackdrop');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    readServicios();
});


// Método del evento para cuando se envía el formulario de guardar.
ADD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_TIPO_SERVICIO) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(ADD_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(SERVICIOS_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});


const addSave = async () => {
    const isValid = await checkFormValidity(ADD_FORM);
    if (isValid) {
        const FORM = new FormData(ADD_FORM);
        const DATA = await fetchData(SERVICIOS_API, 'createRow', FORM);

        if (DATA.status) {
            sweetAlert(1, 'Se ha guardado con éxito', 300);
            readServicios(); // Actualizar la tabla de servicios
            MODAL.hide();
            resetForm();
            ADD_FORM.classList.remove('was-validated');
        } else {
            if (DATA.error === 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                await sweetAlert(4, DATA.error, true);
                location.href = 'index.html';
            } else {
                sweetAlert(4, DATA.error, true);
            }
        }
    } else {
        console.log('Formulario no válido');
    }
};









//Método para hacer el select a la base de los trabajadores disponibles
async function readServicios() {
    try {
        // Petición para obtener los datos del pedido en proceso.
        const DATA = await fetchData(SERVICIOS_API, 'readAll');

        // Debug: Verificar el contenido de DATA
        console.log(DATA);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA && DATA.status) {
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                CONTAINER_TRABAJADORES_BODY.innerHTML += `
                    <div class="card-red shadow-sm z-2" onclick="gotoDetail(${row.id_tipo_servicio})"">
                        <div class="content z-3">
                            <h4 class="open-sans-light-italic">Màs informaciòn</h4>
                        </div>
                        <div class="img-container p-3">
                            <img src="../../recursos/imagenes/img_servicios/mecanica.png">
                        </div>
                        <div class="text-container d-flex justify-content-center p-2">
                            <h3 class="open-sans-regular text-white">${row.nombre_tipo_servicio}</h3>
                        </div>
                    </div>
                `;
            });
        } else {
            // Si DATA no tiene el formato esperado, muestra un mensaje de error.
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false);
        }
    } catch (error) {
        // Manejo de errores: muestra un mensaje si ocurre un error en la petición.
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}



// Funcion para ir hacia la pagina de detalles del automovil
function gotoDetail(id_tipo_servicio) {
    location.href = `../../vistas/privado/pagina_detalle_servicios.html?id_servicio=${id_tipo_servicio}`;
}


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

//Funcion que muestra la alerta de confirmacion
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
    }
}
//Funcion que muestra la alerta de notificacion
const openNoti = async () => {
    // Llamada a la función para mostrar una notificación
    sweetAlert(1, 'Se ha guardado con exito', 300);
    MODAL.hide();
}
