/*
*   CONTROLADOR DE USO GENERAL EN TODAS LAS PÁGINAS WEB.
*/
// Constante para establecer la ruta base del servidor.
const SERVER_URL = 'http://localhost/Proyecto-Tecnico-Cientifico-2024/api/';

/*
*   Función para mostrar un mensaje de confirmación. Requiere la librería sweetalert para funcionar.
*   Parámetros: message (mensaje de confirmación).
*   Retorno: resultado de la promesa.
*/
const confirmAction = (message) => {
    return swal({
        title: 'Advertencia',
        text: message,
        icon: 'warning',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
}

const confirmUpdateAction = (message) => {
    return swal({
        title: 'Aviso',
        text: message,
        icon: 'info',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true
            },
            confirm: {
                text: 'Sí',
                value: true,
                visible: true
            }
        }
    });
}

/*
*   Función asíncrona para manejar los mensajes de notificación al usuario. Requiere la librería sweetalert para funcionar.
*   Parámetros: type (tipo de mensaje), text (texto a mostrar), timer (uso de temporizador) y url (valor opcional con la ubicación de destino).
*   Retorno: ninguno.
*/
const sweetAlert = async (type, text, timer) => {
    // Se compara el tipo de mensaje a mostrar.
    switch (type) {
        case 1:
            title = 'Éxito';
            icon = 'success';
            break;
        case 2:
            title = 'Error';
            icon = 'error';
            break;
        case 3:
            title = 'Advertencia';
            icon = 'warning';
            break;
        case 4:
            title = 'Aviso';
            icon = 'info';
    }
    // Se define un objeto con las opciones principales para el mensaje.
    let options = {
        title: title,
        html: text,
        icon: icon,
        closeOnClickOutside: false,
        closeOnEsc: false,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#E5383B'
    };
    // Se verifica el uso del temporizador.
    (timer) ? options.timer = 3000 : options.timer = null;
    // Se muestra el mensaje.
    await swal.fire(options);
}
/*
*   Función para generar un gráfico de barras verticales. Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const barGraph = (canvas, xAxis, yAxis, legend, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = Array(xAxis.length).fill('#69090B'); // Todas las barras tendrán el color rojo.
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: colors,
                borderRadius: 25,
                borderSkipped: false,
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

const lineGraph = (canvas, xAxis, yAxis, legend, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    xAxis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'line',
        data: {
            labels: xAxis,
            datasets: [{
                label: legend,
                data: yAxis,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

/*
*   Función para generar un gráfico de pastel. Requiere la librería chart.js para funcionar.
*   Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).
*   Retorno: ninguno.
*/
const pieGraph = (canvas, legends, values, title) => {
    // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'pie',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

/*
*   Función asíncrona para cerrar la sesión del usuario.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const logOut = async () => {
    // Se muestra un mensaje de confirmación y se captura la respuesta en una constante.
    /*const confirmed = await Swal.fire({
        title: '¿Está seguro de cerrar la sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        confirmButtonClass: 'btn btn-danger', // Clase para el botón "Sí" (rojo)
        cancelButtonClass: 'btn btn-secondary', // Clase para el botón "Cancelar" (negro)
        customClass: {
            confirmButton: "btn btn-success",   // Estilo del botón "Sí".
            cancelButton: "btn btn-danger"      // Estilo del botón "No".
        }
    });*/

    confirmed = await confirmAction2('Advertencia', '¿Está seguro de cerrar la sesión?')
    // Se verifica si el usuario confirmó la acción.
    if (confirmed.isConfirmed) {
        // Petición para eliminar la sesión.
        const DATA = await fetchData(USER_API, 'logOut');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true);
            window.location.href = 'index.html';
        } else {
            if (DATA.error == 'Acción no disponible fuera de la sesión') {
                await sweetAlert(4, DATA.error, ', debe ingresar para continuar', true); location.href = 'index.html'
            }
            else {
                sweetAlert(4, DATA.error, true);
            }
        }
    }
}

