<?php
session_start();

require_once __DIR__ . '/../../../vendor/autoload.php'; // Path to autoload.php
require_once '../../model/Hideout.php';

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

    // Check if the request method is UPDATE
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $hideout_data = json_decode(file_get_contents('php://input'), true);
        // Check if the hideout ID is provided
        if (isset($hideout_data['id_hideout'])) {
            $hideoutId = $hideout_data['id_hideout'];
            $result = Hideout::modifyHideout($pdo, [
                'country' => $hideout_data['hideout_country'],
                'address' => $hideout_data['hideout_address'],
                'city' => $hideout_data['hideout_city'],
                'codeName' => $hideout_data['hideout_code_name'],
                'type' => $hideout_data['hideout_type']
            ], $hideoutId);

            // Renvoie la réponse au format JSON
            header('Content-Type: application/json');
            echo json_encode($result);

        } else {
            // No hideout ID provided
            header('Content-Type: application/json');
            echo json_encode(['message' => 'No hideout ID provided']);
            exit;
        }
    } else {
        // Invalid request method
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Invalid request method']);
        exit;
    }

} catch (PDOException $e) {
    // Handle database connection error
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
    exit;
}
