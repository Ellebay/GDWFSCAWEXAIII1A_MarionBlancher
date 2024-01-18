<?php
class Mission
{
    private $id;
    private $title;
    private $codeName;
    private $description;
    private $country;
    private $type;
    private $statut;
    private $startDate;
    private $endDate;
    private $specialization;

    public function __construct($id, $title, $codeName, $description, $country, $type, $statut, $startDate, $endDate, $specialization)
    {
        $this->id = $id;
        $this->title = $title;
        $this->codeName = $codeName;
        $this->description = $description;
        $this->country = $country;
        $this->type = $type;
        $this->statut = $statut;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->specialization = $specialization;
    }

    /* ----------------------------------------- Method Create Mission ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function createMission($pdo, $missionData, $agentId, $contactId, $targetId, $hideoutId)
    {
        // Insérer l'mission
        $query = "INSERT INTO mission (mission_title, mission_code_name, mission_description, mission_country, mission_type, mission_statut, mission_start_date, mission_end_date, mission_specialty_id_fk) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            $missionData['title'],
            $missionData['codeName'],
            $missionData['description'],
            $missionData['country'],
            $missionData['type'],
            $missionData['statut'],
            $missionData['startDate'],
            $missionData['endDate'],
            $missionData['specialization']
        ]);

        $mission_id = $pdo->lastInsertId();

        $agentSmt = $pdo->prepare("INSERT INTO agent_mission (agent_id_fk, mission_agent_id_fk) VALUES (?, ?)");
        $agentSmt->execute([$agentId, $mission_id]);

        $contactSmt = $pdo->prepare("INSERT INTO contact_mission (contact_id_fk, mission_contact_id_fk) VALUES (?, ?)");
        $contactSmt->execute([$contactId, $mission_id]);

        $targetSmt = $pdo->prepare("INSERT INTO target_mission (target_id_fk, mission_target_id_fk) VALUES (?, ?)");
        $targetSmt->execute([$targetId, $mission_id]);

        $hideoutSmt = $pdo->prepare("INSERT INTO hideout_mission (hideout_id_fk, mission_hideout_id_fk) VALUES (?, ?)");
        $hideoutSmt->execute([$hideoutId, $mission_id]);

        if ($stmt->rowCount() || $agentSmt->rowCount() || $contactSmt->rowCount() || $targetSmt->rowCount() || $hideoutSmt->rowCount() > 0) {
            return ['message' => 'Création de la mission réussie.'];
        } else {
            return ['message' => 'Aucune mission créée.'];
        }
    }

    /* ----------------------------------------- Method Get All Missions --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getAllMissions($pdo)
    {
        try {
            $query = "SELECT * FROM mission";
            $stmt = $pdo->query($query);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Handle database connection error
            return ['error' => 'Database connection error: ' . $e->getMessage()];
        }
    }

    /* -------------------------------------------- Method Get Mission ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function getMission($pdo, $mission_id, $implodeDetails = true)
    {
        // Retrieve details for the specific mission from the mission table
        $missionQuery = "SELECT * FROM mission WHERE id_mission = :missionId";
        $missionStmt = $pdo->prepare($missionQuery);
        $missionStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $missionStmt->execute();

        // Retrieve details for the specific mission from the agent table
        $agentQuery = "SELECT agent.id_agent, agent.agent_code_name FROM agent_mission 
                     JOIN agent ON agent_mission.agent_id_fk = agent.id_agent
                     WHERE agent_mission.mission_agent_id_fk = :missionId";
        $agentStmt = $pdo->prepare($agentQuery);
        $agentStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $agentStmt->execute();

        // Retrieve details for the specific mission from the contact table
        $contactQuery = "SELECT contact.id_contact, contact.contact_code_name FROM contact_mission 
                       JOIN contact ON contact_mission.contact_id_fk = contact.id_contact
                       WHERE contact_mission.mission_contact_id_fk = :missionId";
        $contactStmt = $pdo->prepare($contactQuery);
        $contactStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $contactStmt->execute();

        // Retrieve details for the specific mission from the target table
        $targetQuery = "SELECT target.id_target, target.target_code_name FROM target_mission 
                      JOIN target ON target_mission.target_id_fk = target.id_target
                      WHERE target_mission.mission_target_id_fk = :missionId";
        $targetStmt = $pdo->prepare($targetQuery);
        $targetStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $targetStmt->execute();

        // Retrieve details for the specific mission from the hideout table
        $hideoutQuery = "SELECT hideout.id_hideout, hideout.hideout_code_name FROM hideout_mission 
                       JOIN hideout ON hideout_mission.hideout_id_fk = hideout.id_hideout
                       WHERE hideout_mission.mission_hideout_id_fk = :missionId";
        $hideoutStmt = $pdo->prepare($hideoutQuery);
        $hideoutStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $hideoutStmt->execute();

        // Retrieve details for the specific mission from the specialty table
        $specialtyQuery = "SELECT specialty.id_specialty, specialty.specialty_code_name 
                         FROM mission
                         JOIN specialty ON mission.mission_specialty_id_fk = specialty.id_specialty
                         WHERE mission.id_mission = :missionId";
        $specialtyStmt = $pdo->prepare($specialtyQuery);
        $specialtyStmt->bindParam(':missionId', $mission_id, PDO::PARAM_INT);
        $specialtyStmt->execute();

        if ($missionStmt->rowCount() > 0) {
            $missionDetails = $missionStmt->fetch(PDO::FETCH_ASSOC);

            // Append agent details to the mission details
            $agentDetails = $agentStmt->fetchAll(PDO::FETCH_ASSOC);
            $missionDetails['agent_code_names'] = $implodeDetails ? implode(', ', array_column($agentDetails, 'agent_code_name')) : array_column($agentDetails, 'agent_code_name');
            $missionDetails['id_agent'] = $implodeDetails ? implode(', ', array_column($agentDetails, 'id_agent')) : array_column($agentDetails, 'id_agent');

            // Append contact details to the mission details
            $contactDetails = $contactStmt->fetchAll(PDO::FETCH_ASSOC);
            $missionDetails['contact_code_names'] = $implodeDetails ? implode(', ', array_column($contactDetails, 'contact_code_name')) : array_column($contactDetails, 'contact_code_name');
            $missionDetails['id_contact'] = $implodeDetails ? implode(', ', array_column($contactDetails, 'id_contact')) : array_column($contactDetails, 'id_contact');

            // Append target details to the mission details
            $targetDetails = $targetStmt->fetchAll(PDO::FETCH_ASSOC);
            $missionDetails['target_code_names'] = $implodeDetails ? implode(', ', array_column($targetDetails, 'target_code_name')) : array_column($targetDetails, 'target_code_name');
            $missionDetails['id_target'] = $implodeDetails ? implode(', ', array_column($targetDetails, 'id_target')) : array_column($targetDetails, 'id_target');

            // Append hideout details to the mission details
            $hideoutDetails = $hideoutStmt->fetchAll(PDO::FETCH_ASSOC);
            $missionDetails['hideout_code_names'] = $implodeDetails ? implode(', ', array_column($hideoutDetails, 'hideout_code_name')) : array_column($hideoutDetails, 'hideout_code_name');
            $missionDetails['id_hideout'] = $implodeDetails ? implode(', ', array_column($hideoutDetails, 'id_hideout')) : array_column($hideoutDetails, 'id_hideout');

            // Append specialty details to the mission details
            $specialtyDetails = $specialtyStmt->fetchAll(PDO::FETCH_ASSOC);
            $missionDetails['specialty_code_names'] = $implodeDetails ? implode(', ', array_column($specialtyDetails, 'specialty_code_name')) : array_column($specialtyDetails, 'specialty_code_name');
            $missionDetails['id_specialty'] = $implodeDetails ? implode(', ', array_column($specialtyDetails, 'id_specialty')) : array_column($specialtyDetails, 'id_specialty');

            // Return mission details in JSON format
            return ($missionDetails);

        } else {
            // Mission not found
            return ['message' => 'Aucune mission trouvée.'];
        }
    }

    /* ---------------------------------------- Method Modify Missions ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function modifyMission($pdo, $missionData, $missionId, $agentIds, $contactIds, $targetIds, $hideoutId)
    {
        try {
            // Begin transaction
            $pdo->beginTransaction();

            // Update mission details
            $updateMissionQuery = "UPDATE mission SET 
                            mission_title = :title,
                            mission_code_name = :codeName,
                            mission_statut = :statut,
                            mission_description = :description,
                            mission_country = :country,
                            mission_start_date = :startDate,
                            mission_end_date = :endDate,
                            mission_type = :type,
                            mission_specialty_id_fk = :specialization
                            WHERE id_mission = :missionId";

            $updateMissionStmt = $pdo->prepare($updateMissionQuery);
            $updateMissionStmt->bindParam(':title',  $missionData['title']);
            $updateMissionStmt->bindParam(':codeName', $missionData['codeName']);
            $updateMissionStmt->bindParam(':statut', $missionData['statut']);
            $updateMissionStmt->bindParam(':description', $missionData['description']);
            $updateMissionStmt->bindParam(':country', $missionData['country']);
            $updateMissionStmt->bindParam(':startDate', $missionData['startDate']);
            $updateMissionStmt->bindParam(':endDate', $missionData['endDate']);
            $updateMissionStmt->bindParam(':type', $missionData['type']);
            $updateMissionStmt->bindParam(':specialization', $missionData['specialization']);
            $updateMissionStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);

            $updateMissionStmt->execute();
            /* ---------------------------------------------- Hideout -------------------------------------------------- */
            /* --------------------------------------------------------------------------------------------------------- */
            $updateHideoutQuery = "UPDATE hideout_mission SET 
            hideout_id_fk = :hideoutId
            WHERE mission_hideout_id_fk = :missionId";

