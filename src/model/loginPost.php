<?php
session_start(); 
$dsn = 'mysql:host=localhost;dbname=kgb_bdd';
$username = 'admin_kgb_bdd';
$password = '$2y$10$Nxj0Dpon5jaeIxYToqaGIOr2UQlCQGADmuc0p24CIe2ulYNESQvP.';

try{
  $pdo = new PDO($dsn, $username, $password);
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
        header("Location: ../index.php"); 

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
