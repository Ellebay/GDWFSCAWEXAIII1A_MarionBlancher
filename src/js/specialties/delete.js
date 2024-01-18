document.addEventListener('DOMContentLoaded', function () {
    const specialtyDropdown = document.getElementById('specialty-dropdown');
    const specialtyBackButton = document.getElementById('specialtyBackButton');
    const specialtyDeleteButton = document.getElementById('specialtyDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Specialties Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/specialties/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la Planque';
            specialtyDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(specialty => {
                const option = document.createElement('option');
                option.value = specialty.id_specialty;
                option.textContent = `${specialty.specialty_code_name} - ${specialty.specialty_type}`;
                specialtyDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching specialty data:', error);
        });

    // Event listener for specialty selection
    specialtyDropdown.addEventListener('change', function () {
        // Check if the selected value is not empty
        if (specialtyDropdown.value !== '') {
            console.log('Selected specialty:', specialtyDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    specialtyBackButton.addEventListener('click', handleBackSpecialty);

    function handleBackSpecialty() {
        window.location.href = './specialties.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    specialtyDeleteButton.addEventListener('click', handleDeleteSpecialty);

    function handleDeleteSpecialty() {
        const selectedSpecialtyId = specialtyDropdown.value;

        if (selectedSpecialtyId) {
            // Send the selected specialty ID to the server for deletion
            fetch('./controller/specialties/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_specialty=${selectedSpecialtyId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression de la spécialité réussie.') {
                        // Fetch updated specialty data after deletion
                        fetch('./controller/specialties/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                specialtyDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner la Planque';
                                specialtyDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(specialty => {
                                    const option = document.createElement('option');
                                    option.value = specialty.id_specialty;
                                    option.textContent = `${specialty.specialty_code_name} - ${specialty.specialty_type}`;
                                    specialtyDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated specialty data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error deleting specialty:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'No specialty selected for deletion.';
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
