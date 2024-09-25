
//Constante donde esta la ruta del archivo php
const USER_API = 'services/privado/usuarios.php';
//Contenedor del formulario del login
const LOGIN_FORM = document.getElementById('LoginForm');
//Contenedor del formulario de recuperacion
const CONREC_FORM = document.getElementById('RecForm');
//Contenedor del formulario de rstablecer
const CONREST_FORM = document.getElementById('RestForm');

const textREC = document.getElementById('textREC');
const textREST = document.getElementById('textREST');

//Contenedor del apartado de registro
const CONTENEDOR_REGISTRO = document.getElementById('contenedorRegistro');

//Modal de la autenticacion de 2 pasos
const DOS_PASOS_MODAL = new bootstrap.Modal(document.getElementById('dosPasosModal'));
//Formulario de la autenticacion de 2 pasos
const DOS_PASOS_FORM = document.getElementById('formDosPasos');

// Formulario de REGISTRO
const ADD_FORM = document.getElementById('addForm');
//Formulario de LOGIN
const FORM_LOGIN_INPUTS = document.getElementById('FormLoginInputs');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    CONTENEDOR_REGISTRO.classList.add('d-none');
    const DATA = await fetchData(USER_API, 'readUsers');
    applicateRules();
    if (DATA.session) {
        // Hay una sesión activa
        location.href = 'panel_principal.html'; // Redirigir a la página principal o realizar acciones adicionales
    }
    if (DATA.status) { //Hay usuarios
        showLogin();
        await sweetAlert(4, DATA.message, true);
    }
    else { //No hay usuarios
        CONTENEDOR_REGISTRO.classList.remove('d-none')
    }
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
    CONTENEDOR_REGISTRO.classList.add('d-none');
    LOGIN_FORM.classList.remove('d-none');
    CONREC_FORM.classList.add('d-none');
    textREC.classList.add('d-none');
    textREST.classList.add('d-none');
    CONREST_FORM.classList.add('d-none');
}

const openNoti1 = async () => { sweetAlert(1, 'El <span class="open-sans-bold-italic">código de verificación</span> ha sido enviado a su direcciòn de corrreo electrónico', 250); }
const openClose = async () => {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Los datos ingresados no serán almacenados');
    if (RESPONSE.isConfirmed) {
        MODAL.hide();
        ADD_FORM.reset();
    }
}

//Inputs del REGISTRO (4)---------------------------------------------------------------------------------------
const CORREO_REGISTRO = document.getElementById('registro_input_correo');
const ERROR_CORREO_REGISTRO = document.getElementById('ERROR-CORREO-REGISTRO');

const TELEFONO_REGISTRO = document.getElementById('registro_input_telefono');
const ERROR_TELEFONO_REGISTRO = document.getElementById('ERROR-TELEFONO-REGISTRO');

const CONTRA_REGISTRO = document.getElementById('registro_input_contrasena');
const ERROR_CONTRA_REGISTRO = document.getElementById('ERROR-CONTRA-REGISTRO');

const CONTRA_REPIT_REGISTRO = document.getElementById('registro_input_contrasena2');
const ERROR_CONTRA_REPIT_REGISTRO = document.getElementById('ERROR-CONTRA2-REGISTRO');

let userData = {};

CORREO_REGISTRO.addEventListener('input', function () {
    checkInput(validateEmail(CORREO_REGISTRO.value), CORREO_REGISTRO, ERROR_CORREO_REGISTRO);
});

TELEFONO_REGISTRO.addEventListener('input', function () {
    checkInput(validatePhoneNumber(TELEFONO_REGISTRO.value), TELEFONO_REGISTRO, ERROR_TELEFONO_REGISTRO);
});

CONTRA_REGISTRO.addEventListener('input', function () {
    checkInput(validatePassword(CONTRA_REGISTRO.value), CONTRA_REGISTRO, ERROR_CONTRA_REGISTRO);
});

CONTRA_REPIT_REGISTRO.addEventListener('input', function () {
    compare(CONTRA_REPIT_REGISTRO, CONTRA_REGISTRO, ERROR_CONTRA_REPIT_REGISTRO);
});


