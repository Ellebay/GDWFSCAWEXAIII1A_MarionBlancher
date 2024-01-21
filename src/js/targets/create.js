document.addEventListener('DOMContentLoaded', function () {
    const createTargetForm = document.getElementById('createTargetForm');
    const targetBackButton = document.getElementById('targetBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/countries.json')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const selectElement = document.getElementById('targetNationality');

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

    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createTargetForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const targetLastName = document.getElementById('targetLastName').value;
        const targetFirstName = document.getElementById('targetFirstName').value;
        const targetBirthDate = document.getElementById('targetBirthDate').value;
        const targetNationality = document.getElementById('targetNationality').value;
        const targetCodeName = document.getElementById('targetCodeName').value;

        const formattedBirthDate = targetBirthDate.split('T')[0];
        console.log('Formatted Birth Date:', formattedBirthDate);

        // Create an object with target data
        const newTarget = {
            targetFirstName: targetFirstName,  // Use correct key names
            targetLastName: targetLastName,
            targetBirthDate: formattedBirthDate,
            targetNationality: targetNationality,
            targetCodeName: targetCodeName
        };

        // Send data to the server
        fetch('../api/targets/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTarget),
        })
            .then(response => response.json())
            .then(data => {
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                console.error('Error creating the target:', error);
                // Display the message in the modal window
                modalContent.textContent = 'Aucune cible sélectionnée.';
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
    targetBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the target modify page or perform the necessary actions
        window.location.href = './targets.php';
    }

    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        createTargetForm.reset();
        document.getElementById('targetNationality').selectedIndex = 0;
    }
});