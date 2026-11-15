<?php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

// Lire le corps JSON
$body   = file_get_contents('php://input');
$data   = json_decode($body, true);
$bouton = isset($data['bouton']) ? htmlspecialchars(trim($data['bouton']), ENT_QUOTES, 'UTF-8') : '';

if (empty($bouton) || mb_strlen($bouton) > 80) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'erreur' => 'Bouton invalide.']);
    exit;
}

try {
    $pdo = getDB();

    // PostgreSQL : INSERT ... ON CONFLICT DO UPDATE (upsert)
    $stmt = $pdo->prepare(
        "INSERT INTO compteur_clics (bouton, total, derniere_maj)
         VALUES (:bouton, 1, NOW())
         ON CONFLICT (bouton) DO UPDATE
           SET total        = compteur_clics.total + 1,
               derniere_maj = NOW()
         RETURNING total"
    );
    $stmt->execute([':bouton' => $bouton]);
    $total = (int) $stmt->fetchColumn();

    echo json_encode(['ok' => true, 'bouton' => $bouton, 'total' => $total]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'erreur' => 'Erreur base de données.']);
}

