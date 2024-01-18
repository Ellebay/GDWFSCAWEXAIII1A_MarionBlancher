document.addEventListener('DOMContentLoaded', function () {
    const targetDropdown = document.getElementById('target-dropdown');
    const targetBackButton = document.getElementById('targetBackButton');
    const targetDeleteButton = document.getElementById('targetDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Targets Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/targets/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner le Target';
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
        // Check if the selected value is not empty
        if (targetDropdown.value !== '') {
            console.log('Selected target:', targetDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    targetBackButton.addEventListener('click', handleBackTarget);

    function handleBackTarget() {
        window.location.href = './targets.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    targetDeleteButton.addEventListener('click', handleDeleteTarget);

    function handleDeleteTarget() {
        const selectedTargetId = targetDropdown.value;

        if (selectedTargetId) {
            // Send the selected target ID to the server for deletion
            fetch('./controller/targets/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_target=${selectedTargetId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression de la cible réussie.') {
                        // Fetch updated target data after deletion
                        fetch('./controller/targets/read.php')
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
                    console.error('Error deleting target:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'No target selected for deletion.';
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
