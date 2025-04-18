// Constante para completar la ruta de la API.
const CLIENTES_API = 'services/privado/clientes.php';
const CITAS_API = 'services/privado/citas.php';
const USER_API = 'services/privado/usuarios.php';

const CLIENTE_DATA_CONTAINER = document.getElementById('clienteDataContainer');

// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#editarClienteModal');
const ADD_FORM = document.getElementById('addForm');

const RUBRO_COMERCIAL_DIV = document.getElementById('rubro_comercial');
const NRC_DIV = document.getElementById('nrc');
const NIT_DIV = document.getElementById('nit');
const NRF_DIV = document.getElementById('nrf');

// Constantes de cada campo del formulario
const DUI = document.getElementById('input_dui'),
    ERROR_DUI_UPDATE = document.getElementById('ERROR-DUI-UPDATE'),
    NIT = document.getElementById('input_nit'),
    ERROR_NIT_UPDATE = document.getElementById('ERROR-NIT-UPDATE'),
    TELEFONO = document.getElementById('input_telefono'),
    ERROR_TELEFONO_UPDATE = document.getElementById('ERROR-TELEFONO-UPDATE'),
    NRC = document.getElementById('input_nrc'),
    NRF = document.getElementById('input_nrf'),
    DEPARTAMENTO = document.getElementById('input_departamento'),
    ERROR_DEPA_UPDATE = document.getElementById('ERROR-DEPA-UPDATE'),
    NOMBRES = document.getElementById('input_nombre'),
    ERROR_NOMBRE_UPDATE = document.getElementById('ERROR-NOMBRE-UPDATE'),
    APELLIDOS = document.getElementById('input_apellido'),
    ERROR_APELLIDO_UPDATE = document.getElementById('ERROR-APELLIDO-UPDATE'),
    CORREO = document.getElementById('input_correo'),
    ERROR_CORREO_UPDATE = document.getElementById('ERROR-CORREO-UPDATE'),
    RUBRO_COMERCIAL = document.getElementById('input_rubro_comercial'),
    ERROR_RUBRO_UPDATE = document.getElementById('ERROR-RUBRO-UPDATE'),
    TIPO_CLIENTE_INPUT = document.getElementById('input_tipo_cliente');;


let TIPO_CLIENTEW = '';


NOMBRES.addEventListener('input', function () {
    checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE_UPDATE);
});

APELLIDOS.addEventListener('input', function () {
    checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_UPDATE);
});

CORREO.addEventListener('input', function () {
    checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO_UPDATE);
});

TELEFONO.addEventListener('input', function () {
    checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO_UPDATE);
});

DEPARTAMENTO.addEventListener('input', function () {
    checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPA_UPDATE);
});

RUBRO_COMERCIAL.addEventListener('input', function () {
    checkInput(validateSelect(RUBRO_COMERCIAL.value), RUBRO_COMERCIAL, ERROR_RUBRO_UPDATE);
});

function applicateRules() {
    //FORMATO DE LOS INPUTS DE AGREGAR
    formatName(NOMBRES);
    formatName(APELLIDOS);
    formatDUI(DUI, ERROR_DUI_UPDATE);
    formatPhone(TELEFONO);
    formatNit(NIT, ERROR_NIT_UPDATE);
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

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    applicateRules();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
        await fillData();
        graficaServiciosRecibidos();
    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

const graficaServiciosRecibidos = async () => {

    const FORM = new FormData();
    FORM.append('id_cliente', Number(getQueryParam('id_cliente')));
    const endpoint = TIPO_CLIENTEW === 'natural' ? 'serviciosClienteNatural' : 'serviciosClienteJuridico';
    const DATAServiciosClientes = await fetchData(CLIENTES_API, endpoint, FORM);

    if (DATAServiciosClientes.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let Servicio = [];
        let Cantidad = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATAServiciosClientes.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            Servicio.push(row.nombre_servicio);
            Cantidad.push(row.cantidad_solicitudes);
        });
        document.getElementById('graficaServiciosContainer').innerHTML = `
            <canvas id="graficaServicios"></canvas> <!--Grafica-->`;
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        doughnutGraph('graficaServicios', Servicio, Cantidad, 'Cantidad de servicios recibidos por el cliente.');
    } else {
        document.getElementById('graficaServiciosContainer').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
    }
}


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

    if (!checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE_UPDATE) ||
        !checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO_UPDATE) ||
        !checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO_UPDATE) ||
        !checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO_UPDATE) ||
        !checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPA_UPDATE) ||
        !checkInput(validateDUI(DUI.value), DUI, ERROR_DUI_UPDATE)) {
        //await sweetAlert(2, 'Error al validar los campos.5', true);
        return;
    }

    if (!NRC.classList.contains('d-none')) {
        if (!checkInput(validateSelect(RUBRO_COMERCIAL.value), RUBRO_COMERCIAL, ERROR_RUBRO_UPDATE) ||
            !checkInput(validateNit(NIT.value), NIT, ERROR_NIT_UPDATE)) {
            //await sweetAlert(2, 'Error al validar los campos.6', true);
            return;
        }
    }


    if (isValid) {
        console.log('TodoGud'); // Código a ejecutar después de la validación
        //Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(ADD_FORM);
        FORM.append('id_cliente', Number(getQueryParam('id_cliente')))
        FORM.append('tipo_cliente', TIPO_CLIENTE_INPUT.value);

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CLIENTES_API, 'updateRow', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            await sweetAlert(1, 'Se ha actualizado con éxito', 300);
            fillData();
            MODAL.hide();
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
    } else {
        console.log('Que paso?: Formulario no válido');
    }
};

