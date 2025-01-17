// Llamada al PHP donde se encuentra el método
const USER_API = 'services/privado/usuarios.php';

CORREO = document.getElementById('correoUsuario');
TELEFONO = document.getElementById('telefonoUsuario');
SAVE_FORM = document.getElementById('inputUsuario');
ID_USUARIO = document.getElementById('id_usuario');
EMAIL = document.getElementById('userEmail');
LOGIN_FORM = document.getElementById('loginForm');
CONTENEDOR_CORREO = document.getElementById('userEmaill');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    const DATA = await fetchData(USER_API, 'readUsers');
    if (DATA.session) {
        applicateRules();
        getToggle();
        // Acciones si la sesión SI está activa
        // Llamada a la función para llenar la tabla con los registros existentes.
        var primeraPestana = document.querySelector('#infoPersonal-tab');
        primeraPestana.click();
        readUsuarios();

    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

const getTimerlock = async (CORREO) => {
    const FORM = new FormData();
    FORM.append('correoLogin', CORREO);
    const DATA_USER = await fetchData(USER_API, 'getUserData', FORM);

    if (DATA_USER.status) {
        const user = DATA_USER.dataset;
        const fechaUltimaModificacion = new Date(user.fecha_ultima_modificacion);

        // Sumar 90 días a la fecha de última modificación
        const fechaLimite = new Date(fechaUltimaModificacion);
        fechaLimite.setDate(fechaLimite.getDate() + 90);

        // Obtener la fecha actual
        const fechaActual = new Date();

        // Calcular la diferencia en milisegundos
        const diferencia = fechaLimite - fechaActual;

        // Verificar que aún no se ha cumplido el plazo
        if (diferencia > 0) {
            // Convertir la diferencia en días, horas y minutos
            const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

            let CONTAINER = document.getElementById("TimeContainer");
            CONTAINER.textContent = `${dias} días | ${horas} horas | ${minutos} minutos`;

        } else {
            await sweetAlert(2, "El plazo de 90 días ha expirado.", false);
        }

    }
}

const INFO_PERSONAL = document.getElementById('infoPersonal');
const CHANGE_CONTRA = document.getElementById('changeContra');
const AJUSTES = document.getElementById('ajustes');

// Función para mostrar el div de agregar trabajador y ocultar el div de la tabla.
function showInfoPersonal(boton) {
    AJUSTES.classList.add('d-none');
    CHANGE_CONTRA.classList.add('d-none');
    INFO_PERSONAL.classList.remove('d-none');
    updateButtonColors(boton);
}

// Función para mostrar el div de la tabla y ocultar el div de agregar trabajador.
function showChangeContra(boton) {
    AJUSTES.classList.add('d-none');
    CHANGE_CONTRA.classList.remove('d-none');
    INFO_PERSONAL.classList.add('d-none');
    updateButtonColors(boton);
}

// Función para mostrar el div de la tabla y ocultar el div de agregar trabajador.
function showAjustes(boton) {
    AJUSTES.classList.remove('d-none');
    CHANGE_CONTRA.classList.add('d-none');
    INFO_PERSONAL.classList.add('d-none');
    updateButtonColors(boton);
}

async function readUsuarios() {
    // Petición para obtener los datos del registro solicitado.
    const DATA = await fetchData(USER_API, 'readProfile');

    if (DATA.status) {
        // Se inicializan los campos con los datos.
        const row = DATA.dataset;
        CORREO.value = row.correo_usuario;
        TELEFONO.value = row.telefono_usuario;
        CONTENEDOR_CORREO.innerHTML += `
        <h4 id="userEmail"  class="email">${row.correo_usuario}</h4>
        <div class="lineR3"></div>
        `;

        userData = {
            telefono: row.telefono_usuario,
            email: row.correo_usuario
        };

        getTimerlock(userData.email);

    } else {
        if (DATA.error == 'Acción no disponible fuera de la sesión, debe ingresar para continuar') {
            await sweetAlert(4, DATA.error, true); location.href = 'index.html'
        }
        else {
            sweetAlert(4, DATA.error, true);
        }
    }
}

const emailERROR = document.getElementById('emailERROR');
const phoneERROR = document.getElementById('phoneERROR');

TELEFONO.addEventListener('input', function () {
    checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, phoneERROR);
});

CORREO.addEventListener('input', function () {
    checkInput(validateEmail(CORREO.value), CORREO, emailERROR);
});

SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (TELEFONO.value === '' || CORREO.value === '') {
        await sweetAlert(2, 'Por favor, complete todos los campos.', true);
        return;
    }

    if (!checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, phoneERROR) || !checkInput(validateEmail(CORREO.value), CORREO, emailERROR)) {
        return;
    }

    // Si ambos son válidos, continúa con el procesamiento
    const formData = new FormData(SAVE_FORM);
    const responseData = await fetchData(USER_API, 'editProfile', formData);

    if (responseData.status) {
        sweetAlert(1, 'Datos actualizados correctamente', true);
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        if (responseData.error === 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, responseData.error, ', debe ingresar para continuar', true);
            location.href = 'index.html';
        } else {
            sweetAlert(2, responseData.error, true);
        }
    }
});

/*
algunos caracteres especiales que son válidos en correos electrónicos:

. (punto)
_ (guion bajo)
% (porcentaje)
+ (más)
- (guion)
@ (arroba)*/


PASSWORD_FORM = document.getElementById('saveForm');

const CONTRASENA_ACTUAL = document.getElementById('input_contra_actual');
const passwordErrorACTUAL = document.getElementById('passwordErrorACTUAL');

const CONTRASENA_NUEVA = document.getElementById('input_contra');
const passwordErrorNUEVA = document.getElementById('passwordErrorNUEVA');

const REPETIR_CONTRASENA = document.getElementById('input_repetircontra');
const passwordErrorREPIT = document.getElementById('passwordErrorREPIT');

let userData = {};

CONTRASENA_ACTUAL.addEventListener('input', function () {
    checkInput(validatePassword(CONTRASENA_ACTUAL.value, userData), CONTRASENA_ACTUAL, passwordErrorACTUAL);
});

function countCheckedCheckboxes() {
    const checkboxes = [
        document.getElementById('charLength'),
        document.getElementById('uppercase'),
        document.getElementById('lowercase'),
        document.getElementById('number'),
        document.getElementById('specialChar')
    ];

    const checkedCount = checkboxes.filter(checkbox => checkbox.checked).length; // Contar los checkboxes marcados
    return checkedCount;
}

function updateCheckboxes(RESULT) {
    // Verificar los requisitos y actualizar los checkboxes
    document.getElementById('charLength').checked = !(RESULT.indices.includes(1) || RESULT.indices.includes(2)); // Marcar si ambos índices no están presentes
    document.getElementById('uppercase').checked = !RESULT.indices.includes(3); // Marcar si no está presente
    document.getElementById('lowercase').checked = !RESULT.indices.includes(4); // Marcar si no está presente
    document.getElementById('number').checked = !RESULT.indices.includes(5); // Marcar si no está presente
    document.getElementById('specialChar').checked = !RESULT.indices.includes(6); // Marcar si no está presente
}

CONTRASENA_NUEVA.addEventListener('input', function () {
    let RESULT = validatePassword(CONTRASENA_NUEVA.value, userData);
    checkInput(RESULT, CONTRASENA_NUEVA, passwordErrorNUEVA);
    // Llamar a la función para actualizar los checkboxes
    updateCheckboxes(RESULT);

    // Contar los checkboxes marcados
    const totalChecked = countCheckedCheckboxes();
    const messageContainer = document.getElementById('resultConContainer');
    if (!totalChecked) {
        messageContainer.innerHTML = '';
        messageContainer.innerHTML = '<h6 class="open-sans-semiBold clrRed"> La nueva contraseña es INVALIDA</h6>';
    }
    if (totalChecked === 5) {
        messageContainer.innerHTML = '';
        messageContainer.innerHTML = '<h6 class="open-sans-semiBold clrGreen"> La nueva contraseña es FUERTE :D</h6>';
    }

    if (totalChecked === 3 || totalChecked === 4) {
        messageContainer.innerHTML = '';
        messageContainer.innerHTML = '<h6 class="open-sans-semiBold clrOrng"> La nueva contraseña es MEDIANA :/</h6>';
    }

    if (totalChecked === 1 || totalChecked === 2) {
        messageContainer.innerHTML = '';
        messageContainer.innerHTML = '<h6 class="open-sans-semiBold clrYellow"> La nueva contraseña es DEBIL :c</h6>';
    }
});


REPETIR_CONTRASENA.addEventListener('input', function () {
    compare(REPETIR_CONTRASENA, CONTRASENA_NUEVA, passwordErrorREPIT);
});

