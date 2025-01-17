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
  ERROR_DUI = document.getElementById('ERROR-DUI'),
  NIT = document.getElementById("input_nit_empleados"),
  ERROR_NIT = document.getElementById('ERROR-NIT'),
  NOMBRES = document.getElementById("input_nombre_empleados"),
  ERROR_NOMBRE = document.getElementById('ERROR-NOMBRE'),
  APELLIDOS = document.getElementById("input_apellido_empleados"),
  ERROR_APELLIDO = document.getElementById('ERROR-APELLIDO'),
  TELEFONO = document.getElementById("input_telefono_empleados"),
  ERROR_TELEFONO = document.getElementById('ERROR-TELEFONO'),
  CORREO = document.getElementById("input_correo_empleados"),
  ERROR_CORREO = document.getElementById('ERROR-CORREO'),
  DEPARTAMENTO = document.getElementById("departamento_trabajador"),
  ERROR_DEPARTAMENTO = document.getElementById('ERROR-DEPARTAMENTO'),
  ESPECIALIZACION = document.getElementById("especializacion_trabajador"),
  ERROR_ESPECIAL = document.getElementById('ERROR-ESPECIAL'),
  FECHA = document.getElementById("fecha_contratacion"),
  ERROR_FECHA = document.getElementById('ERROR-FECHA'),
  SALARIO = document.getElementById("input_salario_empleados"),
  ERROR_SALARIO = document.getElementById('ERROR-SALARIO'),
  ID_EMPLEADO = document.getElementById("idTrabajador");

const INPUT_BUSQUEDA = document.getElementById('input_buscar');

// *Método del evento para cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Llamado de la funcion para agregar la plantilla de la pagina web
  loadTemplate();
  const DATA = await fetchData(USER_API, 'readUsers');
  applicateRules();
  await fillSelect(TRABAJADORES_API, 'readEspecializaciones', 'especializacion_trabajador');
  if (DATA.session) {
    // Acciones si la sesión SI está activa
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'hover'
      });
    });

    //Llamado de la funcion para de leer trabajadores en la base
    readTrabajadores();

    //Llamado de la funcion para deshabilitar las fechas  
    configurarFechaMaxima()

  } else { // Acciones si la sesión NO está activa
    await sweetAlert(4, 'Acción no disponible fuera de la sesión, debe ingresar para continuar', true); location.href = 'index.html'
  }
});

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
      location.reload();
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
      location.reload();
      const botonTres = document.getElementById("btnTres");
      if (botonTres) {
        botonTres.remove();
      }
    }
  }
};

// Función de búsqueda que prepara el formulario y ejecuta la búsqueda
const search = async () => {
  const FORM = new FormData();
  if (INPUT_BUSQUEDA.value) {
    FORM.append('search', INPUT_BUSQUEDA.value);
  }
  await readTrabajadores('searchRows', FORM);
};

