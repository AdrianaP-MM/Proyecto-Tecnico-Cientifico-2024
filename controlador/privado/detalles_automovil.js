// Constantes para completar las rutas de la API.
const AUTOMOVILES_API = 'services/privado/automoviles.php';
const USER_API = 'services/privado/usuarios.php';

// Constante para establecer el formulario de buscar.
const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#staticBackdrop2');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    REPORTEAUTOMOVIL = document.getElementById('idAutoReport'),
    ID_AUTOMOVIL = document.getElementById('idAuto'),
    IMG = document.getElementById('customFile2'),
    IMAGEN = document.getElementById('selectedImageA'),
    MODELO = document.getElementById('input_modelo_auto'),
    ERROR_MODELO_UPDATE = document.getElementById('ERROR-MODELO-UPDATE'),
    TIPO_AUTO = document.getElementById('input_tipo_auto'),
    ERROR_TIPO_UPDATE = document.getElementById('ERROR-TIPO-UPDATE'),
    FECHA_FABRICACION = document.getElementById('fechanInput'),
    ERROR_FECHA_UPDATE = document.getElementById('ERROR-FECHA-UPDATE'),
    COLOR = document.getElementById('input_color_auto'),
    ERROR_COLOR_UPDATE = document.getElementById('ERROR-COLOR-UPDATE'),
    PLACA = document.getElementById('input_placa'),
    ERROR_PLACA_UPDATE = document.getElementById('ERROR-PLACA-UPDATE'),
    CLIENTE = document.getElementById('input_duiP'),
    ERROR_CLIENTE_UPDATE = document.getElementById('ERROR-DUI-UPDATE'),
    MARCA = document.getElementById('input_marca_auto'),
    ERROR_MARCA_UPDATE = document.getElementById('ERROR-MARCA-UPDATE');
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');

// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

// Método usado para encontrar el campo seleccionado en el combobox de Colores tipo enum en la base
function findNumberValue(value) {
    if (value == 'Rojo') {
        return 'Rojo';
    } if (value == 'Azul') {
        return 'Azul';
    } if (value == 'Gris') {
        return 'Gris';
    } if (value == 'Blanco') {
        return 'Blanco';
    } if (value == 'Negro') {
        return 'Negro';
    } if (value == 'Amarillo') {
        return 'Amarillo';
    } if (value == 'Verde') {
        return 'Verde';
    } if (value == 'Anaranjado') {
        return 'Anaranjado';
    } if (value == 'Tornasol') {
        return 'Tornasol';
    } if (value == 'Plata') {
        return 'Plata';
    } if (value == 'Otro') {
        return 'Otro';
    }
    return ''; // Default case
}

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
        MODELO.value = ROW.modelo_automovil;
        fillSelect(AUTOMOVILES_API, 'readTipos', 'input_tipo_auto', ROW.id_tipo_automovil);
        fillSelect(AUTOMOVILES_API, 'readMarcas', 'input_marca_auto', ROW.id_marca_automovil);
        //fillSelect(AUTOMOVILES_API, 'readColores', 'input_color_auto', ROW.id_color);
        fillSelect(AUTOMOVILES_API, 'readClientes', 'input_duiP', ROW.id_cliente);
        PLACA.value = ROW.placa_automovil;
        COLOR.value = findNumberValue(ROW.color_automovil);
        FECHA_FABRICACION.value = ROW.fecha_fabricacion_automovil;
        IMAGEN.src = SERVER_URL.concat('images/automoviles/', ROW.imagen_automovil);

        // Buscar y marcar el `option` correspondiente como seleccionado
        const colorValue = findNumberValue(ROW.color_automovil);
        const options = COLOR.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === colorValue) {
                options[i].selected = true;
                break;
            }
        }

    } else {
        sweetAlert(2, DATA.error, false);
    }
}

