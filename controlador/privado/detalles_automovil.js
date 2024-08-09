// Constantes para completar las rutas de la API.
const AUTOMOVILES_API = 'services/privado/automoviles.php';
// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#staticBackdrop2');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_AUTOMOVIL = document.getElementById('idAuto'),
    IMG = document.getElementById('customFile2'),
    IMAGEN = document.getElementById('selectedImageA'),
    MODELO = document.getElementById('input_modelo_auto'),
    TIPO_AUTO = document.getElementById('input_tipo_auto'),
    FECHA_FABRICACION = document.getElementById('fechanInput'),
    COLOR = document.getElementById('input_color_auto'),
    PLACA = document.getElementById('input_placa'),
    CLIENTE = document.getElementById('input_duiP');
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

/*
*   Función asíncrona para preparar el formulario al momento de actualizar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openUpdate = async () => {
    // Se define un objeto con los datos del registro seleccionado.
    const FORM = new FormData();
    FORM.append('idAuto', PARAMS.get('id'));
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(AUTOMOVILES_API, 'readOne', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se muestra la caja de diálogo con su título.
        MODAL.show();
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_AUTOMOVIL.value = ROW.id_automovil;
        fillSelect(AUTOMOVILES_API, 'readModelos', 'input_modelo_auto', ROW.id_modelo_automovil);
        fillSelect(AUTOMOVILES_API, 'readTipos', 'input_tipo_auto', ROW.id_tipo_automovil);
        fillSelect(AUTOMOVILES_API, 'readColores', 'input_color_auto', ROW.id_color);
        fillSelect(AUTOMOVILES_API, 'readClientes', 'input_duiP', ROW.id_cliente);
        PLACA.value = ROW.placa_automovil;
        FECHA_FABRICACION.value = ROW.fecha_fabricacion_automovil;
        IMAGEN.src = SERVER_URL.concat('images/automoviles/', ROW.imagen_automovil);
    } else {
        sweetAlert(2, DATA.error, false);
    }
}


// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    // Constante tipo objeto con los datos del producto seleccionado.
    const FORM = new FormData();
    FORM.append('idAuto', PARAMS.get('id'));
    // Petición para solicitar los datos del producto seleccionado.
    const DATA = await fetchData(AUTOMOVILES_API, 'readDetail', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se colocan los datos en la página web de acuerdo con el producto seleccionado previamente.
        document.getElementById('imagenCarro').src = SERVER_URL.concat('images/automoviles/', DATA.dataset.imagen_automovil);
        document.getElementById('cliente').textContent = DATA.dataset.nombre_cliente;
        document.getElementById('dui').textContent = DATA.dataset.dui_cliente;
        document.getElementById('color').textContent = DATA.dataset.color_automovil;
        document.getElementById('modelo').textContent = DATA.dataset.modelo_automovil;
        document.getElementById('tipo').textContent = DATA.dataset.nombre_tipo;
        document.getElementById('fecha').textContent = DATA.dataset.fecha_fabricacion_automovil;
        document.getElementById('fechaR').textContent = DATA.dataset.fecha_registro;
        document.getElementById('placa').textContent = DATA.dataset.placa_automovil;
    } else {
        console.log('No se pudieron cargar los datos');
    }
});


// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    const idParam = PARAMS.get('id');
    const id = parseInt(idParam, 10);
    console.log(id);
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    FORM.append('idAutomovil', id)
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(AUTOMOVILES_API, 'updateRow', FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

function goBack() {
    window.history.back();
}

function gotoDetailsServ() {
    location.href = '../../vistas/privado/detalles_servicios_automovil.html'
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Desea eliminar el automóvil de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE.isConfirmed) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAuto', PARAMS.get('id'));
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(AUTOMOVILES_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            MODAL.hide();
            await sweetAlert(1, DATA.message, true);
            location.href = '../../vistas/privado/automoviles.html'
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
    }
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

document.getElementById('input_placa').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número ni una letra
    inputValue = inputValue.replace(/[^A-Za-z0-9]/g, '');

    // Limitar la longitud máxima a 8 caracteres
    inputValue = inputValue.slice(0, 7);

    // Formatear el texto como "11a1-111"
    let formattedValue = '';

    if (inputValue.length > 4) {
        formattedValue += inputValue.slice(0, 4) + '-';
        inputValue = inputValue.slice(4);
    }

    // Agregar el último grupo de dígitos
    if (inputValue.length > 0) {
        formattedValue += inputValue;
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = formattedValue;

    // Validar y agregar la clase 'invalid' si es necesario
    event.target.classList.toggle('invalid', !/^\d{4}-\d{2}-\d{2}$/.test(formattedValue));
});


document.getElementById('input_duiP').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guión antes del último dígito si hay al menos dos dígitos
    if (inputValue.length > 1) {
        inputValue = inputValue.slice(0, -1) + '-' + inputValue.slice(-1);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});


IMG.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            IMAGEN.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});