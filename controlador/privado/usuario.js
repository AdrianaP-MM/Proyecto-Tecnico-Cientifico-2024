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

    if (DATA.session) {
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

function updateButtonColors(boton) {
    var botones = document.querySelectorAll('.boton-cambiar-color');
    botones.forEach(function (b) {
        b.style.backgroundColor = 'white';
        b.style.color = 'black';
        b.style.borderBottom = '0px solid red';
        b.style.border = '0px';
    });
    boton.style.backgroundColor = 'white';
    boton.style.color = 'black';
    boton.style.borderBottom = '3px solid red';
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

SAVE_FORM.addEventListener('submit', async (event) => {
    event.preventDefault();

    const phone = TELEFONO.value; // Obtener el valor del teléfono
    const validationResultPhone = validatePhoneNumber(phone); // Validar el número de teléfono
    const email = CORREO.value; // Obtener el valor del correo
    const validationResultEmail = validateEmail(email); // Validar el correo electrónico

    // Comprobar la validez del correo
    if (!validationResultEmail.valid) {
        await sweetAlert(2, validationResultEmail.message);
        return; // Detiene la ejecución si hay un error de validación
    }

    // Comprobar la validez del teléfono
    if (!validationResultPhone.valid) {
        await sweetAlert(2, validationResultPhone.message);
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

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

// Validación del campo teléfono
document.getElementById('telefonoUsuario').addEventListener('input', function (event) {
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

// Validación del campo correo
document.getElementById('correoUsuario').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar espacios en blanco
    inputValue = inputValue.replace(/\s/g, '');

    // Asegurar que el correo electrónico no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Expresión regular para permitir solo caracteres válidos en un correo electrónico
    const validEmailChars = /^[a-zA-Z0-9._%+-@]+$/;

    // Filtrar caracteres inválidos
    inputValue = inputValue.split('').filter(char => validEmailChars.test(char)).join('');

    // Actualizar el valor del campo de texto con la entrada limitada
    event.target.value = inputValue;
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
    } else {
        passwordErrorACTUAL.textContent = ''; // Limpia el mensaje si es válida
    }
});

const CONTRASENA_NUEVA = document.getElementById('input_contra');
const passwordErrorNUEVA = document.getElementById('passwordErrorNUEVA');

CONTRASENA_NUEVA.addEventListener('input', function () {
    const validationMessage = validatePassword(CONTRASENA_NUEVA.value); // Usar el valor del input correcto
    if (validationMessage) {
        passwordErrorNUEVA.textContent = validationMessage;
    } else {
        passwordErrorNUEVA.textContent = ''; // Limpia el mensaje si es válida
    }
});

const REPETIR_CONTRASENA = document.getElementById('input_repetircontra');
const passwordErrorREPIT = document.getElementById('passwordErrorREPIT');

REPETIR_CONTRASENA.addEventListener('input', function () {
    const isMatching = REPETIR_CONTRASENA.value === CONTRASENA_NUEVA.value;
    if (!isMatching) {
        passwordErrorREPIT.textContent = 'Las contraseñas no coinciden.';
    } else {
        passwordErrorREPIT.textContent = ''; // Limpia el mensaje si coincide
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

    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(PASSWORD_FORM);
    // Petición para guardar los datos del formulario.
    const responseData = await fetchData(USER_API, 'changePasswordDos', formData);

    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (responseData.status) {
        // Se muestra un mensaje de éxito.
        sweetAlert(1, responseData.message, true);
        // Se carga nuevamente la tabla para visualizar los cambios.
        readUsuarios();
    } else {
        if (responseData.error == 'Acción no disponible fuera de la sesión') {
            await sweetAlert(4, responseData.error, ', debe ingresar para continuar', true);
            location.href = 'index.html';
        } else {
            sweetAlert(2, responseData.error, true);
        }
    }
});
