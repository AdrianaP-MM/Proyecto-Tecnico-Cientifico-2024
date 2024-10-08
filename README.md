# Proyecto Técnico Científico 2024.

## OWAS APLICADOS
- A01:2021 - Pérdida de Control de Acceso: Se puede cubrir que no ingrese a urls fuera de la que estan permitidas para el usuario (solo hay un administrador) tocar php o otro archivo sensible

- A02:2021 - Fallas Criptográficas: Son por encryptados debiles y viejos pero el que usamos de php password hash es reciente y seguro en este caso se selecciona con el PASSWORD_DEFAULT 

- A03:2021 - Inyección: Estamos llevando buenas practicas ya que en el executeRow que esta en database se usa el prepare para las querys sean preparadas con PDO(PHP Data Objects) y que se validan los datos en lo set antes de usarlos en la consulta.

- Insecure Design (Diseño inseguro): esto se soluciona con los intentos al iniciar sesion y que no pase tanto tiempo en inactividad para que se cierre la secion para evitar ataques de fuerza bruta

- A05:2021 - Configuración de Seguridad Incorrecta: esto se soluciona con cambiar las credenciales por defecto en la base, hacer un usuario con credenciales especificas y con permisos solo para la base de datos

- A06:2021 - Componentes Vulnerables y Desactualizados: Mantener todas las librerias actualizadas en el caso de la movil ahi puse el comando para act las librerias y en la web pues poner las ultimas (talvez esta falta por as versiones pero si son las ultimas pues tmb la tenemos)

- A07:2021 - Fallas de Identificación y Autenticación: esto se soluciona con la doble autenticacion que es punto rubrica asi que se hace de un solo y es para que no haya suplantacion de identidad o robo de sesion (tmb se evita poniendo contraseñas fuertes)

- Seguridad extra: revisar database.php el execute row, explicaciòn:
Usa PDO para aplicar prepare query para el cuido de inyecciones sql

## - Nombre del proyecto: Data Administration Revolution Garage (DARG)

- Descripción del proyecto:
El presente documento tiene como objetivo general el definir y presentar la documentación necesaria para la comprensión y lógica detrás de la creación de la base de datos para la empresa seleccionada por el presente equipo PTC, de manera que, ayude a personas externas a comprender la lógica del proyecto. Para comenzar, se explicará la lógica del negocio de la empresa seleccionada, para que posteriormente podamos entender el contexto de los diagramas y el diccionario de datos.
La empresa denominada “Taller Revolution Garage” es una empresa que se dedica al mantenimiento y reparación de automóviles de todo tipo, que abarcan desde camionetas tipo pick-up, carros tipo sedan, hasta automóviles más pequeños.
La empresa no se limita solamente a estos tipos de autos, a su vez, manejan todo tipo de marcas de automóviles, desde marcas japonesas, europeas, y un largo etcétera acompañan el buen nombre del taller mismo frente a su versatilidad para la reparación de automotores; es bueno destacar dentro de este punto que, ellos no trabajan con motocicletas, solamente dedican todos sus conocimientos y experiencia en reparar los diversos tipos de vehículos y diversas marcas reconocidas.
Dentro de los servicios que el taller ofrece podemos enlistar; el mantenimiento general del automotor, electrónica automotriz con personas certificadas para poder realizar la labor, mantenimiento preventivo del vehículo, y así cuenta con muchos más servicios, teniendo el personal adecuado para dejar tu auto en las mejores manos. Y, aunque ellos den muchos servicios su fuerte se encuentra dentro de la reparación de aires acondicionados a todo tipo de vehículos, incluso haciendo reparaciones a vehículos de empresas de renombre del país como “Heladería Sarita” hasta “Empresa de boquitas Diana”.
Aunque la empresa es muy completa, poseen algunas limitantes, como por ejemplo, ellos solo hacen trabajos dentro de la zona de San Salvador, además, ellos como tal no poseen un registro formal como un programa de escritorio para poder llevar un registro ordenado y completo de sus trabajadores, trabajos previos, incluso de sus facturas; además, frente al tema de las citas ellos en su totalidad lo manejan usando la aplicación multiplataforma “WhatsApp”, sin embargo, si están con el taller lleno y llega otro vehículo tendrá que esperar o reprogramar su cita. Esto claramente es una desventaja pues detiene el contacto tan fluido que ellos esperan para poder darle las mejores de las atenciones a sus clientes. 

### Integrantes del equipo:
- Adriana Paola Mejía Méndez, 20190015, 2A. - Coordinadora.
- Melanie Jackeline Martínez Ramírez, 20190148, 2A. - Sub-coordinadora.
- Emily Guadalupe Murillo Argueta, 20220021, 2A. - Secretaria.
- Daniel Alejandro Cortez Quintanilla, 20210199, 2A. - Tesorero.
- Axel Gabriel García Ramírez, 20220127, 2A. - Primer vocal.

## Estandares / Buenas practicas

### Variables (sitio web privado)

* NOMBRE_DE_VARIABLE: Nombre descriptivo en mayúsculas con guiones bajos para separar palabras.
Clases

* NombreClase: Nombre de clase en PascalCase, comenzando con mayúscula.
Funciones

* nombreFuncionExtra: Nombre de función en camelCase, comenzando con minúscula y usando palabras consecutivas en mayúscula.
Archivos

* JavaScript: nombre-archivo.js 
* PHP: nombre-archivo.php 

### Componentes
* Componentes generales: NombreComponente
* Componentes específicos de la app móvil: NombreComponenteMovil
* Componentes específicos del sitio privado: NombreComponentePrivado

### Comentarios
Utilizar comentarios claros y concisos en cada bloque de código para explicar la funcionalidad, especialmente en secciones complejas o críticas.
Estándares adicionales
Seguir la convención de nombres establecida para mantener consistencia y facilitar la legibilidad del código.
Mantener la estructura de archivos organizada y lógica dentro de los directorios correspondientes (por ejemplo, separar archivos de JavaScript y PHP en carpetas distintas según su función).
