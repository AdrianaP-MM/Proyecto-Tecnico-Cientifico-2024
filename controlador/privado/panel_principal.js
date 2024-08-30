const CITAS_API = 'services/privado/citas.php';
const AUTOMOVILES_API = 'services/privado/automoviles.php';
const SERVICIOS_API = 'services/privado/servicio.php';
const CLIENTE_API = 'services/privado/clientes.php';
const EMPLEADOS_API = 'services/privado/trabajadores.php';

const EMPLEADOS_FORM = document.getElementById('empleadosPorMesEspForm');


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
    graficaTiempoPorServicio();
    graficoBarrasTipos();
    graficoDonaTipos();
    //graficaClientesMesTipos();
    graficaTop10();
    graficaClientesMasCitas();


    fillSelect(AUTOMOVILES_API, 'readTipos', 'input_tipo_auto');
    fillSelect(SERVICIOS_API, 'readServicios', 'input_tipo_servicio');
});

// Método del evento para cuando se envía el formulario de guardar.
EMPLEADOS_FORM.addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    graficaEmpleadosMesEspecialidad();
});

const graficaEmpleadosMesEspecialidad = async () => {
    // Petición para obtener los datos del gráfico.
    const isValid = await checkFormValidity(EMPLEADOS_FORM);
    if (isValid) {
        const FORM = new FormData(EMPLEADOS_FORM);
        const DATAEmpleados = await fetchData(EMPLEADOS_API, 'empleadosPorMesEspecialidad', FORM);
        const Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        if (DATAEmpleados.status) {
            // Obtener todos los meses y especialidades únicos
            const meses = [...new Set(DATAEmpleados.dataset.map(row => row.mes))];
            const especialidades = [...new Set(DATAEmpleados.dataset.map(row => row.especializacion))];

            // Crear un dataset para cada especialidad
            const datasets = especialidades.map(especialidad => {
                return {
                    label: especialidad,
                    data: meses.map(mes => {
                        const row = DATAEmpleados.dataset.find(d => d.mes === mes && d.especializacion === especialidad);
                        return row ? row.cantidad_empleados : 0;
                    }),
                    backgroundColor: '#' + (Math.random().toString(16)).substring(2, 8),
                };
            });
            const allZero = datasets.every(dataset => dataset.data.every(value => value === 0));

            if (allZero) {
                document.getElementById('trabajadoresMesEspcContainer').innerHTML = `
            <div class="d-flex align-items-center justify-content-center h-100">
                <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
            </div>`;
            } else {
                console.log('Meses:', meses);
                console.log('Datasets:', datasets);
                document.getElementById('trabajadoresMesEspcContainer').innerHTML = `
            <canvas id="empleadosPorMesEspecialidad"></canvas>`;
                // Llama a la función para crear el gráfico.
                graphBarChartBorderRadiusYAXIS('empleadosPorMesEspecialidad', 'Número de empleados registrados por especialidad cada mes', 'Meses', 'Cantidad de empleados', Meses, datasets, 'Especialidad');
            }
        } else {
            document.getElementById('trabajadoresMesEspcContainer').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
        }
    }
}



const graficaTiempoPorServicio = async () => {
    // Petición para obtener los datos del gráfico.
    const DATATiempoPorServicio = await fetchData(CITAS_API, 'tiempoPorServicio');

    // Se comprueba si la respuesta es satisfactoria.
    if (DATATiempoPorServicio.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let Servicios = [];
        let Tiempo = [];

        // Se recorre el conjunto de registros para obtener los servicios y tiempos estimados.
        DATATiempoPorServicio.dataset.forEach(row => {
            Servicios.push(row.servicio_reparacion);
            Tiempo.push(row.tiempo_estimado_minutos);
        });

        console.log('Servicios:', Servicios);
        console.log('Tiempo:', Tiempo);

        // Llama a la función para crear el gráfico.
        graphBarChartBorderRadius('tiempoPorServicio', 'Tiempo estimado previsto para completar un servicio de reparación.', 'Servicios', 'Tiempo estimado (hh.mm)', Servicios, Tiempo, 'Minutos');
    } else {
        document.getElementById('tiempoPorServicio').remove();
        document.getElementById('tiempoPorServicioContainer').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
    }
}

