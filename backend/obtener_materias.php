<?php
// 1. Cabeceras obligatorias para API
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); // Permite que React se conecte sin errores de CORS
header("Access-Control-Allow-Methods: GET");

// 2. Incluimos la conexión que ya creamos
require_once 'conexion.php';

try {
    // 3. Consulta SQL: Traemos las materias con su estado y nota
    // Usamos un JOIN para traer el nombre desde el plan de estudios
    $sql = "SELECT p.id, m.nombre, p.estado, p.nota, m.anio_sugerido 
            FROM progreso_estudiante p 
            JOIN plan_estudios m ON p.id_materia = m.id 
            WHERE p.usuario_id = 1";

    $consulta = $conexion->prepare($sql);
    $consulta->execute();
    
    // 4. Obtenemos todos los resultados
    $materias = $consulta->fetchAll();

    // 5. Enviamos la respuesta en formato JSON
    echo json_encode($materias);

} catch (PDOException $e) {
    // Si falla algo, enviamos un error 500 y el mensaje
    http_response_code(500);
    echo json_encode([
        "error" => "Error al obtener los datos",
        "mensaje" => $e->getMessage()
    ]);
}
?>