const confirmAction2 = (title, message) => {
    // Crea una instancia personalizada de SweetAlert con estilos Bootstrap.
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",   // Estilo del botón "Sí".
            cancelButton: "btn btn-danger"      // Estilo del botón "No".
        },
        buttonsStyling: false   // Desactiva los estilos por defecto de SweetAlert.
    });

    // Muestra la modal de confirmación con los parámetros proporcionados.
    return swalWithBootstrapButtons.fire({
        title: title,               // Título de la modal.
        text: message,              // Mensaje de la modal.
        icon: 'warning',            // Ícono de advertencia.
        showCancelButton: true,      // Muestra el botón "Cancelar/No".
        confirmButtonText: "Sí",    // Texto del botón de confirmación.
        cancelButtonText: "No",     // Texto del botón de cancelación.
        closeOnClickOutside: false,  // Evita cerrar la modal al hacer clic fuera de ella.
        closeOnEsc: false,           // Evita cerrar la modal al presionar la tecla Esc.
        reverseButtons: true         // Invierte la posición de los botones.
    });
}

/*
*   Función asíncrona para intercambiar datos con el servidor.
*   Parámetros: filename (nombre del archivo), action (accion a realizar) y form (objeto opcional con los datos que serán enviados al servidor).
*   Retorno: constante tipo objeto con los datos en formato JSON.
*/
const fetchData = async (filename, action, form = null) => {
    // Se define una constante tipo objeto para establecer las opciones de la petición.
    const OPTIONS = {};
    // Se determina el tipo de petición a realizar.
    if (form) {
        OPTIONS.method = 'post';
        OPTIONS.body = form;
    } else {
        OPTIONS.method = 'get';
    }
    try {
        // Se declara una constante tipo objeto con la ruta específica del servidor.
        const PATH = new URL(SERVER_URL + filename);
        // Se agrega un parámetro a la ruta con el valor de la acción solicitada.
        PATH.searchParams.append('action', action);
        // Se define una constante tipo objeto con la respuesta de la petición.
        const RESPONSE = await fetch(PATH.href, OPTIONS);
        // Se retorna el resultado en formato JSON.
        return await RESPONSE.json();
    } catch (error) {
        // Se muestra un mensaje en la consola del navegador web cuando ocurre un problema.
        console.log(error);
    }
}

/*
*   Función asíncrona para cargar las opciones en un select de formulario.
*   Parámetros: filename (nombre del archivo), action (acción a realizar), select (identificador del select en el formulario) y filter (dato opcional para seleccionar una opción o filtrar los datos).
*   Retorno: ninguno.
*/
const fillSelect = async (filename, action, select, selected = null, form = null) => {
    // Petición para obtener los datos.
    const DATA = await fetchData(filename, action, form);
    let content = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje.
    if (DATA.status) {
        content += '<option value="" selected>Seleccione una opción</option>';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se obtiene el dato del primer campo.
            value = Object.values(row)[0];
            // Se obtiene el dato del segundo campo.
            text = Object.values(row)[1];
            // Se verifica cada valor para enlistar las opciones.
            if (value != selected) {
                content += `<option value="${value}">${text}</option>`;
            } else {
                content += `<option value="${value}" selected>${text}</option>`;
            }
        });
    } else {
        content += '<option>No hay opciones disponibles</option>';
    }
    // Se agregan las opciones a la etiqueta select mediante el id.
    document.getElementById(select).innerHTML = content;
}

function getDateToMysql() {
    // Crear un nuevo objeto Date para obtener la fecha y hora actual
    let fechaActual = new Date();

    // Formatear la fecha y hora en el formato adecuado para MySQL (YYYY-MM-DD HH:MM:SS)
    let fechaMySQL = fechaActual.getFullYear() + '-' +
        ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '-' +
        ('0' + fechaActual.getDate()).slice(-2) + ' ' +
        ('0' + fechaActual.getHours()).slice(-2) + ':' +
        ('0' + fechaActual.getMinutes()).slice(-2) + ':' +
        ('0' + fechaActual.getSeconds()).slice(-2);

    // Mostrar la fecha y hora formateada en la consola
    console.log(fechaMySQL);
    return fechaMySQL;
}

