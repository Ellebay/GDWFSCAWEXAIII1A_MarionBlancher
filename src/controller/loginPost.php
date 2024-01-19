<?php
session_start();

require_once __DIR__ . '/../../vendor/autoload.php'; // Path to autoload.php

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../'); // Adjusted path to project root
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

  //Récupérer les données du formulaire de connexion
  $emailForm = $_POST['email'];
  $passwordForm = $_POST['password'];

  //Récupérer les utilisateurs 
  $query = "SELECT * FROM admin WHERE admin_email = :email";
  $stmt = $pdo->prepare($query);
  $stmt->bindParam(':email', $emailForm);
  $stmt->execute();

    // Initialiser le message
    $message = '';
    // Est-ce que l’utilisateur (mail) existe ?
    if ($stmt->rowCount() == 1) {
      $monUser = $stmt->fetch(PDO::FETCH_ASSOC);
      if (password_verify($passwordForm, $monUser['admin_password'])) {
        // Connexion réussie       
        $_SESSION['adminLoggedIn'] = true;
        $_SESSION['adminFirstName'] = $monUser['admin_first_name'];
/*         $message = "Connexion réussie ! Bienvenue " . $monUser['admin_first_name'] . " " . $monUser['admin_last_name'] ;
 */
        header("Location: ../api/index.php"); 

      } else {
        // Mot de passe incorrect
        unset($_SESSION['adminLoggedIn']);
  /*       $message = "Mot de passe incorrect"; */

      }
    } else {
      // Utilisateur introuvable
      unset($_SESSION['adminLoggedIn']);
/*       $message = "Utilisateur introuvable, êtes-vous sûr de votre mail ?" ; */

    }
  } catch (PDOException $e) {
    $message = "Erreur de connexion à la base de données : " . $e->getMessage();
  }
  
  // Afficher le message dans la fenêtre modale
  echo $message;


  exit;
