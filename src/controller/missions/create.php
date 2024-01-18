<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; // Path to autoload.php
require_once '../../model/Mission.php';

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

    // Check if the request method is POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get the JSON data from the request body
        $mission_data = json_decode(file_get_contents('php://input'), true);

        $result = Mission::createMission($pdo, [
            'title' => $mission_data['missionTitle'],
            'codeName' => $mission_data['missionCodeName'],
            'statut' => $mission_data['missionStatus'],
            'description' => $mission_data['missionDetail'],
            'country' => $mission_data['missionCountry'],
            'type' => $mission_data['missionType'],
            'specialization' => $mission_data['missionSpecialization'],
            'startDate' => $mission_data['missionStartDate'],
            'endDate' => $mission_data['missionEndDate']
        ], $mission_data['missionAgent'], $mission_data['missionContact'], $mission_data['missionTarget'], $mission_data['missionHideout']);

        // Send data 
        header('Content-Type: application/json');
        echo json_encode($result);

    } else {
        throw new Exception('Invalid request method');
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}