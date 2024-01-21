document.addEventListener('DOMContentLoaded', function () {
    const createContactForm = document.getElementById('createContactForm');
    const contactBackButton = document.getElementById('contactBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');
    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../api/countries.json')
        .then(response => response.json())
        .then(data => {
            // Get the select element
            const selectElement = document.getElementById('contactNationality');

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

                    // Update or log the selected value and index here
                    console.log('Selected contact nationality:', selectElement.value);
                    console.log('Selected contact index:', selectedIndex);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
        });

    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createContactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const contactLastName = document.getElementById('contactLastName').value;
        const contactFirstName = document.getElementById('contactFirstName').value;
        const contactBirthDate = document.getElementById('contactBirthDate').value;
        const contactNationality = document.getElementById('contactNationality').value;
        const contactCodeName = document.getElementById('contactCodeName').value;

        const formattedBirthDate = contactBirthDate.split('T')[0];

        // Create an object with contact data
        const newContact = {
            contactFirstName: contactFirstName,  // Use correct key names
            contactLastName: contactLastName,
            contactBirthDate: formattedBirthDate,
            contactNationality: contactNationality,
            contactCodeName: contactCodeName
        };

        // Send data to the server
        fetch('../api/contacts/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newContact),
        })
            .then(response => response.json())
            .then(data => {
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                console.error('Error creating the contact:', error);
                modalContent.textContent = 'No contact created.';
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
    contactBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the contact modify page or perform the necessary actions
        window.location.href = './contacts.php';
    }

    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        createContactForm.reset();
        document.getElementById('contactNationality').selectedIndex = 0;
    }
});