const openDelete = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres eliminar al cliente?', 'No podrás deshacer la acción en otro apartado');
    if (RESPONSE.isConfirmed) {
        const FORM = new FormData();
        FORM.append('id_cliente', Number(getQueryParam('id_cliente')));

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CLIENTES_API, 'deleteRow', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            await sweetAlert(1, 'Se ha eliminado con éxito', 300);
            fillData();
            MODAL.hide();
            location.href = '../../vistas/privado/clientes.html';
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    }
}

// Asignar valor a TIPO_CLIENTE según el tipo de cliente
const asignarTipoCliente = (row) => {
    TIPO_CLIENTEW = row.tipo_cliente === 'Persona natural' ? 'natural' : 'juridico';
};

/*
*   Función asíncrona para llenar el contenedor de los clientes con los registros disponibles.
*   Parámetros: form (objeto opcional con los datos de búsqueda).
*   Retorno: ninguno.
*/
const fillData = async () => {
    CLIENTE_DATA_CONTAINER.innerHTML = '';

    let id_cliente = Number(getQueryParam('id_cliente'));
    const FORM = new FormData();
    FORM.append('id_cliente', id_cliente);

    const DATA = await fetchData(CLIENTES_API, 'readOne', FORM);
    if (DATA.status) {
        const ROW = DATA.dataset;
        asignarTipoCliente(ROW);
        let html = '';

        if (ROW.tipo_cliente == 'Persona natural') {
            RUBRO_COMERCIAL_DIV.classList.add('d-none');
            RUBRO_COMERCIAL.classList.add('d-none');
            NRC_DIV.classList.add('d-none');
            NIT_DIV.classList.add('d-none');
            NIT.classList.add('d-none');
            NRC.classList.add('d-none');
            NRF_DIV.classList.add('d-none');
            NRF.classList.add('d-none');
            formSetValues(ROW);
            html = getPersonaNaturalTemplate(ROW);
        } else {
            RUBRO_COMERCIAL_DIV.classList.remove('d-none');
            RUBRO_COMERCIAL.classList.remove('d-none');
            NRC_DIV.classList.remove('d-none');
            NIT_DIV.classList.remove('d-none');
            NIT.classList.remove('d-none');
            NRC.classList.remove('d-none');
            NRF_DIV.classList.remove('d-none');
            NRF.classList.remove('d-none');
            formSetValues(ROW);
            html = getPersonaJuridicaTemplate(ROW);
        }

        CLIENTE_DATA_CONTAINER.innerHTML = html;
    } else {
        sweetAlert(4, DATA.error, true);
        location.href = '../../vistas/privado/clientes.html';
    }
}

