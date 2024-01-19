document.addEventListener('DOMContentLoaded', function () {
    const createSpecialtyForm = document.getElementById('createSpecialtyForm');
    const specialtyBackButton = document.getElementById('specialtyBackButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton')

    /* ------------------------------------------------ Submit ------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    createSpecialtyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Retrieve form values
        const specialtyCodeName = document.getElementById('specialtyCodeName').value;
        const specialtyType = document.getElementById('specialtyType').value;

        // Create an object with specialty data
        const newSpecialty = {
            specialtyCodeName: specialtyCodeName,  // Use correct key names
            specialtyType: specialtyType
        };

        // Send data to the server
        fetch('../controller/specialties/create.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSpecialty),
        })
            .then(response => response.json())
            .then(data => {
                modalContent.textContent = data.message;
                modal.style.display = 'block';
                resetForm();
            })
            .catch(error => {
                console.error('Error creating the specialty:', error);
                // Display the message in the modal window
                modalContent.textContent = 'Aucune spécialité créée.';
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
    specialtyBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the specialty modify page or perform the necessary actions
        window.location.href = './specialties.php';
    }

    /* ---------------------------------------------- Reset Form ----------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    function resetForm() {
        createSpecialtyForm.reset();
    }
});