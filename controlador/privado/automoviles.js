// Constantes para completar las rutas de la API.
const AUTOMOVILES_API = 'services/privado/automoviles.php';
const USER_API = 'services/privado/usuarios.php';
// Constante para establecer el formulario de buscar.
//const SEARCH_FORM = document.getElementById('searchForm');
// Constantes para establecer el contenido de la tabla.
const TABLE_BODY = document.getElementById('tableBody'),
    ROWS_FOUND = document.getElementById('rowsFound');
// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal('#saveModal'),
    MODAL_TITLE = document.getElementById('modalTitle');
// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById('saveForm'),
    ID_AUTOMOVIL = document.getElementById('idAuto'),
    IMG = document.getElementById('customFile2'),
    IMAGEN = document.getElementById('selectedImageF'),
    MODELO = document.getElementById('input_modelo_auto'),
    TIPO_AUTO = document.getElementById('input_tipo_auto'),
    FECHA_FABRICACION = document.getElementById('fechanInput'),
    COLOR = document.getElementById('input_color_auto'),
    PLACA = document.getElementById('input_placa'),
    CLIENTE = document.getElementById('input_duiP');
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');

const INPUT_BUSQUEDA = document.getElementById('input_buscar');
const FECHA_DESDE = document.getElementById("datepicker-desdeRE");
const FECHA_HASTA = document.getElementById("datepicker-hastaRE");

const FECHA_FABRICACION_CARRO = document.getElementById('year');
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
        // Acciones si la sesión SI está activa
        // Llamada a la función para llenar la tabla con los registros existentes.
        fillTable();
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }

});
/*Método del evento para cuando se envía el formulario de buscar.
SEARCH_FORM.addEventListener('submit', (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SEARCH_FORM);
    // Llamada a la función para llenar la tabla con los resultados de la búsqueda.
    fillTable(FORM);
});*/


const search = async () => {
    const FORM = new FormData();

    if (INPUT_BUSQUEDA.value) {
        FORM.append('search', INPUT_BUSQUEDA.value);
    }

    if (FECHA_DESDE.value) {
        FORM.append('fecha_desde', formatDateToMySQL(FECHA_DESDE.value));
    }

    if (FECHA_HASTA.value) {
        FORM.append('fecha_hasta', formatDateToMySQL(FECHA_HASTA.value));
    }

    if (FECHA_FABRICACION_CARRO.value) {
        FORM.append('fecha_fabricacion', FECHA_FABRICACION_CARRO.value);
    }

    fillTable(FORM);
}


// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_AUTOMOVIL.value) ? action = 'updateRow' : action = 'createRow';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(AUTOMOVILES_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTable();
    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, DATA.error, ', debe ingresar para continuar', true); location.href = 'index.html'
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
    }
});

/*
*   Función asíncrona para llenar la tabla con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillTable = async (form = null) => {
    TABLE_BODY.innerHTML = '';
    // Se verifica la acción a realizar.
    (form) ? action = 'searchRows' : action = 'readAll';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(AUTOMOVILES_API, action, form);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        TABLE_BODY.innerHTML += `
        <!--Contenedor de la primera card - card de agregar automovil-->
            <div class="add-auto-card d-flex align-items-center justify-content-center">
                <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow" onclick="openCreate()">
            </div>
        `
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_BODY.innerHTML += `
                <div class="auto-card card" onclick="gotoDetail(${row.id_automovil})">
                        <div class="content z-3">
                            <h4 class="open-sans-light-italic">Màs informaciòn</h4>
                        </div>
                        <div class="container-img-card">
                            <img src="${SERVER_URL}/images/automoviles/${row.imagen_automovil}"
                            onerror="this.onerror=null; this.src='../../api/images/automoviles/default.png';">
                        </div>
                        <div class="container-info-card position-relative">
                            <div class="line-red-split position-absolute"></div>
                            <div class="grid-c pt-2 c1">
                                <p class="m-0 p-0 open-sans-regular text-black text-center">${row.nombre_cliente} &nbsp
                                    <span
                                        class="open-sans-regular-italic m-0 p-0 text-black text-center">${row.dui_cliente}</span>
                                </p>
                            </div>
                            <div class="grid-c pt-2 c2 w-100 px-1">
                                <p class="m-0 p-0 open-sans-light-italic text-center w-100">${row.nombre_marca} &nbsp
                                    <span class="open-sans-semibold m-0 p-0 text-center w-100">${row.placa_automovil}</span>
                                </p>
                            </div>
                            <div class="grid-c c3">
                                <p class="m-0 p-0 open-sans-regular text-black text-center">Color ${row.color_automovil}
                                    <span
                                        class="open-sans-regular-italic m-0 p-0 text-black text-center">${row.modelo_automovil}</span>
                                </p>
                            </div>
                        </div>
                    </div>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

/*
*   Función para preparar el formulario al momento de insertar un registro.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const openCreate = () => {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    // Se prepara el formulario.
    SAVE_FORM.reset();
    fillSelect(AUTOMOVILES_API, 'readTipos', 'input_tipo_auto');
    fillSelect(AUTOMOVILES_API, 'readClientes', 'input_duiP');
    fillSelect(AUTOMOVILES_API, 'readMarcas', 'input_marca_auto');
}

function gotoDetail(id) {
    location.href = "../../vistas/privado/detalles_automovil.html?id=" + id;
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
        SAVE_MODAL.show();
        // Se prepara el formulario.
        SAVE_FORM.reset();
        // Se inicializan los campos con los datos.
        const ROW = DATA.dataset;
        ID_AUTOMOVIL.value = ROW.ID_AUTOMOVIL;
        MODELO.value = ROW.MODELO;
        TIPO_AUTO.value = ROW.TIPO_AUTO;
        FECHA_FABRICACION.value = ROW.FECHA_FABRICACION;
        COLOR.value = ROW.COLOR;
        PLACA.checked = ROW.estado_libro;
        fillSelect(CATEGORIA_API, 'readAll', 'categoriaLibro', ROW.id_categoria);
    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, DATA.error, ', debe ingresar para continuar', true); location.href = 'index.html'
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
    }
}

/*
*   Función asíncrona para eliminar un registro.
*   Parámetros: id (identificador del registro seleccionado).
*   Retorno: ninguno.
*/
const openDelete = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction('¿Desea eliminar el automóvil de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('idAuto', PARAMS.get('id'));
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(AUTOMOVILES_API, 'deleteRow', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTable();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
}

/*
*   Función para abrir un reporte automático de productos por categoría.
*   Parámetros: ninguno.
*   Retorno: ninguno.

const openReport = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/admin/productos.php`);
    // Se abre el reporte en una nueva pestaña.
    window.open(PATH.href);
}
*/

//Funcion que muestra la alerta de confirmacion
const openClose = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        SAVE_MODAL.hide();
    }
}

