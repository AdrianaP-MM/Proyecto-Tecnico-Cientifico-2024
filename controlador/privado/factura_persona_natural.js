//Abrir modal de citas
document.getElementById("btnAgregarSer").addEventListener("click", function () {
    // Ocultar el contenedor containerExpand
    var AgregarSerB = document.getElementById("modalAServicios");
    AgregarSerB.style.display = "block";

});

// Obtener el primer elemento con la clase closeServiciosA
var closeButton = document.getElementsByClassName("closeAServicios")[0];

// Agregar el evento de clic al botón de cierre
closeButton.addEventListener("click", function () {
    // Ocultar el contenedor modalAgregarServicio
    var AgregarSerB = document.getElementById("modalAServicios");
    AgregarSerB.style.display = "none";
});

document.addEventListener('DOMContentLoaded', async () => {

    //Validaciones factura persona natural

    document.getElementById('inputCliente').addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar caracteres que no sean letras o espacios
        inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

        // Asegurar que el texto no supere los 50 caracteres
        inputValue = inputValue.slice(0, 50);

        // Actualizar el valor del campo de texto con la entrada validada
        event.target.value = inputValue;
    });

    document.getElementById('inputPlacaAutomovilD').addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea un número ni una letra
        inputValue = inputValue.replace(/[^A-Za-z0-9]/g, '');

        // Limitar la longitud máxima a 8 caracteres
        inputValue = inputValue.slice(0, 7);

        // Formatear el texto como "11a1-111"
        let formattedValue = '';

        if (inputValue.length > 4) {
            formattedValue += inputValue.slice(0, 4) + '-';
            inputValue = inputValue.slice(4);
        }

        // Agregar el último grupo de dígitos
        if (inputValue.length > 0) {
            formattedValue += inputValue;
        }

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = formattedValue;

        // Validar y agregar la clase 'invalid' si es necesario
        event.target.classList.toggle('invalid', !/^\d{4}-\d{2}-\d{2}$/.test(formattedValue));
    });

    document.getElementById('inputEstadoD').addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar caracteres que no sean letras o espacios
        inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

        // Asegurar que el texto no supere los 50 caracteres
        inputValue = inputValue.slice(0, 50);

        // Actualizar el valor del campo de texto con la entrada validada
        event.target.value = inputValue;
    });

    document.getElementById('inputCantidad').addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Limpiar el valor de cualquier carácter que no sea un número
        inputValue = inputValue.replace(/\D/g, '');

        // Asegurar que no haya más de 8 dígitos
        inputValue = inputValue.slice(0, 2);

        // Actualizar el valor del campo de texto con la entrada formateada
        event.target.value = inputValue;
    });

    document.getElementById('inputPrecio').addEventListener('input', function (event) {
        // Obtener el valor actual del campo de texto
        let inputValue = event.target.value;

        // Eliminar los espacios en blanco
        inputValue = inputValue.replace(/\s/g, '');

        // Reemplazar cualquier caracter que no sea número, coma o punto con una cadena vacía
        inputValue = inputValue.replace(/[^\d,.]/g, '');

        // Actualizar el valor del campo de texto con la entrada limitada
        event.target.value = inputValue;

        // Validar y agregar la clase 'invalid' si es necesario
        event.target.classList.toggle('invalid', !/^[\d.,]*$/.test(inputValue));
    });

});

