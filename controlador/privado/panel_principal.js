const CITAS_API = 'services/privado/citas.php';
const AUTOMOVILES_API = 'services/privado/automoviles.php';
const SERVICIOS_API = 'services/privado/servicio.php';
const CLIENTE_API = 'services/privado/clientes.php';

// *Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    configurarFechaMaxima();
    // Constante para obtener el número de horas.
    const HOUR = new Date().getHours();
    // Se define una variable para guardar un saludo.
    let greeting = '';
    // Dependiendo del número de horas transcurridas en el día, se asigna un saludo para el usuario.
    if (HOUR < 12) {
        greeting = 'Buenos días';
    } else if (HOUR < 19) {
        greeting = 'Buenas tardes';
    } else if (HOUR <= 23) {
        greeting = 'Buenas noches';
    }
    document.getElementById('mainTitle').textContent = `${greeting}, bienvenida/o`;

    //Llamada para los inputs
    readDUI();
    //Llamada a las diferentes funciones que muestran los datos en las gráficas
    graficaAutosReparar();
    graficoBarrasTipos();
    graficoDonaTipos();
    graficaClientesMesTipos();
    graficaTop10();

    fillSelect(AUTOMOVILES_API, 'readTipos', 'input_tipo_auto');
});

function configurarFechaMaxima() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1; // +1 porque enero es 0
    var yyyy = hoy.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    hoy = yyyy + '-' + mm + '-' + dd;

    document.getElementById("fecha_inicial").setAttribute("max", hoy);
    document.getElementById("fecha_final").setAttribute("max", hoy);
}


const graficoBarrasTipos = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(AUTOMOVILES_API, 'readGraphicCarsByType');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let tipo = [];
        let total = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            tipo.push(row.tipo);
            total.push(row.total);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        barGraph('autosPorTipo', tipo, total, 'Tipos de automóviles', 'Total de automóviles por tipo');
    } else {
        document.getElementById('autosPorTipo').remove();
        console.log(DATA.error);
    }
}

const graficoDonaTipos = async () => {
    // Petición para obtener los datos del gráfico.
    const DATA = await fetchData(SERVICIOS_API, 'readGraphicGroupOfService');
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (DATA.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let nombre = [];
        let total = [];
        // Se recorre el conjunto de registros fila por fila a través del objeto row.
        DATA.dataset.forEach(row => {
            // Se agregan los datos a los arreglos.
            nombre.push(row.nombre);
            total.push(row.total);
        });
        // Llamada a la función para generar y mostrar un gráfico de barras. Se encuentra en el archivo components.js
        doughnutGraph('cantidadServicios', nombre, total, 'Cantidad de servicios');
    } else {
        document.getElementById('cantidadServicios').remove();
        console.log(DATA.error);
    }
}