            $updateHideoutStmt = $pdo->prepare($updateHideoutQuery);
            $updateHideoutStmt->bindParam(':hideoutId', $hideoutId);
            $updateHideoutStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
            $updateHideoutStmt->execute();

            /* ---------------------------------------------- Agent -------------------------------------------------- */
            /* --------------------------------------------------------------------------------------------------------- */
            $agentIdsArray = explode(", ", $agentIds);
            if (count($agentIdsArray) > 1) {
                // Delete existing records for the mission in the join table
                $deleteAgentQuery = "DELETE FROM agent_mission WHERE mission_agent_id_fk = :missionId";
                $deleteAgentStmt = $pdo->prepare($deleteAgentQuery);
                $deleteAgentStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $deleteAgentStmt->execute();

                // Insert new agent_mission records
                foreach ($agentIdsArray as $agentId) {
                    $insertAgentQuery = "INSERT INTO agent_mission (agent_id_fk, mission_agent_id_fk) VALUES (:agentId, :missionId)";
                    $updateAgentStmt = $pdo->prepare($insertAgentQuery);
                    $updateAgentStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                    $updateAgentStmt->bindParam(':agentId', $agentId);
                    $updateAgentStmt->execute();
                }
            } else {
                $updateAgentQuery = "UPDATE agent_mission SET 
            agent_id_fk = :agentId
            WHERE mission_agent_id_fk = :missionId";

                $updateAgentStmt = $pdo->prepare($updateAgentQuery);
                $updateAgentStmt->bindParam(':agentId', $agentIds);
                $updateAgentStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $updateAgentStmt->execute();
            }

