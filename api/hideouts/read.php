<?php
session_start();

require_once __DIR__ . '/../../vendor/autoload.php'; 
require_once __DIR__ . '/../../public/model/Hideout.php';

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

  // Check if a hideout ID is provided in the query string
  if (isset($_GET['id_hideout'])) {
    $hideoutId = $_GET['id_hideout'];
    // Get a single hideout
    $hideouts = Hideout::getHideout($pdo, $hideoutId);
  }
  // Check if a nationality is provided in the query string
  else if (isset($_GET['country'])) {
    $country = $_GET['country'];
    // Get hideouts filtered by nationality
    $hideouts = Hideout::getHideoutsByCountry($pdo, $country);

  } else {
    // Get all hideouts
    $hideouts = Hideout::getAllHideouts($pdo);
  }

  // Encode and echo the hideouts (either all or filtered by nationality)
  echo json_encode($hideouts);

} catch (PDOException $e) {
  // Handle database connection error
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}