const graficaAutosReparar = async () => {
    // Petición para obtener los datos del gráfico.
    const DATAReparados = await fetchData(CITAS_API, 'autosReparados');
    const DATAAReparar = await fetchData(CITAS_API, 'autosAReparar'); //PD: Ambos TIENEN en cuenta los autos repetidos, es decir, si un mismo auto llego en enero y luego en diciembre igual se cuenta
    const DATAARepararPasado = await fetchData(CITAS_API, 'autosARepararPasado');
    // Se comprueba si la respuesta es satisfactoria.
    if (DATAReparados.status && DATAAReparar.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        const Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let reparados = Array(12).fill(0); // Inicializa con ceros
        let aReparar = Array(12).fill(0); // Inicializa con ceros
        let aRepararPasado = Array(12).fill(0);

        // Se recorre el conjunto de registros para obtener las cantidades de autos reparados.
        DATAReparados.dataset.forEach(row => {
            const mesIndex = row.mes - 1; // Ajuste porque el índice de mes es 1-based (1 a 12)
            reparados[mesIndex] = row.autos_reparados;
        });

        // Se recorre el conjunto de registros para obtener las cantidades de autos a reparar.
        DATAAReparar.dataset.forEach(row => {
            const mesIndex = row.mes - 1; // Ajuste porque el índice de mes es 1-based (1 a 12)
            aReparar[mesIndex] = row.autos_esperados;
        });

        // Se recorre el conjunto de registros para obtener las cantidades de autos a reparar teniendo en cuenta solo el año pasado.
        DATAARepararPasado.dataset.forEach(row => {
            const mesIndex = row.mes - 1; // Ajuste porque el índice de mes es 1-based (1 a 12)
            aRepararPasado[mesIndex] = row.autos_esperados;
        });

        // Log para verificar los datos antes de graficar
        console.log('Reparados:', reparados);
        console.log('A Reparar:', aReparar);
        console.log('A Reparar(Pasado):', aRepararPasado)

        // Configuración de los datos para el gráfico
        const data = {
            labels: Meses,
            datasets: [
                {
                    label: 'Autos que se esperan reparar (Teniendo en cuenta todos los años)',
                    fill: false,
                    backgroundColor: 'rgb(211, 211, 211)',
                    borderColor: 'rgb(211, 211, 211)',
                    borderDash: [5, 5],
                    data: aReparar,
                },
                {
                    label: 'Autos que se esperan reparar (Teniendo en cuenta solo el año pasado)',
                    fill: false,
                    backgroundColor: 'rgb(255, 45, 49)',
                    borderColor: 'rgb(255, 45, 49)',
                    data: aRepararPasado,
                    borderDash: [5, 5],
                },
                {
                    label: 'Autos Reparados (Año actual)',
                    backgroundColor: 'rgb(230, 69, 71)',
                    borderColor: 'rgb(230, 69, 71)',
                    data: reparados,
                    fill: true,
                }
            ]
        };

        graphLineStyling('autosReparar', 'Predicción de cantidad de carros que se espera reparar.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica2', 'Tiempo estimado en realizar un servicio de reparación.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica3', '10 servicios más frecuentados por nuestros clientes.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica6', 'Servicios realizados por empleado según su especialidad.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica7', 'Clientes registrados en el mes según su departamento.', 'Meses', 'Cantidad de autos', data);
    } else {
        document.getElementById('autosReparar').remove();
        var elements = document.getElementsByClassName('graphic');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
            </div>`;
        }

    }
}

const graficaClientesMesTipos = async () => {
    // Petición para obtener los datos del gráfico.
    const DATAClienteMesTipo = await fetchData(CLIENTE_API, 'readClientesMesTipos');

    // Se comprueba si la respuesta es satisfactoria.
    if (DATAClienteMesTipo.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        const Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let natural = Array(12).fill(0); // Inicializa con ceros
        let juridico = Array(12).fill(0); // Inicializa con ceros

        // Se recorre el conjunto de registros para obtener las cantidades de clientes por tipo.
        DATAClienteMesTipo.dataset.forEach(row => {
            const mesIndex = row.mes - 1; // Ajuste porque el índice de mes es 1-based (1 a 12)
            if (row.tipo_cliente === 'Persona natural') {
                natural[mesIndex] = row.cantidad_clientes;
            } else if (row.tipo_cliente === 'Persona juridica') {
                juridico[mesIndex] = row.cantidad_clientes;
            }
        });

        // Log para verificar los datos antes de graficar
        console.log('Clientes Naturales:', natural);
        console.log('Clientes Jurídicos:', juridico);

        // Configuración de los datos para el gráfico
        const data = {
            labels: Meses,
            datasets: [
                {
                    label: 'Clientes Naturales',
                    fill: false,
                    backgroundColor: '#E5383B', // Rojo
                    borderColor: '#E5383B', // Rojo
                    data: natural,
                },
                {
                    label: 'Clientes Jurídicos',
                    fill: false,
                    backgroundColor: '#161A1D',
                    borderColor: '#161A1D',
                    data: juridico,
                }
            ]
        };

        graphLineStyling('clientesMesTipos', 'Cantidad de clientes registrados por mes según su tipo.', 'Meses', 'Cantidad de clientes', data);
    } else {
        document.getElementById('clientesMesTipos').remove();
        var elements = document.getElementsByClassName('graphic');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
            </div>`;
        }
    }
}


