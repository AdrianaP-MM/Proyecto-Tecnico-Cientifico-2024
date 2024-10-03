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
        // b.style.backgroundColor = 'none';
        b.style.color = 'black';
        b.style.borderBottom = '0px solid red';
        b.style.border = '0px';
    });
    // boton.style.backgroundColor = 'none';
    boton.style.color = 'white';
    //boton.style.borderBottom = '3px solid red';
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
        SPAN.textContent = ''; // Limpia el mensaje si coincide
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

// Función para formatear la entrada del input con un máximo de 10 caracteres
function formatLimitedInput(input) {
    input.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar espacios en blanco
        inputValue = inputValue.replace(/\s/g, '');

        // Asegurar que el input no supere los 10 caracteres
        inputValue = inputValue.slice(0, 10);

        // Expresión regular para permitir solo caracteres válidos (a-z, A-Z, 0-9)
        const validInputChars = /^[a-zA-Z0-9]+$/;

        // Filtrar caracteres inválidos
        inputValue = inputValue.split('').filter(char => validInputChars.test(char)).join('');

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;
    });
}

// Función para formatear la entrada del input con un máximo de 50 caracteres
function formatCodigo(input) {
    input.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar espacios en blanco
        inputValue = inputValue.replace(/\s/g, '');

        // Asegurar que el input no supere los 8 caracteres
        inputValue = inputValue.slice(0, 8);

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;
    });
}

function formatDatepicker(datepickerId) {
    // Inicializar el datepicker
    $('#' + datepickerId).datepicker({
        autoclose: true, // Cierra automáticamente después de seleccionar
        uiLibrary: 'bootstrap5', // Indica que estás usando Bootstrap 5
        minDate: new Date() // Establece la fecha mínima como hoy
    });

    // Desactivar la edición directa
    $('#' + datepickerId).on('keydown', function (event) {
        event.preventDefault(); // Prevenir la entrada de texto
    });
}

function formatCarModelName(input) {
    input.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar espacios innecesarios al principio y al final
        inputValue = inputValue.trim();

        // Limitar la longitud del nombre del modelo (ejemplo: 50 caracteres)
        inputValue = inputValue.slice(0, 50);

        // Expresión regular para permitir solo caracteres válidos en el nombre del modelo
        const validModelNameChars = /^[A-Za-z0-9-]+$/; // Permite letras, números y guiones

        // Filtrar caracteres inválidos
        inputValue = inputValue.split('').filter(char => validModelNameChars.test(char)).join('');

        // Actualizar el valor del campo de texto con la entrada filtrada
        event.target.value = inputValue;
    });
}

function formatYear(input) {
    input.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea un número
        inputValue = inputValue.replace(/[^0-9]/g, '');

        // Limitar a 4 caracteres
        inputValue = inputValue.slice(0, 4);

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = inputValue;
    });
}

function formatSalvadoreanPlate(inputElement) {
    inputElement.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value.toUpperCase();

        // Limpiar el valor de cualquier carácter que no sea letras o números
        inputValue = inputValue.replace(/[^A-Z0-9]/g, '');

        // Definir las letras y combinaciones permitidas como iniciales
        const validPrefixes = [
            'A', 'AB', 'C', 'CC', 'CD', 'D', 'E', 'F', 'M', 'MB', 'MI', 'N', 'O', 'P', 'PR', 'PNC', 'RE', 'T', 'V'
        ];

        // Buscar el prefijo válido más largo en el valor de entrada
        let prefix = '';
        for (const validPrefix of validPrefixes) {
            if (inputValue.startsWith(validPrefix) && validPrefix.length > prefix.length) {
                prefix = validPrefix;
            }
        }

        // Si no se encuentra un prefijo válido y el valor de entrada está vacío, limpiar la entrada
        if (prefix === '' && inputValue.length === 0) {
            event.target.value = '';
            return;
        }

        // Si no se encuentra un prefijo válido, permitir borrar
        if (prefix === '' && inputValue.length > 0) {
            event.target.value = inputValue; // Mantener lo que se ha escrito
            return;
        }

        // Eliminar el prefijo del valor de entrada
        let remainingInput = inputValue.slice(prefix.length);

        // Limitar el número de caracteres del resto del valor a 6
        remainingInput = remainingInput.slice(0, 6);

        // Formatear el resto del valor con guiones
        if (remainingInput.length > 3) {
            remainingInput = remainingInput.slice(0, 3) + '-' + remainingInput.slice(3);
        }

        // Combinar el prefijo y el resto formateado
        let formattedValue = prefix + '-' + remainingInput;

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = formattedValue;
    });
}