function formatDateToMySQL(dateValue) {
    // Crear un nuevo objeto Date usando el valor recibido
    let fecha = new Date(dateValue);

    // Formatear la fecha en el formato adecuado para MySQL (YYYY-MM-DD)
    let fechaFormateada = fecha.getFullYear() + '-' +
        ('0' + (fecha.getMonth() + 1)).slice(-2) + '-' +
        ('0' + fecha.getDate()).slice(-2);

    // Devolver la fecha formateada
    return fechaFormateada;
}

function convertMySQLDateToJSDate(mysqlDate) {
    const [year, month, day] = mysqlDate.split("-");
    return `${month}/${day}/${year}`;
}

function convertMySQLTimeToHTMLTime(mysqlTime) {
    let [hours, minutes, seconds] = mysqlTime.split(":");
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');
    return `${hours}:${minutes}`;
}

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

// TODO ----------------------- FUNCIONES PARA LAS GRÁFICAS-----------------------------
const graphBarChartBorderRadiusYAXIS = (canvas, graphTitle, XTitle, YTitle, xAsis, datasets, legend) => {
    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: xAsis, // Etiquetas para el eje X
            datasets: datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor,
                borderRadius: 5,
                borderSkipped: false,
            }))
        },
        options: {
            indexAxis: 'y', // Eje X es vertical (barra horizontal)
            responsive: true,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: graphTitle
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: YTitle
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: XTitle
                    }
                }
            }
        }
    });
}

const graphLineStyling = (canvas, graphTitle, XTitle, YTitle, data) => {
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: graphTitle
                },
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: XTitle
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: YTitle
                    }
                }
            }
        },
    });
}

const graphBarChartBorderRadius = (canvas, graphTitle, XTitle, YTitle, xAsis, values, legend) => {
    let colors = [];
    xAsis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });

    new Chart(document.getElementById(canvas), {
        type: 'bar',
        data: {
            labels: xAsis,
            datasets: [{
                label: legend,
                data: values,
                backgroundColor: colors,
                borderRadius: 25,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: graphTitle
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: XTitle
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: YTitle
                    },
                    ticks: {
                        callback: function (value) {
                            const hours = Math.floor(value / 60);
                            const minutes = value % 60;
                            return `${hours}h ${minutes}m`;
                        }
                    }
                }
            }
        },
    });
}

let existingDoughnutChart;

