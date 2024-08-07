//Constante donde esta la ruta del archivo php
const TRABAJADORES_API = "services/privado/trabajadores.php";
const USER_API = 'services/privado/usuarios.php';

// Constante para establecer el cuerpo de la tabla.
const CONTAINER_TRABAJADORES_BODY =
  document.getElementById("cardsTrabajadores");
// Constante para establecer el cuerpo de la tabla.
const CONTAINER_BOTONES = document.getElementById("containerBotones");

// Constantes para establecer los elementos del componente Modal.
const SAVE_MODAL = new bootstrap.Modal("#staticBackdrop");

// Constantes para establecer los elementos del formulario de guardar.
const SAVE_FORM = document.getElementById("saveForm"),
  DUI = document.getElementById("input_dui_empleados"),
  NIT = document.getElementById("input_nit_empleados"),
  NOMBRES = document.getElementById("input_nombre_empleados"),
  APELLIDOS = document.getElementById("input_apellido_empleados"),
  TELEFONO = document.getElementById("input_telefono_empleados"),
  CORREO = document.getElementById("input_correo_empleados"),
  DEPARTAMENTO = document.getElementById("departamento_trabajador"),
  ESPECIALIZACION = document.getElementById("especializacion_trabajador"),
  FECHA = document.getElementById("fecha_contratacion"),
  SALARIO = document.getElementById("input_salario_empleados"),
  FTO_TRABAJADOR = document.getElementById("fto_trabajador"),
  ID_EMPLEADO = document.getElementById("idTrabajador");

// *Método del evento para cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Llamado de la funcion para agregar la plantilla de la pagina web
  loadTemplate();
  const DATA = await fetchData(USER_API, 'readUsers');
  if (DATA.session) {
    // Acciones si la sesión SI está activa
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'hover'
      });
    });

    //FillSelect para llenar combo box de especializaciones en el modal para insert
    fillSelect(
      TRABAJADORES_API,
      'readEspecializaciones',
      'especializacion_trabajador'
    );

    //Llamado de la funcion para de leer trabajadores en la base
    readTrabajadores();

    //Llamado de la funcion para deshabilitar las fechas  
    configurarFechaMaxima()

  } else { // Acciones si la sesión NO está activa
    await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
  }
});


