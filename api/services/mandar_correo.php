<?php

require_once('../../libraries/phpmailer651/src/PHPMailer.php');
require_once('../../libraries/phpmailer651/src/SMTP.php');
require_once('../../libraries/phpmailer651/src/Exception.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class mandarCorreo
{
    // Función para enviar el correo
    function enviarCorreoPassword($correoDestino, $asunto, $codigoRecuperacion)
    {
        // Instanciar la clase PHPMailer
        $mail = new PHPMailer(true);

        try {
            // Configuración del servidor SMTP (en este caso, Gmail)
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // Servidor SMTP de Gmail
            $mail->SMTPAuth   = true;
            $mail->Username   = 'revolutiongarageofficialsv@gmail.com'; // Tu dirección de correo electrónico de Gmail
            $mail->Password   = 'akxt lkpp sdfi nmzf'; // Tu contraseña de Gmail
            $mail->SMTPSecure ='tls';
            $mail->Port       = 587;


            // Configuración del correo electrónico
            $mail->setFrom('revolutiongarageofficialsv@gmail.com', 'RevolutionGarageSupport');
            $mail->addAddress($correoDestino);
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8'; // Establecer la codificación de caracteres
            $mail->Subject = '=?UTF-8?B?' . base64_encode($asunto) . '?='; // Asunto codificado en base64

            // Diseño del cuerpo del correo electrónico
            $cuerpo = '
            <html>
            <head>
                <style>
                    .container {
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                        font-family: Arial, sans-serif;
                    }
                    .header {
                        background-color: #E5383B; /* Color principal */
                        padding: 10px;
                        text-align: center;
                        border-radius: 10px 10px 0 0; /* Redondear bordes superiores */
                    }
                    .content {
                        padding: 20px;
                        background-color: #FFFFFF; /* Fondo blanco */
                        color: #000000; /* Texto negro */
                        border-radius: 0 0 10px 10px; /* Redondear bordes inferiores */
                        border: 1px solid #1A89BD; /* Borde con color principal */
                    }
                    .card {
                        margin-bottom: 20px;
                    }
                    .company-name {
                        color: #FFFFFF; /* Nombre de la empresa en blanco */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="company-name">DARG: Data Administration Revolution Garage</h1>
                    </div>
                    <div class="content">
                        <div class="card">
                            <p>Hola querido usuario,</p>
                            <p>Recibiste este correo electrónico porque solicitaste un código de recuperación para restablecer tu contraseña en DARG.SV o para la seguridad de dos pasos.</p>
                            <p>Tu código de recuperación es: <strong>' . $codigoRecuperacion . '</strong></p>
                            <p>Por favor, guarda este código de forma segura y no lo compartas con nadie.</p>
                            <p>Si no solicitaste este código, puedes ignorar este correo electrónico de manera segura.</p>
                            <p>¡Gracias!</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            ';

            $mail->Body = $cuerpo;

            // Enviar correo
            $mail->send();

            // Devolver verdadero si el correo se envió correctamente
            return true;
        } catch (Exception $e) {
            // Devolver el mensaje de error si hubo un problema
            return $mail->ErrorInfo;
        }
    }

    function generarCodigoRecuperacion($longitud = 8)
    {
        // Caracteres permitidos para el código de recuperación
        $caracteresPermitidos = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$';

        // Longitud del conjunto de caracteres permitidos
        $longitudCaracteres = strlen($caracteresPermitidos);

        // Inicializar la variable que almacenará el código de recuperación
        $codigoRecuperacion = '';

        // Generar el código de recuperación aleatorio
        for ($i = 0; $i < $longitud; $i++) {
            // Obtener un carácter aleatorio del conjunto permitido
            $caracterAleatorio = $caracteresPermitidos[rand(0, $longitudCaracteres - 1)];

            // Agregar el carácter al código de recuperación
            $codigoRecuperacion .= $caracterAleatorio;
        }

        // Devolver el código de recuperación generado
        return $codigoRecuperacion;
    }
}
