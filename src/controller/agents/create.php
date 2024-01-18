<?php
session_start();

error_reporting(E_ALL);
ini_set("display_errors", 1);

require_once __DIR__ . '/../../../vendor/autoload.php'; // Path to autoload.php
require_once '../../model/Agent.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../'); // Adjusted path to project root
$dotenv->load();

$dsn = "mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]}";
/*   $options = array(
    PDO::MYSQL_ATTR_SSL_CA => "/etc/ssl/certs/ca-certificates.crt",
  ); */

try {
    // Connect to the database
    $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"]);
    /* $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"], $options); */
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $agent_data = json_decode(file_get_contents('php://input'), true);

        // Validation de l'âge
        $birthDate = new DateTime($agent_data['agentBirthDate']);
        $today = new DateTime('now');
        $age = $today->diff($birthDate)->y;

        if ($age < 18) {
            header('Content-Type: application/json');
            echo json_encode(['error' => "L'agent doit avoir au moins 18 ans."]);
            exit;
        }

        // Créer un nouvel agent avec sa spécialité
        Agent::createAgent($pdo, [
            'firstName' => $agent_data['agentFirstName'],
            'lastName' => $agent_data['agentLastName'],
            'birthDate' => $agent_data['agentBirthDate'],
            'codeName' => $agent_data['agentCodeName'],
            'nationality' => $agent_data['agentNationality']
        ], $agent_data['agentSpecialtyId']);

        $response = ['success' => true, 'message' => 'Création du nouvel agent réussie.'];

        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        throw new Exception('Invalid request method');
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
    die("Error connecting to database: " . $e->getMessage());
}