// Método del evento para cuando se envía el formulario de registro de usuario
ADD_FORM.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar la recarga de la página después de enviar el formulario

    if (CORREO_REGISTRO.value === '' || TELEFONO_REGISTRO.value === '' || CONTRA_REGISTRO.value === '' || CONTRA_REPIT_REGISTRO.value === ''
    ) {
        await sweetAlert(2, 'Por favor, complete todos los campos', true);
        return;
    }

    if (!checkInput(validateEmail(CORREO_REGISTRO.value), CORREO_REGISTRO, ERROR_CORREO_REGISTRO) ||
        !checkInput(validatePhoneNumber(TELEFONO_REGISTRO.value), TELEFONO_REGISTRO, ERROR_TELEFONO_REGISTRO)) {
        return;
    } else {
        userData = {
            telefono: TELEFONO_REGISTRO.value,
            email: CORREO_REGISTRO.value
        };
    }

    if (!checkInput(validatePassword(CONTRA_REGISTRO.value, userData), CONTRA_REGISTRO, ERROR_CONTRA_REGISTRO) ||
        !checkInput(validatePassword(CONTRA_REPIT_REGISTRO.value, userData), CONTRA_REPIT_REGISTRO, ERROR_CONTRA_REPIT_REGISTRO)) {
        return;
    }

    if (!compare(CONTRA_REPIT_REGISTRO, CONTRA_REGISTRO, ERROR_CONTRA_REPIT_REGISTRO)) {
        return;
    }

    try {
        const DATA = await fetchData(USER_API, 'readUsers');
        if (DATA.error && DATA.error === 'Debe crear un administrador para comenzar') {
            // No hay usuarios registrados, se permite enviar el formulario
            const isValid = await checkFormValidity(ADD_FORM);
            if (isValid) {
                const FORM = new FormData(ADD_FORM);
                const DATA2 = await fetchData(USER_API, 'signUp', FORM);

                if (DATA2.status) {
                    await sweetAlert(1, DATA2.message, true);
                    location.href = 'index.html'; // Redirigir después de registrar correctamente
                } else {
                    // Mostrar SweetAlert con mensaje de error
                    if (DATA2.error === 'Acción no disponible dentro de la sesión') {
                        await sweetAlert(4, 'Ya tiene una sesión activa', true);
                        location.href = 'index.html'; // Redirigir en caso de sesión activa
                    } else {
                        await sweetAlert(2, DATA2.error, false); // Mostrar mensaje de error genérico
                    }
                }
            }
        } else {
            // Mostrar mensaje indicando que ya hay usuarios registrados
            await sweetAlert(4, 'Ya existen usuarios registrados. No es posible registrar más usuarios.', true);
            location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        await sweetAlert(2, 'Error al procesar la solicitud. Intente nuevamente más tarde.', false);
    }
});

// Inputs del LOGIN (2)---------------------------------------------------------------------------------------
const CORREO_LOGIN = document.getElementById('correoLogin');
const ERROR_CORREO_LOGIN = document.getElementById('ERROR-CORREO-LOGIN');

const CONTRA_LOGIN = document.getElementById('claveLogin');
const ERROR_CONTRA_LOGIN = document.getElementById('ERROR-CONTRA-LOGIN');

CORREO_LOGIN.addEventListener('input', function () {
    checkInput(validateEmail(CORREO_LOGIN.value), CORREO_LOGIN, ERROR_CORREO_LOGIN);
});

CONTRA_LOGIN.addEventListener('input', function () {
    checkInput(validatePassword(CONTRA_LOGIN.value), CONTRA_LOGIN, ERROR_CONTRA_LOGIN);
});

