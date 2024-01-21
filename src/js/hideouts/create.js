document.addEventListener('DOMContentLoaded', function () {
    const createHideoutForm = document.getElementById('createHideoutForm');
    const hideoutBackButton = document.getElementById('hideoutBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/countries.json')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const selectElement = document.getElementById('hideoutCountry');

            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner le Pays';
            selectElement.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach((country, index) => {
                const option = document.createElement('option');
                option.value = country.en_short_name;
                option.textContent = country.en_short_name;
                option.setAttribute('data-index', index); // Set the index as a custom attribute
                selectElement.appendChild(option);
            });

            selectElement.addEventListener('change', function () {
                // Check if the selected value is not empty
                if (selectElement.value !== '') {
                    // Retrieve the index from the selected option's custom attribute
                    const selectedIndex = selectElement.options[selectElement.selectedIndex].getAttribute('data-index');

                    // Update or log the selected value and index here
                    console.log('Selected hideout country:', selectElement.value);
                    console.log('Selected hideout index:', selectedIndex);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });

    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createHideoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const hideoutCodeName = document.getElementById('hideoutCodeName').value;
        const hideoutCountry = document.getElementById('hideoutCountry').value;
        const hideoutAddress = document.getElementById('hideoutAddress').value;
        const hideoutCity = document.getElementById('hideoutCity').value;
        const hideoutType = document.getElementById('hideoutType').value;
console.log('country: ', hideoutCountry);
        // Create an object with hideout data
        const newHideout = {
            hideoutCodeName: hideoutCodeName,  // Use correct key names
            hideoutCountry: hideoutCountry,
            hideoutAddress: hideoutAddress,
            hideoutCity: hideoutCity,
            hideoutType: hideoutType
        };

        // Send data to the server
        fetch('./controller/hideouts/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newHideout),
        })
            .then(response => response.json())
            .then(data => {
                // Display the message in the modal window
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                console.error('Error creating the hideout:', error);
                // Display the message in the modal window
                modalContent.textContent = 'Aucune planque sélectionnée.';
                modal.style.display = 'block';
            });
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    hideoutBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the hideout modify page or perform the necessary actions
        window.location.href = './hideouts.php';
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

    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        createHideoutForm.reset();
        document.getElementById('hideoutCountry').selectedIndex = 0;
    }
});