function formatDUI(inputElement, ERROR) {
    inputElement.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea un número
        inputValue = inputValue.replace(/\D/g, '');

        // Asegurar que no haya más de 9 dígitos
        inputValue = inputValue.slice(0, 9);

        // Formatear el número agregando el guión antes del último dígito si hay al menos dos dígitos
        if (inputValue.length > 8) {
            inputValue = inputValue.slice(0, 8) + '-' + inputValue.slice(8);
        }

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = inputValue;

        // Llamar a la validación con el valor formateado
        const validationResult = validateDUI(inputValue); // Validar el valor ya formateado
        checkInput(validationResult, inputElement, ERROR);
    });
}

function formatDireccion(inputElement) {
    inputElement.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea aceptado en una dirección
        inputValue = inputValue.replace(/[^A-Za-zÀ-ÿ0-9\s.,-]/g, '');

        // Asegurar que la longitud esté entre 10 y 250 caracteres
        if (inputValue.length > 250) {
            inputValue = inputValue.slice(0, 250); // Limitar a 250 caracteres
        }

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = inputValue;
    });
}

function formatNit(inputElement, ERROR) {
    inputElement.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea un número
        inputValue = inputValue.replace(/\D/g, '');

        // Asegurar que no haya más de 14 dígitos
        inputValue = inputValue.slice(0, 14);

        // Formatear el número agregando los guiones
        let formattedValue = "";

        if (inputValue.length > 4) {
            formattedValue += inputValue.slice(0, 4) + "-";
            inputValue = inputValue.slice(4);
        }

        if (inputValue.length > 6) {
            formattedValue += inputValue.slice(0, 6) + "-";
            inputValue = inputValue.slice(6);
        }

        if (inputValue.length > 3) {
            formattedValue += inputValue.slice(0, 3) + "-";
            inputValue = inputValue.slice(3);
        }

        if (inputValue.length > 0) {
            formattedValue += inputValue;
        }

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = formattedValue;

        // Aquí podrías validar el valor formateado
        const validationResult = validateNit(formattedValue); // Suponiendo que tienes una función de validación
        checkInput(validationResult, inputElement, ERROR); // Manejo de errores
    });
}

function formatName(inputElement) {
    inputElement.addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea alfabético (incluyendo tildes) o espacio
        inputValue = inputValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = inputValue;
    });
}

