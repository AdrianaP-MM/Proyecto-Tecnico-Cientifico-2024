const CITAS_API = 'services/privado/citas.php';

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
});

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
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    data: aReparar,
                },
                {
                    label: 'Autos que se esperan reparar (Teniendo en cuenta solo el año pasado)',
                    fill: false,
                    backgroundColor: 'rgb(138, 99, 255)',
                    borderColor: 'rgb(138, 99, 255)',
                    data: aRepararPasado,
                },
                {
                    label: 'Autos Reparados (Año actual)',
                    backgroundColor: 'rgb(187, 0, 0)',
                    borderColor: 'rgb(187, 0, 0)',
                    data: reparados,
                    fill: true,
                }
            ]
        };

        graphLineStyling('autosReparar', 'Predicción de cantidad de carros que se espera reparar.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar2', 'Tiempo estimado en realizar un servicio de reparación.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar3', '10 servicios más frecuentados por nuestros clientes.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar4', 'Cantidad de servicios por categorías.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar5', 'Autos totales registrados en el taller en base al año.', 'Meses', 'Cantidad de autos', data);
        
        graphLineStyling('autosReparar6', 'Total de empleados registrados actualmente según su especialidad.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar7', 'Servicios realizados por empleado según su especialidad.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar8', 'Clientes registrados en el mes según su departamento.', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar9', 'Cantidad de clientes registrados en el mes según su tipo (natural y jurídico).', 'Meses', 'Cantidad de autos', data);
        graphLineStyling('autosReparar10', 'Clientes con mayor cantidad de autos.', 'Meses', 'Cantidad de autos', data);
    } else {
        // En caso de error, se puede remover el canvas o mostrar un mensaje.
        // document.getElementById('chart1').remove();
    }
}
