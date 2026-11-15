<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');
if (!isset($_SESSION['utilisateur']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok'=>false, 'erreur'=>'Non connecté.']); exit;
}

$user   = $_SESSION['utilisateur'];
$tid    = (int)($_POST['trajetId'] ?? 0);
$date   = $_POST['date'] ?? '';
$place  = (int)($_POST['place'] ?? 0);
$dep    = htmlspecialchars(trim($_POST['depart'] ?? ''));
$dest   = htmlspecialchars(trim($_POST['destination'] ?? ''));
$heure  = $_POST['heure'] ?? '';
$prix   = (float)($_POST['prix'] ?? 0);
$mode   = in_array($_POST['modePaiement'] ?? '', ['en_ligne','station']) ? $_POST['modePaiement'] : 'en_ligne';

if (!$tid || !$date || !$place || !$dep || !$dest) {
    echo json_encode(['ok'=>false, 'erreur'=>'Données manquantes.']); exit;
}

$pdo   = getDB();
$check = $pdo->prepare('SELECT id FROM reservations WHERE trajet_id=:t AND date_voyage=:d AND place=:p');
$check->execute([':t'=>$tid, ':d'=>$date, ':p'=>$place]);
if ($check->fetch()) {
    echo json_encode(['ok'=>false, 'erreur'=>'Place déjà réservée.']); exit;
}

$code = 'LG-' . rand(1000, 9999);
$ins  = $pdo->prepare(
    'INSERT INTO reservations (utilisateur_id,trajet_id,depart,destination,date_voyage,heure,place,prix,mode_paiement,code)
     VALUES (:u,:t,:dep,:dest,:d,:h,:p,:prix,:m,:c)'
);
$ins->execute([':u'=>$user['id'],':t'=>$tid,':dep'=>$dep,':dest'=>$dest,':d'=>$date,':h'=>$heure,':p'=>$place,':prix'=>$prix,':m'=>$mode,':c'=>$code]);
echo json_encode(['ok'=>true, 'code'=>$code]);