//Método para hacer el select a la base de los trabajadores disponibles
async function readTrabajadores(action = 'readAll', form = null) {
  // Usamos el operador ?? para pasar 'form' si está disponible, o null en caso contrario.
  const DATA = await fetchData(TRABAJADORES_API, action, form ?? null);
  //Limpiar el contenedor de trabajadores.
  CONTAINER_TRABAJADORES_BODY.innerHTML = "";
  CONTAINER_TRABAJADORES_BODY.innerHTML += `
      <div class="add-auto-card d-flex align-items-center justify-content-center" class="agregar">
                      <img src="../../recursos/imagenes/icons/add.svg" class="hvr-grow"
                          onclick="openCreate()">
                  </div>
      `;

  // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
  if (DATA.status) {
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

  if (NOMBRES.value === '' || APELLIDOS.value === '' || CORREO.value === '' || TELEFONO.value === '' ||
    DEPARTAMENTO.value === '' || NIT.value === '' || DUI.value === '' || ESPECIALIZACION.value === '' ||
    FECHA.value === '' || SALARIO.value === ''
  ) {
    await sweetAlert(2, 'Por favor, complete todos los campos.', true); return;
  }

  if (!checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE) ||
    !checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO) ||
    !checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO) ||
    !checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO) ||
    !checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPARTAMENTO) ||
    !checkInput(validateSelect(ESPECIALIZACION.value), ESPECIALIZACION, ERROR_ESPECIAL) ||
    /*!checkInput(validateFecha(FECHA.value), FECHA, ERROR_FECHA) || */
    !checkInput(validateSalary(SALARIO.value), SALARIO, ERROR_SALARIO) ||
    !checkInput(validateDUI(DUI.value), DUI, ERROR_DUI) ||
    !checkInput(validateNit(NIT.value), NIT, ERROR_NIT)) {
    // await sweetAlert(2, 'Error al validar los campos.', true);
    // console.log(DUI.value, 'a', NIT.value)
    return;
  }

  //Se verifica si la validacion es correcta
  if (isValid) {
    // Se verifica la acción a realizar.
    const action = ID_EMPLEADO.value ? "updateRow" : "createRow";
    // Constante tipo objeto con los datos del formulario.
    const formData = new FormData(SAVE_FORM);
    if (ID_EMPLEADO.value) {
      formData.append('idTrabajador', ID_EMPLEADO.value);
    }
    //formData.append('fto_trabajador2', "C:\fakepath\EMPLEADOIMG.png");

    try {
      // Petición para guardar los datos del formulario.
      const DATA = await fetchData(TRABAJADORES_API, action, formData);// Petición para guardar los datos del formulario

      if (DATA.status) { // Se comprueba si la respuesta es satisfactoria
        await sweetAlert(1, DATA.message, true); // Se muestra un mensaje de éxito
        SAVE_MODAL.hide(); // Se cierra la caja de diálogo
        readTrabajadores(); //Se lee los trabajadores en la base
        location.reload();
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
  if (id) {
    await SAVE_MODAL.show();
    ID_EMPLEADO.value = id;

    const formData = new FormData();
    formData.append("idTrabajador", id);

    const DATA = await fetchData(TRABAJADORES_API, "readOne", formData);

    if (DATA.status) {
      SAVE_FORM.reset();
      const row = DATA.dataset;

      // Inicializar campos
      ID_EMPLEADO.value = row.id_trabajador;
      DUI.value = row.dui_trabajador;
      NIT.value = row.NIT_trabajador;
      NOMBRES.value = row.nombres_trabajador;
      APELLIDOS.value = row.apellidos_trabajador;
      TELEFONO.value = row.telefono_trabajador;
      CORREO.value = row.correo_trabajador;
      DEPARTAMENTO.value = findNumberValue(row.departamento_trabajador);
      // Llamada a fillSelect

      setTimeout(async () => {
        const selectElement = document.getElementById('especializacion_trabajador');
        if (selectElement) {
          await fillSelect(TRABAJADORES_API, 'readEspecializaciones', 'especializacion_trabajador', row.id_especializacion_trabajador);
        } else {
          console.error('El select "especializacion_trabajador" no se encontró después del retraso.');
        }
      }, 200); // Ajusta el tiempo según sea necesario

      // Inicializar otros campos
      FECHA.value = row.fecha_contratacion;
      SALARIO.value = row.salario_base;

      // Marcar el option correspondiente
      const departamentoValue = findNumberValue(row.departamento_trabajador);
      const options = DEPARTAMENTO.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].text === departamentoValue) {
          options[i].selected = true;
          break;
        }
      }

      // Verificar y agregar botón "Eliminar"
      if (CONTAINER_BOTONES) {
        if (!document.getElementById("btnTres")) {
          CONTAINER_BOTONES.insertAdjacentHTML('afterbegin', `
            <button type="button" id="btnTres" class="btn btn-secondary btnCancel2 mx-5" 
                    onclick="openDelete(${row.id_trabajador})">Eliminar</button> 
          `);
        }
      } else {
        console.error("CONTAINER_BOTONES is null or undefined.");
      }
    } else {
      sweetAlert(2, DATA.error, false);
    }

    number = 2; // Cambia el diálogo de la alerta
  }
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
  // document.getElementById("btnUno").innerText = "Cancelar";
  // document.getElementById("btnDos").innerText = "Guardar";
}

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

NOMBRES.addEventListener('input', function () {
  checkInput(validateName(NOMBRES.value), NOMBRES, ERROR_NOMBRE);
});

APELLIDOS.addEventListener('input', function () {
  checkInput(validateName(APELLIDOS.value), APELLIDOS, ERROR_APELLIDO);
});

TELEFONO.addEventListener('input', function () {
  checkInput(validatePhoneNumber(TELEFONO.value), TELEFONO, ERROR_TELEFONO);
});

CORREO.addEventListener('input', function () {
  checkInput(validateEmail(CORREO.value), CORREO, ERROR_CORREO);
});

DEPARTAMENTO.addEventListener('input', function () {
  checkInput(validateSelect(DEPARTAMENTO.value), DEPARTAMENTO, ERROR_DEPARTAMENTO);
});

ESPECIALIZACION.addEventListener('input', function () {
  checkInput(validateSelect(ESPECIALIZACION.value), ESPECIALIZACION, ERROR_ESPECIAL);
});

// FECHA.addEventListener('input', function () {
//   checkInput(validateFecha(FECHA.value), FECHA, ERROR_FECHA);
// });

SALARIO.addEventListener('input', function () {
  checkInput(validateSalary(SALARIO.value), SALARIO, ERROR_SALARIO);
});

function applicateRules() {
  // Agregar evento a cada campo de contraseña
  formatDUI(DUI, ERROR_DUI);
  formatNit(NIT, ERROR_NIT);
  formatName(NOMBRES);
  formatName(APELLIDOS);
  formatPhone(TELEFONO);
  formatEmail(CORREO);
  formatSalary(SALARIO);

  disablePasteAndDrop(DUI);
  disableCopy(DUI);
  disablePasteAndDrop(NIT);
  disableCopy(NIT);
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

  document.getElementById("fecha_contratacion").setAttribute("max", hoy);
}

