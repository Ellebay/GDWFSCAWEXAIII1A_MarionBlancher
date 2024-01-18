<?php
class Contact
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

    /* ----------------------------------------- Method Create Contact ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createContact($pdo, $contactData)
    {
        // Insérer l'contact
        $query = "INSERT INTO contact (contact_first_name, contact_last_name, contact_birth_date, contact_code_name, contact_nationality) VALUES (?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            $contactData['firstName'],
            $contactData['lastName'],
            $contactData['birthDate'],
            $contactData['codeName'],
            $contactData['nationality']
        ]);
        if ($stmt->rowCount() || $stmt() > 0) {
            return ['message' => 'Création du contact réussie.'];
        } else {
            return ['message' => 'Aucun contact créé.'];
        }
    }

    /* ----------------------------------------- Method Get All Contacts --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllContacts($pdo)
    {
        try {
            $query = "SELECT * FROM contact";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Contact ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getContact($pdo, $contactId)
    {
        try {
            $query = "SELECT * FROM contact WHERE id_contact = :contactId";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':contactId', $contactId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* ---------------------------------- Method Get Contacts By Nationality ----------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getContactsByNationality($pdo, $nationality)
    {
        try {
            $query = "SELECT * FROM contact WHERE contact_nationality = :nationality";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':nationality', $nationality, PDO::PARAM_STR);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
    
    /* ---------------------------------------- Method Modify Contacts ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifyContact($pdo, $contactData, $contactId)
    {
        // Modifier l'contact
        $query = "UPDATE contact SET 
                contact_last_name = :lastName,
                contact_first_name = :firstName,
                contact_birth_date = :birthDate,
                contact_nationality = :nationality,
                contact_code_name = :codeName
            WHERE id_contact = :contactId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':lastName', $contactData['lastName'], PDO::PARAM_STR);
        $stmt->bindParam(':firstName', $contactData['firstName'], PDO::PARAM_STR);
        $stmt->bindParam(':birthDate', $contactData['birthDate'], PDO::PARAM_STR);
        $stmt->bindParam(':nationality', $contactData['nationality'], PDO::PARAM_STR);
        $stmt->bindParam(':codeName', $contactData['codeName'], PDO::PARAM_STR);
        $stmt->bindParam(':contactId', $contactId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Modification du contact réussie.'];
        } else {
            return ['message' => 'Aucun contact modifié.'];
        }
    }

    /* ---------------------------------------- Method Delete Contacts ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteContact($pdo, $contactId)
    {
        $query = "DELETE FROM contact WHERE id_contact = :contactId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':contactId', $contactId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Suppression du contact réussie.'];
        } else {
            return ['message' => 'Aucun contact supprimé.'];
        }
    }
}
