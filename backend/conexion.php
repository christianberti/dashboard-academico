<?php
// Configuración de la base de datos
$servidor = "localhost";
$usuario = "root";
$contrasena = ""; // En XAMPP/Laragon por defecto es vacío
$nombre_bd = "gestion_academica";

try {
    // Creamos la conexión usando PDO
    $conexion = new PDO("mysql:host=$servidor;dbname=$nombre_bd;charset=utf8mb4", $usuario, $contrasena);
    
    // Configuramos para que lance excepciones en caso de error
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Establecemos el modo de obtención por defecto a Objeto o Array Asociativo
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Si hay un error, lo capturamos y mostramos el mensaje
    error_log("Fallo en la conexión: " . $e->getMessage());
    die("Error interno del servidor. No se pudo conectar a la base de datos.");
}
?>