const graficaAutosReparar = async () => {
    // Petición para obtener los datos del gráfico.
    const DATAReparados = await fetchData(CITAS_API, 'autosReparados');
    const DATAAReparar = await fetchData(CITAS_API, 'autosAReparar'); //PD: Ambos TIENEN en cuenta los autos repetidos, es decir, si un mismo auto llego en enero y luego en diciembre igual se cuenta
    const DATAARepararPasado = await fetchData(CITAS_API, 'autosARepararPasado');
    // Se comprueba si la respuesta es satisfactoria.
    if (DATAReparados.status && DATAAReparar.status && DATAARepararPasado.status) {
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
                    label: 'Autos reparados (Año actual)',
                    backgroundColor: 'rgb(230, 69, 71)',
                    borderColor: 'rgb(230, 69, 71)',
                    data: reparados,
                    fill: true,
                }
            ]
        };

        graphLineStyling('autosReparar', 'Autos reparados en el año actual y previsiones.', 'Meses', 'Cantidad de autos', data);
    } else {
        document.getElementById('autosReparar').remove();
        document.getElementById('autosRepararContainer').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
    }
}

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

document.getElementById('graficaForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const mes = document.getElementById('mes').value;
    const año = document.getElementById('año').value;
    const departamento = document.getElementById('departamento').value;
    graficaClientesMesDepartamentos(mes, año, departamento);
});

const graficaClientesMesDepartamentos = async (mes, año, departamento) => {
    // Petición para obtener los datos del gráfico, enviando mes, año y departamento
    const formData = new FormData();
    formData.append("mes", mes);
    formData.append("año", año);
    formData.append("departamento", departamento);

    const DATAClienteMesDep = await fetchData(CLIENTE_API, 'readClientesRegistrados', formData);
    console.log(DATAClienteMesDep);

    const graficaElement = document.getElementById('clientesMesDepartamentos');
    const noDatosElement = document.getElementById('noDatos');

    // Limpiar el contenido actual de la gráfica antes de actualizarla
    graficaElement.innerHTML = '';
    noDatosElement.style.display = 'none'; // Ocultar mensaje

    // Se declaran los arreglos para guardar los datos a graficar.
    const departamentos = [];
    const clientes = [];

    // Se comprueba si la respuesta es satisfactoria y si hay datos en el dataset.
    if (DATAClienteMesDep.status && DATAClienteMesDep.dataset && DATAClienteMesDep.dataset.length > 0) {
        // Se recorre el conjunto de registros para obtener las cantidades de clientes por departamento.
        DATAClienteMesDep.dataset.forEach(row => {
            departamentos.push(row.departamento_cliente);
            clientes.push(row.cantidad);
        });

        // Se comprueba si los arreglos de datos están vacíos.
        if (departamentos.length > 0 && clientes.length > 0) {
            // Llamada a la función que renderiza la gráfica
            barGraph('clientesMesDepartamentos', departamentos, clientes, `Clientes registrados en ${mes}/${año}: `, 'Cantidad de clientes por departamento');
        } else {
            // Muestra el mensaje cuando no hay datos disponibles
            graficaElement.style.display = 'none'; // Ocultar canvas
            noDatosElement.style.display = 'block'; // Mostrar mensaje
        }
    } else {
        // Muestra el mensaje cuando no hay datos disponibles
        graficaElement.style.display = 'none'; // Ocultar canvas
        noDatosElement.style.display = 'block'; // Mostrar mensaje
    }
};






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
        doughnutGraph('cantidadServicios', nombre, total, 'Cantidad de servicios en cada categoría');
    } else {
        document.getElementById('cantidadServicios').remove();
        console.log(DATA.error);
    }
}

//JS DE GRAFICA DE CLIENTES MES TIPOS
document.getElementById('formClientesMesTipos').addEventListener('submit', function (event) {
    event.preventDefault();
    const año = document.getElementById('año_registro').value;
    graficaClientesMesTipos(año);
});

