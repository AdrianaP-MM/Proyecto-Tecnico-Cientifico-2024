// Constante para completar la ruta de la API.
const CLIENTES_API = 'services/privado/clientes.php';
const USER_API = 'services/privado/usuarios.php';

// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#agregarClienteModal');
// Constantes para establecer los elementos de la card de clientes.
const CLIENTES_JURIDICO_CONTAINER = document.getElementById('clientesJuridicoContainer');
const CLIENTES_NATURAL_CONTAINER = document.getElementById('clientesNaturalContainer');
const CONTENEDOR_MARCAS_AUTOS = document.getElementById('contenedorMarcasAutos');
const CONTENEDOR_RUBRO_COMERCIAL = document.getElementById('contenedorRubroComercial');
const ADD_FORM = document.getElementById('addForm');

const PERSONA_NATURAL_DIV = document.getElementById('personaNatural');
const PERSONA_JURIDICA_DIV = document.getElementById('personaJuridica');
const RUBRO_COMERCIAL_DIV = document.getElementById('rubroComercial');
const NIT_DIV = document.getElementById('nit');
const NRC_DIV = document.getElementById('nrc');
const NRF_DIV = document.getElementById('nrf');

// Constantes de cada campo del formulario
const DUI = document.getElementById('input_dui'),
    ERROR_DUI_ADD = document.getElementById('ERROR-DUI-ADD'),
    NIT = document.getElementById('input_nit'),
    ERROR_NIT_ADD = document.getElementById('ERROR-NIT-ADD'),
    TELEFONO = document.getElementById('input_telefono'),
    ERROR_TELEFONO_ADD = document.getElementById('ERROR-TELEFONO-ADD'),
    NRC = document.getElementById('input_nrc'),
    ERROR_NRC_ADD = document.getElementById('ERROR-NRC-ADD'),
    NRF = document.getElementById('input_nrf'),
    ERROR_NRF_ADD = document.getElementById('ERROR-NRF-ADD'),
    DEPARTAMENTO = document.getElementById('input_departamento'),
    ERROR_DEPA_ADD = document.getElementById('ERROR-DEPA-ADD'),
    NOMBRES = document.getElementById('input_nombre'),
    ERROR_NOMBRE_ADD = document.getElementById('ERROR-NOMBRE-ADD'),
    APELLIDOS = document.getElementById('input_apellido'),
    CORREO = document.getElementById('input_correo'),
    ERROR_CORREO_ADD = document.getElementById('ERROR-CORREO-ADD'),
    ERROR_APELLIDO_ADD = document.getElementById('ERROR-APELLIDO-ADD'),
    RUBRO_COMERCIAL = document.getElementById('input_rubro_comercial'),
    ERROR_RUBRO_ADD = document.getElementById('ERROR-RUBRO-ADD');

const DEPARTAMENTO_BUSCAR = document.getElementById('departamento_buscar');
const RUBRO_BUSCAR = document.getElementById('rubro_buscar');
const FECHA_DESDE = document.getElementById("datepicker-desde");
const FECHA_HASTA = document.getElementById("datepicker-hasta");

NOMBRES.addEventListener('input', function () {
    checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE_ADD);
});

APELLIDOS.addEventListener('input', function () {
    checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_ADD);
});

CORREO.addEventListener('input', function () {
    checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO_ADD);
});

TELEFONO.addEventListener('input', function () {
    checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO_ADD);
});

DEPARTAMENTO.addEventListener('input', function () {
    checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPA_ADD);
});

RUBRO_COMERCIAL.addEventListener('input', function () {
    checkInput(validateSelect(RUBRO_COMERCIAL.value), RUBRO_COMERCIAL, ERROR_RUBRO_ADD);
});

// APELLIDOS.addEventListener('input', function () {
//     checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_ADD);
// });
// APELLIDOS.addEventListener('input', function () {
//     checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_ADD);
// });

function applicateRules() {
    //FORMATO DE LOS INPUTS DE AGREGAR
    formatName(NOMBRES);
    formatName(APELLIDOS);
    formatDUI(DUI, ERROR_DUI_ADD);
    formatPhone(TELEFONO);
    formatNit(NIT, ERROR_NIT_ADD);
    formatEmail(CORREO);

    disablePasteAndDrop(CORREO);
    disableCopy(CORREO);
    disablePasteAndDrop(TELEFONO);
    disableCopy(TELEFONO);
    disablePasteAndDrop(DUI);
    disableCopy(DUI);

    // formatNRC(NRC);
    // formatNRF(NRF);
}

let TIPO_CLIENTE;

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    applicateRules();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
        // Acciones si la sesión SI está activa
        var primeraPestana = document.querySelector('#personaNatural-tab');
        if (primeraPestana) {
            primeraPestana.click();
            fillData('readMarcas');
            fillData('readServicios');
        }
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

