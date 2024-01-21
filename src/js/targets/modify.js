document.addEventListener('DOMContentLoaded', function () {
    const targetDropdown = document.getElementById('target-dropdown');
    const targetBackButton = document.getElementById('targetBackButton');
    const modifyTargetForm = document.getElementById('modifyTarget-form');
    const targetModifyButton = document.getElementById('targetModifyButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Targets Dropdown ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/targets/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la Cible';
            targetDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(target => {
                const option = document.createElement('option');
                option.value = target.id_target;
                option.textContent = `${target.target_code_name} - ${target.target_first_name} ${target.target_last_name}`;
                targetDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching target data:', error);
        });

    // Event listener for target selection
    targetDropdown.addEventListener('change', function () {
        const selectedTargetId = targetDropdown.value;

        if (selectedTargetId) {
            fetch(`../api/targets/read.php?id_target=${selectedTargetId}`)
                .then(response => response.json())
                .then(data => {

                    if (data.length > 0) {
                        const target = data[0];
                    // Populate the form with target details
                    document.getElementById('targetLastName').value = target.target_last_name;
                    document.getElementById('targetFirstName').value = target.target_first_name;
                    document.getElementById('targetBirthDate').value = target.target_birth_date;
                    document.getElementById('targetNationality').value = target.target_nationality;
                    document.getElementById('targetCodeName').value = target.target_code_name;
                    }
                })
                .catch(error => {
                    console.error('Error fetching target details:', error);
                });
        };
    });

    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    // Fetch JSON data (replace 'countries.json' with the actual path to your JSON file)
    fetch('../api/countries.json')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('targetNationality');
            // Loop through the data and populate the dropdown
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.nationality; // Use the country code as the value
                option.textContent = country.nationality; // Display the country name

                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });

    /* ------------------------------------------------ Modify Button ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    /* targetModifyButton.addEventListener('click', handleModifyTarget);
    
        function handleModifyTarget() { */
    // Event listener for form submission
    modifyTargetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedTargetId = targetDropdown.value;


        console.log('Selected Target ID:', selectedTargetId);

        if (selectedTargetId) {
            // Send the selected target ID to the server for modification
            fetch('../api/targets/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_target: selectedTargetId,
                    target_last_name: document.getElementById('targetLastName').value,
                    target_first_name: document.getElementById('targetFirstName').value,
                    target_birth_date: document.getElementById('targetBirthDate').value,
                    target_nationality: document.getElementById('targetNationality').value,
                    target_code_name: document.getElementById('targetCodeName').value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Modification de la cible réussie.') {
                        // Fetch updated target data after modification
                        fetch('../api/targets/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                targetDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélecitonner le Target';
                                targetDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(target => {
                                    const option = document.createElement('option');
                                    option.value = target.id_target;
                                    option.textContent = `${target.target_code_name} - ${target.target_first_name} ${target.target_last_name}`;
                                    targetDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated target data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error modifying target:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucune Cible sélectionnée.';
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
    targetBackButton.addEventListener('click', handleBackTarget);

    function handleBackTarget() {
        window.location.href = './targets.php';
    }
});
