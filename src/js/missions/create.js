document.addEventListener('DOMContentLoaded', function () {
    const createMissionForm = document.getElementById('createMissionForm');
    const countryDropdown = document.getElementById('missionCountry');
    const hideoutDropdown = document.getElementById('missionHideout');
    const specialtyDropdown = document.getElementById('missionSpecialization');
    const agentDropdown = document.getElementById('missionAgent');
    const contactDropdown = document.getElementById('missionContact');
    const targetDropdown = document.getElementById('missionTarget');
    const missionBackButton = document.getElementById('missionBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    let selectedContactIDs = [];
    let selectedAgentIDs = [];
    let selectedTargetIDs = [];

    /* ------------------------------------------------ Specialty & Agents ------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../controller/specialties/read.php')
        .then(response => response.json())
        .then(specialtyData => {
            // Loop through the specialty data and populate the dropdown
            specialtyData.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id_specialty;
                option.textContent = specialty.specialty_type + ' (' + specialty.specialty_code_name + ')';;
                specialtyDropdown.appendChild(option);
            });
            selectedSpecialtyId = specialtyDropdown.value;
            console.log('specialty ID: ', selectedSpecialtyId);

            if (selectedSpecialtyId) {
                // Fetch agents based on the selected specialty
                fetch(`../controller/agents/read.php?specialtyId=${selectedSpecialtyId}`)
                    .then(response => response.json())
                    .then(agentData => {
                        // Clear existing options in the agent dropdown
                        agentDropdown.innerHTML = '';
                        // Loop through the agent data and populate the dropdown
                        agentData.forEach(agent => {
                            const option = document.createElement('option');
                            option.value = agent.id_agent;
                            selectedAgentIDs.push(option.value);
                            option.textContent = agent.agent_first_name + ' ' + agent.agent_last_name + ' (' + agent.agent_code_name + ')';
                            agentDropdown.appendChild(option);
                        });
                        console.log('agent id function:', selectedAgentIDs);
                        /* ------------------------------------------------ Target -------------------------------------------------- */
                        /* --------------------------------------------------------------------------------------------------------- */
                        fetchAndPopulateTargets(selectedAgentIDs);

                        agentDropdown.addEventListener('change', () => {
                            selectElement = document.querySelector('#missionAgent');
                            selectedAgentIDs = selectElement.value;
                            console.log('agent Id: ', selectedAgentIDs);

                            fetchAndPopulateTargets(selectedAgentIDs);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching agent details:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching specialty details:', error);
        });

    specialtyDropdown.addEventListener('change', () => {
        selectElement = document.querySelector('#missionSpecialization');
        selectedSpecialtyId = selectElement.value;
        console.log('specialty ID: ', selectedSpecialtyId);
        if (selectedSpecialtyId) {
            // Fetch agents based on the selected specialty
            fetch(`../controller/agents/read.php?specialtyId=${selectedSpecialtyId}`)
                .then(response => response.json())
                .then(agentData => {
                    // Clear existing options in the agent dropdown
                    agentDropdown.innerHTML = '';
                    // Loop through the agent data and populate the dropdown
                    agentData.forEach(agent => {
                        const option = document.createElement('option');
                        option.value = agent.id_agent;
                        option.textContent = agent.agent_first_name + ' ' + agent.agent_last_name + ' (' + agent.agent_code_name + ')';
                        agentDropdown.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error fetching agent details:', error);
                });
        }
    });

    /* ------------------------------------------------ Country ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Charger le fichier countries.json pour obtenir la nationalité
    fetch('../controller/countries.json')
        .then(response => response.json())
        .then(countriesData => {
            // Loop through the data and populate the dropdown
            countriesData.forEach(country => {
                const option = document.createElement('option');
                option.value = country.en_short_name; // Use the country code as the value
                option.textContent = country.en_short_name; // Display the country name
                countryDropdown.appendChild(option);
            });

            let selectedCountry = countryDropdown.value;
            let missionNationality = countriesData.find(country => country.en_short_name === selectedCountry)?.nationality;
            console.log('nationality: ', missionNationality);
            console.log('selected country: ', selectedCountry);

            /* ------------------------------------------------ Hideout Update ----------------------------------------- */
            /* --------------------------------------------------------------------------------------------------------- */
            fetchAndPopulateHideouts(selectedCountry);

            fetchAndPopulateContacts(missionNationality);

            countryDropdown.addEventListener('change', () => {
                selectElement = document.querySelector('#missionCountry');
                selectedCountry = selectElement.value;
                missionNationality = countriesData.find(country => country.en_short_name === selectedCountry)?.nationality;

                console.log('selected country: ', missionNationality);
                /* ------------------------------------------------ Hideout Update ----------------------------------------- */
                /* --------------------------------------------------------------------------------------------------------- */
                fetchAndPopulateHideouts(selectedCountry);

                /* ------------------------------------------------ Contact Update ----------------------------------------- */
                /* --------------------------------------------------------------------------------------------------------- */
                fetchAndPopulateContacts(missionNationality);

            })

        })
        .catch(error => {
            console.error('Error fetching target details:', error);
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
        console.log('select Contact: ', selectedContactIDs);
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
        console.log('select target: ', selectedTargetIDs);
    });


    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createMissionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const missionTitle = document.getElementById('missionTitle').value;
        const missionCodeName = document.getElementById('missionCodeName').value;
        const missionStatus = document.getElementById('missionStatus').value;
        const missionDetail = document.getElementById('missionDetail').value;
        const missionCountry = document.getElementById('missionCountry').value;
        const missionHideout = document.getElementById('missionHideout').value;
        const missionType = document.getElementById('missionType').value;
        const missionSpecialization = document.getElementById('missionSpecialization').value;
        const missionAgent = document.getElementById('missionAgent').value;
        const missionContact = document.getElementById('missionContact').value;
        const missionTarget = document.getElementById('missionTarget').value;
        const missionStartDate = document.getElementById('missionStartDate').value;
        const missionEndDate = document.getElementById('missionEndDate').value;

        const formattedStartDate = missionStartDate.split('T')[0];
        const formattedEndDate = missionEndDate.split('T')[0];

        // Create an object with mission data
        const newMission = {
            missionTitle: missionTitle,
            missionCodeName: missionCodeName,
            missionStatus: missionStatus,
            missionDetail: missionDetail,
            missionCountry: missionCountry,
            missionStartDate: formattedStartDate,
            missionEndDate: formattedEndDate,
            missionHideout: missionHideout,
            missionType: missionType,
            missionSpecialization: missionSpecialization,
            missionAgent: missionAgent,
            missionContact: missionContact,
            missionTarget: missionTarget,
        };

        // Send data to the server

        fetch('../controller/missions/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMission),
        })
            .then(response => response.json())
            .then(data => {
                // Display the message in the modal window
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                console.error('Error creating the mission:', error);
                // Display the message in the modal window
                modalContent.textContent = 'No mission created.';
                modal.style.display = 'block';
            });
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
        // Redirect to the mission modify page or perform the necessary actions
        window.location.href = './index.php';
    }

    /* ------------------------------------------------ Hideout Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateHideouts(country) {
        fetch(`../controller/hideouts/read.php?country=${country}`)
            .then(response => response.json())
            .then(hideoutData => {
                // Clear existing options in the dropdown
                hideoutDropdown.innerHTML = '';

                // Loop through the hideout data and populate the dropdown
                hideoutData.forEach(hideout => {
                    const option = document.createElement('option');
                    option.value = hideout.id_hideout;
                    option.textContent = hideout.hideout_type + ' (' + hideout.hideout_code_name + ')';

                    hideoutDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching hideout details:', error);
            });
    }

    /* ------------------------------------------------ Contact Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateContacts(nationality) {
        fetch(`../controller/contacts/read.php?nationality=${nationality}`)
            .then(response => response.json())
            .then(contactData => {
                // Clear existing options in the dropdown
                contactDropdown.innerHTML = '';
                // Loop through the contact data and populate the dropdown
                contactData.forEach(contact => {
                    const option = document.createElement('option');
                    option.value = contact.id_contact;
                    option.textContent = contact.contact_first_name + ' ' + contact.contact_last_name + ' (' + contact.contact_code_name + ')';
                    contactDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching contact details:', error);
            });
    }

    /* ------------------------------------------------- Target Function --------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function fetchAndPopulateTargets(selectedAgentId) {
        fetch(`../controller/agents/read.php?id_agent=${selectedAgentId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const agent = data[0];
                const nationality = agent.agent_nationality;
                console.log('agent nationality: ', agent.agent_nationality);

                fetch(`../controller/targets/read.php?nationality=${nationality}`)
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
                            if (data.target_code_name && data.target_code_name.includes(target.target_code_name)) {
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
        createMissionForm.reset();
        document.getElementById('missionCountry').selectedIndex = 0;
    }
});