function formatSalary(inputElement) {
    inputElement.addEventListener("input", function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar los espacios en blanco
        inputValue = inputValue.replace(/\s/g, "");

        // Reemplazar cualquier carácter que no sea número, coma o punto con una cadena vacía
        inputValue = inputValue.replace(/[^\d,.]/g, "");

        // Limitar la longitud total a 7 caracteres incluyendo decimales
        if (inputValue.includes(".")) {
            // Si hay un punto decimal, limitamos a 7 caracteres en total
            let integerPart = inputValue.split(".")[0];
            let decimalPart = inputValue.split(".")[1] || "";
            inputValue = `${integerPart.slice(0, 5)}.${decimalPart.slice(0, 2)}`;
        } else {
            // Si no hay punto decimal, limitamos a 7 caracteres en total
            inputValue = inputValue.slice(0, 8);
        }

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;

        // Validar y agregar la clase 'invalid' si es necesario
        event.target.classList.toggle("invalid", !/^[\d.,]*$/.test(inputValue));
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
    const hasSpaces = /\s/.test(email); // Verificar si hay espacios

    // Validar si contiene espacios en blanco
    if (hasSpaces) {
        return { valid: false, message: 'La correo no debe contener espacios en blanco.' };
    }

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

function validatePassword(password, userData = null) {
    const minLength = 8;
    const maxLength = 50;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
    const hasSpaces = /\s/.test(password); // Verificar si hay espacios

    if (userData) {
        // Verificar si la contraseña contiene datos del usuario
        const userFields = [userData.telefono, userData.email.split('@')[0]];

        for (let field of userFields) {
            if (password.toLowerCase().includes(field.toLowerCase())) {
                return { valid: false, message: 'La contraseña no debe contener información personal del usuario (número telefónico o correo).' };
            }
        }
    }

    // Validar si contiene espacios en blanco
    if (hasSpaces) {
        return { valid: false, message: 'La contraseña no debe contener espacios en blanco.' };
    }

    // Verificar los demás requisitos de la contraseña
    let messages = [];
    let indices = []; // Array para almacenar los índices

    // Validar longitud mínima y máxima
    if (password.length < minLength) {
        messages.push({ index: 1, message: 'La contraseña debe tener al menos 8 caracteres |' });
        indices.push(1); // Agregar índice
    }
    if (password.length > maxLength) {
        messages.push({ index: 2, message: 'La contraseña no debe exceder los 50 caracteres |' });
        indices.push(2); // Agregar índice
    }
    if (!hasUppercase) {
        messages.push({ index: 3, message: 'La contraseña debe contener al menos una letra mayúscula |' });
        indices.push(3); // Agregar índice
    }
    if (!hasLowercase) {
        messages.push({ index: 4, message: 'La contraseña debe contener al menos una letra minúscula |' });
        indices.push(4); // Agregar índice
    }
    if (!hasNumbers) {
        messages.push({ index: 5, message: 'La contraseña debe contener al menos un número |' });
        indices.push(5); // Agregar índice
    }
    if (!hasSpecialChars) {
        messages.push({ index: 6, message: 'La contraseña debe contener al menos un carácter especial |' });
        indices.push(6); // Agregar índice
    }

    if (messages.length > 0) {
        const combinedMessage = messages.map(msg => msg.message).join(' '); // Une todos los mensajes en un solo string
        return { valid: false, message: combinedMessage, indices }; // Devuelve el mensaje combinado y la lista de índices
    }

    // Si todos los requisitos son válidos
    return { valid: true, message: 'La contraseña es válida.', indices };
}

function validateDUI(dui) {
    // Expresión regular para validar el formato de DUI salvadoreño con guion
    const duiRegex = /^[0-9]{8}-[0-9]$/;

    // Validar formato
    if (!duiRegex.test(dui)) {
        return { valid: false, message: 'Formato de DUI no válido. Debe seguir el formato nnnnnnnn-n.' };
    }

    return { valid: true, message: 'DUI válido.' };
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

function validateSalvadoranPlate(plate) {
    // Expresión regular para validar el formato de la placa salvadoreña
    const plateRegex = /^(A|AB|C|CC|CD|D|E|F|M|MB|MI|N|O|P|PR|PNC|RE|T|V)-?[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;

    // Validar formato
    if (!plateRegex.test(plate)) {
        return { valid: false, message: 'Formato de placa no válido. Debe ser una placa salvadoreña. Ejemplo: A-123-456 o A-ABC-DEF.' };
    }

    return { valid: true, message: 'Placa válida.' };
}


function validateCarModelName(modelName) {
    // Expresión regular para validar que el nombre solo contenga letras, números y guiones
    const modelNameRegex = /^[A-Za-z0-9-]+$/; // Permite letras, números y guiones
    const minLength = 1, maxLength = 50;

    // Validar si el campo está vacío
    if (!modelName.trim()) {
        return { valid: false, message: 'El nombre del modelo no puede estar vacío.' };
    }

    // Validar longitud
    if (modelName.length < minLength) {
        return { valid: false, message: `El nombre del modelo debe tener al menos ${minLength} carácter(es).` };
    }
    if (modelName.length > maxLength) {
        return { valid: false, message: `El nombre del modelo no puede tener más de ${maxLength} caracteres.` };
    }

    // Validar formato
    if (!modelNameRegex.test(modelName)) {
        return { valid: false, message: 'El nombre del modelo solo puede contener letras, números y guiones, y no debe tener caracteres especiales.' };
    }

    return { valid: true, message: 'Nombre de modelo válido.' };
}

function validateYear(year) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual
    const yearRegex = /^\d{4}$/; // Expresión regular para validar que tenga exactamente 4 dígitos

    // Validar que solo tenga 4 dígitos
    if (!yearRegex.test(year)) {
        return { valid: false, message: 'El año debe tener exactamente 4 dígitos.' };
    }

    // Validar que no exceda el año actual
    if (parseInt(year) > currentYear) {
        return { valid: false, message: 'El año no puede ser mayor al año actual.' };
    }

    return { valid: true, message: 'Año válido.' };
}

function validateFecha(date) {
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/; // Validar formato mm/dd/yyyy
    const hasSpaces = /\s/.test(date); // Verificar si hay espacios

    // Validar si está vacío o contiene espacios
    if (!date || hasSpaces) {
        return { valid: false, message: 'La fecha no debe estar vacía y no debe contener espacios en blanco.' };
    }

    // Validar formato
    if (!dateRegex.test(date)) {
        return { valid: false, message: 'Formato de fecha no válido. Debe ser mm/dd/yyyy.' };
    }

    // Extraer partes de la fecha
    const [month, day, year] = date.split('/').map(Number);

    // Validar la fecha (días por mes)
    const isValidDate = (month, day, year) => {
        const daysInMonth = [31, (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return day > 0 && day <= daysInMonth[month - 1];
    };

    // Comprobar si la fecha es válida
    if (!isValidDate(month, day, year)) {
        return { valid: false, message: 'La fecha no es válida. Comprueba el día y el mes.' };
    }

    return { valid: true, message: 'Fecha válida.' };
}

function validateSelect(value) {
    // Verificar si el valor está vacío o no es una selección válida
    if (!value || value === '0') { // Suponiendo que '0' representa una opción no válida
        return { valid: false, message: 'Por favor, selecciona una opción.' };
    }
    // Si pasa todas las validaciones
    return { valid: true, message: 'Código válido.' };
}

function validateDireccion(direccion) {
    // Expresión regular para validar que la dirección tenga entre 10 y 250 caracteres
    // Acepta letras, números, espacios, puntos, comas, guiones y caracteres acentuados
    const direccionRegex = /^[A-Za-zÀ-ÿ0-9\s.,-]{10,250}$/;

    // Validar formato
    if (!direccionRegex.test(direccion)) {
        return { valid: false, message: 'La dirección debe tener entre 10 y 250 caracteres y puede incluir letras, números, espacios, puntos, comas y guiones.' };
    }

    return { valid: true, message: 'Dirección válida.' };
}

function validateHora(hora) {
    // Expresión regular para validar horas en formato 24h entre 10:00 y 15:59
    const horaRegex = /^(1[0-5]|10|11|12|13|14|15):[0-5][0-9]$/;

    // Validar formato
    if (!horaRegex.test(hora)) {
        return { valid: false, message: 'La hora debe estar entre las 10:00 AM y las 15:59 PM.' };
    }

    return { valid: true, message: 'Hora válida.' };
}

function validateNit(nit) {
    // Verificar longitud mínima y máxima
    if (nit.length < 17 || nit.length > 17) {
        return { valid: false, message: 'El NIT debe tener exactamente 17 caracteres.' };
    }

    // Expresión regular para validar el formato de NIT con guiones
    const nitRegex = /^[0-9]{4}-[0-9]{6}-[0-9]{3}-?[0-9]?$/; // Ajusta según el formato específico de NIT

    // Validar formato
    if (!nitRegex.test(nit)) {
        return { valid: false, message: 'Formato de NIT no válido. Debe seguir el formato nnnn-nnnnnn-nnn-n.' };
    }

    return { valid: true, message: 'NIT válido.' };
}

function validateName(name) {
    // Verificar si el nombre está vacío
    if (!name.trim()) {
        return { valid: false, message: 'El campo no puede estar vacío.' };
    }

    // Verificar longitud mínima y máxima
    if (name.length < 1 || name.length > 50) {
        return { valid: false, message: 'El nombre debe tener entre 1 y 50 caracteres.' };
    }

    // Verificar si contiene solo caracteres alfabéticos (incluyendo tildes) y espacios
    const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/; // Incluye letras acentuadas

    if (!nameRegex.test(name)) {
        return { valid: false, message: 'Solo se permiten letras y espacios.' };
    }

    return { valid: true, message: 'Nombre válido.' };
}


function validateSalary(salary) {
    // Verificar si el salario está vacío
    if (!salary.trim()) {
        return { valid: false, message: 'El campo no puede estar vacío.' };
    }

    // Verificar longitud máxima
    if (salary.length > 8) {
        return { valid: false, message: 'El salario no puede tener más de 8 caracteres.' };
    }

    // Verificar si contiene solo números, comas o puntos
    const salaryRegex = /^[\d,.]+$/;

    if (!salaryRegex.test(salary)) {
        return { valid: false, message: 'Solo se permiten números, comas y puntos.' };
    }

    // Verificar formato de número (máximo 5 dígitos antes del punto decimal y 2 después)
    const parts = salary.split(".");
    if (parts.length > 2 ||
        (parts[0].length > 5) ||
        (parts.length === 2 && (parts[1].length > 2))) {
        return { valid: false, message: 'El salario debe tener un máximo de 5 dígitos antes del punto decimal y 2 después.' };
    }

    return { valid: true, message: 'Salario válido.' };
}

function validateCarBrand(brand) {
    // Verificar longitud y que solo contenga letras y espacios
    if (brand.length > 50 || !/^[A-Za-z\s]+$/.test(brand)) {
        return { valid: false, message: 'Nombre de la marca no válido. Solo se permiten letras y espacios, y no debe exceder 50 caracteres.' };
    }

    return { valid: true, message: 'Marca válida.' };
}