//Funcion para validar que los campos deben estar completados dentro del form
(() => {
  "use strict";

  //Selecciona todos los campos en los que queremos validar
  const forms = document.querySelectorAll(".needs-validation");

  // Recorre cada uno, aplica la validacion y no deja que se envie
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();



//Método del evento para cuando se envía el formulario de buscar.
document
  .getElementById("searchForm")
  .addEventListener("submit", async (event) => {
    //Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Constante tipo objeto con los datos del formulario de barra de busqueda.
    const formData = new FormData(document.getElementById("searchForm"));

    try {
      //Realizar una solicitud al servidor para buscar trabajadores.
      const searchData = await fetchData(
        TRABAJADORES_API,
        "searchRows",
        formData
      );

      //Verificar si la búsqueda fue exitosa.
      if (searchData.status) {
        //Limpiar el contenedor de trabajadores.
        CONTAINER_TRABAJADORES_BODY.innerHTML = "";

        //Se agrega la card para agregar usuario luego de vaciar el campo
        CONTAINER_TRABAJADORES_BODY.innerHTML += `
            <div class="add-auto-card d-flex align-items-center justify-content-center" class="agregar">
                            <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow"
                                onclick="openCreate()">
                        </div>
            `;

        //Verificar si se encontraron resultados.
        if (searchData.dataset.length > 0) {
          //Dependiendo los resultados de cada linea se muestran en el contenedor.
          searchData.dataset.forEach((row) => {
            CONTAINER_TRABAJADORES_BODY.innerHTML += `
                        <div class="auto-card card" onclick="openUpdate(${row.id_trabajador})"> <!--Card de empleados #1-->
                        <div class="content z-3">
                            <h4 class="open-sans-light-italic">Más información</h4> <!--Boton de mas informacion-->
                        </div>
                        <div class="container-img-card"> <!--Imagen de la empresa-->
                            <h1>DARG</h1> <!--Nombre de la empresa-->
                            <img src="../../recursos/imagenes/img_empleados/fondo_cliente.png">
                        </div>
                        <div class="container-img-card2"> <!--Imagen del empleado-->
                            <img src="../../recursos/imagenes/img_empleados/empleado.png">
                            <h1 class=" align-items-center justify-content-center">${row.nombres_trabajador} ${row.apellidos_trabajador}</h1>
                            <!--Nombre del empleado-->
                            <h3 class="">${row.dui_trabajador}</h3> <!--DUI-->
                            <h4 class="">${row.correo_trabajador}</h4> <!--Correo-->
                            <h4 class="">${row.telefono_trabajador}</h4> <!--Telefono-->
                        </div>
                        <div class="container-img-card3"> <!--Logo de la empresa-->
                            <img src="../../recursos/imagenes/img_empleados/logo.png">
                            <h2>${row.nombre_especializacion_trabajador}</h2> <!--Especialización del empleado-->
                        </div>
                        <div class="container-info-card"> <!--Informacion adicional-->
                        </div>
                    </div>
                        `;
          });
        } else {
          // Mostrar si no se encontro ningun resultado.
          sweetAlert(4, "No se encontraron resultados", false);
        }
      } else {
        // Mostrar si no se encontro ningun resultado en base de un error.
        sweetAlert(4, "No se encontraron resultados", false);
        // Puedes mostrar un mensaje de error al usuario si lo deseas.
      }
    } catch (error) {
      console.error("Error al buscar trabajadores:", error);
      //Loguea un error si este lo presenta.
    }
  });


//Método para hacer el select a la base de los trabajadores disponibles
async function readTrabajadores() {
  // Petición para obtener los datos de los trabajadores.
  const DATA = await fetchData(TRABAJADORES_API, "readAll");

  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
    //Limpiar el contenedor de trabajadores.
    CONTAINER_TRABAJADORES_BODY.innerHTML = "";

    CONTAINER_TRABAJADORES_BODY.innerHTML += `
    <div class="add-auto-card d-flex align-items-center justify-content-center" class="agregar">
                    <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow"
                        onclick="openCreate()">
                </div>
    `;

    // Se recorre el conjunto de registros fila por fila a través del objeto row.
    DATA.dataset.forEach((row) => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro a la card de trabajador.
      CONTAINER_TRABAJADORES_BODY.innerHTML += `
            <div class="auto-card card" onclick="openUpdate(${row.id_trabajador})"> <!--Card de empleados #1-->
            <div class="content z-3">
                <h4 class="open-sans-light-italic">Más información</h4> <!--Boton de mas informacion-->
            </div>
            <div class="container-img-card"> <!--Imagen de la empresa-->
                <h1>DARG</h1> <!--Nombre de la empresa-->
                <img src="../../recursos/imagenes/img_empleados/fondo_cliente.png">
            </div>
            <div class="container-img-card2"> <!--Imagen del empleado-->
                <img src="../../recursos/imagenes/img_empleados/empleado.png">
                <h1 class=" align-items-center justify-content-center">${row.nombres_trabajador} ${row.apellidos_trabajador}</h1>
                <!--Nombre del empleado-->
                <h3 class=""> Dui: ${row.dui_trabajador}</h3> <!--DUI-->
                <h4 class=""> Correo: ${row.correo_trabajador}</h4> <!--Correo-->
                <h4 class=""> Tel: ${row.telefono_trabajador}</h4> <!--Telefono-->
            </div>
            <div class="container-img-card3"> <!--Logo de la empresa-->
                <img src="../../recursos/imagenes/img_empleados/logo.png">
                <h2>${row.nombre_especializacion_trabajador}</h2> <!--Especialización del empleado-->
            </div>
            <div class="container-info-card"> <!--Informacion adicional-->
            </div>
        </div>
            `;
    });
  } else {
    //Se abre una alerta si esta presenta un error
    sweetAlert(4, DATA.error, false);
  }
}

// Método del evento para cuando se envía el formulario de guardar.
SAVE_FORM.addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  //Se valida que los campos no esten vacios de lo contrario se le hace saber al usuario por medio del cambio en el aspecto de los campos
  const isValid = await checkFormValidity(SAVE_FORM);

  //Se verifica si la validacion es correcta
  if (isValid) {
    // Se verifica la acción a realizar.
    const action = ID_EMPLEADO.value ? "updateRow" : "createRow";

    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(SAVE_FORM);
    //formData.append('fto_trabajador2', "C:\fakepath\EMPLEADOIMG.png");

    try {
      // Petición para guardar los datos del formulario.
      const DATA = await fetchData(TRABAJADORES_API, action, formData);// Petición para guardar los datos del formulario

      if (DATA.status) { // Se comprueba si la respuesta es satisfactoria
        SAVE_MODAL.hide(); // Se cierra la caja de diálogo
        sweetAlert(1, DATA.message, true); // Se muestra un mensaje de éxito
        readTrabajadores(); //Se lee los trabajadores en la base
      } else {
        sweetAlert(2, DATA.error, false); // Se muestra un mensaje de error
      }
    } catch (error) {
      //Se muestra un error en consola
      console.error('Error al guardar al trabajador: ', error);
      //Se muestra el error en una alerta
      sweetAlert(4, 'No se pudo guardar al trabajador', false);
    }

  } else {
    //Si no funciona el is valid se manda este error en la consola
    console.log("Que paso?: Formulario no válido");
  }

});

