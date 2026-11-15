<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');
if (!isset($_SESSION['utilisateur']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok'=>false]); exit;
}

$code = $_POST['code'] ?? '';
$pdo  = getDB();
$del  = $pdo->prepare('DELETE FROM reservations WHERE code=:c AND utilisateur_id=:u');
$del->execute([':c'=>$code, ':u'=>$_SESSION['utilisateur']['id']]);
echo json_encode(['ok'=>true]);
