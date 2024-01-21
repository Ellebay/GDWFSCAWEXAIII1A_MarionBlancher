document.addEventListener('DOMContentLoaded', function () {
    const specialtyDropdown = document.getElementById('specialty-dropdown');
    const specialtyBackButton = document.getElementById('specialtyBackButton');
    const modifySpecialtyForm = document.getElementById('modifySpecialty-form');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Specialties Dropdown ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/specialties/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la Spécialité';
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
        const selectedSpecialtyId = specialtyDropdown.value;

        if (selectedSpecialtyId) {
            fetch(`./controller/specialties/read.php?id_specialty=${selectedSpecialtyId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const specialty = data[0];

                    // Populate the form with specialty details
                    document.getElementById('specialtyType').value = specialty.specialty_type;
                    document.getElementById('specialtyCodeName').value = specialty.specialty_code_name;
                    }
                })
                .catch(error => {
                    console.error('Error fetching specialty details:', error);
                });
        };
    });

    /* ------------------------------------------------ Modify Button ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Event listener for form submission
    modifySpecialtyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedSpecialtyId = specialtyDropdown.value;


        console.log('Selected Specialty ID:', selectedSpecialtyId);

        if (selectedSpecialtyId) {
            // Send the selected specialty ID to the server for modification
            fetch('./controller/specialties/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_specialty: selectedSpecialtyId,
                    specialty_type: document.getElementById('specialtyType').value,
                    specialty_code_name: document.getElementById('specialtyCodeName').value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Modification de la spécialité réussie.') {
                        // Fetch updated specialty data after modification
                        fetch('./controller/specialties/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                specialtyDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner la Spécialité';
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
                    console.error('Error modifying specialty:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucune spécialité sélectionnée.';
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
    specialtyBackButton.addEventListener('click', handleBackSpecialty);

    function handleBackSpecialty() {
        window.location.href = './specialties.php';
    }
});