// Método usado para encontrar el campo seleccionado en el combobox de departamentos tipo enum en la base
function findNumberValue(value) {
  if (value == 'Ahuachapán') {
    return 'Ahuachapán';
  } if (value == 'Cabañas') {
    return 'Cabañas';
  } if (value == 'Chalatenango') {
    return 'Chalatenango';
  } if (value == 'Cuscatlán') {
    return 'Cuscatlán';
  } if (value == 'La Libertad') {
    return 'La Libertad';
  } if (value == 'La Paz') {
    return 'La Paz';
  } if (value == 'La Unión') {
    return 'La Unión';
  } if (value == 'Morazán') {
    return 'Morazán';
  } if (value == 'San Miguel') {
    return 'San Miguel';
  } if (value == 'San Salvador') {
    return 'San Salvador';
  } if (value == 'San Vicente') {
    return 'San Vicente';
  } if (value == 'Santa Ana') {
    return 'Santa Ana';
  } if (value == 'Sonsonate') {
    return 'Sonsonate';
  } if (value == 'Usulután') {
    return 'Usulután';
  }
  return ''; // Default case
}


/*
 *   Función asíncrona para preparar el formulario al momento de actualizar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */

const openUpdate = async (id) => {
  // Se abre el modal para cambiar la info del trabajador
  SAVE_MODAL.show();

  // Se le asigna el id recibido del select anterior
  ID_EMPLEADO.value = id;

  // Se define una constante tipo objeto con los datos del registro seleccionado.
  const formData = new FormData();
  formData.append("idTrabajador", id); //Se agrega el id trabajador al form

  // Petición para obtener los datos del registro solicitado.
  const DATA = await fetchData(TRABAJADORES_API, "readOne", formData);

  if (DATA.status) {
    // Se muestra la caja de diálogo con su título.
    SAVE_MODAL.show();
    // Se prepara el formulario.
    SAVE_FORM.reset();

    // Se inicializan los campos con los datos.
    const row = DATA.dataset;
    ID_EMPLEADO.value = row.id_trabajador;
    DUI.value = row.dui_trabajador;
    NIT.value = row.NIT_trabajador;
    NOMBRES.value = row.nombres_trabajador;
    APELLIDOS.value = row.apellidos_trabajador;
    TELEFONO.value = row.telefono_trabajador;
    CORREO.value = row.correo_trabajador;
    DEPARTAMENTO.value = findNumberValue(row.departamento_trabajador);

    // Buscar y marcar el `option` correspondiente como seleccionado
    const departamentoValue = findNumberValue(row.departamento_trabajador);
    const options = DEPARTAMENTO.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === departamentoValue) {
        options[i].selected = true;
        break;
      }
    }

    // Debugging log
    console.log(`Especialización Trabajador ID: ${row.id_especializacion_trabajador}`);

    fillSelect(TRABAJADORES_API, 'readEspecializaciones', 'especializacion_trabajador', row.id_especializacion_trabajador);
    FECHA.value = row.fecha_contratacion;
    SALARIO.value = row.salario_base;

    CONTAINER_BOTONES.innerHTML += `
              <button type="button" id="btnTres" class="btn btn-secondary btnCancel mx-5"
                                                  onclick="openDelete(${row.id_trabajador})">Eliminar</button> <!--Boton de cancelar-- >
              `;
  } else {
    sweetAlert(2, DATA.error, false);
  }

  // Se asigna la variable para cambiar el dialogo de la alerta
  number = 2;

  // Actualizar texto de los botones
  document.getElementById("btnUno").innerText = "Eliminar";
  document.getElementById("btnDos").innerText = "Actualizar";
};

/*
 *   Función asíncrona para eliminar un registro.
 *   Parámetros: id (identificador del registro seleccionado).
 *   Retorno: ninguno.
 */