FORM_LOGIN_INPUTS.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recarga de página al enviar formulario

    // Validaciones de campos vacíos
    if (CONTRA_LOGIN.value === '' || CORREO_LOGIN.value === '') {
        await sweetAlert(2, 'Por favor, complete todos los campos', true);
        return;
    }

    // Validaciones de formato (correo y contraseña)
    if (!checkInput(validateEmail(CORREO_LOGIN.value), CORREO_LOGIN, ERROR_CORREO_LOGIN) ||
        !checkInput(validatePassword(CONTRA_LOGIN.value), CONTRA_LOGIN, ERROR_CONTRA_LOGIN)) {
        return;
    }
    try {
        const isValid = await checkFormValidity(FORM_LOGIN_INPUTS);
        if (isValid) {
            const FORM = new FormData(FORM_LOGIN_INPUTS); // Datos del formulario
            const DATADOSPASOS = await fetchData(USER_API, 'readDosPasos', FORM);

            if (DATADOSPASOS.status) {
                if (DATADOSPASOS.dataset.dos_pasos == 1) {
                    // Autenticación de dos pasos habilitada
                    mandarCodigoDosPasos(); // Enviar código
                    openDosPasos(); // Mostrar formulario de código

                    // Evento para verificar el código de dos pasos
                    document.getElementById('formDosPasos').addEventListener('submit', async function (event) {
                        event.preventDefault(); // Evitar recarga de página
                        const INPUTCODIGO = document.getElementById("inputValidarCod").value;

                        if (INPUTCODIGO.trim() === DATA2.codigo) {
                            const DATA = await fetchData(USER_API, 'logIn', FORM); // Intentar iniciar sesión
                            if (DATA.status) {
                                await sweetAlert(1, 'Código verificado correctamente.', true);
                                location.href = 'panel_principal.html'; // Redirigir al panel principal
                            } else {
                                if (DATA.error == 'Acción no disponible dentro de la sesión') {
                                    sweetAlert(4, "Ya tiene una sesión activa", true).then(() => location.href = 'index.html');
                                } else {
                                    sweetAlert(2, DATA.error, false);
                                    closePasosIncorrecto(); // Cerrar modal de código si es incorrecto
                                }
                            }
                        } else {
                            await sweetAlert(2, 'Ingrese el código enviado en el correo.', true);
                        }
                    });
                } else {
                    // Autenticación sin dos pasos
                    const FORM2 = new FormData();
                    FORM2.append('correoLogin', CORREO_LOGIN.value);
                    const DATA_USER = await fetchData(USER_API, 'getUserData', FORM2);

                    if (DATA_USER.status) {
                        const user = DATA_USER.dataset;

                        // Verificar si la cuenta está bloqueada
                        if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
                            await sweetAlert(2, `Tu cuenta está bloqueada hasta ${user.account_locked_until}.`, false);
                            return;
                        }
                        // } else if (!user.account_locked_until || new Date() >= new Date(user.account_locked_until)) {
                        //     // Restablecer los intentos fallidos solo si la cuenta no está bloqueada
                        //     const RESULT_START = await fetchData(USER_API, 'resetFailedAttempts', FORM2); // Restablecer intentos fallidos
                        //     if (RESULT_START.status) {
                        //         console.log('Intentos fallidos restablecidos.');
                        //         user.failed_attempts = 0; // Actualizar en el objeto local
                        //     }
                        // }

                        // Intentar iniciar sesión
                        const DATA = await fetchData(USER_API, 'logIn', FORM);
                        const isPasswordCorrect = DATA.status;

                        if (isPasswordCorrect) {
                            const RESULT_RESET = await fetchData(USER_API, 'resetFailedAttempts', FORM2); // Restablecer intentos fallidos
                            if (RESULT_RESET.status) {
                                console.log('// Restablecer intentos fallidos, inicia sesión');
                                location.href = 'panel_principal.html'; // Redirigir al panel principal
                            }
                        } else {
                            // Incrementar intentos fallidos
                            const newFailedAttempts = user.failed_attempts + 1;

                            if (newFailedAttempts >= 3) {
                                // Bloquear cuenta por 24 horas
                                const lockDuration = 24 * 60 * 60 * 1000; // 24 horas
                                const now = new Date();
                                const accountLockedUntil = new Date(now.getTime() + lockDuration);

                                const accountLockedUntilSQL = formatDateForSQL(accountLockedUntil);
                                FORM2.append('accountLockedUntil', accountLockedUntilSQL);

                                const REULST_BLOCK = await fetchData(USER_API, 'blockAccount', FORM2);
                                if (REULST_BLOCK.status) {
                                    await sweetAlert(2, 'Tu cuenta ha sido bloqueada por 24 horas debido a múltiples intentos fallidos.', false);
                                }
                            } else {
                                const REULST_INCREMENT = await fetchData(USER_API, 'incrementFailedAttempts', FORM2);
                                if (REULST_INCREMENT.status) {
                                    await sweetAlert(2, `Contraseña incorrecta. Tienes ${3 - newFailedAttempts} intentos restantes.`, false);
                                }
                            }
                        }
                    }
                }
            } else {
                await sweetAlert(2, DATADOSPASOS.error, false); // Mostrar error si no se encuentran datos
            }
        }
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        await sweetAlert(2, 'Error al procesar la solicitud. Intente nuevamente más tarde.', false);
    }
});

const formatDateForSQL = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Mes (agrega el 0 si es necesario)
    const day = ('0' + date.getDate()).slice(-2); // Día (agrega el 0 si es necesario)
    const hours = ('0' + date.getHours()).slice(-2); // Hora
    const minutes = ('0' + date.getMinutes()).slice(-2); // Minutos
    const seconds = ('0' + date.getSeconds()).slice(-2); // Segundos

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Inputs del Recuperación de contraseña PASO 1---------------------------------------------------------------------------------------
const CORREO_RECUPERAR = document.getElementById('Input_Correo2');
const ERROR_CORREO_RECUPERAR = document.getElementById('ERROR-CORREO-RECUPERAR');

