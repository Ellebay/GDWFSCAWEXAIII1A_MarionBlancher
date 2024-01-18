<?php
class Agent
{
    private $id;
    private $firstName;
    private $lastName;
    private $birthDate;
    private $codeName;
    private $nationality;

    // Constructor
    public function __construct($id, $firstName, $lastName, $birthDate, $codeName, $nationality)
    {
        $this->id = $id;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->birthDate = $birthDate;
        $this->codeName = $codeName;
        $this->nationality = $nationality;
    }

    /* ------------------------------------------ Method Create Agent ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createAgent($pdo, $agentData, $specialtyId)
    {
        try {
            // Start Transaction
            $pdo->beginTransaction();

            // Create new Agent
            $query = "INSERT INTO agent (agent_first_name, agent_last_name, agent_birth_date, agent_code_name, agent_nationality) VALUES (?, ?, ?, ?, ?)";
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                $agentData['firstName'],
                $agentData['lastName'],
                $agentData['birthDate'],
                $agentData['codeName'],
                $agentData['nationality']
            ]);
            $agentId = $pdo->lastInsertId();

            // Add Specialty
            $agentSpecialtyStmt = $pdo->prepare("INSERT INTO agent_specialty (agent_specialty_id_fk, specialty_agent_id_fk) VALUES (?, ?)");
            $agentSpecialtyStmt->execute([$agentId, $specialtyId]);

            // Validate transaction
            $pdo->commit();

            return $agentId;

        } catch (PDOException $e) {
            // Cancel transaction if error
            $pdo->rollBack();
            throw $e;
        }
    }

    /* ------------------------------------------ Method Get All Agents ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllAgents($pdo)
    {
        try {
            $query = "SELECT * FROM agent";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Agent ------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAgent($pdo, $agentId)
    {
        try {
            $query = "SELECT * FROM agent WHERE id_agent = :agentId";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':agentId', $agentId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
    /* ------------------------------------ Method Get Agents By Specilaty ------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAgentsBySpecialty($pdo, $specialtyId)
    {
        try {
            $query = "SELECT agent.id_agent, agent.agent_first_name, agent.agent_last_name, agent.agent_code_name, agent.agent_nationality
                    FROM agent
                    JOIN agent_specialty ON agent.id_agent = agent_specialty.agent_specialty_id_fk
                    WHERE agent_specialty.specialty_agent_id_fk = :specialtyId";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':specialtyId', $specialtyId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                return ['message' => 'Aucun agent trouvé.'];
            }
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* ------------------------------------------ Method Modify Agent ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifyAgent($pdo, $agentData, $agentId, $specialtyId)
    {
        try {
            $query = "UPDATE agent SET 
                agent_last_name = :lastName,
                agent_first_name = :firstName,
                agent_birth_date = :birthDate,
                agent_nationality = :nationality,
                agent_code_name = :codeName
            WHERE id_agent = :agentId";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':lastName', $agentData['lastName'], PDO::PARAM_STR);
            $stmt->bindParam(':firstName', $agentData['firstName'], PDO::PARAM_STR);
            $stmt->bindParam(':birthDate', $agentData['birthDate'], PDO::PARAM_STR);
            $stmt->bindParam(':nationality', $agentData['nationality'], PDO::PARAM_STR);
            $stmt->bindParam(':codeName', $agentData['codeName'], PDO::PARAM_STR);
            $stmt->bindParam(':agentId', $agentId, PDO::PARAM_INT);
            $stmt->execute();

            // Modify specialty
            $agentSpecialtyStmt = $pdo->prepare("UPDATE agent_specialty SET 
            specialty_agent_id_fk = :specialtyId
            WHERE agent_specialty_id_fk = :agentId");

            $agentSpecialtyStmt->bindParam(':specialtyId', $specialtyId);
            $agentSpecialtyStmt->bindParam(':agentId', $agentId, PDO::PARAM_INT);
            $agentSpecialtyStmt->execute();

            if ($stmt->rowCount() || $agentSpecialtyStmt() > 0) {
                return ['message' => 'Modification de l‘agent réussie.'];
            } else {
                return ['message' => 'Aucun agent modifié.'];
            }
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }


    /* ------------------------------------------ Method Delete Agent ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteAgent($pdo, $agentId)
    {
        try {
            $query = "DELETE FROM agent WHERE id_agent = :agentId";

            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':agentId', $agentId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return ['message' => 'Suppression de l‘agent réussie.'];
            } else {
                return ['message' => 'Aucun agent supprimé.'];
            }
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }
}
