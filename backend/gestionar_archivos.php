<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = json_decode(file_get_contents("php://input"));

try {
    if ($metodo === 'GET') {
        $id_progreso = $_GET['id_progreso'];
        $sql = "SELECT * FROM archivos_materia WHERE id_progreso = ? ORDER BY fecha_subida DESC";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id_progreso]);
        echo json_encode($stmt->fetchAll());

    } elseif ($metodo === 'POST') {
        $sql = "INSERT INTO archivos_materia (id_progreso, nombre_archivo, url_archivo, tipo_archivo) VALUES (?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            $datos->id_progreso, 
            $datos->nombre_archivo, 
            $datos->url_archivo, 
            $datos->tipo_archivo ?? 'link'
        ]);
        echo json_encode(["mensaje" => "Archivo guardado", "id" => $conexion->lastInsertId()]);

    } elseif ($metodo === 'DELETE') {
        $id = $_GET['id'] ?? $datos->id;
        $sql = "DELETE FROM archivos_materia WHERE id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Archivo eliminado"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
