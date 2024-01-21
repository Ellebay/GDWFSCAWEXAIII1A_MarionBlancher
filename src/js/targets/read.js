fetch('./controller/targets/read.php') // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    const targetForm = document.getElementById('target-form');

    data.forEach(target => {
      // Create a form for each target
      const target_form = document.createElement('form');
      target_form.className = 'agentForm-input';

      // Create input fields for target data
      const targetFirstName = document.createElement('input');
      targetFirstName.type = 'text';
      targetFirstName.value = 'Prénom : ' + ' ' + target.target_first_name;
      targetFirstName.className = 'titleInput';
      targetFirstName.readOnly = true;

      // Create input fields for target data
      const targetLastName = document.createElement('input');
      targetLastName.type = 'text';
      targetLastName.value = 'Nom : ' + ' ' + target.target_last_name;
      targetLastName.className = 'titleInput';
      targetLastName.readOnly = true;

      // Create input fields for target data
      const targetBirthDate = document.createElement('input');
      targetBirthDate.type = 'text';
      targetBirthDate.value = 'Date de Naissance : ' + ' ' + target.target_birth_date;
      targetBirthDate.className = 'titleInput';
      targetBirthDate.readOnly = true;

      // Create input fields for target data
      const targetCodeNameInput = document.createElement('input');
      targetCodeNameInput.type = 'text';
      targetCodeNameInput.value = target.target_code_name;
      targetCodeNameInput.className = 'chip';
      targetCodeNameInput.readOnly = true;

      // Create input fields for target data
      const targetNationality = document.createElement('input');
      targetNationality.type = 'text';
      targetNationality.value = 'Nationalité : ' + ' ' + target.target_nationality;
      targetNationality.className = 'titleInput';
      targetNationality.readOnly = true;

      // Append the elements to the form
      target_form.appendChild(targetCodeNameInput);
      target_form.appendChild(targetFirstName);
      target_form.appendChild(targetLastName);
      target_form.appendChild(targetBirthDate);
      target_form.appendChild(targetNationality);
      /*       target_form.appendChild(targetDetailsButton);
       */
      // Append the form to the main target form
      targetForm.appendChild(target_form);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

/* Insert the different buttons depending if Admin is connected or not */
const targetButton = document.getElementById('target-button');

const targetCreateButton = document.createElement('button');
targetCreateButton.innerText = 'Créer';
targetCreateButton.id = 'targetCreateButton';
targetCreateButton.className = 'action-button create_btn';
targetCreateButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const targetModifyButton = document.createElement('button');
targetModifyButton.innerText = 'Modifier';
targetModifyButton.id = 'targetModifyButton';
targetModifyButton.className = 'action-button modify_btn';
targetModifyButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const targetDeleteButton = document.createElement('button');
targetDeleteButton.innerText = 'Supprimer';
targetDeleteButton.id = 'targetDeleteButton';
targetDeleteButton.className = 'action-button delete_btn';
targetDeleteButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

// Append the button to the main target div
targetButton.appendChild(targetCreateButton);
targetButton.appendChild(targetModifyButton);
targetButton.appendChild(targetDeleteButton);

document.addEventListener('DOMContentLoaded', function () {
  const targetCreateButton = document.getElementById('targetCreateButton');
  const targetModifyButton = document.getElementById('targetModifyButton');
  const targetDeleteButton = document.getElementById('targetDeleteButton');

  // Add click event listeners for the Modify and Delete buttons
  targetCreateButton.addEventListener('click', handleCreate);
  targetModifyButton.addEventListener('click', handleModify);
  targetDeleteButton.addEventListener('click', handleDelete);
});

function handleCreate() {
  // Redirect to the target modify page or perform the necessary actions
  window.location.href = './targetsCreate.php';
}

function handleModify() {
  // Redirect to the target modify page or perform the necessary actions
  window.location.href = './targetsModify.php';
}

function handleDelete() {
  // Implement the delete functionality or perform the necessary actions
  window.location.href = './targetsDelete.php';
}

