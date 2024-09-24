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
        // Acciones si la sesión SI está activa
        // Llamada a la función para llenar la tabla con los registros existentes.
        var primeraPestana = document.querySelector('#infoPersonal-tab');
        primeraPestana.click();
        readUsuarios();

    } else { // Acciones si la sesión NO está activa
        await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
    }
});

const INFO_PERSONAL = document.getElementById('infoPersonal');
const CHANGE_CONTRA = document.getElementById('changeContra');

// Función para mostrar el div de agregar trabajador y ocultar el div de la tabla.
function showInfoPersonal(boton) {
    CHANGE_CONTRA.classList.add('d-none');
    INFO_PERSONAL.classList.remove('d-none');
    updateButtonColors(boton);
}

// Función para mostrar el div de la tabla y ocultar el div de agregar trabajador.
function showChangeContra(boton) {
    CHANGE_CONTRA.classList.remove('d-none');
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
        <h3 id="userEmail"  class="email">${row.correo_usuario}</h3>
        <div class="lineR3"></div>
        `;
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
    const validationResult = validatePhoneNumber(TELEFONO.value); // Usar el valor del input correcto
    if (!validationResult.valid) {
        phoneERROR.textContent = validationResult.message;
        changeInput(TELEFONO, false);
    } else {
        phoneERROR.textContent = ''; // Limpia el mensaje si es válida
        changeInput(TELEFONO, true);
    }
});

CORREO.addEventListener('input', function () {
    const validationResult = validateEmail(CORREO.value); // Usar el valor del input correcto
    if (!validationResult.valid) {
        emailERROR.textContent = validationResult.message;
        changeInput(CORREO, false);
    } else {
        emailERROR.textContent = ''; // Limpia el mensaje si es válida
        changeInput(CORREO, true);
    }
});

SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();

    const phone = TELEFONO.value; // Obtener el valor del teléfono
    const validationResultPhone = validatePhoneNumber(phone); // Validar el número de teléfono
    const email = CORREO.value; // Obtener el valor del correo
    const validationResultEmail = validateEmail(email); // Validar el correo electrónico

    // Comprobar la validez del correo y del teléfono
    if (!validationResultEmail.valid || !validationResultPhone.valid) {
        // Si hay un error de validación para el correo
        if (!validationResultEmail.valid) {
            emailERROR.textContent = validationResultEmail.message;
        } else { emailERROR.textContent = '' }

        // Si hay un error de validación para el teléfono
        if (!validationResultPhone.valid) {
            phoneERROR.textContent = validationResultPhone.message;
        } else { phoneERROR.textContent = '' }

        return; // Detiene la ejecución si hay un error de validación
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

CONTRASENA_ACTUAL.addEventListener('input', function () {
    const validationMessage = validatePassword(CONTRASENA_ACTUAL.value); // Usar el valor del input correcto
    if (validationMessage) {
        passwordErrorACTUAL.textContent = validationMessage;
        changeInput(CONTRASENA_ACTUAL, false);
    } else {
        passwordErrorACTUAL.textContent = ''; // Limpia el mensaje si es válida
        changeInput(CONTRASENA_ACTUAL, true);
    }
});

const CONTRASENA_NUEVA = document.getElementById('input_contra');
const passwordErrorNUEVA = document.getElementById('passwordErrorNUEVA');

CONTRASENA_NUEVA.addEventListener('input', function () {
    const validationMessage = validatePassword(CONTRASENA_NUEVA.value); // Usar el valor del input correcto
    if (validationMessage) {
        passwordErrorNUEVA.textContent = validationMessage;
        changeInput(CONTRASENA_NUEVA, false);
    } else {
        passwordErrorNUEVA.textContent = ''; // Limpia el mensaje si es válida
        changeInput(CONTRASENA_NUEVA, true);
    }
});

const REPETIR_CONTRASENA = document.getElementById('input_repetircontra');
const passwordErrorREPIT = document.getElementById('passwordErrorREPIT');

REPETIR_CONTRASENA.addEventListener('input', function () {
    const isMatching = REPETIR_CONTRASENA.value === CONTRASENA_NUEVA.value;
    if (!isMatching) {
        passwordErrorREPIT.textContent = 'Las contraseñas no coinciden.';
        changeInput(REPETIR_CONTRASENA, false);
    } else {
        passwordErrorREPIT.textContent = ''; // Limpia el mensaje si coincide
        changeInput(REPETIR_CONTRASENA, true);
    }
});

// Método del evento para cuando se envía el formulario de cambiar contraseña.
PASSWORD_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    // Obtener los valores de las contraseñas
    const currentPassword = CONTRASENA_ACTUAL.value;
    const newPassword = CONTRASENA_NUEVA.value;
    const repeatPassword = REPETIR_CONTRASENA.value;

    // Validar las contraseñas
    const currentPasswordValidation = validatePassword(currentPassword);
    const newPasswordValidation = validatePassword(newPassword);
    const repeatPasswordValidation = validatePassword(repeatPassword);

    // Verificar si hay errores de validación
    if (currentPasswordValidation || newPasswordValidation || repeatPasswordValidation) {
        // Si hay errores, puedes mostrarlos en el lugar correspondiente
        if (currentPasswordValidation) {
            passwordErrorACTUAL.textContent = currentPasswordValidation;
        }
        if (newPasswordValidation) {
            passwordErrorNUEVA.textContent = newPasswordValidation;
        }
        if (repeatPasswordValidation) {
            passwordErrorREPIT.textContent = repeatPasswordValidation;
        }
        return; // No enviar el formulario si hay errores
    }

    // Verificar que las contraseñas nueva y repetir coincidan
    if (newPassword !== repeatPassword) {
        passwordErrorREPIT.textContent = 'Las contraseñas no coinciden.';
        return; // No enviar el formulario si las contraseñas no coinciden
    } else {
        passwordErrorREPIT.textContent = ''; // Limpia el mensaje si coinciden
    }

    // Verificar que la nueva contraseña no sea igual a la contraseña actual
    if (currentPassword === newPassword) {
        passwordErrorNUEVA.textContent = 'La nueva contraseña no puede ser la misma que la actual.';
        return; // No enviar el formulario si son iguales
    } else {
        passwordErrorNUEVA.textContent = ''; // Limpia el mensaje si son diferentes
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