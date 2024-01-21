<?php
session_start();

require_once __DIR__ . '/../../vendor/autoload.php'; 
require_once __DIR__ . '/../../public/model/Agent.php';

if (file_exists(__DIR__ . '/../../' . '/.env')) {
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
  $dotenv->load();
}

$dsn = "mysql:host={$_ENV["DB_HOST"]};dbname={$_ENV["DB_NAME"]}";
/*   $options = array(
    PDO::MYSQL_ATTR_SSL_CA => "/etc/ssl/certs/ca-certificates.crt",
  ); */

try {
  // Connect to the database
  $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"]);
  /* $pdo = new PDO($dsn, $_ENV["DB_USERNAME"], $_ENV["DB_PASSWORD"], $options); */
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // Check if a agent ID is provided in the query string
  if (isset($_GET['id_agent'])) {
    $agentId = $_GET['id_agent'];
    // Get a single agent
    $agents = Agent::getAgent($pdo, $agentId);
  }
  // Check if a speciality is provided in the query string
  else if (isset($_GET['specialtyId'])) {
    $specialtyId = $_GET['specialtyId'];
    $agents = Agent::getAgentsBySpecialty($pdo, $specialtyId);
  } else {
    $agents = Agent::getAllAgents($pdo);
  }

  header('Content-Type: application/json');
  echo json_encode($agents);

} catch (PDOException $e) {
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
  exit;
}