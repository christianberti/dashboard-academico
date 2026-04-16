<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once 'conexion.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$datos = json_decode(file_get_contents("php://input"));

try {
    if ($metodo === 'POST') {
        // Obtenemos el id_progreso basado en el nombre de la materia
        $sqlMateria = "SELECT id FROM progreso_estudiante WHERE id_materia = (SELECT id FROM plan_estudios WHERE nombre = ?) AND usuario_id = 1";
        $stmtM = $conexion->prepare($sqlMateria);
        $stmtM->execute([$datos->nombre]);
        $materia = $stmtM->fetch();

        if (!$materia) throw new Exception("Materia no encontrada");

        $sql = "INSERT INTO eventos_examenes (id_progreso, nombre, fecha) VALUES (?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$materia['id'], $datos->nombre, $datos->fecha]);
        echo json_encode(["mensaje" => "Examen agendado", "id" => $conexion->lastInsertId()]);

    } elseif ($metodo === 'PUT') {
        if (isset($datos->toggleCompletado)) {
            $sql = "UPDATE eventos_examenes SET completado = NOT completado WHERE id = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$datos->id]);
        } else {
            // Edición completa: Nombre y Fecha
            // Buscamos el nuevo id_progreso si cambió el nombre
            $sqlMateria = "SELECT id FROM progreso_estudiante WHERE id_materia = (SELECT id FROM plan_estudios WHERE nombre = ?) AND usuario_id = 1";
            $stmtM = $conexion->prepare($sqlMateria);
            $stmtM->execute([$datos->nombre]);
            $materia = $stmtM->fetch();
            
            if (!$materia) throw new Exception("Materia no encontrada");

            $sql = "UPDATE eventos_examenes SET nombre = ?, fecha = ?, id_progreso = ? WHERE id = ?";
            $stmt = $conexion->prepare($sql);
            $stmt->execute([$datos->nombre, $datos->fecha, $materia['id'], $datos->id]);
        }
        echo json_encode(["mensaje" => "Examen actualizado"]);

    } elseif ($metodo === 'DELETE') {
        $id = $_GET['id'] ?? $datos->id;
        $sql = "DELETE FROM eventos_examenes WHERE id = ?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$id]);
        echo json_encode(["mensaje" => "Examen eliminado"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
