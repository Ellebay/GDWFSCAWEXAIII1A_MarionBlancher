document.addEventListener('DOMContentLoaded', function () {
    const agentDropdown = document.getElementById('agent-dropdown');
    const agentBackButton = document.getElementById('agentBackButton');
    const agentDeleteButton = document.getElementById('agentDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Agents Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/agents/read.php')
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
        // Check if the selected value is not empty
        if (agentDropdown.value !== '') {
            console.log('Selected agent:', agentDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    agentBackButton.addEventListener('click', handleBackAgent);

    function handleBackAgent() {
        window.location.href = './agents.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    agentDeleteButton.addEventListener('click', handleDeleteAgent);

    function handleDeleteAgent() {
        const selectedAgentId = agentDropdown.value;

        if (selectedAgentId) {
            // Send the selected agent ID to the server for deletion
            fetch('../api/agents/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_agent=${selectedAgentId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression de l‘agent réussie.') {
                        // Fetch updated agent data after deletion
                        fetch('../api/agents/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                agentDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner l`Agent';
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
                    console.error('Error deleting agent:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucun Agent sélectionné.';
            modal.style.display = 'block';
        }
    }

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
});