const openDelete = async (id) => {
  // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
  const response = await confirmAction2(
    "¿Desea eliminar al trabajador de forma permanente?"
  );
  // Se verifica la respuesta del mensaje.
  if (response.isConfirmed) {
    // Se define una constante tipo objeto con los datos del registro seleccionado.
    const formData = new FormData();
    formData.append("idTrabajador", id);
    // Petición para eliminar el registro seleccionado.
    const DATA = await fetchData(TRABAJADORES_API, "deleteRow", formData);
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
    if (DATA.status) {
      // Se muestra un mensaje de éxito.
      await sweetAlert(1, DATA.message, true);
      // Se carga nuevamente la tabla para visualizar los cambios.
      // Se abre el modal para cambiar la info del trabajador
      SAVE_MODAL.hide();
      location.reload();
      readTrabajadores();

      // Eliminar el botón con id BotonTres
      const botonTres = document.getElementById("btnTres");
      if (botonTres) {
        botonTres.remove();
      }
    } else {
      sweetAlert(2, DATA.error, false);
    }
  }
};

// Función principal para abrir el formulario de creación
async function openCreate() {
  // Se prepara el formulario.
  SAVE_FORM.reset();
  // Se muestra la caja de diálogo con su título.
  SAVE_MODAL.show();
  number = 1;
  // Actualizar texto de los botones
  document.getElementById("btnUno").innerText = "Cancelar";
  document.getElementById("btnDos").innerText = "Guardar";
}

var number = 1;

const openClose = async () => {
  if (number == 1) {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2(
      "¿Seguro qué quieres regresar?",
      "Los datos ingresados no serán almacenados"
    );

    if (RESPONSE.isConfirmed) {
      SAVE_MODAL.hide();
      const botonTres = document.getElementById("btnTres");
      if (botonTres) {
        botonTres.remove();
      }
    }
  } else {
    // Llamada a la función para mostrar un mensaje de confirmación, capturando la respuesta en una constante.
    const RESPONSE = await confirmAction2(
      "¿Seguro qué quieres regresar?",
      "Los datos ingresados no serán almacenados"
    );
    if (RESPONSE.isConfirmed) {
      SAVE_MODAL.hide();
      const botonTres = document.getElementById("btnTres");
      if (botonTres) {
        botonTres.remove();
      }
    }
  }
};

// Función para mostrar la imagen seleccionada en un elemento de imagen
function displaySelectedImage(event, elementId) {
  const selectedImage = document.getElementById(elementId);
  const fileInput = event.target;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      selectedImage.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
  }
}

document
  .getElementById("input_dui_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, "");

    // Asegurar que no haya más de 9 dígitos
    inputValue = inputValue.slice(0, 9);

    // Formatear el número agregando el guión antes del último dígito si hay al menos dos dígitos
    if (inputValue.length > 1) {
      inputValue = inputValue.slice(0, -1) + "-" + inputValue.slice(-1);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
  });

document
  .getElementById("input_nit_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, "");

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

    // Agregar el último grupo de dígitos
    if (inputValue.length > 0) {
      formattedValue += inputValue;
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = formattedValue;
  });

document
  .getElementById("input_nombre_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar caracteres que no sean letras o espacios
    inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");

    // Asegurar que el texto no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada validada
    event.target.value = inputValue;
  });

document
  .getElementById("input_apellido_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar caracteres que no sean letras o espacios
    inputValue = inputValue.replace(/[^a-zA-Z\s]/g, "");

    // Asegurar que el texto no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada validada
    event.target.value = inputValue;
  });

document
  .getElementById("input_telefono_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Limpiar el valor de cualquier carácter que no sea un número
    inputValue = inputValue.replace(/\D/g, "");

    // Asegurar que no haya más de 8 dígitos
    inputValue = inputValue.slice(0, 8);

    // Formatear el número agregando el guión
    if (inputValue.length > 4) {
      inputValue = inputValue.slice(0, 4) + "-" + inputValue.slice(4);
    }

    // Actualizar el valor del campo de texto con la entrada formateada
    event.target.value = inputValue;
  });

document
  .getElementById("input_correo_empleados")
  .addEventListener("input", function (event) {
    // Obtener el valor actual del campo de texto
    let inputValue = event.target.value;

    // Eliminar espacios en blanco
    inputValue = inputValue.replace(/\s/g, "");

    // Asegurar que el correo electrónico no supere los 50 caracteres
    inputValue = inputValue.slice(0, 50);

    // Actualizar el valor del campo de texto con la entrada limitada
    event.target.value = inputValue;
  });

document.getElementById("input_salario_empleados").addEventListener("input", function (event) {
  // Obtener el valor actual del campo de texto
  let inputValue = event.target.value;

  // Eliminar los espacios en blanco
  inputValue = inputValue.replace(/\s/g, "");

  // Reemplazar cualquier caracter que no sea número, coma o punto con una cadena vacía
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

  document.getElementById("fecha_contratacion").setAttribute("max", hoy);
}

