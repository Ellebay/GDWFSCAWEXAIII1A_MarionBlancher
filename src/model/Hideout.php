<?php
class Hideout
{
    private $id;
    private $country;
    private $address;
    private $city;
    private $codeName;
    private $type;

    // Un constructeur pour initialiser les propriétés
    public function __construct($id, $country, $address, $city, $codeName, $type)
    {
        $this->id = $id;
        $this->country = $country;
        $this->address = $address;
        $this->city = $city;
        $this->codeName = $codeName;
        $this->type = $type;
    }

    /* ----------------------------------------- Method Create Hideout ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createHideout($pdo, $hideoutData)
    {
        // Insérer l'hideout
        $query = "INSERT INTO hideout (hideout_code_name, hideout_country, hideout_address, hideout_city, hideout_type) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            $hideoutData['codeName'],
            $hideoutData['country'],
            $hideoutData['address'],
            $hideoutData['city'],
            $hideoutData['type']
        ]);
        if ($stmt->rowCount() || $stmt() > 0) {
            return ['message' => 'Création de la planque réussie.'];
        } else {
            return ['message' => 'Aucune planque créé.'];
        }
    }

    /* ----------------------------------------- Method Get All Hideouts --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllHideouts($pdo)
    {
        try {
            $query = "SELECT * FROM hideout";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Hideout ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getHideout($pdo, $hideoutId)
    {
        try {
            $query = "SELECT * FROM hideout WHERE id_hideout = :hideoutId";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':hideoutId', $hideoutId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* ---------------------------------- Method Get Hideouts By Country --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getHideoutsByCountry($pdo, $country)
    {
        try {
            $query = "SELECT * FROM hideout WHERE hideout_country = :country";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':country', $country, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
    
    /* ---------------------------------------- Method Modify Hideouts ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifyHideout($pdo, $hideoutData, $hideoutId)
    {
        // Modifier l'hideout
        $query = "UPDATE hideout SET 
                hideout_country = :country,
                hideout_address = :address,
                hideout_city = :city,
                hideout_type = :type,
                hideout_code_name = :codeName
            WHERE id_hideout = :hideoutId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':country', $hideoutData['country'], PDO::PARAM_STR);
        $stmt->bindParam(':address', $hideoutData['address'], PDO::PARAM_STR);
        $stmt->bindParam(':city', $hideoutData['city'], PDO::PARAM_STR);
        $stmt->bindParam(':type', $hideoutData['type'], PDO::PARAM_STR);
        $stmt->bindParam(':codeName', $hideoutData['codeName'], PDO::PARAM_STR);
        $stmt->bindParam(':hideoutId', $hideoutId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Modification de la planque réussie.'];
        } else {
            return ['message' => 'Aucune planque modifié.'];
        }
    }

    /* ---------------------------------------- Method Delete Hideouts ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteHideout($pdo, $hideoutId)
    {
        $query = "DELETE FROM hideout WHERE id_hideout = :hideoutId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':hideoutId', $hideoutId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Suppression de la planque réussie.'];
        } else {
            return ['message' => 'Aucune planque supprimé.'];
        }
    }
}
