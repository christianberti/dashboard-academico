<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once 'conexion.php';

try {
    // Traemos los exámenes uniéndolos con el progreso para obtener el nombre de la materia si es necesario
    $sql = "SELECT e.id, e.nombre, e.fecha, e.completado, p.id as id_progreso, m.nombre as nombre_materia
            FROM eventos_examenes e
            JOIN progreso_estudiante p ON e.id_progreso = p.id
            JOIN plan_estudios m ON p.id_materia = m.id
            WHERE p.usuario_id = 1
            ORDER BY e.fecha ASC";

    $consulta = $conexion->prepare($sql);
    $consulta->execute();
    
    $examenes = $consulta->fetchAll();

    echo json_encode($examenes);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
