<?php
class Specialty
{
    private $id;
    private $type;
    private $codeName;

    // Un constructeur pour initialiser les propriétés
    public function __construct($id, $type, $codeName)
    {
        $this->id = $id;
        $this->type = $type;
        $this->codeName = $codeName;
    }

    /* ----------------------------------------- Method Create Specialty ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createSpecialty($pdo, $specialtyData)
    {
        // Insérer l'specialty
        $query = "INSERT INTO specialty (specialty_type, specialty_code_name) VALUES (?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            $specialtyData['type'],
            $specialtyData['codeName']
        ]);
        if ($stmt->rowCount() || $stmt() > 0) {
            return ['message' => 'Création de la spécialité réussie.'];
        } else {
            return ['message' => 'Aucun spécialité créée.'];
        }
    }

    /* ----------------------------------------- Method Get All Specialtys --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllSpecialties($pdo)
    {
        try {
            $query = "SELECT * FROM specialty";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Specialty ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getSpecialty($pdo, $specialtyId)
    {
        try {
            $query = "SELECT * FROM specialty WHERE id_specialty = :specialtyId";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':specialtyId', $specialtyId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
    
    /* ---------------------------------------- Method Modify Specialtys ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifySpecialty($pdo, $specialtyData, $specialtyId)
    {
        // Modifier l'specialty
        $query = "UPDATE specialty SET 
                specialty_type = :type,
                specialty_code_name = :codeName
            WHERE id_specialty = :specialtyId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':type', $specialtyData['type'], PDO::PARAM_STR);
        $stmt->bindParam(':codeName', $specialtyData['codeName'], PDO::PARAM_STR);
        $stmt->bindParam(':specialtyId', $specialtyId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Modification de la spécialité réussie.'];
        } else {
            return ['message' => 'Aucun spécialité modifiée.'];
        }
    }

    /* ---------------------------------------- Method Delete Specialtys ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteSpecialty($pdo, $specialtyId)
    {
        $query = "DELETE FROM specialty WHERE id_specialty = :specialtyId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':specialtyId', $specialtyId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Suppression de la spécialité réussie.'];
        } else {
            return ['message' => 'Aucun spécialité supprimée.'];
        }
    }
}
