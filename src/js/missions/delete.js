document.addEventListener('DOMContentLoaded', function () {
    const missionDropdown = document.getElementById('mission-dropdown');
    const missionBackButton = document.getElementById('missionBackButton');
    const missionDeleteButton = document.getElementById('missionDeleteButton');
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modalContent');
    const closeModalButton = document.getElementById('closeModalButton');

    /* ------------------------------------------------ Missions Dropdown -------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    fetch('./controller/missions/read.php')
        .then(response => response.json())
        .then(data => {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Sélectionner la mission';
            missionDropdown.appendChild(defaultOption);

            // Loop through the data and populate the dropdown
            data.forEach(mission => {
                const option = document.createElement('option');
                option.value = mission.id_mission;
                option.textContent = `${mission.mission_title} - ${mission.mission_code_name}`;
                missionDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching mission data:', error);
        });

    // Event listener for mission selection
    missionDropdown.addEventListener('change', function () {
        // Check if the selected value is not empty
        if (missionDropdown.value !== '') {
            console.log('Selected mission:', missionDropdown.value);
        }
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    missionBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        window.location.href = './index.php';
    }

    /* ---------------------------------------------- Delete Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    missionDeleteButton.addEventListener('click', handleDeleteMission);

    function handleDeleteMission() {
        const selectedMissionId = missionDropdown.value;

        if (selectedMissionId) {
            // Send the selected mission ID to the server for deletion
            fetch('./controller/missions/delete.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id_mission=${selectedMissionId}`,
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the response from the server
                    /*                    console.log(data); */
                    // Display the message in the modal window
                    modalContent.textContent = data.message;
                    modal.style.display = 'block';

                    // Check if the deletion was successful
                    if (data.message === 'Suppression de la mission réussie.') {
                        // Fetch updated mission data after deletion
                        fetch('./controller/missions/read.php')
                            .then(response => response.json())
                            .then(updatedData => {
                                // Clear existing options in the dropdown
                                missionDropdown.innerHTML = '';

                                // Add a default option
                                const defaultOption = document.createElement('option');
                                defaultOption.value = '';
                                defaultOption.textContent = 'Sélectionner la Mission';
                                missionDropdown.appendChild(defaultOption);

                                // Loop through the updated data and populate the dropdown
                                updatedData.forEach(mission => {
                                    const option = document.createElement('option');
                                    option.value = mission.id_mission;
                                    option.textContent = `${mission.mission_title} - ${mission.mission_code_name}`;
                                    missionDropdown.appendChild(option);
                                });
                            })
                            .catch(error => {
                                console.error('Error fetching updated mission data:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error deleting mission:', error);
                });
        } else {
            // Display the message in the modal window
            modalContent.textContent = 'Aucune mission sélectionnée.';
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
