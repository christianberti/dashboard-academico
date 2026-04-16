<?php
// Configuración de la base de datos para InfinityFree
$servidor = "sql100.infinityfree.com";
$usuario = "if0_41679743";
$contrasena = "FKO6frkXtSnW"; 
$nombre_bd = "if0_41679743_gestion_academica";

try {
    // Creamos la conexión usando PDO
    $conexion = new PDO("mysql:host=$servidor;dbname=$nombre_bd;charset=utf8mb4", $usuario, $contrasena);
    
    // Configuramos para que lance excepciones en caso de error
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Establecemos el modo de obtención por defecto
    $conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Error log para el servidor (en InfinityFree puedes verlo en logs si están activos)
    error_log("Fallo en la conexión: " . $e->getMessage());
    
    // Respuesta JSON para el frontend en caso de error
    header("Content-Type: application/json");
    http_response_code(500);
    die(json_encode([
        "error" => "Error de conexión a la base de datos remota",
        "mensaje" => "Verifica las credenciales en conexion.php"
    ]));
}
?>