const getRandomColor = () => {
    // Genera un color hexadecimal aleatorio
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const doughnutGraph = (canvas, legends, values, title) => {
    // Destruir el gráfico existente si existe
    if (existingDoughnutChart) {
        existingDoughnutChart.destroy();
    }

    // Generar colores aleatorios para cada segmento
    const colors = legends.map(() => getRandomColor());

    // Crear el nuevo gráfico y guardar la referencia
    existingDoughnutChart = new Chart(document.getElementById(canvas), {
        type: 'doughnut',
        data: {
            labels: legends,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}
/*-----------------------------------------------------------------FUNCIONES REPETITIVAS------------------------------------------------------------------*/
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

function disablePasteAndDrop(inputElement) {
    // Evitar que el usuario pegue texto
    inputElement.addEventListener('paste', function (event) {
        event.preventDefault(); // Prevenir la acción de pegar
    });

    // Evitar que el usuario suelte texto
    inputElement.addEventListener('drop', function (event) {
        event.preventDefault(); // Prevenir la acción de soltar
    });
}

function disableCopy(inputElement) {
    // Evitar que el usuario copie el texto
    inputElement.addEventListener('copy', function (event) {
        event.preventDefault(); // Prevenir la acción de copiar
    });
}

function checkInput(FUNCTION, INPUT, SPAN) {
    if (!FUNCTION.valid) {
        SPAN.textContent = FUNCTION.message;
        changeInput(INPUT, false);
        return false;
    } else {
        SPAN.textContent = ''; // Limpia el mensaje si es válida
        changeInput(INPUT, true);
        return true;
    }
}

function changeInput(INPUT, STATE) {
    if (STATE) {
        INPUT.classList.add('is-valid');
        INPUT.classList.remove('is-invalid');
    } else {
        INPUT.classList.remove('is-valid');
        INPUT.classList.add('is-invalid');
    }
}

function compare(INPUT1, INPUT2, SPAN) {
    const isMatching = INPUT1.value === INPUT2.value;
    if (!isMatching) {
        SPAN.textContent = 'Las contraseñas no coinciden.';
        changeInput(INPUT1, false);
        return false;
    } else {
        passwordErrorREPIT.textContent = ''; // Limpia el mensaje si coincide
        changeInput(INPUT1, true);
        return true;
    }
}

/*-----------------------------------------------------------------FORMATOS------------------------------------------------------------------*/
function formatPhone(input) {
    input.addEventListener('input', function (event) {
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
}

function formatEmail(input) {
    input.addEventListener('input', function (event) {
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
}

// Función para formatear la contraseña
function formatPassword(input) {
    input.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar espacios en blanco
        inputValue = inputValue.replace(/\s/g, '');

        // Asegurar que la contraseña no supere los 50 caracteres
        inputValue = inputValue.slice(0, 50);

        // Expresión regular para permitir solo caracteres válidos en una contraseña
        const validPasswordChars = /^[a-zA-Z0-9._%+-@!#$%^&*]+$/;

        // Filtrar caracteres inválidos
        inputValue = inputValue.split('').filter(char => validPasswordChars.test(char)).join('');

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;
    });
}

/*-----------------------------------------------------------------VALIDACIONES(Mensajes de error)------------------------------------------------------------------*/

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validar formato
    const allowedDomains = [
        'gmail.com',
        'hotmail.com',
        'yahoo.com',
        'outlook.com',
        'aol.com',          // Añadido: AOL
        'icloud.com',       // Añadido: iCloud
        'mail.com',         // Añadido: Mail.com
        'zoho.com',         // Añadido: Zoho
        'gmx.com',          // Añadido: GMX
        'protonmail.com',   // Añadido: ProtonMail
        'gmail.sv',
        'hotmail.sv',
        'yahoo.sv',
        'outlook.sv',
        'icloud.sv',
        'ricaldone.edu.sv'
    ];

    // Validar longitud
    if (email.length < 5 || email.length > 50) {
        return { valid: false, message: 'El correo debe tener entre 5 y 50 caracteres.' };
    }

    // Validar formato
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Formato de correo electrónico no válido.' };
    }

    // Extrae el dominio del correo electrónico
    const domain = email.split('@')[1];

    // Validar dominio
    if (!allowedDomains.includes(domain)) {
        return { valid: false, message: 'Dominio del correo electrónico no permitido.' };
    }

    return { valid: true, message: 'Correo electrónico válido.' };
}

function validatePhoneNumber(phone) {
    // Expresión regular para validar el formato nnnn-nnnn que inicie con 2, 6 o 7
    const phoneRegex = /^[267][0-9]{3}-[0-9]{4}$/;

    // Validar formato
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Formato de número de teléfono no válido. Debe iniciar con 2, 6 o 7 y seguir el formato nnnn-nnnn.' };
    }

    return { valid: true, message: 'Número de teléfono válido.' };
}

function validatePassword(password, userData) {
    const minLength = 8;
    const maxLength = 50;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);

    // Verificar si la contraseña contiene datos del usuario
    const userFields = [userData.telefono, userData.email.split('@')[0]];

    for (let field of userFields) {
        if (password.toLowerCase().includes(field.toLowerCase())) {
            return { valid: false, message: 'La contraseña no debe contener información personal del usuario (número telefónico o correo).' };
        }
    }

    if (password.length < minLength) {
        return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    if (password.length > maxLength) {
        return { valid: false, message: 'La contraseña no debe exceder los 50 caracteres.' };
    }
    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChars) {
        return { valid: false, message: 'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales.' };
    }
    return { valid: true, message: 'Contraseña válida' };
}