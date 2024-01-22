<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Agent.php';

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

    // Check if the request method is DELETE
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents("php://input"), $deleteData);

        // Check if the agent ID is provided
        if (isset($deleteData['id_agent'])) {
            $agentId = $deleteData['id_agent'];
            $result = Agent::deleteAgent($pdo, $agentId);

            // Renvoie la réponse au format JSON
            header('Content-Type: application/json');
            echo json_encode($result);

        } else {
            // No agent ID provided
            echo json_encode(['message' => 'Aucun ID agent donné.']);
        }
    } else {
        // Invalid request method
        echo json_encode(['message' => 'Invalid request method']);
    }
} catch (PDOException $e) {
    // Handle database connection error
    echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}