const graficaClientesMesTipos = async (año) => {
    const formData = new FormData();
    formData.append("fecha_registro", año);

    // Petición para obtener los datos del gráfico.
    const DATAClienteMesTipo = await fetchData(CLIENTE_API, 'readClientesMesTipos', formData);

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

        // Verifica si el canvas ya existe, en cuyo caso lo elimina antes de crear uno nuevo
        let canvas = document.getElementById('clientesMesTipos');
        if (canvas) {
            canvas.remove();
        }

        // Crea un nuevo canvas y lo añade al contenedor
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'clientesMesTipos';
        document.getElementById('clientesMesTiposContainer').appendChild(newCanvas);

        // Dibuja el gráfico en el nuevo canvas
        graphLineStyling('clientesMesTipos', 'Cantidad de clientes registrados por mes según su tipo.', 'Meses', 'Cantidad de clientes', data);

    } else {
        // Si no hay datos, elimina solo el canvas y muestra el mensaje
        let canvas = document.getElementById('clientesMesTipos');
        if (canvas) {
            canvas.remove();
        }

        // Añade el mensaje de "No hay datos para mostrar" al contenedor
        document.getElementById('clientesMesTiposContainer').innerHTML += `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
    }
}

//JS DE GRAFICA CLIENTES CON MAYOR CANTIDAD DE AUTOS
const graficaClientesMasCitas = async () => {
    // Petición para obtener los datos del gráfico.
    const DATAClienteMasCitas = await fetchData(CLIENTE_API, 'readClientesMasCitas');
    console.log(DATAClienteMasCitas);

    // Se comprueba si la respuesta es satisfactoria y si hay datos.
    if (DATAClienteMasCitas.status && DATAClienteMasCitas.dataset.length > 0) {
        // Se declaran los arreglos para guardar los datos a graficar.
        const clientes = [];
        const cantidades = [];

        // Se recorre el conjunto de registros para obtener los nombres de los clientes y la cantidad de citas.
        DATAClienteMasCitas.dataset.forEach(row => {
            clientes.push(row.nombre_completo_cliente);
            cantidades.push(row.cantidad_citas);
        });

        // Limitar a los primeros 5 datos
        const maxItems = 5;
        const topClientes = clientes.slice(0, maxItems);
        const topCantidades = cantidades.slice(0, maxItems);

        // Llamada a la función que renderiza el gráfico de pastel
        pieGraph('clientesMasCitas', topClientes, topCantidades, 'Clientes con mayor cantidad de citas');
    } else {
        document.getElementById('clientesMasCitas').remove();
        document.getElementById('MasCitasContainer').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
    }
};






//JS GRAFICA TOP 10
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
            graphPieStyling('graficaTop10', 'Top 10 servicios más solicitados y otros', topServicios, topConteos);
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

            graphPieStyling('graficaTop10', 'Top 10 servicios más solicitados y otros', allServicios, allConteos);
        }

    } else {
        // Si no hay datos, muestra un mensaje
        document.getElementById('graficaTop10').remove();
        document.getElementById('graficaTop10Container').innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100">
            <h6 class="open-sans-semiBold m-0 p-0 text-center">No hay datos para mostrar</h6>
        </div>`;
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
const openReportAutosPorAño = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/automovilesPorAño.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}

const openReportTotalDeClientes = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/totalDeClientes.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
}

const openReportServiciosPendientes = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/serviciosEnProceso.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}