            /* ---------------------------------------------- Contact -------------------------------------------------- */
            /* --------------------------------------------------------------------------------------------------------- */
            $contactIdsArray = explode(", ", $contactIds);
            if (count($contactIdsArray) > 1) {
                // Delete existing records for the mission in the join table
                $deleteContactQuery = "DELETE FROM contact_mission WHERE mission_contact_id_fk = :missionId";
                $deleteContactStmt = $pdo->prepare($deleteContactQuery);
                $deleteContactStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $deleteContactStmt->execute();

                // Insert new records for each contact ID
                foreach ($contactIdsArray as $contactId) {
                    $insertContactQuery = "INSERT INTO contact_mission (mission_contact_id_fk, contact_id_fk) VALUES (:missionId, :contactId)";
                    $updateContactStmt = $pdo->prepare($insertContactQuery);
                    $updateContactStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                    $updateContactStmt->bindParam(':contactId', $contactId);
                    $updateContactStmt->execute();
                }
            } else {
                $updateContactQuery = "UPDATE contact_mission SET 
                contact_id_fk = :contactId
                WHERE mission_contact_id_fk = :missionId";

                $updateContactStmt = $pdo->prepare($updateContactQuery);
                $updateContactStmt->bindParam(':contactId', $contactIds);
                $updateContactStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $updateContactStmt->execute();
            }

