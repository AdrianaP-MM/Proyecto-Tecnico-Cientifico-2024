// Constante para completar la ruta de la API.
const SERVICIOS_API = 'services/privado/servicio.php';

const SERVICIO_DATA_CONTAINER = document.getElementById('ServicioDataContainer');

const CONTAINER_BOTONES = document.getElementById('containerBotones');

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal("#staticBackdrop");

const SAVE_FORM = document.getElementById('save_form'),
    ID_TIPO_SERVICIO = document.getElementById('id_tipo_servicio'),
    NOMBRE_SERVICIO = document.getElementById('nombre_servicio'),
    DESCRIPCION_SERVICIO = document.getElementById('descripcion_servicio');

// Función para obtener parámetros de la URL
const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
};


const checkFormValidity = form => {
    const validities = [];
    Array.from(form.elements).forEach(element => {
        // Verificar si el campo está visible
        const isVisible = !element.classList.contains('d-none');
        // Verificar si el campo es un elemento de formulario (input, select, textarea)
        const isFormElement = ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);

        if (isVisible && isFormElement) {
            validities.push(element.checkValidity());
            console.log(`Elemento: ${element.id}, Validez: ${element.checkValidity()}, Mensaje de error: ${element.validationMessage}`);
        }
    });

    return validities.every(valid => valid); // Retorna true si todos los elementos son válidos.
};

// Método del evento para cuando se envía el formulario de guardar
SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Se evita recargar la página web después de enviar el formulario

    const action = ID_TIPO_SERVICIO.value ? 'updateRow' : 'createRow'; // Se verifica la acción a realizar
    const formData = new FormData(SAVE_FORM); // Constante tipo objeto con los datos del formulario
    formData.append('id_tipo_servicio', Number(getQueryParam('id_tipo_servicio')))

    try {
        const responseData = await fetchData(SERVICIOS_API, action, formData); // Petición para guardar los datos del formulario

        if (responseData.status) { // Se comprueba si la respuesta es satisfactoria
            MODAL.hide(); // Se cierra la caja de diálogo
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
    const id_tipo_servicio = Number(getQueryParam('id_tipo_servicio'));
    if (id_tipo_servicio) {
        // Llama a la función para llenar los datos del servicio específico.
        await fillServiceData(id_tipo_servicio);
    } else {
        console.error('ID del servicio no especificado en los parámetros de la URL.');
    }
});

const fillServiceData = async (id_tipo_servicio = Number(getQueryParam('id_tipo_servicio'))) => {
    // Limpia el contenedor antes de cargar nuevos datos.
    SERVICIO_DATA_CONTAINER.innerHTML = '';
    let html;

    const FORM = new FormData();
    FORM.append('id_tipo_servicio', id_tipo_servicio);

    const DATA = await fetchData(SERVICIOS_API, 'readOne', FORM);
    if (DATA.status) {
        DATA.dataset.forEach(row => {
            html += `
            <div class="col">
                <div class="card envelope-card" onclick="openUpdate(${row.id_servicio})">
                    <div class="card-body">
                        <h5 class="card-title">${row.nombre_servicio}</h5>
                        <p class="card-text">${row.descripcion_servicio}</p>
                    </div>
                </div>
            </div>
        `;
        });


        // Inserta el HTML generado en el contenedor especificado.
        SERVICIO_DATA_CONTAINER.innerHTML = html;
    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
            await sweetAlert(4, DATA2.error, true); location.href = 'index.html'
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
        //location.href = '../../vistas/privado/pagina_servicios.html';
    }
};

const openUpdate = async (id) => {
    // Se abre el modal para cambiar la info del trabajador
    SAVE_MODAL.show();

    // Se le asigna el id recibido del select anterior
    ID_TIPO_SERVICIO.value = id;

    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const formData = new FormData();
    formData.append("id_servicio", id); // Asegúrate de que 'id' sea el valor correcto del ID del trabajador

    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(SERVICIOS_API, "readOneModal", formData);

    // Mostrar los valores de los campos del FormData en la consola.
    for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
    }

    if (DATA.status) {
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se muestra la caja de diálogo con su título.
        SAVE_MODAL.show();
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        ID_TIPO_SERVICIO.value = row.id_tipo_servicio;
        NOMBRE_SERVICIO.value = row.nombre_servicio;
        DESCRIPCION_SERVICIO.value = row.descripcion_servicio;

        CONTAINER_BOTONES.innerHTML += `
              <button id="btnDelete" type="button" class="btn btn-dark mx-2" onclick="openDelete(${row.row.id_servicio})">Eliminar</button>
              `;
    } else {
        sweetAlert(2, DATA.error, false);
    }

    // Se asigna la variable para cambiar el dialogo de la alerta
    number = 2;

};

const openDelete = async (id) => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const response = await confirmAction2(
        "¿Desea eliminar al trabajador de forma permanente?"
    );
    // Se verifica la respuesta del mensaje.
    if (response.isConfirmed) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const formData = new FormData();
        formData.append("id_servicio", id);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(SERVICIOS_API, "deleteRow", formData);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            // Se abre el modal para cambiar la info del trabajador
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



// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {

    // Agregar un evento de teclado al input del nombre del servicio
    NOMBRE_SERVICIO.addEventListener('input', function (event) {
        // Obtener el valor actual del input
        let currentValue = event.target.value;

        // Verificar si la longitud del valor actual excede 50 caracteres
        if (currentValue.length > 50) {
            // Establecer el valor del input al substring de los primeros 50 caracteres
            event.target.value = currentValue.slice(0, 50);
        }
    });

    // Permitir borrar pero no ingresar números en el campo de nombre del servicio
    NOMBRE_SERVICIO.addEventListener('keydown', function (event) {
        // Obtener el código de la tecla presionada
        const keyCode = event.keyCode || event.which;

        // Permitir retroceder (Backspace) y eliminar (Delete)
        if (keyCode === 8 || keyCode === 46) {
            return; // Permitir estas teclas sin restricciones
        }

        // Verificar si la tecla presionada es un número
        const isNumber = /^[0-9]$/.test(event.key);

        // Si la tecla es un número, prevenir la acción predeterminada
        if (isNumber) {
            event.preventDefault();
        }
    });



    // Agregar un evento de teclado al input de la descripción del servicio
    DESCRIPCION_SERVICIO.addEventListener('input', function (event) {
        // Obtener el valor actual del input
        let currentValue = event.target.value;

        // Verificar si la longitud del valor actual excede 50 caracteres
        if (currentValue.length > 50) {
            // Establecer el valor del input al substring de los primeros 50 caracteres
            event.target.value = currentValue.slice(0, 50);
        }
    });

    // Permitir borrar pero no ingresar números en el campo de descripción del servicio
    DESCRIPCION_SERVICIO.addEventListener('keydown', function (event) {
        // Obtener el código de la tecla presionada
        const keyCode = event.keyCode || event.which;

        // Permitir retroceder (Backspace) y eliminar (Delete)
        if (keyCode === 8 || keyCode === 46) {
            return; // Permitir estas teclas sin restricciones
        }

        // Verificar si la tecla presionada es un número
        const isNumber = /^[0-9]$/.test(event.key);

        // Si la tecla es un número, prevenir la acción predeterminada
        if (isNumber) {
            event.preventDefault();
        }
    });
});

function goBack() {
    window.history.back();
}

const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        SAVE_MODAL.hide();
    }
}

const openNoti = async () => {
    // Llamada a la función para mostrar una notificación
    sweetAlert(1, 'Se ha guardado con exito', 300);
    SAVE_MODAL.hide();
}

