<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Specialty.php';

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

  // Check if a specialty ID is provided in the query string
  if (isset($_GET['id_specialty'])) {
    $specialtyId = $_GET['id_specialty'];
    // Get a single specialty
    $specialties = Specialty::getSpecialty($pdo, $specialtyId);
  } else {
    // Get all specialties
    $specialties = Specialty::getAllSpecialties($pdo);
  }

  // Encode and echo the specialties (either all or filtered by nationality)
  echo json_encode($specialties);

} catch (PDOException $e) {
  // Handle database connection error
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}