// Método del evento para cuando se envía el formulario de cambiar contraseña.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    if (CONTRASENA_ACTUAL.value === '' || CONTRASENA_NUEVA === '' || REPETIR_CONTRASENA === '') {
        await sweetAlert(2, 'Por favor, complete todos los campos.', true);
        return;
    }

    if (!checkInput(validatePassword(CONTRASENA_ACTUAL.value, userData), CONTRASENA_ACTUAL, passwordErrorACTUAL) ||
        !checkInput(validatePassword(CONTRASENA_NUEVA.value, userData), CONTRASENA_NUEVA, passwordErrorNUEVA) ||
        !checkInput(validatePassword(REPETIR_CONTRASENA.value, userData), REPETIR_CONTRASENA, passwordErrorREPIT)) {
        return;
    }

    if (!compare(REPETIR_CONTRASENA, CONTRASENA_NUEVA, passwordErrorREPIT)) {
        return;
    }

    // Verificar que la nueva contraseña no sea igual a la contraseña actual
    if (CONTRASENA_ACTUAL.value === CONTRASENA_NUEVA.value) {
        passwordErrorNUEVA.textContent = 'La nueva contraseña no puede ser la misma que la actual.';
        changeInput(CONTRASENA_NUEVA, false);
        return; // No enviar el formulario si son iguales
    } else {
        passwordErrorNUEVA.textContent = ''; // Limpia el mensaje si son diferentes
        changeInput(CONTRASENA_NUEVA, true);
    }

    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(PASSWORD_FORM);
    // Petición para guardar los datos del formulario.
    const responseData = await fetchData(USER_API, 'changePasswordDos', formData);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (responseData.status) {
        // Se muestra un mensaje de éxito.
        sweetAlert(1, responseData.message, true);
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        if (responseData.error == 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, responseData.error, ', debe ingresar para continuar', true);
            location.href = 'index.html';
        } else {
            sweetAlert(2, responseData.error, true);
            if (responseData.error === 'Contraseña actual incorrecta') {
                passwordErrorACTUAL.textContent = responseData.error;
                changeInput(CONTRASENA_ACTUAL, false);
            }
        }
    }
});

function applicateRules() {
    // Agregar evento a cada campo de contraseña
    formatPassword(CONTRASENA_ACTUAL);
    formatPassword(CONTRASENA_NUEVA);
    formatPassword(REPETIR_CONTRASENA);
    formatPhone(TELEFONO);
    formatEmail(CORREO);

    disablePasteAndDrop(CORREO);
    disableCopy(CORREO);
    disablePasteAndDrop(TELEFONO);
    disableCopy(TELEFONO);
    disablePasteAndDrop(CONTRASENA_ACTUAL);
    disableCopy(CONTRASENA_ACTUAL);
    disablePasteAndDrop(CONTRASENA_NUEVA);
    disableCopy(CONTRASENA_NUEVA);
    disablePasteAndDrop(REPETIR_CONTRASENA);
    disableCopy(REPETIR_CONTRASENA);
}

// Función para mostrar un mensaje de confirmación y redirigir
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres cancelar?', 'Los datos ingresados no serán actualizados');
    if (RESPONSE.isConfirmed) {
        location.href = '../../vistas/privado/usuario.html';
    }
}

// Función para mostrar una notificación
const openNoti = async () => {
    sweetAlert(1, 'Se ha actualizado con éxito', 300);
}

// Función para cerrar sesión
const openLogout = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Está seguro de cerrar la sesión?');
    if (RESPONSE.isConfirmed) {
        location.href = '../../vistas/privado/index.html';
    }
}

/*Js para el toggle button*/

const getToggle = async () => {
    try {
        // Llamada a la API para obtener el estado del toggle
        const DATADOSPASOS = await fetchData(USER_API, 'readDosPasosToggle');

        // Verificar si el valor de dos_pasos es 1 o 0 y pasar el valor a la función que configura el estado del toggle
        if (DATADOSPASOS.dataset.dos_pasos == 1) {
            setToggleButtonState('1');  // Activado
        } else {
            setToggleButtonState('0');  // Desactivado
        }
    } catch (error) {
        console.error('Error al obtener el estado del toggle:', error);
    }
}

// Función para configurar el estado inicial del toggle desde la base de datos
async function setToggleButtonState(value) {
    const toggleButton = document.getElementById('toggleButton');

    if (value === '1') {
        toggleButton.checked = true; // Activado
    } else {
        toggleButton.checked = false; // Desactivado
    }
}

// Función para manejar el cambio de estado de forma asíncrona
document.getElementById('toggleButton').addEventListener('change', async function () {
    // Mostrar la alerta de confirmación antes de realizar el cambio
    const RESPONSE = await confirmAction2('¿Está seguro de cambiar el estado del botón?');

    if (RESPONSE.isConfirmed) {
        const toggleState = this.checked ? '1' : '0';

        // Crear una nueva instancia de FormData
        const FORM = new FormData();
        FORM.append('estadoToggle', toggleState);

        // Enviar la solicitud
        const DATADOSPASOS = await fetchData(USER_API, 'updateToggle', FORM);

        if (DATADOSPASOS.status) {
            sweetAlert(1, "Se ha cambiado la seguridad de la cuenta", true);
            getToggle();
        } else {
            sweetAlert(2, DATADOSPASOS.error, true);
            // Revertir el cambio si no se confirma
            this.checked = !this.checked;
        }

    } else {
        // Revertir el cambio si no se confirma
        this.checked = !this.checked;
    }
});

