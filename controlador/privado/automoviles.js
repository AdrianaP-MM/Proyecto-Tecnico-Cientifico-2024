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
const ID_AUTOMOVIL = document.getElementById('idAuto');
const IMG = document.getElementById('customFile2');
const IMAGEN = document.getElementById('selectedImageF');
const FECHA_FABRICACION = document.getElementById('fechanInput');
const CLIENTE = document.getElementById('input_duiP');
//Constantes de CRUD de marcas
const TABLE_MARCAS = document.getElementById('tablaMarcas');
const TABLE_MARCAS_ROWS = document.getElementById('tablaMarcasRows');
const MARCAS_MODAL = new bootstrap.Modal(document.getElementById('marcasModal'));
const SAVE_FORM_MARCAS = document.getElementById('saveFormMarcas'),
    ID_MARCA = document.getElementById('input_id_marca_automovil');
const SEARCH_FORM_MARCAS = document.getElementById('searchMarca');
// Constante para establecer el elemento del título principal.
const MAIN_TITLE = document.getElementById('mainTitle');
const FECHA_DESDE = document.getElementById("datepicker-desdeRE");
const FECHA_HASTA = document.getElementById("datepicker-hastaRE");

const FECHA_FABRICACION_CARRO = document.getElementById('year');
// Constante tipo objeto para obtener los parámetros disponibles en la URL.
let PARAMS = new URLSearchParams(location.search);

// Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    const DATA = await fetchData(USER_API, 'readUsers');
    applicateRules();
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

//Inputs de BUSQUeDA---------------------------------------------------------------------------------------
const INPUT_BUSQUEDA = document.getElementById('input_buscar');
const search = async () => {
    const FORM = new FormData();

    if (INPUT_BUSQUEDA.value) {
        FORM.append('search', INPUT_BUSQUEDA.value);
        console.log('Buscando...');
    }
    else {
        fillTable();
        return;
    }

    fillTable(FORM);
}
function reload() {
    fillTable();
    INPUT_BUSQUEDA.value = '';
}

//Inputs de AGREGAR AUTOMOVIL---------------------------------------------------------------------------------------
const SAVE_FORM = document.getElementById('saveForm');

const MODELO = document.getElementById('input_modelo_auto');
const MODELO_ERROR_ADD = document.getElementById('ERROR-MODELO-ADD');

const TIPO_AUTO = document.getElementById('input_tipo_auto');
const ERROR_TIPO_AUTO_ADD = document.getElementById('ERROR-TIPO-ADD');

const FECHA = document.getElementById('input_fecha_auto');
const ERROR_FECHA_ADD = document.getElementById('ERROR-FECHA-ADD');

const COLOR = document.getElementById('input_color_auto');
const ERROR_COLOR_ADD = document.getElementById('ERROR-COLOR-ADD');

const PLACA = document.getElementById('input_placa');
const ERROR_PLACA_ADD = document.getElementById('ERROR-PLACA-ADD');

const MARCA = document.getElementById('input_marca_auto');
const ERROR_MARCA_ADD = document.getElementById('ERROR-MARCA-ADD');

const DUI = document.getElementById('label_dui');
const ERROR_DUI_ADD = document.getElementById('ERROR-DUI-ADD');

// DUI.addEventListener('input', function () {
//     checkInput(validateDUI(DUI.value), DUI, ERROR_DUI_ADD);
// });

MARCA.addEventListener('input', function () {
    checkInput(validateSelect(MARCA.value), MARCA, ERROR_MARCA_ADD);
});

MODELO.addEventListener('input', function () {
    checkInput(validateCarModelName(MODELO.value), MODELO, MODELO_ERROR_ADD);
});

TIPO_AUTO.addEventListener('input', function () {
    checkInput(validateSelect(TIPO_AUTO.value), TIPO_AUTO, ERROR_TIPO_AUTO_ADD);
});

FECHA.addEventListener('input', function () {
    checkInput(validateYear(FECHA.value), FECHA, ERROR_FECHA_ADD);
});

COLOR.addEventListener('input', function () {
    checkInput(validateSelect(COLOR.value), COLOR, ERROR_COLOR_ADD);
});

PLACA.addEventListener('input', function () {
    checkInput(validateSalvadoranPlate(PLACA.value), PLACA, ERROR_PLACA_ADD);
});

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_AUTOMOVIL.value) ? action = 'updateRow' : action = 'createRow';
    if (action === 'createRow') {
        if (MODELO.value === '' || TIPO_AUTO.value === '' || FECHA.value === '' || DUI.value === '' ||
            COLOR.value === '' || PLACA.value === '' || MARCA.value === ''
        ) {
            await sweetAlert(2, 'Por favor, complete todos los campos.', true);
            return;
        }

        if (!checkInput(validateSelect(MARCA.value), MARCA, ERROR_MARCA_ADD) ||
            !checkInput(validateCarModelName(MODELO.value), MODELO, MODELO_ERROR_ADD) ||
            !checkInput(validateSelect(TIPO_AUTO.value), TIPO_AUTO, ERROR_TIPO_AUTO_ADD) ||
            !checkInput(validateYear(FECHA.value), FECHA, ERROR_FECHA_ADD) ||
            !checkInput(validateSelect(COLOR.value), COLOR, ERROR_COLOR_ADD) ||
            !checkInput(validateSalvadoranPlate(PLACA.value), PLACA, ERROR_PLACA_ADD)) {
            return;
        }
    } else {

    }
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM);

    // Imprime los campos del formulario en la consola
    for (let [key, value] of FORM.entries()) {
        console.log(`${key}: ${value}`);
    }
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
            sweetAlert(2, DATA.error, true);
        }
    }
});