CORREO_RECUPERAR.addEventListener('input', function () {
    checkInput(validateEmail(CORREO_RECUPERAR.value), CORREO_RECUPERAR, ERROR_CORREO_RECUPERAR);
});

let DATA2;
let id;

document.getElementById("forgetpasswordstepone").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada

    if (CORREO_RECUPERAR.value === '') {
        await sweetAlert(2, 'Por favor, ingrese su correo electrónico.', true);
        return;
    }

    if (!checkInput(validateEmail(CORREO_RECUPERAR.value), CORREO_RECUPERAR, ERROR_CORREO_RECUPERAR)) {
        return;
    }

    FORM1 = new FormData();
    FORM1.append('Input_Correo2', CORREO_RECUPERAR.value);

    // Lógica asíncrona para obtener los datos del usuario
    const DATA = await fetchData(USER_API, 'searchMail', FORM1);
    if (DATA.status) {
        FORM2 = new FormData();
        var resultado = DATA.dataset;
        FORM2.append('Input_Correo2', CORREO_RECUPERAR.value);

        id = resultado.id_usuario;

        DATA2 = await fetchData(USER_API, 'enviarCodigoRecuperacion', FORM2); // Asigna el valor de DATA2 aquí

        if (DATA2.status) {
            await sweetAlert(1, 'Se ha enviado correctamente al correo electrónico, ingrese el código enviado', true);
        } else {
            await sweetAlert(2, DATA2.error, false);
        }

    } else {
        await sweetAlert(2, DATA.error, false);
    }
});

const CODIGO_RECUPERAR = document.getElementById('codigoContra');
const ERROR_CODIGO_RECUPERAR = document.getElementById('ERROR-CODIGO-RECUPERAR');

CODIGO_RECUPERAR.addEventListener('input', function () {
    checkInput(validateCodigo(CODIGO_RECUPERAR.value), CODIGO_RECUPERAR, ERROR_CODIGO_RECUPERAR);
});

document.getElementById("forgetpasswordsteptwo").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada
    if (DATA2) {
        if (CODIGO_RECUPERAR.value === '') {
            await sweetAlert(2, 'Por favor, complete este campo.', true);
            return;
        }
        const INPUTCODIGO = CODIGO_RECUPERAR.value;
        if (INPUTCODIGO.trim() === DATA2.codigo) {
            await sweetAlert(1, 'Codigo verificado correctamente.', true);
            showRestCon();
        } else {
            await sweetAlert(2, 'Ingrese el codigo enviado en el correo.', true);
        }
    } else {
        await sweetAlert(2, 'No se le ha mandado ningún código, por favor, complete el campo anterior y haga click en enviar.', true);
    }
});

// Inputs del Recuperación de contraseña PASO 2---------------------------------------------------------------------------------------
const CONTRA_RECUPERAR = document.getElementById('Input_ContraNEW');
const ERROR_CONTRA_RECUPERAR = document.getElementById('ERROR-CONTRASEÑA-RECUPERAR');

const CONTRA_REPIT_RECUPERAR = document.getElementById('Input_Contra2');
const ERROR_CONTRA_REPIT_RECUPERAR = document.getElementById('ERROR-CONTRASEÑA2-RECUPERAR');

CONTRA_RECUPERAR.addEventListener('input', function () {
    checkInput(validatePassword(CONTRA_RECUPERAR.value), CONTRA_RECUPERAR, ERROR_CONTRA_RECUPERAR);
});

CONTRA_REPIT_RECUPERAR.addEventListener('input', function () {
    compare(CONTRA_REPIT_RECUPERAR, CONTRA_RECUPERAR, ERROR_CONTRA_REPIT_RECUPERAR);
});

document.getElementById("forgetPasswordStepThree").addEventListener("submit", async function (event) {
    event.preventDefault(); // Esto evita que el formulario se envíe de forma predeterminada
    const INPUTCONTRA = CONTRA_RECUPERAR.value.trim();
    const INPUTCONFIRMARCONTRA = CONTRA_REPIT_RECUPERAR.value.trim();

    if (CONTRA_RECUPERAR.value === '' || CONTRA_REPIT_RECUPERAR === '') {
        await sweetAlert(2, 'Por favor, complete todos los campos', true);
        return;
    }

    if (!checkInput(validatePassword(CONTRA_RECUPERAR.value), CONTRA_RECUPERAR, ERROR_CONTRA_RECUPERAR) ||
        !checkInput(validatePassword(CONTRA_REPIT_RECUPERAR.value), CONTRA_REPIT_RECUPERAR, ERROR_CONTRA_REPIT_RECUPERAR)) {
        return;
    }

    if (!compare(CONTRA_REPIT_RECUPERAR, CONTRA_RECUPERAR, ERROR_CONTRA_REPIT_RECUPERAR)) {
        return;
    }

    // Validar que las contraseñas coincidan
    if (INPUTCONTRA === INPUTCONFIRMARCONTRA) {
        // Validar que la contraseña cumpla con los requisitos
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
        sweetAlert(2, 'Los campos de contraseña no coinciden.', true);
    }
});

