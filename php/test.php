<?php
// test.php — Diagnostic complet Louagi BDD & Session
require_once 'config.php';
session_start();

header('Content-Type: text/plain; charset=utf-8');

try {
    $pdo = getDB();
    echo "=== 1. CONNEXION POSTGRESQL ===\n";
    $v = $pdo->query("SELECT version()")->fetchColumn();
    echo "✅ Connecté : " . substr($v, 0, 50) . "...\n\n";

    echo "=== 2. SESSION PHP ACTUELLE ===\n";
    if (isset($_SESSION['utilisateur'])) {
        echo "✅ Connecté en tant que : " . json_encode($_SESSION['utilisateur'], JSON_UNESCAPED_UNICODE) . "\n\n";
    } else {
        echo "⚠️ Aucune session active (null)\n\n";
    }

    echo "=== 3. TABLE UTILISATEURS ===\n";
    $users = $pdo->query("SELECT id, nom, email, telephone, date_inscription FROM utilisateurs ORDER BY id DESC")->fetchAll();
    echo "Total : " . count($users) . " utilisateur(s)\n";
    foreach ($users as $u) {
        echo " - [#" . $u['id'] . "] " . $u['nom'] . " (" . $u['email'] . ") Tel: " . $u['telephone'] . "\n";
    }
    echo "\n";

    echo "=== 4. TABLE RESERVATIONS ===\n";
    $res = $pdo->query("SELECT id, utilisateur_id, code, depart, destination, date_voyage, heure, place, prix, mode_paiement FROM reservations ORDER BY id DESC")->fetchAll();
    echo "Total : " . count($res) . " réservation(s)\n";
    foreach ($res as $r) {
        echo " - [#" . $r['id'] . "] Code: " . $r['code'] . " | " . $r['depart'] . " -> " . $r['destination'] . " | Place: " . $r['place'] . " | User ID: " . $r['utilisateur_id'] . "\n";
    }
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage() . "\n";
}
