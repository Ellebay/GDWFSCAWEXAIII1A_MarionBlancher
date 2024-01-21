document.addEventListener('DOMContentLoaded', function () {
    const createAgentForm = document.getElementById('createAgentForm');
    const agentBackButton = document.getElementById('agentBackButton');
    const specialtyDropdown = document.getElementById('agentSpecialtyId');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/countries.json')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const selectElement = document.getElementById('agentNationality');

            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner le Pays';
            selectElement.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach((country, index) => {
                const option = document.createElement('option');
                option.value = country.nationality;
                option.textContent = country.nationality;
                option.setAttribute('data-index', index); // Set the index as a custom attribute
                selectElement.appendChild(option);
            });

            selectElement.addEventListener('change', function () {
                // Check if the selected value is not empty
                if (selectElement.value !== '') {
                    // Retrieve the index from the selected option's custom attribute
                    const selectedIndex = selectElement.options[selectElement.selectedIndex].getAttribute('data-index');
                }
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });

    /* ------------------------------------------------ Specialty ---------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/specialties/read.php')
        .then(response => response.json())
        .then(specialtyData => {
            // Loop through the specialty data and populate the dropdown
            specialtyData.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id_specialty;
                option.textContent = specialty.specialty_type;
                specialtyDropdown.appendChild(option);
            });
            agentSpecialtyId = specialtyDropdown.value;
        })
        .catch(error => {
            console.error('Error fetching specialty details:', error);
        });
    specialtyDropdown.addEventListener('change', () => {
        selectElement = document.querySelector('#agentSpecialtyId');
        agentSpecialtyId = selectElement.value;
    });

    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createAgentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const agentLastName = document.getElementById('agentLastName').value;
        const agentFirstName = document.getElementById('agentFirstName').value;
        const agentBirthDate = document.getElementById('agentBirthDate').value;
        const agentNationality = document.getElementById('agentNationality').value;
        const agentCodeName = document.getElementById('agentCodeName').value;
        const agentSpecialtyId = document.getElementById('agentSpecialtyId').value;

        const age = calculateAge(agentBirthDate);
    
        if (age < 18) {
            alert("L'agent doit avoir au moins 18 ans.");
            return;
        }
        const formattedBirthDate = agentBirthDate.split('T')[0];
        // Create an object with agent data
        const newAgent = {
            agentFirstName: agentFirstName,
            agentLastName: agentLastName,
            agentBirthDate: formattedBirthDate,
            agentNationality: agentNationality,
            agentCodeName: agentCodeName,
            agentSpecialtyId: agentSpecialtyId
        };

        // Send data to the server
        fetch('./controller/agents/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAgent),
        })
            .then(response => response.json())
            .then(data => {
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                modalContent.textContent = 'No agent created.';
                modal.style.display = 'block';
                console.error('Error creating the agent:', error);
            });
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    agentBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the agent modify page or perform the necessary actions
        window.location.href = './agents.php';
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

    /* ---------------------------------------------- Age Check ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    function calculateAge(dob) { // dob est une chaîne de date de naissance
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }


    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        createAgentForm.reset();
        document.getElementById('agentSpecialtyId').selectedIndex = 0;
        document.getElementById('agentNationality').selectedIndex = 0;
    }
    
});