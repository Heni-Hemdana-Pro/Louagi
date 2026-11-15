<?php
require_once 'config.php';
header('Content-Type: application/json');
$tid  = (int)($_GET['trajetId'] ?? 0);
$date = $_GET['date'] ?? '';
$pdo  = getDB();
$stmt = $pdo->prepare('SELECT place FROM reservations WHERE trajet_id=:t AND date_voyage=:d');
$stmt->execute([':t'=>$tid, ':d'=>$date]);
echo json_encode(array_map('intval', array_column($stmt->fetchAll(), 'place')));
