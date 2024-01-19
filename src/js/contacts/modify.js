document.addEventListener('DOMContentLoaded', function () {
    const contactDropdown = document.getElementById('contact-dropdown');
    const contactBackButton = document.getElementById('contactBackButton');
    const modifyContactForm = document.getElementById('modifyContact-form');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Contacts Dropdown ---------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('../controller/contacts/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner le Contact';
            contactDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(contact => {
                const option = document.createElement('option');
                option.value = contact.id_contact;
                option.textContent = `${contact.contact_code_name} - ${contact.contact_first_name} ${contact.contact_last_name}`;
                contactDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching contact data:', error);
        });

    // Event listener for contact selection
    contactDropdown.addEventListener('change', function () {
        const selectedContactId = contactDropdown.value;

        if (selectedContactId) {
            fetch(`../controller/contacts/read.php?id_contact=${selectedContactId}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const contact = data[0];
        
                    // Populate the form with contact details
                    document.getElementById('contactLastName').value = contact.contact_last_name;
                    document.getElementById('contactFirstName').value = contact.contact_first_name;
                    document.getElementById('contactBirthDate').value = contact.contact_birth_date;
                    document.getElementById('contactNationality').value = contact.contact_nationality;
                    document.getElementById('contactCodeName').value = contact.contact_code_name;
                }
            })
            .catch(error => {
                console.error('Error fetching contact details:', error);
            });
        };
    });

    /* ------------------------------------------------ Nationality--------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    // Fetch JSON data (replace 'countries.json' with the actual path to your JSON file)
    fetch('../controller/countries.json')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('contactNationality');
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
    // Event listener for form submission
    modifyContactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedContactId = contactDropdown.value;

        if (selectedContactId) {
            // Send the selected contact ID to the server for modification
            fetch('../controller/contacts/modify.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_contact: selectedContactId,
                    contact_last_name: document.getElementById('contactLastName').value,
                    contact_first_name: document.getElementById('contactFirstName').value,
                    contact_birth_date: document.getElementById('contactBirthDate').value,
                    contact_nationality: document.getElementById('contactNationality').value,
                    contact_code_name: document.getElementById('contactCodeName').value,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Modification du contact réussie.') {
                        // Fetch updated contact data after modification
                        fetch('../controller/contacts/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                contactDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner le Contact';
                                contactDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(contact => {
                                    const option = document.createElement('option');
                                    option.value = contact.id_contact;
                                    option.textContent = `${contact.contact_code_name} - ${contact.contact_first_name} ${contact.contact_last_name}`;
                                    contactDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated contact data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error modifying contact:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'No contact selected for modification.';
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
    contactBackButton.addEventListener('click', handleBackContact);

    function handleBackContact() {
        window.location.href = './contacts.php';
    }
});
