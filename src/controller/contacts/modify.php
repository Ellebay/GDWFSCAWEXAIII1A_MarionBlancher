<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Contact.php';

if (file_exists(__DIR__ . '/../../../' . '/.env')) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
  $dotenv->load();
}

$dsn = "mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]}";
  $options = array(
    PDO::MYSQL_ATTR_SSL_CA => "/etc/ssl/cert.pem",
  );

try {
    // Connect to the database
    /* $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"]); */
    $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"], $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the request method is UPDATE
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $contact_data = json_decode(file_get_contents('php://input'), true);
        // Check if the contact ID is provided
        if (isset($contact_data['id_contact'])) {
            $contactId = $contact_data['id_contact'];
            $result = Contact::modifyContact($pdo, [
                'firstName' => $contact_data['contact_first_name'],
                'lastName' => $contact_data['contact_last_name'],
                'birthDate' => $contact_data['contact_birth_date'],
                'codeName' => $contact_data['contact_code_name'],
                'nationality' => $contact_data['contact_nationality']
            ], $contactId);

            // Renvoie la réponse au format JSON
            header('Content-Type: application/json');
            echo json_encode($result);

        } else {
            // No contact ID provided
            header('Content-Type: application/json');
            echo json_encode(['message' => 'No contact ID provided']);
            exit;
        }
    } else {
        // Invalid request method
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Invalid request method']);
        exit;
    }

} catch (PDOException $e) {
    // Handle database connection error
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
    exit;
}