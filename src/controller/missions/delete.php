<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Mission.php';

if (file_exists(__DIR__ . '/../../../' . '/.env')) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
  $dotenv->load();
}

$dsn = "mysql:host={$_ENV["STACKHERO_MYSQL_HOST"]};dbname={$_ENV["STACKHERO_MYSQL_NAME"]}";
  $options = array(
    PDO::MYSQL_ATTR_SSL_CAPATH => '/etc/ssl/certs/',
    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true,
  );

try {
    // Connect to the database
    /* $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"]); */
    $pdo = new PDO($dsn, $_ENV["STACKHERO_MYSQL_USER"], $_ENV["STACKHERO_MYSQL_PASSWORD"], $options);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the request method is DELETE
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents("php://input"), $deleteData);

        // Check if the mission ID is provided
        if (isset($deleteData['id_mission'])) {
            $missionId = $deleteData['id_mission'];
            $result = Mission::deleteMission($pdo, $missionId);

            // Renvoie la réponse au format JSON
            header('Content-Type: application/json');
            echo json_encode($result);

        } else {
            // No mission ID provided
            echo json_encode(['message' => 'Aucun ID mission donné.']);
        }
    } else {
        // Invalid request method
        echo json_encode(['message' => 'Invalid request method']);
    }
} catch (PDOException $e) {
    // Handle database connection error
    echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}

