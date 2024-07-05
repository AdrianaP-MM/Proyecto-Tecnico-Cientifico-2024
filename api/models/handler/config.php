<?php
// Configurar tiempo de vida máximo de la sesión (en segundos)
$session_lifetime = 1800; // 30 minutos

// Establecer el tiempo máximo de vida de la sesión
ini_set('session.gc_maxlifetime', $session_lifetime);

// Configurar parámetros de la cookie de sesión
session_set_cookie_params($session_lifetime);

// Iniciar o reanudar la sesión
session_start();
?>
