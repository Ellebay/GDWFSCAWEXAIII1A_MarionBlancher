document.addEventListener('DOMContentLoaded', function () {
    const hideoutDropdown = document.getElementById('hideout-dropdown');
    const hideoutBackButton = document.getElementById('hideoutBackButton');
    const hideoutDeleteButton = document.getElementById('hideoutDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Hideouts Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/hideouts/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la Planque';
            hideoutDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(hideout => {
                const option = document.createElement('option');
                option.value = hideout.id_hideout;
                option.textContent = `${hideout.hideout_code_name} - ${hideout.hideout_country} - ${hideout.hideout_type}`;
                hideoutDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching hideout data:', error);
        });

    // Event listener for hideout selection
    hideoutDropdown.addEventListener('change', function () {
        // Check if the selected value is not empty
        if (hideoutDropdown.value !== '') {
            console.log('Selected hideout:', hideoutDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    hideoutBackButton.addEventListener('click', handleBackHideout);

    function handleBackHideout() {
        window.location.href = './hideouts.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    hideoutDeleteButton.addEventListener('click', handleDeleteHideout);

    function handleDeleteHideout() {
        const selectedHideoutId = hideoutDropdown.value;

        if (selectedHideoutId) {
            // Send the selected hideout ID to the server for deletion
            fetch('./controller/hideouts/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_hideout=${selectedHideoutId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression de la planque réussie.') {
                        // Fetch updated hideout data after deletion
                        fetch('./controller/hideouts/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                hideoutDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélecitonner la Planque';
                                hideoutDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(hideout => {
                                    const option = document.createElement('option');
                                    option.value = hideout.id_hideout;
                                    option.textContent = `${hideout.hideout_code_name} - ${hideout.hideout_country} - ${hideout.hideout_type}`;
                                    hideoutDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated hideout data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error deleting hideout:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'No hideout selected for deletion.';
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
