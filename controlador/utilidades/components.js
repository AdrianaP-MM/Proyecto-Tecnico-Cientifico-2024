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
    let colors = [];
    // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
    xAxis.forEach(() => {
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // Se crea una instancia para generar el gráfico con los datos recibidos.
    new Chart(document.getElementById(canvas), {
        type: 'bar',
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

    confirmed= await confirmAction2('Advertencia', '¿Está seguro de cerrar la sesión?')
    // Se verifica si el usuario confirmó la acción.
    if (confirmed.isConfirmed) {
        // Petición para eliminar la sesión.
        const DATA = await fetchData(USER_API, 'logOut');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
        if (DATA.status) {
            sweetAlert(1, DATA.message, true);
            window.location.href = 'index.html';
        } else {
            sweetAlert(2, DATA.exception, false);
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
const fillSelect = async (filename, action, select, filter = undefined) => {
    // Se verifica si el filtro contiene un objeto para enviar a la API.
    const FORM = (typeof (filter) == 'object') ? filter : null;
    // Petición para obtener los datos.
    const DATA = await fetchData(filename, action, FORM);
    let content = '';
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje.
    if (DATA.status) {
        content += '<option value="" selected>Seleccione una opción</option>';
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se obtiene el dato del primer campo de la sentencia SQL.
            value = Object.values(row)[0];
            // Se obtiene el dato del segundo campo de la sentencia SQL.
            text = Object.values(row)[1];
            // Se verifica el valor del filtro para enlistar las opciones.
            const SELECTED = (typeof (filter) == 'number') ? filter : null;
            if (value != SELECTED) {
                content += `<option value="${value}">${text}</option>`;
            } else {
                content += `<option value="${value}" selected>${text}</option>`;
            }
        });
    } else {
        content += '<option value="">No hay opciones disponibles</option>';
    }
    // Se agregan las opciones a la etiqueta select mediante el id.
    document.getElementById(select).innerHTML = content;
}

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

function getDateToMysql() {
    // Crear un nuevo objeto Date para obtener la fecha y hora actual
    let fechaActual = new Date();

    // Formatear la fecha y hora en el formato adecuado para MySQL (YYYY-MM-DD HH:MM:SS)
    let fechaMySQL = fechaActual.getFullYear() + '-' +
        ('0' + (fechaActual.getMonth() + 1)).slice(-2) + '-' +
        ('0' + fechaActual.getDate()).slice(-2) + ' ';

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
