<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_encode(['ok'=>false]); exit; }

$email = trim(strtolower($_POST['email'] ?? ''));
$mdp   = $_POST['motDePasse'] ?? '';

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT * FROM utilisateurs WHERE email = :e');
$stmt->execute([':e' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($mdp, $user['mot_de_passe'])) {
    echo json_encode(['ok'=>false, 'erreur'=>'Email ou mot de passe incorrect.']); exit;
}

session_regenerate_id(true);
$_SESSION['utilisateur'] = ['id'=>(int)$user['id'], 'nom'=>$user['nom'], 'email'=>$user['email'], 'telephone'=>$user['telephone']];
echo json_encode(['ok'=>true, 'utilisateur'=>$_SESSION['utilisateur']]);
