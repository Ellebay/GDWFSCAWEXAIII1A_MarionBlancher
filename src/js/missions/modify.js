document.addEventListener('DOMContentLoaded', function () {
    const missionDropdown = document.getElementById('mission-dropdown');
    const hideoutDropdown = document.getElementById('missionHideout');
    const contactDropdown = document.getElementById('missionContact');
    const countryDropdown = document.getElementById('missionCountry');
    const targetDropdown = document.getElementById('missionTarget');
    const agentDropdown = document.getElementById('missionAgent');
    const specialtyDropdown = document.getElementById('missionSpecialization');
    const modifyMissionForm = document.getElementById('modifyMission-form');
    const missionBackButton = document.getElementById('missionBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    let selectedContactIDs = [];
    let selectedAgentIDs = [];
    let selectedTargetIDs = [];
    let selectedSpecialtyID = [];

    /* ------------------------------------------------ Missions Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/missions/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la mission';
            missionDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(mission => {
                const option = document.createElement('option');
                option.value = mission.id_mission;
                option.textContent = `${mission.mission_title} - ${mission.mission_code_name}`;
                missionDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching mission data:', error);
        });

    // Event listener for mission selection
    missionDropdown.addEventListener('change', function () {
        const selectedMissionId = missionDropdown.value;
        if (selectedMissionId) {
            fetch(`../api/missions/read.php?id_mission=${selectedMissionId}`)
                .then(response => response.json())
                .then(data => {
                    // Populate the form with mission details
                    document.getElementById('missionTitle').value = data.mission_title;
                    document.getElementById('missionCodeName').value = data.mission_code_name;
                    document.getElementById('missionStatus').value = data.mission_statut;
                    document.getElementById('missionDetail').value = data.mission_description;
                    document.getElementById('missionCountry').value = data.mission_country;
                    document.getElementById('missionStartDate').value = data.mission_start_date;
                    document.getElementById('missionEndDate').value = data.mission_end_date;
                    document.getElementById('missionType').value = data.mission_type;
                    document.getElementById('missionSpecialization').value = data.specialty_code_name;
                    document.getElementById('missionHideout').value = data.hideout_code_name;
                    document.getElementById('missionAgent').value = data.agent_first_name + data.agent_last_name;
                    document.getElementById('missionContact').value = data.contact_first_name + data.contact_last_name;
                    document.getElementById('missionTarget').value = data.target_first_name + data.target_last_name;
                    document.getElementById('missionType').value = data.mission_type;

                    /* ------------------------------------------------ Specialty & Agents ------------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    specialtyDropdown.textContent = data.id_specialty;
                    selectedSpecialtyID = data.id_specialty;
                    console.log('special ID: ', selectedSpecialtyID);
                    /* fetchAndPopulateSpecialties(); */
                        fetch('../api/specialties/read.php')
                            .then(response => response.json())
                            .then(specialtyData => {
                                // Clear existing options in the dropdown
                                specialtyDropdown.innerHTML = '';
                
                                // Loop through the specialty data and populate the dropdown
                                specialtyData.forEach(specialty => {
                                    const option = document.createElement('option');
                                    option.value = specialty.id_specialty;
                                    option.textContent = specialty.specialty_type + ' (' + specialty.specialty_code_name + ')';
                
                                    // Check if the agent code name is in the array from the mission data
                                    if (data.id_specialty && data.id_specialty.includes(specialty.id_specialty)) {
                                        option.selected = true; // Set the selected attribute
                                    }
                                    specialtyDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching specialty details:', error);
                            });

                    if (selectedSpecialtyID) {
                        // Fetch agents based on the selected specialty
                        fetchAndPopulateAgents(selectedSpecialtyID, data)
                        selectedAgentIDs = data.id_agent;
                        /* console.log('agent ID:', selectedAgentIDs); */
                    }

                        /* -------------------------------------- Listen the Speciality changes ------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    specialtyDropdown.addEventListener('change', () => {
        selectElement = document.querySelector('#missionSpecialization');
        selectedSpecialtyID = selectElement.value;
        console.log('specialty ID: ', selectedSpecialtyID);
        if (selectedSpecialtyID) {
            // Fetch agents based on the selected specialty
            fetchAndPopulateAgents(selectedSpecialtyID, data)
        }
    });
                    /* ------------------------------------------------ Country -------------------------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    // Charger le fichier countries.json pour obtenir la nationalité
                    countryDropdown.textContent = data.mission_country;
                    const missionCountry = data.mission_country;
                    /* console.log('mission country: ', missionCountry) */
                    fetch('../api/countries.json')
                        .then(response => response.json())
                        .then(countriesData => {
                            let missionNationality = countriesData.find(country => country.en_short_name === missionCountry)?.nationality;
                            /* console.log('nationality: ', missionNationality); */
                            // Loop through the data and populate the dropdown
                            countriesData.forEach(country => {
                                const option = document.createElement('option');
                                option.value = country.en_short_name; // Use the country code as the value
                                option.textContent = country.en_short_name; // Display the country name
                                if (data.mission_country && data.mission_country.includes(country.en_short_name)) {
                                    option.selected = true; // Set the selected attribute
                                }
                                countryDropdown.appendChild(option);
                            });

                            let selectedCountry = missionCountry;
                            /* console.log('selected country: ', selectedCountry); */

                            /* ------------------------------------------------ Hideout Update ----------------------------------------- */
                            /* --------------------------------------------------------------------------------------------------------- */
                            fetchAndPopulateHideouts(selectedCountry, data);

                            /* ------------------------------------------------ Contact Update ----------------------------------------- */
                            /* --------------------------------------------------------------------------------------------------------- */
                            selectedContactIDs = data.id_contact;
                            fetchAndPopulateContacts(missionNationality, data);

                            countryDropdown.addEventListener('change', () => {
                                selectElement = document.querySelector('#missionCountry');
                                selectedCountry = selectElement.value;
                                missionNationality = countriesData.find(country => country.en_short_name === selectedCountry)?.nationality;

                                /* ------------------------------------------------ Hideout Update ----------------------------------------- */
                                /* --------------------------------------------------------------------------------------------------------- */
                                fetchAndPopulateHideouts(selectedCountry, data);

                                /* ----------------------------------------------- Countact Update ----------------------------------------- */
                                /* --------------------------------------------------------------------------------------------------------- */
                                fetchAndPopulateContacts(missionNationality, data);
                                /* console.log('nationality country: ', missionNationality); */
                            })

                            /* ------------------------------------------------ Target -------------------------------------------------- */
                            /* --------------------------------------------------------------------------------------------------------- */
                            selectedAgentIDs = data.id_agent;
                            selectedTargetIDs = data.id_target;
                            /* console.log('target Id: ', selectedTargetIDs); */
                            fetchAndPopulateTargets(selectedAgentIDs, data);

                            agentDropdown.addEventListener('change', () => {
                                selectElement = document.querySelector('#missionAgent');
                                selectedAgentIDs = selectElement.value;
                                /* console.log('agent Id: ', selectedAgentIDs); */

                                fetchAndPopulateTargets(selectedAgentIDs, data);
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching target details:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching countries:', error);
                });
        };
    });


    /* ----------------------------------------- Listen the Contact changes ------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    let selectContactElement = document.getElementById('missionContact');
    selectContactElement.addEventListener('change', () => {
        const selectedOptions = selectContactElement.selectedOptions;
        // Clear the array before updating it
        selectedContactIDs = [];
        // Iterate through the selected options
        for (const option of selectedOptions) {
            const contactID = option.value;
            selectedContactIDs.push(contactID);
        }
        selectedContactIDs = selectedContactIDs.join(', ');
    });
    /* ----------------------------------------- Listen the Target changes ------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    let selectTargetElement = document.getElementById('missionTarget');
    selectTargetElement.addEventListener('change', () => {
        const selectedOptions = selectTargetElement.selectedOptions;
        // Clear the array before updating it
        selectedTargetIDs = [];
        // Iterate through the selected options
        for (const option of selectedOptions) {
            const targetID = option.value;
            selectedTargetIDs.push(targetID);
        }
        selectedTargetIDs = selectedTargetIDs.join(', ');
    });
    /* ------------------------------------------ Listen the Agent changes ------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    let selectAgentElement = document.getElementById('missionAgent');
    selectAgentElement.addEventListener('change', () => {
        const selectedOptions = selectAgentElement.selectedOptions;
        // Clear the array before updating it
        selectedAgentIDs = [];
        // Iterate through the selected options
        for (const option of selectedOptions) {
            const agentID = option.value;
            selectedAgentIDs.push(agentID);
            /* console.log('select Agent', selectedAgentIDs); */
        }
        selectedAgentIDs = selectedAgentIDs.join(', ');
    });

    /* ------------------------------------------------ Modify Button ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Event listener for form submission
    modifyMissionForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedMissionId = missionDropdown.value;
        const selectedHideoutId = hideoutDropdown.value;
        const selectedContactsFinal = selectedContactIDs;
        const selectedAgentFinal = selectedAgentIDs;
        const selectedTargetFinal = selectedTargetIDs;
        const selectedSpecialtyFinal = selectedSpecialtyID;
        console.log('special ID final: ', selectedSpecialtyFinal);
        if (selectedMissionId) {
            fetch('../api/missions/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_mission: selectedMissionId,
                    id_hideout: selectedHideoutId,
                    id_agent: selectedAgentFinal,
                    id_contact: selectedContactsFinal,
                    id_target: selectedTargetFinal,
                    id_specialty: selectedSpecialtyFinal,
                    mission_title: document.getElementById('missionTitle').value,
                    mission_code_name: document.getElementById('missionCodeName').value,
                    mission_statut: document.getElementById('missionStatus').value,
                    mission_description: document.getElementById('missionDetail').value,
                    mission_country: document.getElementById('missionCountry').value,
                    mission_start_date: document.getElementById('missionStartDate').value,
                    mission_end_date: document.getElementById('missionEndDate').value,
                    mission_type: document.getElementById('missionType').value,
/*                     specialty_code_name: document.getElementById('missionSpecialization').value,
                    hideout_code_name: document.getElementById('missionHideout').value,
                    agent_code_name: document.getElementById('missionAgent').value,
                    contact_code_name: document.getElementById('missionContact').value,
                    target_code_name: document.getElementById('missionTarget').value, */
                }),
            })

                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';
                    resetForm()

                    // Check if the deletion was successful
                    if (data.message === 'Modification de la mission réussie.') {
                        // Fetch updated agent data after modification
                        fetch('../api/missions/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                missionDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner la Mission';
                                missionDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(mission => {
                                    const option = document.createElement('option');
                                    option.value = mission.id_mission;
                                    option.textContent = `${mission.mission_title} - ${mission.mission_code_name}`;
                                    missionDropdown.appendChild(option);
                                })
                            })
                            .catch(error => {
                                console.error('Error fetching updated agent data:', error);
                            })
                    }
                })
                .catch(error => {
                    console.error('Error modifying agent:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucune mission sélectionnée.';
            modal.style.display = 'block';
        }
    });

    /* ---------------------------------------------- Modal ---------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    // Event listener for closing the modal
    closeModalButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    missionBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        window.location.href = './index.php';
    }

    /* ------------------------------------------------ Hideout Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateHideouts(country, data) {
        fetch(`../api/hideouts/read.php?country=${country}`)
            .then(response => response.json())
            .then(hideoutData => {
                // Clear existing options in the dropdown
                hideoutDropdown.innerHTML = '';

                // Loop through the hideout data and populate the dropdown
                hideoutData.forEach(hideout => {
                    const option = document.createElement('option');
                    option.value = hideout.id_hideout;
                    option.textContent = hideout.hideout_type + ' (' + hideout.hideout_code_name + ')';

                    // Check if the hideout code name is in the array from the mission data
                    if (data.id_hideout && data.id_hideout.includes(hideout.id_hideout)) {
                        option.selected = true; // Set the selected attribute
                    }

                    hideoutDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching hideout details:', error);
            });
    }

    /* ------------------------------------------------ Agent Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateAgents(SpecialtyId, data) {
        fetch(`../api/agents/read.php?specialtyId=${SpecialtyId}`)
            .then(response => response.json())
            .then(agentData => {
                // Clear existing options in the agent dropdown
                agentDropdown.innerHTML = '';

                // Loop through the agent data and populate the dropdown
                agentData.forEach(agent => {
                    const option = document.createElement('option');
                    option.value = agent.id_agent;
                    option.textContent = agent.agent_first_name + ' ' + agent.agent_last_name + ' (' + agent.agent_code_name + ')';

                    // Check if the agent ID is in the array from the mission data
                    if (data.id_agent && data.id_agent.includes(agent.id_agent)) {
                        option.selected = true; // Set the selected attribute
                    }
                    agentDropdown.appendChild(option);

                });
            })
            .catch(error => {
                console.error('Error fetching agent details:', error);
            });
    }
    /* ------------------------------------------------ Contact Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateContacts(nationality, data) {
        fetch(`../api/contacts/read.php?nationality=${nationality}`)
            .then(response => response.json())
            .then(contactData => {
                // Clear existing options in the dropdown
                contactDropdown.innerHTML = '';
                // Loop through the contact data and populate the dropdown
                contactData.forEach(contact => {
                    const option = document.createElement('option');
                    option.value = contact.id_contact;
                    option.textContent = contact.contact_first_name + ' ' + contact.contact_last_name + ' (' + contact.contact_code_name + ')';
                    // Check if the agent code name is in the array from the mission data
                    if (data.id_contact && data.id_contact.includes(contact.id_contact)) {
                        option.selected = true; // Set the selected attribute
                    }
                    contactDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching contact details:', error);
            });
    }

    /* ------------------------------------------------- Target Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateTargets(selectedAgentId, data) {
        fetch(`../api/agents/read.php?id_agent=${selectedAgentId}`)
            .then(response => response.json())
            .then(agentData => {
                if (agentData.length > 0) {
                    const agent = agentData[0];
                const nationality = agent.agent_nationality;
                /* console.log('agent nationality: ', agent.agent_nationality); */

                fetch(`../api/targets/read.php?nationality=${nationality}`)
                    .then(response => response.json())
                    .then(targetData => {
                        // Clear existing options in the dropdown
                        targetDropdown.innerHTML = '';
                        // Loop through the target data and populate the dropdown
                        targetData.forEach(target => {
                            const option = document.createElement('option');
                            option.value = target.id_target;
                            option.textContent = target.target_first_name + ' ' + target.target_last_name + ' (' + target.target_code_name + ')';
                            // Check if the agent code name is in the array from the mission data
                            if (data.id_target && data.id_target.includes(target.id_target)) {
                                option.selected = true; // Set the selected attribute
                            }
                            targetDropdown.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching target details:', error);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching agent details:', error);
            });
    }

    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        modifyMissionForm.reset();
        document.getElementById('missionCountry').selectedIndex = 0;
        document.getElementById('missionSpecialization').selectedIndex = 0;
    }
});