const reportEstadoAutomovil = () => {
    // Asegúrate de que `PARAMS` esté correctamente inicializado
    if (!PARAMS) {
        console.error("PARAMS no está definido.");
        return;
    }

    // Obtén el ID del automóvil desde los parámetros de la URL
    const auto = PARAMS.get('id');

    // Imprimir en consola para depuración
    console.log("ID Automovil:", auto);

    // Verifica que se haya proporcionado un ID válido
    if (!auto) {
        alert("ID del automóvil no proporcionado.");
        return;
    }

    // Crea la URL con el parámetro
    const PATH = new URL(`${SERVER_URL}reports/administrador/estadoAutomovil.php?auto=${encodeURIComponent(auto)}`);

    // Abre el reporte en una nueva pestaña
    window.open(PATH.href);
    console.log(PATH.href);
}

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    const DATA1 = await fetchData(USER_API, 'readUsers');
    applicateRules();
    if (DATA1.session) {
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
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

PLACA.addEventListener('input', function () {
    checkInput(validateSalvadoranPlate(PLACA.value), PLACA, ERROR_PLACA_UPDATE);
});

MODELO.addEventListener('input', function () {
    checkInput(validateCarModelName(MODELO.value), MODELO, ERROR_MODELO_UPDATE);
});

TIPO_AUTO.addEventListener('input', function () {
    checkInput(validateSelect(TIPO_AUTO.value), TIPO_AUTO, ERROR_TIPO_UPDATE);
});

FECHA_FABRICACION.addEventListener('input', function () {
    checkInput(validateYear(FECHA_FABRICACION.value), FECHA_FABRICACION, ERROR_FECHA_UPDATE);
});

COLOR.addEventListener('input', function () {
    checkInput(validateSelect(COLOR.value), COLOR, ERROR_COLOR_UPDATE);
});

MARCA.addEventListener('input', function () {
    checkInput(validateSelect(MARCA.value), MARCA, ERROR_MARCA_UPDATE);
});

CLIENTE.addEventListener('input', function () {
    checkInput(validateSelect(CLIENTE.value), CLIENTE, ERROR_CLIENTE_UPDATE);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    if (MODELO.value === '' || TIPO_AUTO.value === '' || FECHA_FABRICACION.value === '' || CLIENTE.value === '' ||
        COLOR.value === '' || PLACA.value === '' || MARCA.value === ''
    ) {
        await sweetAlert(2, 'Por favor, complete todos los campos.', true); return;
    }

    if (!checkInput(validateSelect(MARCA.value), MARCA, ERROR_MARCA_UPDATE) ||
        !checkInput(validateCarModelName(MODELO.value), MODELO, ERROR_MODELO_UPDATE) ||
        !checkInput(validateSelect(TIPO_AUTO.value), TIPO_AUTO, ERROR_TIPO_UPDATE) ||
        !checkInput(validateYear(FECHA_FABRICACION.value), FECHA_FABRICACION, ERROR_FECHA_UPDATE) ||
        !checkInput(validateSelect(COLOR.value), COLOR, ERROR_COLOR_UPDATE) ||
        !checkInput(validateSalvadoranPlate(PLACA.value), PLACA, ERROR_PLACA_UPDATE)) {
        return;
    }

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
        await sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        location.reload()
    } else {
        sweetAlert(2, DATA.error, false);
    }
});

function applicateRules() {
    //FORMATO DE LOS INPUTS DE ACTUALIZAR
    formatSalvadoreanPlate(PLACA);
    formatCarModelName(MODELO);
    formatYear(FECHA_FABRICACION);

    disablePasteAndDrop(PLACA);
    disableCopy(PLACA);
}


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
        location.reload();
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

// Example starter JavaScript for disabling form submissions if there are invalid fields
// (() => {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     const forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     Array.from(forms).forEach(form => {
//         form.addEventListener('submit', event => {
//             if (!form.checkValidity()) {
//                 event.preventDefault();
//                 event.stopPropagation();
//             }
//             form.classList.add('was-validated')
//         }, false)
//     })
// })()
