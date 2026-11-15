<?php
session_start();
require_once 'config.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { echo json_encode(['ok'=>false]); exit; }

$nom   = trim($_POST['nom'] ?? '');
$email = trim(strtolower($_POST['email'] ?? ''));
$tel   = trim($_POST['telephone'] ?? '');
$mdp   = $_POST['motDePasse'] ?? '';
$conf  = $_POST['confirmation'] ?? '';

if (mb_strlen($nom) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($mdp) < 6) {
    echo json_encode(['ok'=>false, 'erreur'=>'Données invalides (nom ≥ 2 car., mot de passe ≥ 6 car.)']); exit;
}
if ($mdp !== $conf) {
    echo json_encode(['ok'=>false, 'erreur'=>'Les mots de passe ne correspondent pas.']); exit;
}

$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id FROM utilisateurs WHERE email = :e');
$stmt->execute([':e' => $email]);
if ($stmt->fetch()) {
    echo json_encode(['ok'=>false, 'erreur'=>'Un compte existe déjà avec cet email.']); exit;
}

$hash = password_hash($mdp, PASSWORD_DEFAULT);
$ins  = $pdo->prepare('INSERT INTO utilisateurs (nom, email, telephone, mot_de_passe) VALUES (:n, :e, :t, :m) RETURNING id');
$ins->execute([':n'=>$nom, ':e'=>$email, ':t'=>$tel ?: null, ':m'=>$hash]);
$newId = (int)$ins->fetchColumn();

// Connexion automatique immédiate après inscription
session_regenerate_id(true);
$_SESSION['utilisateur'] = [
    'id'        => $newId,
    'nom'       => $nom,
    'email'     => $email,
    'telephone' => $tel
];

echo json_encode(['ok'=>true, 'utilisateur'=>$_SESSION['utilisateur']]);
