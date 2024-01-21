document.addEventListener('DOMContentLoaded', function () {
    const hideoutDropdown = document.getElementById('hideout-dropdown');
    const countryDropdown = document.getElementById('hideoutCountry');
    const hideoutBackButton = document.getElementById('hideoutBackButton');
    const modifyHideoutForm = document.getElementById('modifyHideout-form');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Hideouts Dropdown ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/hideouts/read.php')
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
        const selectedHideoutId = hideoutDropdown.value;

        if (selectedHideoutId) {
            fetch(`../api/hideouts/read.php?id_hideout=${selectedHideoutId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const hideout = data[0];

                        // Populate the form with hideout details
                        document.getElementById('hideoutCountry').value = hideout.hideout_country;
                        document.getElementById('hideoutAddress').value = hideout.hideout_address;
                        document.getElementById('hideoutCity').value = hideout.hideout_city;
                        document.getElementById('hideoutType').value = hideout.hideout_type;
                        document.getElementById('hideoutCodeName').value = hideout.hideout_code_name;

    /* ------------------------------------------------ Country ------------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Fetch JSON data (replace 'countries.json' with the actual path to your JSON file)
    countryDropdown.textContent = hideout.hideout_country;
    console.log('hideout country: ',hideout );
    fetch('../api/countries.json')
        .then(response => response.json())
        .then(countryData => {
            countryData.forEach(country => {
                const option = document.createElement('option');
                option.value = country.en_short_name; // Use the country code as the value
                option.textContent = country.en_short_name; // Display the country name
                if (hideout.hideout_country && hideout.hideout_country.includes(country.en_short_name)) {
                    option.selected = true; // Set the selected attribute
                }
                countryDropdown.appendChild(option);
            });
        })
    }
    })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });
    };
});
    /* ------------------------------------------------ Modify Button ------------------------------------------ */
    /* --------------------------------------------------------------------------------------------------------- */
    // Event listener for form submission
    modifyHideoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedHideoutId = hideoutDropdown.value;

        if (selectedHideoutId) {
            // Send the selected hideout ID to the server for modification
            fetch('../api/hideouts/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_hideout: selectedHideoutId,
                    hideout_country: document.getElementById('hideoutCountry').value,
                    hideout_address: document.getElementById('hideoutAddress').value,
                    hideout_city: document.getElementById('hideoutCity').value,
                    hideout_type: document.getElementById('hideoutType').value,
                    hideout_code_name: document.getElementById('hideoutCodeName').value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Modification de la planque réussie.') {
                        // Fetch updated hideout data after modification
                        fetch('../api/hideouts/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                hideoutDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner le Hideout';
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
                    console.error('Error modifying hideout:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucune Planque sélectionnée.';
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
    hideoutBackButton.addEventListener('click', handleBackHideout);

    function handleBackHideout() {
        window.location.href = './hideouts.php';
    }
});
