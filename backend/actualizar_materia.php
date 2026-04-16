<?php
// 1. Cabeceras para permitir que React (puerto 5173) se comunique con PHP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de la petición preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// 2. Conexión a la base de datos (InfinityFree)
$servidor = "sql100.infinityfree.com";
$usuario_db = "if0_41679743";
$password_db = "FKO6frkXtSnW";
$nombre_db = "if0_41679743_gestion_academica";

$conexion = new mysqli($servidor, $usuario_db, $password_db, $nombre_db);

if ($conexion->connect_error) {
    die(json_encode(["error" => "Error de conexión remota"]));
}

$json = file_get_contents("php://input");
$datos = json_decode($json);

if ($datos) {
    $id_materia = $datos->id_materia;
    $estado = $datos->estado;
    $nota = ($estado === "Aprobada") ? $datos->nota : null;
    $usuario_id = 1;

    $stmt = $conexion->prepare("UPDATE progreso_estudiante SET estado = ?, nota = ? WHERE id = ?");
    $stmt->bind_param("ssi", $estado, $nota, $id_materia);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["mensaje" => "Base de datos actualizada"]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "No se encontró la materia o los datos son iguales"]);
        }
    }

    $stmt->close();
} else {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
}

$conexion->close();
