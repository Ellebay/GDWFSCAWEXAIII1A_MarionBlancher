<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Mission.php';

if (file_exists(__DIR__ . '/../../../' . '/.env')) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
  $dotenv->load();
}

$dsn = "mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]}";
  $options = array(
    PDO::MYSQL_ATTR_SSL_CA => "/etc/ssl/certs/ca-certificates.crt",
  );

try {
    // Connect to the database
    /* $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"]); */
    $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"], $options);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Check if a mission ID is provided in the query string
  if (isset($_GET['id_mission'])) {
    $mission_id = $_GET['id_mission'];
    $missions = Mission::getMission($pdo, $mission_id);
  } else if (isset($_GET['id_mission_detail'])) {
    $missionId = $_GET['id_mission_detail'];
    // Get a single mission
    $missions = Mission::getMission($pdo, $missionId, false);
  } else {
    // Get all missions
    $missions = Mission::getAllMissions($pdo);
  }

  // Encode and echo the missions (either all or filtered by nationality)
  echo json_encode($missions);

} catch (PDOException $e) {
  // Handle database connection error
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}