function applicateRules() {
    //Formatos del registro----------
    formatEmail(CORREO_REGISTRO);
    formatPhone(TELEFONO_REGISTRO);
    formatPassword(CONTRA_REGISTRO);
    formatPassword(CONTRA_REPIT_REGISTRO);

    disablePasteAndDrop(CORREO_REGISTRO);
    disableCopy(CORREO_REGISTRO);

    disablePasteAndDrop(TELEFONO_REGISTRO);
    disableCopy(TELEFONO_REGISTRO);

    disablePasteAndDrop(CONTRA_REGISTRO);
    disableCopy(CONTRA_REGISTRO);

    disablePasteAndDrop(CONTRA_REPIT_REGISTRO);
    disableCopy(CONTRA_REPIT_REGISTRO);

    //Formatos del login----------
    formatEmail(CORREO_LOGIN);
    formatPassword(CONTRA_LOGIN);

    disablePasteAndDrop(CORREO_LOGIN);
    disableCopy(CORREO_LOGIN);

    disablePasteAndDrop(CONTRA_LOGIN);
    disableCopy(CONTRA_LOGIN);

    //Formatos de recuperar PASO 1----------
    formatEmail(CORREO_RECUPERAR)
    formatCodigo(CODIGO_RECUPERAR);

    disablePasteAndDrop(CORREO_RECUPERAR);
    disableCopy(CORREO_RECUPERAR);

    disablePasteAndDrop(CODIGO_RECUPERAR);
    disableCopy(CODIGO_RECUPERAR);

    //Formatos de recuperar PASO 2----------
    formatPassword(CONTRA_RECUPERAR)
    formatPassword(CONTRA_REPIT_RECUPERAR);

    disablePasteAndDrop(CONTRA_RECUPERAR);
    disableCopy(CONTRA_RECUPERAR);

    disablePasteAndDrop(CONTRA_REPIT_RECUPERAR);
    disableCopy(CONTRA_REPIT_RECUPERAR);
}

/*JS DE VALIDACION EN DOS PASOS*/

const openDosPasos = () => {
    // Se muestra la caja de diálogo con su título.
    DOS_PASOS_MODAL.show();
    // Se prepara el formulario.
    DOS_PASOS_FORM.reset();
}

const closeDosPasos = async () => {
    const RESPONSE = await confirmAction2('¿Seguro qué quieres regresar?', 'Tendras que ingresar el codigo de nuevo');
    if (RESPONSE.isConfirmed) {
        DOS_PASOS_MODAL.hide();
    }
}

const closePasosIncorrecto = async () => {
    DOS_PASOS_MODAL.hide();
}

const mandarCodigoDosPasos = async () => {
    const INPUTCONTRA = document.getElementById("correoLogin");
    FORM1 = new FormData();
    FORM1.append('correoLogin', INPUTCONTRA.value);

    // Lógica asíncrona para obtener los datos del usuario
    const DATA = await fetchData(USER_API, 'searchMailDosPasos', FORM1);
    if (DATA.status) {
        FORM2 = new FormData();
        var resultado = DATA.dataset;
        FORM2.append('correoLogin', INPUTCONTRA.value);

        id = resultado.id_usuario;

        DATA2 = await fetchData(USER_API, 'enviarCodigoDosPasos', FORM2); // Asigna el valor de DATA2 aquí

        if (DATA2.status) {
            await sweetAlert(1, '!Revisa tu correo!, se ha mandado un codigo para esta medida de seguridad', true);
        } else {
            await sweetAlert(2, DATA2.error, false);
        }

    } else {
        await sweetAlert(2, DATA.error, false);
    }
}

document.getElementById('inputValidarCod').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar cualquier espacio en blanco
    inputValue = inputValue.replace(/\s/g, '');

    // Asegurar que el valor no supere los 8 caracteres
    inputValue = inputValue.slice(0, 8);

    // Actualizar el valor del campo de texto con la entrada limitada y sin espacios
    event.target.value = inputValue;
});