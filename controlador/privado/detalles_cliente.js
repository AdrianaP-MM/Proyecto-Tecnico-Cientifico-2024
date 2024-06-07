// Constante para completar la ruta de la API.
const CLIENTES_API = 'services/privado/cliente.php';

const CLIENTE_DATA_CONTAINER = document.getElementById('clienteDataContainer');

// Constantes para establecer los elementos del componente Modal.
const MODAL = new bootstrap.Modal('#editarClienteModal');
const ADD_FORM = document.getElementById('addForm');

const RUBRO_COMERCIAL_DIV = document.getElementById('rubro_comercial');
const NRC_DIV = document.getElementById('nrc');
const NRF_DIV = document.getElementById('nrf');

// Constantes de cada campo del formulario
const DUI = document.getElementById('input_dui'),
    NIT = document.getElementById('input_nit'),
    TELEFONO = document.getElementById('input_telefono'),
    NRC = document.getElementById('input_nrc'),
    NRF = document.getElementById('input_nrf'),
    DEPARTAMENTO = document.getElementById('input_departamento'),
    NOMBRES = document.getElementById('input_nombre'),
    APELLIDOS = document.getElementById('input_apellido'),
    CORREO = document.getElementById('input_correo'),
    RUBRO_COMERCIAL = document.getElementById('input_rubro_comercial'),
    TIPO_CLIENTE_INPUT = document.getElementById('input_tipo_cliente');;


let TIPO_CLIENTE;

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    fillData();
});

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

const addSave = async () => {
    const isValid = await checkFormValidity(ADD_FORM);
    if (isValid) {
        console.log('TodoGud'); // Código a ejecutar después de la validación
        //Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(ADD_FORM);
        FORM.append('id_cliente', Number(getQueryParam('id_cliente')))
        FORM.append('tipo_cliente', 'Persona natural');

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CLIENTES_API, 'updateRow', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, 'Se ha actualizado con éxito', 300);
            fillData();
            MODAL.hide();
            ADD_FORM.classList.remove('was-validated'); // Quita la clase de validación
        } else {
            await sweetAlert(2, DATA.error, false);
        }
    } else {
        console.log('Que paso?: Formulario no válido');
    }
};

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

const openDelete = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres eliminar al cliente?', 'Podrás deshacer la acción en otro apartado');
    if (RESPONSE.isConfirmed) {
        const FORM = new FormData();
        FORM.append('id_cliente', Number(getQueryParam('id_cliente')));

        // Petición para guardar los datos del formulario.
        const DATA = await fetchData(CLIENTES_API, 'deleteRow', FORM);

        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, 'Se ha eliminado con éxito', 300);
            fillData();
            MODAL.hide();
            location.href = '../../vistas/privado/clientes.html';
        } else {
            await sweetAlert(2, DATA.error, false);
        }
       
    }
}

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
        let html = '';

        if (ROW.tipo_cliente == 'Persona natural') {
            RUBRO_COMERCIAL_DIV.classList.add('d-none');
            RUBRO_COMERCIAL.classList.add('d-none');
            NRC_DIV.classList.add('d-none');
            NRC.classList.add('d-none');
            NRF_DIV.classList.add('d-none');
            NRF.classList.add('d-none');
            formSetValues(ROW);
            html = getPersonaNaturalTemplate(ROW);
        } else {
            RUBRO_COMERCIAL_DIV.classList.remove('d-none');
            RUBRO_COMERCIAL.classList.remove('d-none');
            NRC_DIV.classList.remove('d-none');
            NRC.classList.remove('d-none');
            NRF_DIV.classList.remove('d-none');
            NRF.classList.remove('d-none');
            html = getPersonaJuridicaTemplate(ROW);
        }

        CLIENTE_DATA_CONTAINER.innerHTML = html;
    } else {
        sweetAlert(4, DATA.error, true);
    }
}

function getPersonaNaturalTemplate(row) {
    return `
    <div
        class="contenedor-izq d-flex flex-column col-lg-4 col-md-8 col-12 flex-wrap justify-content-center align-items-center">
        <img src="../../recursos/imagenes/user_exmpl.png">
        <div class="col-12 d-flex justify-content-end align-items-end">
            <button type="button" id="btnEditCliente" onclick="" data-bs-toggle="modal"
                data-bs-target="#editarClienteModal" class="btn btn-outline-primary col-10 btnEdit m-0 p-0">
                <img src="../../recursos/imagenes/icons/btn-edit.svg" class="svg1">
            </button>
        </div>
        <!-- Contenedor del info del cliente -->
        <div
            class="contenedor-info d-flex flex-column col-lg-12 col-md-11 col-10 justify-content-center align-items-center">
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
                        Telèfono
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
            class="contenedor-masinfo d-flex flex-column align-items-center justify-content-start col-12 mt-5 mt-md-0 mt-lg-0">
            <!--Contenedor mas info header -->
            <div class="masinfo-header">
                <h3 class="m-0 p-0 open-sans-bold">
                    Màs Informaciòn
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
                <div class="nit2">
                    <h5 class="m-0 p-0 open-sans-semibold">Nùmero de NIT</h5>
                    <p class="m-0 p-0 open-sans-regular">
                        ${row.NIT_cliente}
                    </p>
                </div>
            </div>
        </div>
        <!--Contenedor frecuencia-->
        <div
            class="contenedor-frecuencia d-flex flex-column col-lg-6 col-md-7 col-9 justify-content-center align-items-center">
            <!--Contenedor frecuencia header-->
            <div class="frecuencia-header text-center">
                <h6 class="m-0 p-0 open-sans-semibold">Frecuencia con la que el cliente
                    <br> vista nuestro taller
                </h6>
            </div>
            <!--Contenedor frecuencia body-->
            <div class="frecuencia-body d-flex flex-column">
                <h6 class="m-0 p-0 open-sans-regular">
                    Mes de abril
                </h6>
                <h3 class="m-0 p-0 open-sans-bold-italic">
                    XXXX Veces
                </h3>
            </div>
        </div>
    </div>
    `;
}

