<?php
class Target
{
    private $id;
    private $firstName;
    private $lastName;
    private $birthDate;
    private $codeName;
    private $nationality;

    // Un constructeur pour initialiser les propriétés
    public function __construct($id, $firstName, $lastName, $birthDate, $codeName, $nationality)
    {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->birthDate = $birthDate;
        $this->codeName = $codeName;
        $this->nationality = $nationality;
    }

    /* ----------------------------------------- Method Create Target ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createTarget($pdo, $targetData)
    {
        // Insérer l'target
        $query = "INSERT INTO target (target_first_name, target_last_name, target_birth_date, target_code_name, target_nationality) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            $targetData['firstName'],
            $targetData['lastName'],
            $targetData['birthDate'],
            $targetData['codeName'],
            $targetData['nationality']
        ]);
        if ($stmt->rowCount() || $stmt() > 0) {
            return ['message' => 'Création de la cible réussie.'];
        } else {
            return ['message' => 'Aucune cible créé.'];
        }
    }

    /* ----------------------------------------- Method Get All Targets --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllTargets($pdo)
    {
        try {
            $query = "SELECT * FROM target";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Target ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getTarget($pdo, $targetId)
    {
        try {
            $query = "SELECT * FROM target WHERE id_target = :targetId";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':targetId', $targetId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* ---------------------------------- Method Get Targets By Nationality ----------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getTargetsByNationality($pdo, $nationality)
    {
        try {
            $query = "SELECT * FROM target WHERE target_nationality != :nationality";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':nationality', $nationality, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
    
    /* ---------------------------------------- Method Modify Targets ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifyTarget($pdo, $targetData, $targetId)
    {
        // Modifier l'target
        $query = "UPDATE target SET 
                target_last_name = :lastName,
                target_first_name = :firstName,
                target_birth_date = :birthDate,
                target_nationality = :nationality,
                target_code_name = :codeName
            WHERE id_target = :targetId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':lastName', $targetData['lastName'], PDO::PARAM_STR);
        $stmt->bindParam(':firstName', $targetData['firstName'], PDO::PARAM_STR);
        $stmt->bindParam(':birthDate', $targetData['birthDate'], PDO::PARAM_STR);
        $stmt->bindParam(':nationality', $targetData['nationality'], PDO::PARAM_STR);
        $stmt->bindParam(':codeName', $targetData['codeName'], PDO::PARAM_STR);
        $stmt->bindParam(':targetId', $targetId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Modification de la cible réussie.'];
        } else {
            return ['message' => 'Aucune cible modifié.'];
        }
    }

    /* ---------------------------------------- Method Delete Targets ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteTarget($pdo, $targetId)
    {
        $query = "DELETE FROM target WHERE id_target = :targetId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':targetId', $targetId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Suppression de la cible réussie.'];
        } else {
            return ['message' => 'Aucune cible supprimé.'];
        }
    }
}
