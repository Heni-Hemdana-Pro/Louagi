<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');
if (!isset($_SESSION['utilisateur'])) { echo json_encode([]); exit; }

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT * FROM reservations WHERE utilisateur_id=:u ORDER BY date_reservation DESC');
$stmt->execute([':u' => $_SESSION['utilisateur']['id']]);
echo json_encode($stmt->fetchAll());