function getPersonaJuridicaTemplate(row) {
    return `
    <div class="fila1 col-12 d-flex flex-wrap">
        <div
            class="contenedor-izq d-flex flex-column col-lg-7 col-md-6 col-12 flex-wrap justify-content-center align-items-center">
            <img src="../../recursos/imagenes/user_exmpl2.png">
            <div
                class="contenedor-info d-flex flex-column col-lg-8 col-md-11 col-10 justify-content-center align-items-center">
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
                            Telèfono
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
        <div class="contenedor-drch d-flex flex-column col-lg-5 col-md-6 col-12 align-items-center">
            <!--Contenedor de mas informacion-->
            <div
                class="contenedor-masinfo d-flex flex-column align-items-center justify-content-start col-12 mt-5 mt-md-0 mt-lg-0">
                <!--Contenedor del titulo, header de mas informacion-->
                <div class="masinfo-header">
                    <h3 class="m-0 p-0 open-sans-bold">
                        Màs Informaciòn
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
                        <h5 class="m-0 p-0 open-sans-semibold">Nùmero de NIT</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NIT_cliente}
                        </p>
                    </div>
                    <!--Contenedor del nrc-->
                    <div class="nrc">
                        <h5 class="m-0 p-0 open-sans-semibold">Nùmero de NRC</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NRC_cliente}
                        </p>
                    </div>
                    <div class="nrf">
                        <h5 class="m-0 p-0 open-sans-semibold">Nùmero de NRF</h5>
                        <p class="m-0 p-0 open-sans-regular">
                            ${row.NRF_cliente}
                        </p>
                    </div>
                </div>
            </div>
            <!--Contenedor de la frecuencia del cliente-->
            <div
                class="contenedor-frecuencia d-flex flex-column col-lg-6 col-md-7 col-9 justify-content-center align-items-center">
                <!--Contenedor header de frecuencia-->
                <div class="frecuencia-header text-center">
                    <h6 class="m-0 p-0 open-sans-semibold">Frecuencia con la que el cliente
                        <br> vista nuestro taller
                    </h6>
                </div>
                <!--Contenedor body de frecuencia-->
                <div class="frecuencia-body d-flex flex-column">
                    <h6 class="m-0 p-0 open-sans-regular">
                        Mes de abril
                    </h6>
                    <h3 class="m-0 p-0 open-sans-bold-italic">
                        XX Veces
                    </h3>
                </div>
            </div>
        </div>
    </div>
    `;
}

function formSetValues(row)
{
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

document.getElementById('input_nrc').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Asegurar que el texto no supere los 11 caracteres
    inputValue = inputValue.slice(0, 11);

    // Actualizar el valor del campo de texto con la entrada validada
    event.target.value = inputValue;
});

document.getElementById('input_dui').addEventListener('input', function (event) {
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

document.getElementById('input_nit').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 14 dígitos
    inputValue = inputValue.slice(0, 14);

    // Formatear el número agregando los guiones
    let formattedValue = '';

    if (inputValue.length > 4) {
        formattedValue += inputValue.slice(0, 4) + '-';
        inputValue = inputValue.slice(4);
    }

    if (inputValue.length > 6) {
        formattedValue += inputValue.slice(0, 6) + '-';
        inputValue = inputValue.slice(6);
    }

    if (inputValue.length > 3) {
        formattedValue += inputValue.slice(0, 3) + '-';
        inputValue = inputValue.slice(3);
    }

    // Agregar el último grupo de dígitos
    if (inputValue.length > 0) {
        formattedValue += inputValue;
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = formattedValue;
});


document.getElementById('input_telefono').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 8 dígitos
    inputValue = inputValue.slice(0, 8);

    // Formatear el número agregando el guión
    if (inputValue.length > 4) {
        inputValue = inputValue.slice(0, 4) + '-' + inputValue.slice(4);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('input_nombre').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar caracteres que no sean letras, espacios o tildes
    inputValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ\s]/g, '');

    // Asegurar que el texto no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada validada
    event.target.value = inputValue;
});

document.getElementById('input_apellido').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar caracteres que no sean letras, espacios o tildes
    inputValue = inputValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ\s]/g, '');

    // Asegurar que el texto no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada validada
    event.target.value = inputValue;
});

document.getElementById('input_correo').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar espacios en blanco
    inputValue = inputValue.replace(/\s/g, '');

    // Asegurar que el correo electrónico no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada limitada
    event.target.value = inputValue;
});