// Método del evento para cuando se envía el formulario de guardar.
ADD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    addSave();
});

const addSave = async () => {
    const isValid = await checkFormValidity(ADD_FORM);

    if (NOMBRES.value === '' || APELLIDOS.value === '' || CORREO.value === '' || TELEFONO.value === '' ||
        DEPARTAMENTO.value === '' || DUI.value === ''
    ) {
        await sweetAlert(2, 'Por favor, complete todos los campos.', true); return;
    }

    if ((!RUBRO_COMERCIAL.classList.contains('d-none') && RUBRO_COMERCIAL.value === '') ||
        (!NRC.classList.contains('d-none') && NRC.value === '') ||
        (!NRF.classList.contains('d-none') && NRF.value === '') ||
        (!NIT.classList.contains('d-none') && NIT.value === '')
    ) {
        await sweetAlert(2, 'Por favor, complete todos los campos.', true);
        return;
    }

    if (!checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE_ADD) ||
        !checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_ADD) ||
        !checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO_ADD) ||
        !checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO_ADD) ||
        !checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPA_ADD) ||
        !checkInput(validateDUI(DUI.value), DUI, ERROR_DUI_ADD)) {
         await sweetAlert(2, 'Error al validar los campos.', true);
        return;
    }

    if (!NRC.classList.contains('d-none')) {
        if (!checkInput(validateSelect(RUBRO_COMERCIAL.value), RUBRO_COMERCIAL, ERROR_RUBRO_ADD) ||
            !checkInput(validateNit(NIT.value), NIT, ERROR_NIT_ADD)) {
             await sweetAlert(2, 'Error al validar los campos.', true);
            return;
        }
    }

    if (isValid) {
        console.log('TodoGud'); // Código a ejecutar después de la validación
        //Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(ADD_FORM);
        FORM.append('fecha_registro', getDateToMysql());
        FORM.append('tipo_cliente', TIPO_CLIENTE);
        FORM.append('estado_cliente', 'Activo');

        //Aqui empieza la division del flujo de si es cliente natural o juridico

        if (TIPO_CLIENTE == "Persona natural") {

            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(CLIENTES_API, 'createRowNatural', FORM);

            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                await sweetAlert(1, 'Se ha guardado con éxito', 300);
                fillData('readAll');
                MODAL.hide();
                resetForm(); // Resetea el formulario
                ADD_FORM.classList.remove('was-validated'); // Quita la clase de validación
                location.reload();
            } else {
                if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                    await sweetAlert(4, DATA.error, true); location.href = 'index.html'
                }
                else {
                    sweetAlert(4, DATA.error, true);
                }
            }

        } if (TIPO_CLIENTE == "Persona juridica") {

            // Petición para guardar los datos del formulario.
            const DATA = await fetchData(CLIENTES_API, 'createRowJuridico', FORM);

            // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
            if (DATA.status) {
                await sweetAlert(1, 'Se ha guardado con éxito', 300);
                fillData('readAll');
                MODAL.hide();
                resetForm(); // Resetea el formulario
                ADD_FORM.classList.remove('was-validated'); // Quita la clase de validación
                location.reload();
            } else {
                if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                    await sweetAlert(4, DATA.error, true); location.href = 'index.html'
                }
                else {
                    sweetAlert(4, DATA.error, true);
                }
            }

        }
    } else {
        console.log('Que paso?: Formulario no válido');
    }
};

function reload() {
    INPUT_BUSQUEDA.value = '';
    DEPARTAMENTO_BUSCAR.value = 0;
    FECHA_DESDE.value = '';
    FECHA_HASTA.value = '';
    RUBRO_BUSCAR.value = 0;
    fillData('readAll');
}

const INPUT_BUSQUEDA = document.getElementById('input_buscar');

// Agregar un evento change al select
DEPARTAMENTO_BUSCAR.addEventListener('change', function () {
    search();
});

// Agregar un evento change al select
RUBRO_BUSCAR.addEventListener('change', function () {
    search();
});

const search = async () => {
    const FORM = new FormData();
    FORM.append('tipo_cliente', TIPO_CLIENTE);

    if (INPUT_BUSQUEDA.value) {
        FORM.append('search', INPUT_BUSQUEDA.value);
    }

    if (DEPARTAMENTO_BUSCAR.value) {
        FORM.append('departamento_cliente', DEPARTAMENTO_BUSCAR.value);
    }

    if (FECHA_DESDE.value) {
        FORM.append('fecha_desde', formatDateToMySQL(FECHA_DESDE.value));
    }

    if (FECHA_HASTA.value) {
        FORM.append('fecha_hasta', formatDateToMySQL(FECHA_HASTA.value));
    }

    if (MARCAS_SELECCIONADAS.length != 0) {
        FORM.append('autos_marcas', MARCAS_SELECCIONADAS);
    }

    if (RUBRO_BUSCAR.value) {
        FORM.append('rubro_cliente', RUBRO_BUSCAR.value);
    }

    fillData('searchRows', FORM);
}

