
//Constante donde esta la ruta del archivo php
const USER_API = 'services/privado/usuarios.php';
const LOGIN_FORM = document.getElementById('LoginForm');
const CONREC_FORM = document.getElementById('RecForm');
const CONREST_FORM = document.getElementById('RestForm');

const textREC = document.getElementById('textREC');
const textREST = document.getElementById('textREST');
const MODAL = new bootstrap.Modal('#modalRegistrarUsuario');

//Constante para llamar al form de inicio de sesion
const FORM_LOGIN_INPUTS = document.getElementById('FormLoginInputs');
const ADD_FORM = document.getElementById('addForm');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Se muestra el formulario para iniciar sesión.
    LOGIN_FORM.classList.remove('d-none');
    // Se oculta el formulario de restablecimiento de contraseña (paso 1 y 2).
    CONREC_FORM.classList.add('d-none');
    CONREST_FORM.classList.add('d-none');
    // Petición para consultar los usuarios registrados.
    const DATA = await fetchData(USER_API, 'readUsers');
    // Se comprueba si existe una sesión, de lo contrario se sigue con el flujo normal.
    if (DATA.session) {
        // Se direcciona a la página web de bienvenida.
        location.href = 'panel_principal.html';
    } else if (DATA.status) {
        // Se muestra el formulario para iniciar sesión.
        LOGIN_FORM.classList.remove('d-none');
        sweetAlert(4, DATA.message, true);
    }

});


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


// Método del evento para cuando se envía el formulario de inicio de sesión.
FORM_LOGIN_INPUTS.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    const isValid = await checkFormValidity(FORM_LOGIN_INPUTS);
    if (isValid) {
        // Constante tipo objeto con los datos del formulario.
        const FORM = new FormData(FORM_LOGIN_INPUTS);
        // Petición para iniciar sesión.
        const DATA = await fetchData(USER_API, 'logIn', FORM);
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            // sweetAlert(1, DATA.message, true, 'panel_principal.html');
            location.href = 'panel_principal.html';
        } else {
            sweetAlert(2, DATA.error, false);
        }
    }
    else { }
});

//Funcion para mostrar el formulario de recuperar contraseña
function showRecCon() {
    LOGIN_FORM.classList.add('d-none');
    CONREC_FORM.classList.remove('d-none');
    textREC.classList.remove('d-none');
    textREST.classList.add('d-none');
    CONREST_FORM.classList.add('d-none');
}

//Funcion para mostrar el formulario de recuperacion de contraseña cuando se ha verificado la direccion de correo electronico
function showRestCon() {
    sweetAlert(1, 'Seguridad aprobada para recuperar contraseña', 250);
    LOGIN_FORM.classList.add('d-none');
    CONREC_FORM.classList.add('d-none');
    textREC.classList.add('d-none');
    textREST.classList.remove('d-none');
    CONREST_FORM.classList.remove('d-none');
}

//Funcion para mostrar el formulario de login
function showLogin() {
    LOGIN_FORM.classList.remove('d-none');
    CONREC_FORM.classList.add('d-none');
    textREC.classList.add('d-none');
    textREST.classList.add('d-none');
    CONREST_FORM.classList.add('d-none');
}


const openNoti1 = async () => {
    // Llamada a la función para mostrar una notificación
    sweetAlert(1, 'El <span class="open-sans-bold-italic">código de verificación</span> ha sido enviado a su direcciòn de corrreo electrónico', 250);
}

const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
      MODAL.hide();
      ADD_FORM.reset();
    }
  }

document.getElementById('Input_Contra2').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar los espacios en blanco
    inputValue = inputValue.replace(/\s/g, '');

    // Limitar la longitud máxima a 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada limitada
    event.target.value = inputValue;
});


document.getElementById('Input_ContraNEW').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar los espacios en blanco
    inputValue = inputValue.replace(/\s/g, '');

    // Limitar la longitud máxima a 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada limitada
    event.target.value = inputValue;
});

/**Aqui empiesa el script para poder recuperar la contraseña**/

let DATA2; // Declara DATA2 en un ámbito más amplio para que sea accesible desde ambos eventos
let id;

document.getElementById("forgetpasswordstepone").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    const INPUTCONTRA = document.getElementById("Input_Correo2");

    FORM1 = new FormData();
    FORM1.append('Input_Correo2', INPUTCONTRA.value);

    // Lógica asíncrona para obtener los datos del usuario
    const DATA = await fetchData(USER_API, 'searchMail', FORM1);
    if (DATA.status) {
        FORM2 = new FormData();
        var resultado = DATA.dataset;
        FORM2.append('Input_Correo2', INPUTCONTRA.value);

        id = resultado.id_usuario;

        DATA2 = await fetchData(USER_API, 'enviarCodigoRecuperacion', FORM2); // Asigna el valor de DATA2 aquí

        if (DATA2.status) {
            await sweetAlert(1, 'Se ha enviado correctamente al correo electrónico, ingrese el código enviado', true);
        } else {
            sweetAlert(2, DATA2.error, false);
        }

    } else {
        sweetAlert(2, DATA.error, false);
    }
});


document.getElementById("forgetpasswordsteptwo").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    const INPUTCODIGO = document.getElementById("codigoContra").value;
    if (INPUTCODIGO.trim() === DATA2.codigo) {
        await sweetAlert(1, 'Codigo verificado correctamente.', true);
        showRestCon();
    } else {
        await sweetAlert(2, 'Ingrese el codigo enviado en el correo.', true);
    }
});

function validatePassword(password) {
    // Expresión regular para validar que la contraseña cumpla con los requisitos
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])[A-Za-z\d!@#$%^&*()_+}{":;'?/>.<,]{8,}$/;
    return regex.test(password);
}

document.getElementById("forgetPasswordStepThree").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada
    const INPUTCONTRA = document.getElementById("Input_ContraNEW").value.trim();
    const INPUTCONFIRMARCONTRA = document.getElementById("Input_Contra2").value.trim();

    // Validar que las contraseñas coincidan
    if (INPUTCONTRA === INPUTCONFIRMARCONTRA) {
        // Validar que la contraseña cumpla con los requisitos
        if (validatePassword(INPUTCONTRA)) {
            const FORM1 = new FormData();
            FORM1.append('claveTrabajador', INPUTCONTRA);
            FORM1.append('confirmarTrabajador', INPUTCONFIRMARCONTRA);
            FORM1.append('idTrabajador', id);

            const DATA = await fetchData(USER_API, 'changePasswordLogin', FORM1);
            if (DATA.status) {
                sweetAlert(1, 'La contraseña ha sido restablecida correctamente', true);
                showLogin()
            } else {
                sweetAlert(2, DATA.error, false);
            }
        } else {
            sweetAlert(2, 'La contraseña debe tener al menos 8 caracteres, incluir letras mayúsculas y minúsculas, dígitos y caracteres especiales.', true);
        }
    } else {
        sweetAlert(2, 'Los campos de contraseña no coinciden.', true);
    }
});
