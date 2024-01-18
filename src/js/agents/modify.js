document.addEventListener('DOMContentLoaded', function () {
    const agentDropdown = document.getElementById('agent-dropdown');
    const agentBackButton = document.getElementById('agentBackButton');
    const modifyAgentForm = document.getElementById('modifyAgent-form');
    const agentModifyButton = document.getElementById('agentModifyButton');
    const nationalityDropdown = document.getElementById('agentNationality');
    const specialtyDropdown = document.getElementById('agentSpecialtyId');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Agents Dropdown ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/agents/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner l\'Agent';
            agentDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(agent => {
                const option = document.createElement('option');
                option.value = agent.id_agent;
                option.textContent = `${agent.agent_code_name} - ${agent.agent_first_name} ${agent.agent_last_name}`;
                agentDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching agent data:', error);
        });

    // Event listener for agent selection
    agentDropdown.addEventListener('change', function () {
        const selectedAgentId = agentDropdown.value;

        if (selectedAgentId) {
            fetch(`./controller/agents/read.php?id_agent=${selectedAgentId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const agent = data[0];
                    // Populate the form with agent details
                    document.getElementById('agentLastName').value = agent.agent_last_name;
                    document.getElementById('agentFirstName').value = agent.agent_first_name;
                    document.getElementById('agentBirthDate').value = agent.agent_birth_date;
                    document.getElementById('agentNationality').value = agent.agent_nationality;
                    document.getElementById('agentCodeName').value = agent.agent_code_name;
                    document.getElementById('agentSpecialtyId').value = agent.specialty_code_name;

                    /* ------------------------------------------------ Specialty ---------------------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    specialtyDropdown.textContent = agent.specialty_code_name;
                    fetchAndPopulateSpecialties(agent);
                    selectedSpecialtyId = agent.id_specialty;

                    specialtyDropdown.addEventListener('change', () => {
                        selectElement = document.querySelector('#agentSpecialtyId');
                        selectedSpecialtyId = selectElement.value;
                        console.log('specialty ID: ', selectedSpecialtyId);
                    });

                    /* ------------------------------------------------ Nationality--------------------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    // Fetch JSON data (replace 'countries.json' with the actual path to your JSON file)
                    nationalityDropdown.textContent = agent.agent_nationality;
                    fetch('./controller/countries.json')
                        .then(response => response.json())
                        .then(nationalityData => {
                            // Loop through the data and populate the dropdown
                            nationalityData.forEach(country => {
                                const option = document.createElement('option');
                                option.value = country.nationality; // Use the country code as the value
                                option.textContent = country.nationality; // Display the country name
                                if (agent.agent_nationality && agent.agent_nationality.includes(country.nationality)) {
                                    option.selected = true; // Set the selected attribute
                                }
                                nationalityDropdown.appendChild(option);
                            });
                        })
                    }
                })
                .catch(error => {
                    console.error('Error fetching agent details:', error);
                });
        };
    });
    /* ------------------------------------------------ Modify Button ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Event listener for form submission
    modifyAgentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedAgentId = agentDropdown.value;
        const selectedSpecialtyId = specialtyDropdown.value;

        if (selectedAgentId) {
            // Send the selected agent ID to the server for modification
            fetch('./controller/agents/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_agent: selectedAgentId,
                    id_specialty: selectedSpecialtyId,
                    agent_last_name: document.getElementById('agentLastName').value,
                    agent_first_name: document.getElementById('agentFirstName').value,
                    agent_birth_date: document.getElementById('agentBirthDate').value,
                    agent_nationality: document.getElementById('agentNationality').value,
                    agent_code_name: document.getElementById('agentCodeName').value,
                    specialty_code_name: document.getElementById('agentSpecialtyId').value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Modification de l‘agent réussie.') {
                        // Fetch updated agent data after modification
                        fetch('./controller/agents/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                agentDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Select your agent';
                                agentDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(agent => {
                                    const option = document.createElement('option');
                                    option.value = agent.id_agent;
                                    option.textContent = `${agent.agent_code_name} - ${agent.agent_first_name} ${agent.agent_last_name}`;
                                    agentDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated agent data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error modifying agent:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'No agent selected for modification.';
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
    agentBackButton.addEventListener('click', handleBackAgent);

    function handleBackAgent() {
        window.location.href = './agents.php';
    }

    /* ------------------------------------------------ Specialty Function -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateSpecialties(data) {
        fetch('./controller/specialties/read.php')
            .then(response => response.json())
            .then(specialtyData => {
                // Loop through the specialty data and populate the dropdown
                specialtyData.forEach(specialty => {
                    const option = document.createElement('option');
                    option.value = specialty.id_specialty;
                    option.textContent = specialty.specialty_type;

                    // Check if the agent code name is in the array from the mission data
                    if (data.specialty_type && data.specialty_type.includes(specialty.specialty_type)) {
                        option.selected = true; // Set the selected attribute
                    }
                    specialtyDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching specialty details:', error);
            });
    }
});
