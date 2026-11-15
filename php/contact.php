<?php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Uniquement POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'erreur' => 'Méthode non autorisée.']);
    exit;
}

// ---- Anti-spam : champ honeypot ----
if (!empty($_POST['site_web'])) {
    // Bot détecté → répondre ok sans rien faire
    echo json_encode(['ok' => true]);
    exit;
}

// ---- Récupération et nettoyage des données ----
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$nom       = clean($_POST['nom']       ?? '');
$email     = clean($_POST['email']     ?? '');
$telephone = clean($_POST['telephone'] ?? '');
$sujet     = clean($_POST['sujet']     ?? '');
$message   = clean($_POST['message']   ?? '');
$ip        = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'inconnue';

// ---- Validation côté serveur ----
$erreurs = [];

if (mb_strlen($nom) < 2)
    $erreurs[] = 'Nom trop court (min. 2 caractères).';

if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    $erreurs[] = 'Adresse email invalide.';

if (!empty($telephone) && !preg_match('/^(\+216|00216)?[\d\s]{8,12}$/', $telephone))
    $erreurs[] = 'Téléphone invalide (format : +216 98 123 456).';

$sujets_valides = ['reservation', 'chauffeur', 'reclamation', 'partenariat', 'autre'];
if (!in_array($sujet, $sujets_valides, true))
    $erreurs[] = 'Sujet invalide.';

if (mb_strlen($message) < 10)
    $erreurs[] = 'Message trop court (min. 10 caractères).';

if (!empty($erreurs)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'erreur' => implode(' ', $erreurs)]);
    exit;
}

// ---- Anti-spam : rate-limiting par IP (max 3 messages/heure) ----
try {
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) FROM messages_contact
         WHERE ip_expediteur = :ip
           AND date_envoi > NOW() - INTERVAL '1 hour'"
    );
    $stmt->execute([':ip' => $ip]);
    $nb = (int) $stmt->fetchColumn();

    if ($nb >= 3) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'erreur' => 'Trop de messages envoyés. Réessayez dans une heure.']);
        exit;
    }

    // ---- Insertion en base ----
    $insert = $pdo->prepare(
        "INSERT INTO messages_contact (nom, email, telephone, sujet, message, ip_expediteur)
         VALUES (:nom, :email, :telephone, :sujet, :message, :ip)"
    );
    $insert->execute([
        ':nom'       => $nom,
        ':email'     => $email,
        ':telephone' => $telephone ?: null,
        ':sujet'     => $sujet,
        ':message'   => $message,
        ':ip'        => $ip,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'erreur' => 'Erreur base de données.']);
    exit;
}

// ---- Envoi email (simulation locale XAMPP) ----
$destinataire = 'admin@louagi.tn';
$sujet_mail   = '[Louagi] Nouveau message : ' . $sujet;
$corps        = "Nom : $nom\nEmail : $email\nTéléphone : $telephone\nSujet : $sujet\n\nMessage :\n$message\n\nIP : $ip";
$headers      = "From: noreply@louagi.tn\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
@mail($destinataire, $sujet_mail, $corps, $headers); // @ = pas bloquant si mail désactivé localement

// ---- Réponse succès ----
echo json_encode(['ok' => true, 'message' => 'Message enregistré avec succès !']);