// Date pickers
$('#datepicker-desde').datepicker({
    uiLibrary: 'bootstrap5'
});
$('#datepicker-hasta').datepicker({
    uiLibrary: 'bootstrap5'
});

$('#datepicker-desdeRE').datepicker({
    uiLibrary: 'bootstrap5'
});
$('#datepicker-hastaRE').datepicker({
    uiLibrary: 'bootstrap5'
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

document.getElementById('input_placa').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value.toUpperCase();

    // Limpiar el valor de cualquier carácter que no sea letras, números o guiones
    inputValue = inputValue.replace(/[^A-Z0-9]/g, '');

    // Definir las letras y combinaciones permitidas como iniciales
    const validPrefixes = [
        'A', 'AB', 'C', 'CC', 'CD', 'D', 'E', 'F', 'M', 'MB', 'MI', 'N', 'O', 'P', 'PR', 'PNC', 'RE', 'T', 'V'
    ];

    // Buscar el prefijo válido más largo en el valor de entrada
    let prefix = '';
    for (const validPrefix of validPrefixes) {
        if (inputValue.startsWith(validPrefix) && validPrefix.length > prefix.length) {
            prefix = validPrefix;
        }
    }

    // Eliminar el prefijo del valor de entrada
    let remainingInput = inputValue.slice(prefix.length);

    // Limitar el número de caracteres del resto del valor a 6
    remainingInput = remainingInput.slice(0, 6);

    // Formatear el resto del valor con guiones
    if (remainingInput.length > 3) {
        remainingInput = remainingInput.slice(0, 3) + '-' + remainingInput.slice(3);
    }

    // Combinar el prefijo y el resto formateado
    let formattedValue = prefix + '-' + remainingInput;

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = formattedValue;
});


document.getElementById('input_fecha_auto').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Limitar a 4 caracteres
    inputValue = inputValue.slice(0, 4);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('input_buscar').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea una 'P', letras o números
    inputValue = inputValue.replace(/[^P0-9A-Za-z]/g, '');

    // Asegurarse de que comience con 'P'
    if (inputValue.length > 0 && inputValue.charAt(0) !== 'P') {
        inputValue = 'P' + inputValue.substring(1);
    }

    // Limitar a 8 caracteres
    inputValue = inputValue.slice(0, 7);

    // Insertar guión antes de los últimos 3 caracteres
    if (inputValue.length > 3) {
        inputValue = inputValue.slice(0, 4) + '-' + inputValue.slice(4);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue.toUpperCase(); // Convertir a mayúsculas
});

// Funcion que hace el efecto de rotacion en la flecha de cada elemento de los filtros
function rotarImagen(idImagen) {
    var imagen = document.getElementById(idImagen);
    if (!imagen.classList.contains('rotacion-90')) {
        imagen.classList.add('rotacion-90');
    } else {
        imagen.classList.remove('rotacion-90');
    }
}

// Obtener el elemento de entrada por su ID
const yearInput = document.getElementById('year');

// Obtener el año actual
const currentYear = new Date().getFullYear();

// Establecer el atributo max del campo de entrada como el año actual
yearInput.setAttribute('max', currentYear);

document.getElementById('year').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 4 dígitos
    inputValue = inputValue.slice(0, 4);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});
