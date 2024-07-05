//Constante donde esta la ruta del archivo php
const CITAS_API = 'services/privado/citas.php';

// Constante para establecer el cuerpo de la tabla.
const CONTAINER_CITAS_FIN = document.getElementById('citasContenedor');


ID_CITA = document.getElementById('id_cita'),
FECHA = document.getElementById('fecha_hora_cita'),
MOVILIZACION_VEHICULO = document.getElementById('movilizacion_vehiculo'),
NOMBRES = document.getElementById('input_nombre'),

// *Método del evento para cuando el documento ha cargado
document.addEventListener('DOMContentLoaded', async () => {
    loadTemplate();
    readCitas();
});

async function readCitas() {
    try {
        const DATA = await fetchData(CITAS_API, 'readAll'); // Petición para obtener los datos

        if (DATA && DATA.status) { // Se comprueba si la respuesta es satisfactoria
            DATA.dataset.forEach(row => {
                CONTAINER_CITAS_FIN.innerHTML += `
                    <div class="card position-relative z-2"> <!--Card de la cita N#1-->
                            <div class="line-divis position-absolute z-3"></div>
                            <div class="card-izquierda">
                                <div
                                    class="elemento-fecha-cita d-flex justify-content-center align-items-center text-center">
                                    <h5 class=" open-sans-regular text-black p-0 m-0"> <!--Fecha de la cita-->
                                        Fecha de la cita programada: <br> <strong> ${row.fecha_hora_cita}</strong>
                                    </h5>
                                </div>
                                <div
                                    class="elemento-hora-llegada d-flex justify-content-center align-items-center text-center">
                                    <h5 class=" open-sans-regular-regular text-white p-0 m-0">
                                        <!--Hora de llegada del cliente-->
                                        Hora de llegada del cliente: <br> ${row.fecha_hora_cita}.
                                    </h5>
                                </div>
                                <div
                                    class="elemento-movilizacion text-black d-flex flex-column justify-content-center align-items-center px-3">
                                    <h5 class="open-sans-semibold p-0 m-0 mb-1"> <!--Movilización del vehículo-->
                                        Movilización del vehículo:
                                    </h5>
                                    <h5 class="open-sans-regular p-0 m-0"> <!--Como se movilizo el vehículo-->
                                    ${row.movilizacion_vehiculo}
                                    </h5>
                                </div>
                            </div>

                            <div class="card-derecha position-relative">

                                <div class="cita-number position-absolute text-center">
                                    <h6 class="open-sans-semibold m-0 p-0 text-white">Cita N° ${row.id_cita}</h6>
                                    <!--Número de la cita-->
                                </div>

                                <div class="img-container">
                                    <img src="../../recursos/imagenes/img_automoviles/carexmpl2.jpg">
                                </div>
                                <div
                                    class="info-cliente text-white d-flex flex-column justify-content-center align-items-center ">
                                    <div class="grupo1 pb-3">
                                        <h5 class="open-sans-bold p-0 m-0"> <!--DUI del cliente-->
                                            DUI del cliente:
                                        </h5>
                                        <h5 class="open-sans-regular p-0 m-0"> <!--Número de DUI del cliente-->
                                        ${row.dui_cliente}
                                        </h5>
                                    </div>

                                    <div class="grupo2">
                                        <h5 class="open-sans-bold p-0 m-0"> <!--Placa del vehículo-->
                                            Placa del Vehiculo:
                                        </h5>
                                        <h5 class="open-sans-regular p-0 m-0"> <!--Número de placa del vehículo-->
                                        ${row.placa_automovil}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                `;
            });
        } else {
            sweetAlert(4, DATA ? DATA.error : 'Error en la respuesta de la API', false); // Se muestra un mensaje de error
        }
    } catch (error) {
        console.error('Error al leer los servicios:', error);
        sweetAlert(4, 'No se pudo obtener los datos de los servicios.', false);
    }
}


// *Método del evento para cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    
    graficoBarrasAnalisis();
    cargarGraficaLineal();
});

/*
*   Función asíncrona para mostrar un gráfico de barras.
*   Parámetros: ninguno.
*   Retorno: ninguno.
*/
const graficoBarrasAnalisis = async () => {
    /*
    *   Lista de datos de ejemplo en caso de error al obtener los datos reales.
    */
    const datosEjemplo = [
        {
            marca: 'Toyota',
            reparado: 27
        },
        {
            marca: 'Nissan',
            reparado: 25
        },
        {
            marca: 'Honda',
            reparado: 17
        },
        {
            marca: 'Kia',
            reparado: 20
        }
    ];

    let marcas = [];
    let reparados = [];
    datosEjemplo.forEach(filter => {
        marcas.push(filter.marca);
        reparados.push(filter.reparado);
    });
    // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
    barGraph('grafica', marcas, reparados, 'Autos reparados');

}


async function cargarGraficaLineal() {
    const datos = [
        { fecha: '2024-01-26', reparados: 6 },
        { fecha: '2024-01-27', reparados: 8 },
        { fecha: '2024-01-28', reparados: 8 },
        { fecha: '2024-01-29', reparados: 7 },
        { fecha: '2024-02-01', reparados: 9 },
        { fecha: '2024-02-02', reparados: 7 },
        { fecha: '2024-02-03', reparados: 6 }
    ];
    try {
        // Petición para obtener los datos del gráfico.
        const DATA = await fetchData(PRODUCTO_API, 'reparadosPorFecha');
        // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
        if (DATA.status) {
            // Se declaran los arreglos para guardar los datos a gráficar.
            let fecha = [];
            let reparados = [];
            // Se recorre el conjunto de registros fila por fila a través del objeto row.
            DATA.dataset.forEach(row => {
                // Se agregan los datos a los arreglos.
                fecha.push(row.fecha);
                reparados.push(row.reparados);
            });
            // Llamada a la función para generar y mostrar un gráfico de pastel. Se encuentra en el archivo components.js
            lineGraph('graficaLineal', fecha, ganancias, 'Reparados por fecha', 'Gráfica de autos reparados por fecha');
        } else {
            document.getElementById('graficaLineal').remove();
            console.log(DATA.error);
        }
    } catch {
        let fecha = [];
        let reparados = [];
        datos.forEach(filter => {
            fecha.push(filter.fecha);
            reparados.push(filter.reparados);
        });
        // Si ocurre un error, se utilizan los datos de ejemplo definidos arriba.
        lineGraph('graficaLineal', fecha, reparados, 'Reparados por fecha', 'Gráfica de autos reparados por fecha');

    }
}