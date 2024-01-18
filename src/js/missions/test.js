class MissionManager {
    constructor(adminIsConnected) {
        this.adminIsConnected = adminIsConnected;
        this.missionForm = document.getElementById('mission-form');
        this.initEventListeners();
        this.createButtons();
    }

    initEventListeners() {
        document.getElementById('searchForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const searchTerm = document.getElementById('searchInput').value;
            this.searchMissions(searchTerm);
        });
    }

    fetchMissions() {
        fetch('./controller/missions/read.php')
            .then(response => response.json())
            .then(data => this.displayMissions(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    searchMissions(searchTerm) {
        if (!searchTerm.trim()) {
            this.fetchMissions();
        } else {
            fetch(`./controller/missions/search.php?searchTerm=${encodeURIComponent(searchTerm)}`)
                .then(response => response.json())
                .then(data => this.displayMissions(data))
                .catch(error => console.error('Error fetching search results:', error));
        }
    }

    displayMissions(missions) {
        const missionForm = document.getElementById('mission-form');
        missionForm.innerHTML = '';
      
        missions.forEach(mission => {
          // Create a form for each mission
          const mission_form = document.createElement('form');
          mission_form.className = 'form-input';
      
          // Create input fields for mission data
          const missionTitleInput = document.createElement('input');
          missionTitleInput.type = 'text';
          missionTitleInput.value = mission.mission_title;
          missionTitleInput.className = 'titleInput title-grid';
          missionTitleInput.readOnly = true;
      
          // Create input fields for mission data
          const missionCodeNameInput = document.createElement('input');
          missionCodeNameInput.type = 'text';
          missionCodeNameInput.value = mission.mission_code_name;
          missionCodeNameInput.className = 'chip';
          missionCodeNameInput.readOnly = true;
      
          // Create input fields for mission data
          const missionStatutInput = document.createElement('input');
          missionStatutInput.type = 'text';
          missionStatutInput.value = mission.mission_statut;
          missionStatutInput.className = mission.mission_statut;
          missionStatutInput.readOnly = true;
      
          // Append the elements to the form
          mission_form.appendChild(missionCodeNameInput);
          mission_form.appendChild(missionStatutInput);
          mission_form.appendChild(missionTitleInput);
      
          // Append the form to the main mission form
          missionForm.appendChild(mission_form);
        });
    }

    createButtons() {
        const missionButton = document.getElementById('mission-button');

        const missionDetailsButton = this.createButton('Détails', 'missionDetailsButton', 'details_btn');
        const missionCreateButton = this.createButton('Créer', 'missionCreateButton', 'create_btn', this.adminIsConnected);
        const missionModifyButton = this.createButton('Modifier', 'missionModifyButton', 'modify_btn', this.adminIsConnected);
        const missionDeleteButton = this.createButton('Supprimer', 'missionDeleteButton', 'delete_btn', this.adminIsConnected);

        missionButton.appendChild(missionDetailsButton);
        missionButton.appendChild(missionCreateButton);
        missionButton.appendChild(missionModifyButton);
        missionButton.appendChild(missionDeleteButton);
    }

    createButton(text, id, className, isVisible = true) {
        const button = document.createElement('button');
        button.innerText = text;
        button.id = id;
        button.className = 'action-button ' + className;
        button.style.display = isVisible ? 'inline' : 'none';
        return button;
    }

    handleDetails() {
        window.location.href = './missionsDetail.php';
    }

    handleCreate() {
        window.location.href = './missionsCreate.php';
    }

    handleModify() {
        window.location.href = './missionsModify.php';
    }

    handleDelete() {
        window.location.href = './missionsDelete.php';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const missionManager = new MissionManager(adminIsConnected);
    missionManager.fetchMissions();
});