function applicateRules() {
    //FORMATO DE LOS INPUTS DE AGREGAR
    formatCarModelName(MODELO);
    formatYear(FECHA);
    formatSalvadoreanPlate(PLACA);
    formatDUI(DUI, ERROR_DUI_ADD);
    formatSalvadoreanPlate(INPUT_BUSQUEDA)
}

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
    readDUI();
    fillSelect(AUTOMOVILES_API, 'readMarcas', 'input_marca_auto');
}


const openCloseCRUDMarcas = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MARCAS_MODAL.hide();
    }
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

// Funcion que hace el efecto de rotacion en la flecha de cada elemento de los filtros
function rotarImagen(idImagen) {
    var imagen = document.getElementById(idImagen);
    if (!imagen.classList.contains('rotacion-90')) {
        imagen.classList.add('rotacion-90');
    } else {
        imagen.classList.remove('rotacion-90');
    }
}

/*
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
*/



//JS DE CRUD DE MARCAS

const openCRUDMarcas = () => {
    // Se muestra la caja de diálogo con su título.
    MARCAS_MODAL.show();
    fillTableMarcas();
}

function selectMarca(id, nombre) {
    // Establece el valor del input de ID Marca
    document.getElementById('input_id_marca_automovil').value = id;
    // Establece el valor del input de nombre
    document.getElementById('input_marca_automovil').value = nombre;
}

/*JS PARA ADMINISTRAR CRUD DE MARCAS*/

const fillTableMarcas = async () => {
    TABLE_MARCAS_ROWS.innerHTML = '';
    SAVE_FORM_MARCAS.reset();
    ID_MARCA.value = '';
    // Petición para obtener los registros disponibles.
    const DATA = await fetchData(AUTOMOVILES_API, "readAllMarcasAutomoviles");
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se crean y concatenan las filas de la tabla con los datos de cada registro.
            TABLE_MARCAS_ROWS.innerHTML += `
                <tr onclick="selectMarca(${row.id_marca_automovil}, '${row.nombre_marca_automovil}')">
                                            <td>${row.id_marca_automovil}</td>
                                            <td>${row.nombre_marca_automovil}</td>
                                        </tr>
            `;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
}


const searchMarcas = async () => {
    const FORM = new FormData();
    FORM.append('searchMarca', SEARCH_FORM_MARCAS.value);

    const DATA = await fetchData(AUTOMOVILES_API, "searchRowsMarcasAutomoviles", FORM);

    if (DATA.status) {
        DATA.dataset.forEach(row => {
            TABLE_MARCAS_ROWS.innerHTML += `
                <tr onclick="selectMarca(${row.id_marca_automovil}, '${row.nombre_marca_automovil}')">
                    <td>${row.id_marca_automovil}</td>
                    <td>${row.nombre_marca_automovil}</td>
                </tr>`;
        });
    } else {
        sweetAlert(4, DATA.error, true);
    }
};


// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM_MARCAS.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se verifica la acción a realizar.
    (ID_MARCA.value) ? action = 'updateRowMarcaAutomovil' : action = 'createMarcaAutomovil';
    // Constante tipo objeto con los datos del formulario.
    const FORM = new FormData(SAVE_FORM_MARCAS);
    // Petición para guardar los datos del formulario.
    const DATA = await fetchData(AUTOMOVILES_API, action, FORM);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
        // Se cierra la caja de diálogo.
        SAVE_MODAL.hide();
        // Se muestra un mensaje de éxito.
        sweetAlert(1, DATA.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        fillTableMarcas();
    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, DATA.error, ', debe ingresar para continuar', true); location.href = 'index.html'
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
    }
});

const openDeleteMarca = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Desea eliminar la marca de forma permanente?');
    // Se verifica la respuesta del mensaje.
    if (RESPONSE) {
        // Se define una constante tipo objeto con los datos del registro seleccionado.
        const FORM = new FormData();
        FORM.append('input_id_marca_automovil', ID_MARCA.value);
        // Petición para eliminar el registro seleccionado.
        const DATA = await fetchData(AUTOMOVILES_API, 'deleteRowMarcaAutomovil', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // Se muestra un mensaje de éxito.
            await sweetAlert(1, DATA.message, true);
            // Se carga nuevamente la tabla para visualizar los cambios.
            fillTableMarcas();
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
};

// Evento para el envío del formulario de búsqueda
SEARCH_FORM_MARCAS.addEventListener('submit', async (event) => {
    // Prevenir el comportamiento por defecto (recargar la página)
    event.preventDefault();

    // Crear un objeto FormData con los datos del formulario de búsqueda
    const FORM = new FormData(SEARCH_FORM_MARCAS);

    // Llamar a la función para llenar la tabla, pasando el formulario como parámetro para la búsqueda
    await fillTableMarcas(FORM);
});

/*Extra*/

async function readDUI() {
    try {
        const DATA = await fetchData(AUTOMOVILES_API, 'readClientes');

        if (DATA && DATA.status) {
            const duiOptions = DATA.dataset.map(item => ({
                label: item.dui_cliente,
                value: item.id_cliente
            }));

            $("#label_dui").autocomplete({
                source: duiOptions,
                select: function (event, ui) {
                    $('#label_dui').val(ui.item.label);
                    $('#input_duiP').val(ui.item.value); // Guardar el id_cliente como data en el input
                    console.log("ID Cliente seleccionado:", ui.item.value);
                    return false;
                }
            });

        } else {
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false);
        }
    } catch (error) {
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}