function getPersonaNaturalTemplate(row) {
    const isFto = row.fto_cliente == null ? 'default.png' : row.fto_cliente;
    return `
    <div
        class="contenedor-izq d-flex flex-column col-lg-4 col-md-8 col-12 flex-wrap justify-content-start align-items-center">
        <img src="${SERVER_URL}/images/clientes/${isFto}" class="img-cliente">
        <div class="col-12 d-flex justify-content-end align-items-end">
            <button type="button" id="btnEditCliente" onclick="" data-bs-toggle="modal"
                data-bs-target="#editarClienteModal" class="btn btn-outline-primary col-10 btnEdit m-0 p-0">
                <img src="../../recursos/imagenes/icons/btn-edit.svg" class="svg1">
            </button>
        </div>
        <!-- Contenedor del info del cliente -->
        <div
            class="contenedor-info d-flex flex-column col-lg-12 col-md-11 col-10 justify-content-center align-items-center p-5">
            <!--Contenedor Info header-->
            <div class="info-header d-flex flex-column text-center pt-4 pt-md-0 pt-lg-0">
                <h2 class="p-0 m-0 open-sans-bold">
                    ${row.nombres_cliente} ${row.apellidos_cliente}
                </h2>
                <p class="p-0 m-0 open-sans-regular">
                    Cliente #${row.id_cliente}
                </p>
            </div>
            <!--Contenedor Info body-->
            <div
                class="info-body d-flex flex-lg-row flex-column flex-md-row justify-content-around align-items-center col-12 flex-wrap pb-4 pb-md-0 pb-lg-0 gap-3">
                <!--Contenedor del correo-->
                <div class="correo d-flex flex-column text-center text-md-start text-lg-start">
                    <h5 class="p-0 m-0 open-sans-semibold">
                        Correo
                    </h5>
                    <p class="p-0 m-0 open-sans-regular">
                        ${row.correo_cliente}
                    </p>
                </div>
                <!--Contenedor del DUI-->
                <div class="dui d-flex flex-column text-center px-3">
                    <h5 class="p-0 m-0 open-sans-semibold">
                        DUI
                    </h5>
                    <p class="p-0 m-0 open-sans-regular">
                        ${row.dui_cliente}
                    </p>
                </div>
                <!--Contenedor del Telefono-->
                <div class="telefono d-flex flex-column">
                    <h5 class="p-0 m-0 open-sans-semibold">
                        Teléfono
                    </h5>
                    <p class="p-0 m-0 open-sans-regular">
                        ${row.telefono_cliente}
                    </p>
                </div>
            </div>
        </div>
    </div>
    <!--Contenedor de la columna derecha -->
    <div class="contenedor-drch d-flex flex-column col-lg-5 col-md-6 col-12 align-items-center">
        <!--Contenedor de màs informacion -->
        <div
            class="contenedor-masinfo d-flex flex-column align-items-center justify-content-start col-12 mt-5 mt-md-0 mt-lg-0 p-5">
            <!--Contenedor mas info header -->
            <div class="masinfo-header">
                <h3 class="m-0 p-0 open-sans-bold">
                    Más Información
                </h3>
            </div>
            <!--Contenedor mas info body -->
            <div class="masinfo-body col-12">
                <!--Elemento de departamento -->
                <div class="depa d-flex flex-column">
                    <h5 class="m-0 p-0 open-sans-semibold">Departamento de residencia</h5>
                    <p class="m-0 p-0 open-sans-regular">
                        ${row.departamento_cliente}
                    </p>
                </div>
                <!--Elemento de registro -->
                <div class="fecharegistro d-flex flex-column">
                    <h5 class="m-0 p-0 open-sans-semibold">Fecha de registro en el taller</h5>
                    <p class="m-0 p-0 open-sans-regular">
                        ${row.fecha_registro_cliente}
                    </p>
                </div>
            </div>
        </div>
        <div class="col2Row2 col-10 graphic p-4 mb-2 mt-1" id="graficaServiciosContainer">
            <canvas id="graficaServicios"></canvas> <!--Grafica-->
        </div>
    </div>
    `;
}

