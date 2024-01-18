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

  if (isset($_GET['searchTerm'])) {
    $searchTerm = $_GET['searchTerm'];
    $results = Mission::searchMissions($searchTerm, $pdo);
    echo json_encode($results);
    exit; // Important pour empêcher l'exécution ultérieure du script
} else {
    // Logique pour charger toutes les missions ou une vue par défaut
    // ...
}
  // Encode and echo the missions (either all or filtered by nationality)
  echo json_encode($missions);

} catch (PDOException $e) {
  // Handle database connection error
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}