fetch('../controller/specialties/read.php') // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    const specialtyForm = document.getElementById('specialty-form');

    data.forEach(specialty => {
      // Create a form for each specialty
      const specialty_form = document.createElement('form');
      specialty_form.className = 'form-input';

      // Create input fields for specialty data
      const specialtyCodeNameInput = document.createElement('input');
      specialtyCodeNameInput.type = 'text';
      specialtyCodeNameInput.value = specialty.specialty_code_name;
      specialtyCodeNameInput.className = 'chip';
      specialtyCodeNameInput.readOnly = true;

      // Create input fields for specialty data
      const specialtyType = document.createElement('input');
      specialtyType.type = 'text';
      specialtyType.value = specialty.specialty_type;
      specialtyType.className = 'titleInput';
      specialtyType.readOnly = true;

      // Append the elements to the form
      specialty_form.appendChild(specialtyCodeNameInput);
      specialty_form.appendChild(specialtyType);
      /*       specialty_form.appendChild(specialtyDetailsButton);
       */
      // Append the form to the main specialty form
      specialtyForm.appendChild(specialty_form);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

/* Insert the different buttons depending if Admin is connected or not */
const specialtyButton = document.getElementById('specialty-button');

const specialtyCreateButton = document.createElement('button');
specialtyCreateButton.innerText = 'Créer';
specialtyCreateButton.id = 'specialtyCreateButton';
specialtyCreateButton.className = 'action-button create_btn';
specialtyCreateButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const specialtyModifyButton = document.createElement('button');
specialtyModifyButton.innerText = 'Modifier';
specialtyModifyButton.id = 'specialtyModifyButton';
specialtyModifyButton.className = 'action-button modify_btn';
specialtyModifyButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const specialtyDeleteButton = document.createElement('button');
specialtyDeleteButton.innerText = 'Supprimer';
specialtyDeleteButton.id = 'specialtyDeleteButton';
specialtyDeleteButton.className = 'action-button delete_btn';
specialtyDeleteButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

// Append the button to the main specialty div
specialtyButton.appendChild(specialtyCreateButton);
specialtyButton.appendChild(specialtyModifyButton);
specialtyButton.appendChild(specialtyDeleteButton);

document.addEventListener('DOMContentLoaded', function () {
  const specialtyCreateButton = document.getElementById('specialtyCreateButton');
  const specialtyModifyButton = document.getElementById('specialtyModifyButton');
  const specialtyDeleteButton = document.getElementById('specialtyDeleteButton');

  // Add click event listeners for the Modify and Delete buttons
  specialtyCreateButton.addEventListener('click', handleCreate);
  specialtyModifyButton.addEventListener('click', handleModify);
  specialtyDeleteButton.addEventListener('click', handleDelete);
});

function handleCreate() {
  // Redirect to the specialty modify page or perform the necessary actions
  window.location.href = './specialtiesCreate.php';
}

function handleModify() {
  // Redirect to the specialty modify page or perform the necessary actions
  window.location.href = './specialtiesModify.php';
}

function handleDelete() {
  // Implement the delete functionality or perform the necessary actions
  window.location.href = './specialtiesDelete.php';
}