/*
*   Función asíncrona para llenar el contenedor de los clientes con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillData = async (action, form = null) => {
    if (action == 'readAll' || action == 'searchRows') {
        // Lógica para mostrar clientes naturales o jurídicos
        if (TIPO_CLIENTE == 'Persona natural') {
            const FORM2 = form ?? new FormData();
            FORM2.append('tipo_cliente', TIPO_CLIENTE);
            const DATA2 = await fetchData(CLIENTES_API, action, FORM2);

            CLIENTES_NATURAL_CONTAINER.innerHTML = "";
            createCardAdd(CLIENTES_NATURAL_CONTAINER);
            if (DATA2.status) {
                DATA2.dataset.forEach(row => {
                    CLIENTES_NATURAL_CONTAINER.innerHTML += createCardCliente(row);
                });
            } else {
                if (DATA2.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                    await sweetAlert(4, DATA.error, true); location.href = 'index.html'
                    CLIENTES_NATURAL_CONTAINER.innerHTML = "";
                }
                else {
                    sweetAlert(4, DATA2.error, true);
                }
            }
        } else {
            const FORM1 = form ?? new FormData();;
            FORM1.append('tipo_cliente', TIPO_CLIENTE);
            const DATA1 = await fetchData(CLIENTES_API, action, FORM1);

            CLIENTES_JURIDICO_CONTAINER.innerHTML = "";
            createCardAdd(CLIENTES_JURIDICO_CONTAINER);
            if (DATA1.status) {
                DATA1.dataset.forEach(row => {
                    CLIENTES_JURIDICO_CONTAINER.innerHTML += createCardCliente(row);
                });
            } else {
                if (DATA1.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                    await sweetAlert(4, DATA.error, true); location.href = 'index.html'
                    CLIENTES_JURIDICO_CONTAINER.innerHTML = '';
                }
                else {
                    sweetAlert(4, DATA1.error, true);
                }
            }
        }
    }
    else {
        if (action == 'readMarcas') {
            CONTENEDOR_MARCAS_AUTOS.innerHTML = '';
            const DATA = await fetchData(CLIENTES_API, action);

            if (DATA.status) {
                DATA.dataset.forEach(row => {
                    CONTENEDOR_MARCAS_AUTOS.innerHTML +=
                        `
                    <li class="list-group-item p-0 m-0 px-2">
                        <input class="form-check-input me-2 checkbox" type="checkbox" id="${row.id_marca_automovil}" onclick="clickOnCheckBox(this)">
                        <label class="form-check-label stretched-link" for="${row.id_marca_automovil}">
                            <h6 class="m-0 p-0 open-sans-regular">
                            ${row.nombre_marca_automovil}
                            </h6>
                        </label>
                    </li>
                    `
                });
            } else {
                if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
                    await sweetAlert(4, DATA.error, true); location.href = 'index.html'
                }
                else {
                    CONTENEDOR_MARCAS_AUTOS.innerHTML +=
                        `<h6 class="m-0 p-0 open-sans-regular">
                        No existen marcas de automóviles registrados
                        </h6>`
                    //sweetAlert(4, DATA.error, true);
                }
            }
        }
        else {
        }
    }
}

// Función para generar el HTML de cada cliente
function createCardCliente(row) {
    const isFto = row.fto_cliente == null ? 'default2.png' : row.fto_cliente;
    return `
        <!--Card del Cliente -->
        <div class="cliente-card card" onclick="gotoDetail(${row.id_cliente})">
            <div class="content z-3">
                <h4 class="open-sans-light-italic">Más información</h4>
            </div>
            <div class="container-img-card">
                <img src="${SERVER_URL}/images/clientes/${isFto}" class="img-cliente">
            </div>
            <div class="container-info-card position-relative p-3 justify-content-center align-items-center">
                <div class="line-red-split position-absolute"></div>
                <div class="d-flex flex-column">
                    <h5 class="m-0 p-0 open-sans-bold text-black text-start">${row.nombres_cliente} ${row.apellidos_cliente}</h5>
                    <p class="open-sans-light-italic m-0 p-0 text-start clrGry1">Cliente ${row.id_cliente}</p>
                </div>
                <div class="info-row-2 d-flex gap-5">
                    <div class="d-flex flex-column position-relative">
                        <div class="line-red-split-2 position-absolute"></div>
                        <h6 class="m-0 p-0 open-sans-bold text-black text-start">DUI</h6>
                        <p class="open-sans-light m-0 p-0 text-start clrGry1">${row.dui_cliente}</p>
                    </div>
                    <div class="d-flex flex-column">
                        <h6 class="m-0 p-0 open-sans-bold text-black text-start">Teléfono</h6>
                        <p class="open-sans-light m-0 p-0 text-start clrGry1">${row.telefono_cliente}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para agregar la card de agregar cliente
function createCardAdd(container) {
    container.innerHTML += `
        <!--Contenedor de la primera card - card de agregar automovil-->
        <div class="add-cliente-card d-flex align-items-center justify-content-center">
            <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow" data-bs-toggle="modal"
                data-bs-target="#agregarClienteModal">
        </div>
    `;
}

let MARCAS_SELECCIONADAS = [];

function clickOnCheckBox(input) {
    setIdMarcas(input.id)
}

function setIdMarcas(id) {
    // Verificar si el id ya está en el arreglo
    const index = MARCAS_SELECCIONADAS.indexOf(id);
    if (index === -1) {
        // Si el id no está en el arreglo, lo agregamos
        MARCAS_SELECCIONADAS.push(id);
    } else {
        // Si el id ya está en el arreglo, lo eliminamos
        MARCAS_SELECCIONADAS.splice(index, 1);
    }
    search();
}


function clickOnCheckBoxServicios(input) {
    setIdServicios(input.id)
}

// Función para mostrar el div de agregar trabajador y ocultar el div de la tabla.
function showPersonaNatural(boton) {
    TIPO_CLIENTE = 'Persona natural';
    fillData('readAll');
    showCamposNaturales();
    resetForm();
    updateButtonColors(boton);
}

// Función para mostrar el div de la tabla y ocultar el div de agregar trabajador.
function showPersonaJuridica(boton) {
    TIPO_CLIENTE = 'Persona juridica';
    fillData('readAll');
    showCamposJuridicos();
    resetForm();
    updateButtonColors(boton);
}

function showCamposJuridicos() {
    PERSONA_JURIDICA_DIV.classList.remove('d-none');
    PERSONA_NATURAL_DIV.classList.add('d-none');
    RUBRO_COMERCIAL_DIV.classList.remove('d-none');
    NIT_DIV.classList.remove('d-none');
    RUBRO_COMERCIAL.classList.remove('d-none');
    NRC_DIV.classList.remove('d-none');
    NRC.classList.remove('d-none');
    NRF_DIV.classList.remove('d-none');
    NRF.classList.remove('d-none');
    NIT.classList.remove('d-none');
    CONTENEDOR_RUBRO_COMERCIAL.classList.remove('d-none');
}

function showCamposNaturales() {
    PERSONA_NATURAL_DIV.classList.remove('d-none');
    PERSONA_JURIDICA_DIV.classList.add('d-none');
    RUBRO_COMERCIAL_DIV.classList.add('d-none');
    NIT_DIV.classList.add('d-none');
    RUBRO_COMERCIAL.classList.add('d-none');
    NRC_DIV.classList.add('d-none');
    NRC.classList.add('d-none');
    NRF_DIV.classList.add('d-none');
    NRF.classList.add('d-none');
    NIT.classList.add('d-none');
    CONTENEDOR_RUBRO_COMERCIAL.classList.add('d-none');
}

//Funcion que muestra la alerta de confirmacion
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
        resetForm();
        location.reload();
    }
}

// Funcion para ir hacia la pagina de detalles del automovil
function gotoDetail(idCliente) {
    location.href = `../../vistas/privado/detalles_cliente.html?id_cliente=${idCliente}`;
}

function resetForm() {
    // Resetea el formulario y los mensajes de validación
    ADD_FORM.reset(); // Resetea el formulario
}

// Funcion que hace el efecto de rotacion en la flecha de cada elemento de los filtros
function rotarImagen(idImagen) {
    var imagen = document.getElementById(idImagen);
    if (!imagen.classList.contains('rotacion-90')) {
        imagen.classList.add('rotacion-90');
    } else {
        imagen.classList.remove('rotacion-90');
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

//----------------------------VALIDACIONES-----------------

document.getElementById('input_nrf').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número o guión
    inputValue = inputValue.replace(/[^\d-]/g, '');

    // Asegurar que no haya más de 100 caracteres
    inputValue = inputValue.slice(0, 11);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('input_nrc').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número o guión
    inputValue = inputValue.replace(/[^\d-]/g, '');

    // Asegurar que no haya más de 100 caracteres
    inputValue = inputValue.slice(0, 15);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});