            /* ---------------------------------------------- Target -------------------------------------------------- */
            /* --------------------------------------------------------------------------------------------------------- */
            $targetIdsArray = explode(", ", $targetIds);
            if (count($targetIdsArray) > 1) {
                // Delete existing records for the mission in the join table
                $deleteTargetQuery = "DELETE FROM target_mission WHERE mission_target_id_fk = :missionId";
                $deleteTargetStmt = $pdo->prepare($deleteTargetQuery);
                $deleteTargetStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $deleteTargetStmt->execute();

                // Insert new records for each target ID
                foreach ($targetIdsArray as $targetId) {
                    $insertTargetQuery = "INSERT INTO target_mission (mission_target_id_fk, target_id_fk) VALUES (:missionId, :targetId)";
                    $updateTargetStmt = $pdo->prepare($insertTargetQuery);
                    $updateTargetStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                    $updateTargetStmt->bindParam(':targetId', $targetId);
                    $updateTargetStmt->execute();
                }
            } else {
                $updateTargetQuery = "UPDATE target_mission SET 
            target_id_fk = :targetId
            WHERE mission_target_id_fk = :missionId";

                $updateTargetStmt = $pdo->prepare($updateTargetQuery);
                $updateTargetStmt->bindParam(':targetId', $targetIds);
                $updateTargetStmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
                $updateTargetStmt->execute();
            }

            // Commit transaction
            $pdo->commit();
            
            // Check if any data was modified
            if ($updateMissionStmt->rowCount() == 0 && $updateHideoutStmt->rowCount() == 0 && $updateTargetStmt->rowCount() == 0 && $updateContactStmt->rowCount() == 0 && $updateAgentStmt->rowCount() == 0) {
                return ['message' => 'Aucune mission modifiée.'];
            } else {
                return ['message' => 'Modification de la mission réussie.'];
            }
            

        } catch (PDOException $e) {
            // Rollback transaction in case of error
            $pdo->rollBack();
            return ['error' => 'Database error: ' . $e->getMessage()];
        }
    }


    /* ---------------------------------------- Method Delete Missions ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function deleteMission($pdo, $missionId)
    {
        $query = "DELETE FROM mission WHERE id_mission = :missionId";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':missionId', $missionId, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return ['message' => 'Suppression de la mission réussie.'];
        } else {
            return ['message' => 'Aucun mission supprimée.'];
        }
    }

    /* ---------------------------------------- Method Search Missions ----------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    public static function searchMissions($searchTerm, $pdo) {
        // Préparez et exécutez la requête de recherche
        $query = "SELECT * FROM mission WHERE mission_title LIKE :searchTerm";
        $stmt = $pdo->prepare($query);
        $stmt->bindValue(':searchTerm', '%' . $searchTerm . '%');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
