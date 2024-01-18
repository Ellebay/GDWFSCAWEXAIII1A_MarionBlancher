<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; // Path to autoload.php
require_once '../../model/Contact.php';

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

  // Check if a contact ID is provided in the query string
  if (isset($_GET['id_contact'])) {
    $contactId = $_GET['id_contact'];
    // Get a single contact
    $contacts = Contact::getContact($pdo, $contactId);
  }
  // Check if a nationality is provided in the query string
  else if (isset($_GET['nationality'])) {
    $nationality = $_GET['nationality'];
    // Get contacts filtered by nationality
    $contacts = Contact::getContactsByNationality($pdo, $nationality);

  } else {
    // Get all contacts
    $contacts = Contact::getAllContacts($pdo);
  }

  // Encode and echo the contacts (either all or filtered by nationality)
  echo json_encode($contacts);

} catch (PDOException $e) {
  // Handle database connection error
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
}