const openReportEspecializacionEmpleados = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/trabajdoresPorEspecializacion.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
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
        sweetAlert(4, 'Por favor, ingrese el DUI y seleccione un estado de cita.', true);
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
    const tipoAutoId = document.getElementById("input_tipo_auto").value;
    const tipoAutoNombre = document.getElementById("input_tipo_auto").options[document.getElementById("input_tipo_auto").selectedIndex].text;

    // Imprimir en consola para depuración
    console.log("Fecha Inicial:", fechaInicial);
    console.log("Fecha Final:", fechaFinal);
    console.log("Tipo Auto ID:", tipoAutoId);
    console.log("Tipo Auto Nombre:", tipoAutoNombre);

    // Verifica que se hayan proporcionado valores válidos
    if (!fechaInicial || !fechaFinal || !tipoAutoId || !tipoAutoNombre) {
        sweetAlert(4, 'Por favor, complete todos los campos: fechas y tipo de vehículo.', true);
        return;
    }

    // Crea la URL con los parámetros
    const PATH = new URL(`${SERVER_URL}reports/administrador/automovilesTipoAutoYFecha.php`);
    PATH.searchParams.append('fecha_inicial', encodeURIComponent(fechaInicial));
    PATH.searchParams.append('fecha_final', encodeURIComponent(fechaFinal));
    PATH.searchParams.append('tipo_auto', encodeURIComponent(tipoAutoId)); // ID del tipo de auto
    PATH.searchParams.append('tipo_auto_nombre', encodeURIComponent(tipoAutoNombre)); // Nombre del tipo de auto

    // Abre el reporte en una nueva pestaña
    window.open(PATH.href);
    console.log(PATH.href);
}

// Función para abrir el reporte del historial de servicios del cliente
// Función para abrir el reporte del historial de servicios del cliente
const openReportHistorialserviciosCliente = () => {
    // Obtén los valores de los inputs
    const duiInput = document.getElementById("input_dui_report_servicios");
    const idCliente = duiInput.getAttribute('data-selected-id'); // Obtener el id_cliente del DUI seleccionado
    const tipoServicio = document.getElementById("input_tipo_servicio").value;

    // Imprimir en consola para depuración
    console.log("ID Cliente:", idCliente);
    console.log("Tipo de Servicio:", tipoServicio);

    // Verifica que se hayan proporcionado valores válidos
    if (!idCliente) {
        sweetAlert(4, 'Seleccione un DUI existente.', true);
        return;
    }

    if (!tipoServicio) {
        sweetAlert(4, 'Por favor, seleccione un tipo de servicio.', true);
        return;
    }

    // Crea la URL con los parámetros
    const PATH = new URL(`${SERVER_URL}reports/administrador/serviciosHistorialCliente.php?dui=${encodeURIComponent(idCliente)}&tipo=${encodeURIComponent(tipoServicio)}`);
    // Abre el reporte en una nueva pestaña
    window.open(PATH.href);
    console.log(PATH.href);
};

// Agregar un event listener para limpiar el data-selected-id cuando el DUI cambia
document.getElementById("input_dui_report_servicios").addEventListener('input', function () {
    this.removeAttribute('data-selected-id');
    console.log("DUI cambiado, data-selected-id limpiado.");
});

// Ejemplo de cómo establecer el data-selected-id cuando se selecciona un DUI válido
const setSelectedClientId = (idCliente) => {
    document.getElementById("input_dui_report_servicios").setAttribute('data-selected-id', idCliente);
}









/*Js referente al apartado de reportes*/

const openReportPrediccionTiempoNatural = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/predictivoTiempoAtencionNatural.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}

const openReportPrediccionDemandaServicios = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/predictivoDemandaServicios.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}

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

            $("#input_dui_report_servicios").autocomplete({
                source: duiOptions,
                select: function (event, ui) {
                    $('#input_dui_report_servicios').val(ui.item.label);
                    $('#input_dui_report_servicios').attr('data-selected-id', ui.item.value); // Guardar el id_cliente como data en el input
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

/*Validaciones de campos de graficas y reportes*/

document.getElementById('año_registro').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 4 dígitos
    inputValue = inputValue.slice(0, 4);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('año').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 4 dígitos
    inputValue = inputValue.slice(0, 4);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});

document.getElementById('input_dui_report').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guion después del octavo dígito si hay al menos 9 dígitos
    if (inputValue.length > 8) {
        inputValue = inputValue.slice(0, 8) + '-' + inputValue.slice(8);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});


document.getElementById('input_dui_report_servicios').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guion después del octavo dígito si hay al menos 9 dígitos
    if (inputValue.length > 8) {
        inputValue = inputValue.slice(0, 8) + '-' + inputValue.slice(8);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
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

document.getElementById('agno_contratacion').addEventListener('input', function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, '');

    // Asegurar que no haya más de 4 dígitos
    inputValue = inputValue.slice(0, 4);

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
});