const CITAS_API = 'services/privado/citas.php';
const AUTOMOVILES_API = 'services/privado/automoviles.php';
const SERVICIOS_API = 'services/privado/servicio.php';

// *Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
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

    //Llamada a las diferentes funciones que muestran los datos en las gráficas
    graficaAutosReparar();
    graficoBarrasTipos();
    graficoDonaTipos();
});

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
        graphLineStyling('grafica4', 'Cantidad de servicios por categorías.', 'Meses', 'Cantidad de autos', data);

        graphLineStyling('grafica6', 'Servicios realizados por empleado según su especialidad.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica7', 'Clientes registrados en el mes según su departamento.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica8', 'Cantidad de clientes registrados en el mes según su tipo (natural y jurídico).', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('grafica9', 'Clientes con mayor cantidad de citas.', 'Meses', 'Cantidad de autos', data);
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

const openReportAutos = () => {
    // Se declara una constante tipo objeto con la ruta específica del reporte en el servidor.
    const PATH = new URL(`${SERVER_URL}reports/administrador/automoviles.php`);
    // Se abre el reporte en una nueva pestaña.or
    window.open(PATH.href);
    console.log(PATH.href);
}
