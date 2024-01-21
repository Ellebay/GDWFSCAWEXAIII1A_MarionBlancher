document.addEventListener('DOMContentLoaded', function () {
    const contactDropdown = document.getElementById('contact-dropdown');
    const contactBackButton = document.getElementById('contactBackButton');
    const contactDeleteButton = document.getElementById('contactDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Contacts Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/contacts/read.php')
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
        // Check if the selected value is not empty
        if (contactDropdown.value !== '') {
            console.log('Selected contact:', contactDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    contactBackButton.addEventListener('click', handleBackContact);

    function handleBackContact() {
        window.location.href = './contacts.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    contactDeleteButton.addEventListener('click', handleDeleteContact);

    function handleDeleteContact() {
        const selectedContactId = contactDropdown.value;

        if (selectedContactId) {
            // Send the selected contact ID to the server for deletion
            fetch('./controller/contacts/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_contact=${selectedContactId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression du contact réussie.') {
                        // Fetch updated contact data after deletion
                        fetch('./controller/contacts/read.php')
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
                    console.error('Error deleting contact:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucun Contact sélectionné.';
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