function getPersonaJuridicaTemplate(row) {
    const isFto = row.fto_cliente == null ? 'default.png' : row.fto_cliente;
    return `
        <div
            class="contenedor-izq d-flex flex-column col-lg-4 col-md-8 col-12 flex-wrap justify-content-start align-items-center">
            <img src="${SERVER_URL}/images/clientes/${isFto}" class="img-cliente">
            <div class="col-12 d-flex justify-content-end align-items-end">
                <button type="button" id="btnEditCliente" onclick="" data-bs-toggle="modal"
                    data-bs-target="#editarClienteModal" class="btn btn-outline-primary col-10 btnEdit m-0 p-0">
                    <img src="../../recursos/imagenes/icons/btn-edit.svg" class="svg1">
                </button>
            </div>
            <div
                class="contenedor-info d-flex flex-column col-lg-12 col-md-11 col-10 justify-content-center align-items-center p-5">
                <!--Contenedor del header de la info-->
                <div class="info-header d-flex flex-column text-center my-4">
                    <h2 class="p-0 m-0 open-sans-bold">
                        ${row.nombres_cliente} ${row.apellidos_cliente}
                    </h2>
                    <p class="p-0 m-0 open-sans-regular">
                        Cliente #${row.id_cliente}
                    </p>
                </div>
                <!--Contenedor del body de la info-->
                <div
                    class="info-body d-flex flex-lg-row flex-column flex-md-row justify-content-around align-items-center col-12 flex-wrap">
                    <!--Contenedor del correo-->
                    <div class="correo d-flex flex-column text-center text-md-start text-lg-start">
                        <h5 class="p-0 m-0 open-sans-semibold">
                            Correo
                        </h5>
                        <p class="p-0 m-0 open-sans-regular">
                            ${row.correo_cliente}
                        </p>
                    </div>
                    <!--Contenedor del dui-->
                    <div class="dui d-flex flex-column text-center px-3">
                        <h5 class="p-0 m-0 open-sans-semibold">
                            DUI
                        </h5>
                        <p class="p-0 m-0 open-sans-regular">
                            ${row.dui_cliente}
                        </p>
                    </div>
                    <!--Contenedor del telefono-->
                    <div class="telefono d-flex flex-column">
                        <h5 class="p-0 m-0 open-sans-semibold">
                            Teléfono
                        </h5>
                        <p class="p-0 m-0 open-sans-regular">
                            ${row.telefono_cliente}
                        </p>
                    </div>
                </div>
                <!--Contenedor del footer de la info-->
                <div
                    class="info-footer d-flex flex-column mt-lg-5 mt-md-3 mt-4 mb-4 text-center text-md-start text-lg-start">
                    <h5 class="p-0 m-0 open-sans-semibold">
                        Rubro comercial al que pertenece
                    </h5>
                    <p class="p-0 m-0 open-sans-regular">
                        ${row.rubro_comercial}
                    </p>
                </div>
            </div>
        </div>
        <!--Contenedor de la columna derecha-->
        <div class="contenedor-drch d-flex flex-column col-lg-5 col-md-6 col-12 align-items-center ">
            <!--Contenedor de mas informacion-->
            <div
                class="contenedor-masinfo d-flex flex-column align-items-center justify-content-start col-12 mt-5 mt-md-0 mt-lg-0 p-5">
                <!--Contenedor del titulo, header de mas informacion-->
                <div class="masinfo-header">
                    <h3 class="m-0 p-0 open-sans-bold">
                        Más Información
                    </h3>
                </div>
                <!--Contenedor del body de màs informacion-->
                <div class="masinfo-body col-12">
                    <!--Contenedor de departamento-->
                    <div class="depa d-flex flex-column">
                        <h5 class="m-0 p-0 open-sans-semibold">Departamento de residencia</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.departamento_cliente}
                        </p>
                    </div>
                    <!--Contenedor de fecha de registro-->
                    <div class="fecharegistro d-flex flex-column">
                        <h5 class="m-0 p-0 open-sans-semibold">Fecha de registro en el taller</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.fecha_registro_cliente}
                        </p>
                    </div>
                    <!--Contenedor del nit-->
                    <div class="nit">
                        <h5 class="m-0 p-0 open-sans-semibold">Número de NIT</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NIT_cliente}
                        </p>
                    </div>
                    <!--Contenedor del nrc-->
                    <div class="nrc">
                        <h5 class="m-0 p-0 open-sans-semibold">Número de NRC</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NRC_cliente}
                        </p>
                    </div>
                    <div class="nrf">
                        <h5 class="m-0 p-0 open-sans-semibold">Número de NRF</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NRF_cliente}
                        </p>
                    </div>
                </div>
            </div>
            <!--Contenedor de la frecuencia del cliente-->
            <div class="col2Row2 col-10 graphic p-4 mb-5 mt-2"  id="graficaServiciosContainer">
                <canvas id="graficaServicios"></canvas> <!--Grafica-->
            </div>
        </div>
    `;
}

function formSetValues(row) {
    DUI.value = row.dui_cliente;
    NIT.value = row.NIT_cliente;
    TELEFONO.value = row.telefono_cliente;
    NRC.value = row.NRC_cliente;
    NRF.value = row.NRF_cliente;
    DEPARTAMENTO.value = row.departamento_cliente;
    NOMBRES.value = row.nombres_cliente;
    APELLIDOS.value = row.apellidos_cliente;
    CORREO.value = row.correo_cliente;
    RUBRO_COMERCIAL.value = row.rubro_comercial;
    TIPO_CLIENTE_INPUT.value = row.tipo_cliente;
}

//Funcion que muestra la alerta de confirmacion
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
        location.reload();
    }
}


// Función para obtener un parámetro específico de la URL
function getQueryParam(Param) {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(Param);
}

// *Funcion para ir a los detalles del automovil
function gotoDetailsCar() {
    location.href = "../../vistas/privado/detalles_automovil.html";
}
// *Funcion para ir a la pagina anterior
function goBack() {
    window.history.back();
}


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
