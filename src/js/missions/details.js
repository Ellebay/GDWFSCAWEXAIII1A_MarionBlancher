document.addEventListener('DOMContentLoaded', function () {
    const missionDropdown = document.getElementById('mission-dropdown');
    const missionDetailForm = document.getElementById('missionDetail-form');
    const missionBackButton = document.getElementById('missionBackButton');

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
        const selectedMissionId = missionDropdown.value;

        if (selectedMissionId) {
            fetch(`./controller/missions/read.php?id_mission_detail=${selectedMissionId}`)
                .then(response => response.json())
                .then(data => {
                    missionDetailForm.innerHTML = '';
                    // Create a container for each section
                    const sectionContainer = document.createElement('div');
                    sectionContainer.className = 'section-container';

                    /* --------------------------------- Section 1: Title, Code Name & Status ---------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    const section1 = document.createElement('div');
                    section1.className = 'row m-0';
                    section1.innerHTML = `
                    <div class="p-0 form__section col-25">
                    <span class="chip">${data.mission_code_name}</span>
                    </div>
                    <div class="p-0 form__section col-25">
                    <span class=${data.mission_statut}>${data.mission_statut}</span>
                    </div>
                  
                    <div class="row m-0 p-0">
                    <div class="p-0 form__section">
                    <h2 class="title-detail">${data.mission_title}</h2>
                  </div>
                  </div>

  `;
                    sectionContainer.appendChild(section1);

                    /* ------------------------------------- Section 2: Description -------------------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    const section2 = document.createElement('div');
                    section2.className = 'row m-0';
                    section2.innerHTML = `
                    <label class="subtitle-detail col">Details</label><p class="description-detail">${data.mission_description}</p>
  `;
                    sectionContainer.appendChild(section2);

                    /* ------------------------------ Section 3: Country, Start Time & End Time -------------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    const section3 = document.createElement('div');
                    section3.className = 'row custom-div';

                    // Left column with Country
                    const countryColumn = document.createElement('div');
                    countryColumn.className = 'form__section col-15';
                    const iconCountry = document.createElement('div');
                    iconCountry.className = 'icon-container';
                    iconCountry.innerHTML = `
                        <i class="bi bi-globe" style="font-size: 2rem; color: #ad2831;"></i>
                            `;
                    const columnCountry = document.createElement('div');
                    columnCountry.className = 'label-value-container';
                    columnCountry.innerHTML = `
                                <label>Pays</label>
                                <span>${data.mission_country}</span>
                            `;
                    countryColumn.appendChild(iconCountry);
                    countryColumn.appendChild(columnCountry);

                    // Center column with Start Time
                    const ColumnStart = document.createElement('div');
                    ColumnStart.className = 'form__section col-15';
                    const iconStart = document.createElement('div');
                    iconStart.className = 'icon-container';
                    iconStart.innerHTML = `
                                <i class="bi bi-calendar-fill" style="font-size: 2rem; color: #ad2831;"></i>
                            `;
                    const startColumn = document.createElement('div');
                    startColumn.className = 'label-value-container';
                    startColumn.innerHTML = `
                                <label>Début</label>
                                <span>${data.mission_start_date}</span>
                            `;
                    ColumnStart.appendChild(iconStart);
                    ColumnStart.appendChild(startColumn);

                    // Center column with End Time
                    const ColumnEnd = document.createElement('div');
                    ColumnEnd.className = 'form__section col-15';
                    const iconEnd = document.createElement('div');
                    iconEnd.className = 'icon-container';
                    iconEnd.innerHTML = `
                                <i class="bi bi-calendar-fill" style="font-size: 2rem; color: #ad2831;"></i>
                            `;
                    const endColumn = document.createElement('div');
                    endColumn.className = 'label-value-container';
                    endColumn.innerHTML = `
                                <label>Fin</label>
                                <span>${data.mission_end_date}</span>
                            `;
                    ColumnEnd.appendChild(iconEnd);
                    ColumnEnd.appendChild(endColumn);

                    // Append columns to the main section3
                    section3.appendChild(countryColumn);
                    section3.appendChild(ColumnStart);
                    section3.appendChild(ColumnEnd);

                    sectionContainer.appendChild(section3);

                    /* ------------------------- Section 4: Hideout ID, Mission Type & Specialization -------------------------- */
                    /* --------------------------------------------------------------------------------------------------------- */
                    const section4 = document.createElement('div');
                    section4.className = 'row custom-bg';

                    // Left column with Hideout ID
                    const hideoutColumn = document.createElement('div');
                    hideoutColumn.className = 'form__section col-15';
                    const iconHideout = document.createElement('div');
                    iconHideout.className = 'icon-container';
                    iconHideout.innerHTML = `
       <i class="bi bi-door-open-fill" style="font-size: 2rem; color: #ad2831;"></i>
        `;
                    const columnHideout = document.createElement('div');
                    columnHideout.className = 'label-value-container';
                    if (Array.isArray(data.hideout_code_names)) {
                        let hideoutCodeNamesHTML = '';

                        for (const hideout of data.hideout_code_names) {
                            hideoutCodeNamesHTML += `<span>${hideout}</span>`;
                        }

                        columnHideout.innerHTML = `
                            <label>Planque ID</label>
                            ${hideoutCodeNamesHTML}
                        `;
                    } else {
                        columnHideout.innerHTML = `
                            <label>Planque ID</label>
                            <span>${data.hideout_code_names}</span>
                        `;
                    }
                    hideoutColumn.appendChild(iconHideout);
                    hideoutColumn.appendChild(columnHideout);

                    // Center column with Mission Type
                    const missionTypeColumn = document.createElement('div');
                    missionTypeColumn.className = 'form__section col-15';
                    const iconMission = document.createElement('div');
                    iconMission.className = 'icon-container';
                    iconMission.innerHTML = `
            <i class="bi bi-binoculars-fill" style="font-size: 2rem; color: #ad2831;"></i>
        `;
                    const columnMission = document.createElement('div');
                    columnMission.className = 'label-value-container';
                    columnMission.innerHTML = `
            <label>Type</label>
            <span>${data.mission_type}</span>
        `;
                    missionTypeColumn.appendChild(iconMission);
                    missionTypeColumn.appendChild(columnMission);

                    // Center column with Specialization
                    const specializationColumn = document.createElement('div');
                    specializationColumn.className = 'form__section col-15';
                    const iconSpecialization = document.createElement('div');
                    iconSpecialization.className = 'icon-container';
                    iconSpecialization.innerHTML = `
            <i class="bi bi-tools" style="font-size: 2rem; color: #ad2831;"></i>
        `;
                    const columnSpecialization = document.createElement('div');
                    columnSpecialization.className = 'label-value-container';
                    columnSpecialization.innerHTML = `
            <label>Spécialité</label>
            <span>${data.specialty_code_names}</span>
        `;
                    specializationColumn.appendChild(iconSpecialization);
                    specializationColumn.appendChild(columnSpecialization);

                    // Append columns to the main section3
                    section4.appendChild(hideoutColumn);
                    section4.appendChild(missionTypeColumn);
                    section4.appendChild(specializationColumn);

                    sectionContainer.appendChild(section4);

                    /* ------------------------------ Section 5: Agent ID, Contact ID & Target ID ------------------------------ */
                    /* --------------------------------------------------------------------------------------------------------- */
                    // 
                    const section5 = document.createElement('div');
                    section5.className = 'row custom-bg ';

                    // Left column with Agent ID
                    const agentColumn = document.createElement('div');
                    agentColumn.className = 'form__section col-15';
                    const iconAgent = document.createElement('div');
                    iconAgent.className = 'icon-container';
                    iconAgent.innerHTML = `
    <i class="bi bi-person-fill" style="font-size: 2rem; color: #ad2831;"></i>
        `;
                    const columnAgent = document.createElement('div');
                    columnAgent.className = 'label-value-container';
                    if (Array.isArray(data.agent_code_names)) {
                        let agentCodeNamesHTML = '';

                        for (const agent of data.agent_code_names) {
                            agentCodeNamesHTML += `<span>${agent}</span>`;
                        }

                        columnAgent.innerHTML = `
                            <label>Agent ID</label>
                            ${agentCodeNamesHTML}
                        `;
                    } else {
                        columnAgent.innerHTML = `
                            <label>Agent ID</label>
                            <span>${data.agent_code_names}</span>
                        `;
                    }
                    agentColumn.appendChild(iconAgent);
                    agentColumn.appendChild(columnAgent);

                    // Center column with Contact Id
                    const contactColumn = document.createElement('div');
                    contactColumn.className = 'form__section col-15';
                    const iconContact = document.createElement('div');
                    iconContact.className = 'icon-container';
                    iconContact.innerHTML = `
                    <i class="bi bi-person-lines-fill" style="font-size: 2rem; color: #ad2831;"></i>
                        `;
                    const columnContact = document.createElement('div');
                    columnContact.className = 'label-value-container';
                    if (Array.isArray(data.contact_code_names)) {
                        let contactCodeNamesHTML = '';

                        for (const contact of data.contact_code_names) {
                            contactCodeNamesHTML += `<span>${contact}</span>`;
                        }

                        columnContact.innerHTML = `
                            <label>Contact ID</label>
                            ${contactCodeNamesHTML}
                        `;
                    } else {
                        columnContact.innerHTML = `
                            <label>Contact ID</label>
                            <span>${data.contact_code_names}</span>
                        `;
                    }
                    contactColumn.appendChild(iconContact);
                    contactColumn.appendChild(columnContact);

                    // Center column with Target ID
                    const targetColumn = document.createElement('div');
                    targetColumn.className = 'form__section col-15';
                    const iconTarget = document.createElement('div');
                    iconTarget.className = 'icon-container';
                    iconTarget.innerHTML = `
            <i class="bi bi-bullseye" style="font-size: 2rem; color: #ad2831;"></i>
        `;
                    const columnTarget = document.createElement('div');
                    columnTarget.className = 'label-value-container';
                    if (Array.isArray(data.target_code_names)) {
                        let targetCodeNamesHTML = '';

                        for (const target of data.target_code_names) {
                            targetCodeNamesHTML += `<span>${target}</span>`;
                        }

                        columnTarget.innerHTML = `
                            <label>Cible ID</label>
                            ${targetCodeNamesHTML}
                        `;
                    } else {
                        columnTarget.innerHTML = `
                            <label>Cible ID</label>
                            <span>${data.target_code_names}</span>
                        `;
                    }
                    targetColumn.appendChild(iconTarget);
                    targetColumn.appendChild(columnTarget);

                    // Append columns to the main section3
                    section5.appendChild(agentColumn);
                    section5.appendChild(contactColumn);
                    section5.appendChild(targetColumn);

                    sectionContainer.appendChild(section5);

                    missionDetailForm.appendChild(sectionContainer);
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                        }
                    }
                })
                .catch(error => {
                    console.error('Error fetching mission details:', error);
                });
        };
    });

    /* ------------------------------------------------ Back Button -------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------- */
    missionBackButton.addEventListener('click', handleBackMission);

    function handleBackMission() {
        // Redirect to the mission modify page or perform the necessary actions
        window.location.href = './index.php';
    }

});