const graficaTop10 = async () => {
    // Petición para obtener los datos del gráfico.
    const DATATopServicios = await fetchData(SERVICIOS_API, 'readTop10Servicios'); // Suponemos que 'topServicios' es el endpoint para la vista

    // Se comprueba si la respuesta es satisfactoria.
    if (DATATopServicios.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let servicios = [];
        let conteos = [];
        let otrosCount = 0;

        // Se recorre el conjunto de registros para obtener los servicios y sus conteos.
        DATATopServicios.dataset.forEach(row => {
            if (row.servicio === "Otros") {
                otrosCount = parseInt(row.conteo, 10); // Almacena el conteo de "Otros"
            } else {
                servicios.push(row.servicio);
                conteos.push(parseInt(row.conteo, 10)); // Convierte a número
            }
        });

        // Se asegura que el array de servicios no exceda los 10 elementos
        if (servicios.length > 10) {
            // Si hay más de 10 servicios, se maneja "Otros" como una categoría combinada
            const topServicios = servicios.slice(0, 10); // Obtiene los primeros 10 servicios
            const topConteos = conteos.slice(0, 10); // Obtiene los conteos de los primeros 10 servicios

            // Si hay más de 10 elementos, sumar el resto en "Otros"
            if (DATATopServicios.dataset.length > 10) {
                topServicios[9] = 'Otros'; // Reemplaza el último servicio por "Otros"
                topConteos[9] = otrosCount + conteos.slice(10).reduce((a, b) => a + b, 0); // Suma los conteos restantes
            }

            // Log para verificar los datos antes de graficar
            console.log('Servicios:', topServicios);
            console.log('Conteos:', topConteos);

            // Configuración de los datos para el gráfico
            graphPieStyling('graficaTop10', 'Top 10 Servicios Más Solicitados y Otros', topServicios, topConteos);
        } else {
            // Si hay 10 o menos servicios, simplemente grafica todos y agrega "Otros"
            const allServicios = servicios.slice(0, 10); // Limita a los primeros 10
            const allConteos = conteos.slice(0, 10); // Limita a los primeros 10

            // Añade "Otros" si hay servicios restantes
            if (DATATopServicios.dataset.length > 10) {
                allServicios.push('Otros');
                allConteos.push(otrosCount); // Incluye el conteo de "Otros"
            }

            // Log para verificar los datos antes de graficar
            console.log('Servicios:', allServicios);
            console.log('Conteos:', allConteos);

            graphPieStyling('graficaTop10', 'Top 10 Servicios Más Solicitados y Otros', allServicios, allConteos);
        }

    } else {
        // Si no hay datos, muestra un mensaje
        document.getElementById('graficaTop10').remove();
        var elements = document.getElementsByClassName('graphic');
        for (var i = 0; i < elements.length; i++) {
            elements[i].innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
            </div>`;
        }
    }
}

/// Función para inicializar y configurar el gráfico de pastel
const graphPieStyling = (canvasId, title, dataLabels, dataValues) => {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Limpiar cualquier instancia previa del gráfico
    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    new Chart(ctx, {
        type: 'pie',  // Tipo de gráfico: pastel
        data: {
            labels: dataLabels,
            datasets: [{
                label: title,
                data: dataValues,
                backgroundColor: [
                    '#F5F3F4',
                    '#D3D3D3',
                    '#E5383B',
                    '#E00D11',
                    '#BA181B',
                    '#161A1D',
                    '#F5F3F4',
                    '#151313',
                    '#D3D3D3',
                    '#E5383B',
                    '#E00D11',
                    '#BA181B'
                ],
                borderColor: [
                    '#F5F3F4',
                    '#D3D3D3',
                    '#E5383B',
                    '#E00D11',
                    '#BA181B',
                    '#161A1D',
                    '#F5F3F4',
                    '#151313',
                    '#D3D3D3',
                    '#E5383B',
                    '#E00D11',
                    '#BA181B'
                ],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',  // Mueve las leyendas a la derecha
                    labels: {
                        boxWidth: 20,
                        padding: 10,
                        font: {
                            size: 10,  // Reduce el tamaño de la letra de las leyendas
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            const total = tooltipItem.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(2) + '%';
                            return `${label}: ${value} (${percentage})`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 14  // Reduce el tamaño de la letra del título
                    }
                }
            }
        }
    });
};

/*JS de reportes*/

/*Abrir reportes*/
const openReportAutos = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/automoviles.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}

const openReportCitasEstadoYDUI = () => {
    // Obtén los valores de los inputs
    const estadoCita = document.getElementById("input_estado_cita").value;
    const duiInput = document.getElementById("input_dui_report");
    const idCliente = duiInput.getAttribute('data-selected-id'); // Obtener el id_cliente del DUI seleccionado

    // Imprimir en consola para depuración
    console.log("Estado Cita:", estadoCita);
    console.log("ID Cliente:", idCliente);

    // Verifica que se hayan proporcionado valores válidos
    if (!estadoCita || !idCliente) {
        alert("Por favor, ingrese el DUI y seleccione un estado de cita.");
        return;
    }

    // Crea la URL con los parámetros
    const PATH = new URL(`${SERVER_URL}reports/administrador/automovilesTipoYCliente.php?estado=${encodeURIComponent(estadoCita)}&dui=${encodeURIComponent(idCliente)}`);

    // Abre el reporte en una nueva pestaña
    window.open(PATH.href);
    console.log(PATH.href);
}

const openReportServiciosCarroFechaYTipo = () => {
    // Obtén los valores de los inputs
    const fechaInicial = document.getElementById("fecha_inicial").value;
    const fechaFinal = document.getElementById("fecha_final").value;
    const tipoAuto = document.getElementById("input_tipo_auto").value;

    // Imprimir en consola para depuración
    console.log("Fecha Inicial:", fechaInicial);
    console.log("Fecha Final:", fechaFinal);
    console.log("Tipo Auto:", tipoAuto);

    // Verifica que se hayan proporcionado valores válidos
    if (!fechaInicial || !fechaFinal || !tipoAuto) {
        alert("Por favor, complete todos los campos: fechas y tipo de vehículo.");
        return;
    }

    // Crea la URL con los parámetros
    const PATH = new URL(`${SERVER_URL}reports/administrador/automovilesTipoAutoYFecha.php`);
    PATH.searchParams.append('fecha_inicial', encodeURIComponent(fechaInicial));
    PATH.searchParams.append('fecha_final', encodeURIComponent(fechaFinal));
    PATH.searchParams.append('tipo_auto', encodeURIComponent(tipoAuto));

    // Abre el reporte en una nueva pestaña
    window.open(PATH.href);
    console.log(PATH.href);
}




/*Js referente al apartado de reportes*/

async function readDUI() {
    try {
        const DATA = await fetchData(AUTOMOVILES_API, 'readClientes');

        if (DATA && DATA.status) {
            const duiOptions = DATA.dataset.map(item => ({
                label: item.dui_cliente,
                value: item.id_cliente
            }));

            $("#input_dui_report").autocomplete({
                source: duiOptions,
                select: function (event, ui) {
                    $('#input_dui_report').val(ui.item.label);
                    $('#input_dui_report').attr('data-selected-id', ui.item.value); // Guardar el id_cliente como data en el input
                    console.log("ID Cliente seleccionado:", ui.item.value);
                    return false;
                }
            });
        } else {
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false);
        }
    } catch (error) {
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}


$(document).ready(function () {
    // Llama a la función para leer los servicios y configurar el autocompletado
    readDUI();
});






