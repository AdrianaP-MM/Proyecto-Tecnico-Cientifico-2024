/*
*   Controladores de uso general en las páginas web del sitio privado.
*   Sirve para manejar las plantillas del encabezado y pie del documento.
*/

//* Constante para establecer el elemento del contenido principal.
const MAIN = document.querySelector('main');

/* Función asíncrona para cargar el encabezado y pie del documento.
*   Parámetros: ninguno.
*   Retorno: ninguno.*/

const loadTemplate = async () => {

    // *Se agrega el encabezado de la página web antes del contenido principal.
    MAIN.insertAdjacentHTML('beforebegin', `
    <header class="sticky-top z-3">
        <nav class="navbar navbar-expand-lg bg-color-n2 shadow px-lg-5 py-3 px-md-0">
            <div class="container-fluid">

                <button class="navbar-toggler mb-3" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse " id="navbarSupportedContent">

                    <ul
                        class="navbar-nav mb-2 mb-lg-0 nav-underline d-flex justify-content-between me-auto flex-grow-1">

                        <li class="nav-item animation">
                            <a class="nav-link" aria-current="page" href="../../vistas/privado/empleados.html">
                                <h5 class="text-white open-sans-regular m-0 p-0 px-4 px-lg-0">Empleados</h5>
                            </a>
                        </li>

                        <li class="nav-item animation">
                            <a class="nav-link" aria-current="page" href="../../vistas/privado/automoviles.html">
                                <h5 class="text-white open-sans-regular m-0 p-0 px-4 px-lg-0">Automóviles</h5>
                            </a>
                        </li>

                        <li class="nav-item animation">
                            <a class="nav-link" aria-current="page" href="../../vistas/privado/clientes.html">
                                <h5 class="text-white open-sans-regular m-0 p-0 px-4 px-lg-0">Clientes</h5>
                            </a>
                        </li>

                        <li class="nav-item animation">
                            <a class="nav-link" aria-current="page" href="../../vistas/privado/citas.html">
                                <h5 class="text-white open-sans-regular m-0 p-0 px-4 px-lg-0">Citas</h5>
                            </a>
                        </li>

                        <li class="nav-item animation">
                            <a class="nav-link" aria-current="page" href="../../vistas/privado/pagina_servicios.html">
                                <h5 class="text-white open-sans-regular m-0 p-0 px-4 px-lg-0">Servicios</h5>
                            </a>
                        </li>

                        <li class="nav-item animation">
                        <a class="nav-link" aria-current="page" href="../../vistas/privado/manual_usuario.html">
                            <h5 class="text-white open-sans-regular m-0 px-4">Manual de usuario</h5>
                        </a>
                    </li>
                    </ul>

                    <ul class="navbar-nav nav-underline flex-grow-1 justify-content-center">
                        <li class="nav-item animation">
                        <a class="nav-link" aria-current="page" href="../../vistas/privado/panel_principal.html">
                            <h3 class="text-white open-sans-semibold m-0 px-4">INICIO</h3>
                        </a>
                    </li>
                    </ul>

                    <button class="btn btn-outline-primary d-flex flex-wrap justify-content-center" type="button">
                    <a class="nav-link d-flex" aria-current="page" href="../../vistas/privado/usuario.html">
                        <img src="../../recursos/imagenes/icons/icono_usuario.svg" width="22px" height="22px">
                        <h5 class="text-white open-sans-regular m-0 text-center ps-1">USUARIO</h5>
                        </a>
                    </button>
                </div>
            </div>
        </nav>
    </header>
    `);
    //* Se agrega el pie de la página web después del contenido principal.
    MAIN.insertAdjacentHTML('afterend', `
    <footer class="text-center text-lg-start text-white bg-color-n2 pt-5">
        <!-- Section: Social media -->

        <!-- Section: Links  -->
        <section class="w-100">
            <div class="text-center text-md-start m-0 row">
                <!-- Grid row -->
                <div class="d-flex flex-wrap justify-content-center">
                    <div class="itemFlex">
                        <img src="../../recursos/imagenes/logos/LOGO_CUADRADO.svg">
                    </div>

                    <!-- Grid column -->
                    <div class="itemFlex mx-auto my-3">
                        <!-- Content -->
                        <h5 class="text-white open-sans-semibold">CONTÁCTANOS</h5>
                        <div class="lineR1 mb-3"></div>
                        <div class="col">
                            <div class="d-flex flex-row align-items-center mb-3">
                                <img class="me-2" src="../../recursos/imagenes/icons/icon_facebook.svg" height="20px">
                                <a class="text-white" href="">
                                    <h6 class="open-sans-light m-0 p-0">Facebook</h6>
                                </a>
                            </div>

                            <div class="d-flex flex-row align-items-center mb-3">
                                <img class="me-2" src="../../recursos/imagenes/icons/icon_whatsapp.svg" height="20px">
                                <a class="text-white" href="">
                                    <h6 class="open-sans-light m-0 p-0">WhatsApp</h6>
                                </a>
                            </div>

                            <div class="d-flex flex-row align-items-center mb-3">
                                <img class="me-2" src="../../recursos/imagenes/icons/icon_instagram.svg" height="20px">
                                <a class="text-white" href="">
                                    <h6 class="open-sans-light m-0 p-0">Instagram</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Grid column -->

                    <!-- Grid column -->
                    <div class="itemFlex mx-auto my-3">
                        <!-- Content -->
                        <h5 class="text-white open-sans-semibold">CONTÁCTANOS</h5>
                        <div class="lineR1 mb-3"></div>
                        <div class="col">
                            <div class="d-flex flex-row align-items-center mb-3">
                                <img class="me-2" src="../../recursos/imagenes/icons/icon_cellphone.svg" height="20px">
                                <h6 class="open-sans-light m-0 p-0">+503 7221-2806</h6>
                            </div>

                            <div class="d-flex flex-row align-items-center mb-3">
                                <img class="me-2" src="../../recursos/imagenes/icons/icon_gmail.svg" height="20px">
                                <a class="text-white" href="">
                                    <h6 class="open-sans-light m-0 p-0 w-100">info.revolutiongarage<br>@gmail.com</h6>
                                </a>
                            </div>
                        </div>
                    </div>
                    <!-- Grid column -->
                    <div class="itemFlexU mx-auto my-3">
                        <!-- Content -->
                        <h5 class="text-white open-sans-semibold">UBICACIÓN</h5>
                        <div class="lineR1 mb-3"></div>
                        <p class="open-sans-regular">
                            Prolongacion 10 ª Ave. Norte, entre 39 y 37 Calle Oriente. Col. El Encanto Nº 36 S.S.,
                            San Salvador, El Salvador
                        </p>
                    </div>
                    <!-- Grid column -->

                    <div class="lineW1 p-0"></div>

                    <!-- Grid column -->
                    <div class="itemFlex mx-auto my-3">
                        <!-- Content -->
                        <h5 class="text-white open-sans-semibold">DESARROLLADORES</h5>
                        <div class="lineR1 mb-3"></div>
                        <div class="row">
                            <div class="col">
                                <div class="d-flex flex-row align-items-center mb-3">
                                    <img class="me-2" src="../../recursos/imagenes/icons/icon_user3.svg" height="20px">
                                    <h6 class="open-sans-light m-0 p-0">Adriana P. Mejía</h6>
                                </div>
                                <div class="d-flex flex-row align-items-center mb-3">
                                    <img class="me-2" src="../../recursos/imagenes/icons/icon_user3.svg" height="20px">
                                    <h6 class="open-sans-light m-0 p-0">Melanie J. Martínez</h6>
                                </div>
                                <div class="d-flex flex-row align-items-center mb-3">
                                    <img class="me-2" src="../../recursos/imagenes/icons/icon_user3.svg" height="20px">
                                    <h6 class="open-sans-light m-0 p-0">Emily G. Murillo.</h6>
                                </div>
                            </div>

                            <div class="col">
                                <div class="d-flex flex-row align-items-center mb-3">
                                    <img class="me-2" src="../../recursos/imagenes/icons/icon_user3.svg" height="20px">
                                    <h6 class="open-sans-light m-0 p-0">Daniel A. Córtez</h6>
                                </div>
                                <div class="d-flex flex-row align-items-center mb-3">
                                    <img class="me-2" src="../../recursos/imagenes/icons/icon_user3.svg" height="20px">
                                    <h6 class="open-sans-light m-0 p-0">Axel G. García</h6>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- Grid column -->

                    <div class="itemFlex mx-auto d-flex flex-column align-items-center justify-content-center">
                        <div class="lineR1"></div>
                        <h6 class="open-sans-semibold">© 2024 REVOLUTION GARAGE</h6>
                    </div>
                </div>
                <!-- Grid row -->
            </div>
        </section>
    </footer>
`);
}
