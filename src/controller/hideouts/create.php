<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; 
require_once __DIR__ . '/../../model/Hideout.php';

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

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $hideout_data = json_decode(file_get_contents('php://input'), true);

        // Create new hideout
        $result = Hideout::createHideout($pdo, [
            'codeName' => $hideout_data['hideoutCodeName'],
            'country' => $hideout_data['hideoutCountry'],
            'address' => $hideout_data['hideoutAddress'],
            'city' => $hideout_data['hideoutCity'],
            'type' => $hideout_data['hideoutType']
        ]);

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