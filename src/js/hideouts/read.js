fetch('./controller/hideouts/read.php') // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    const hideoutForm = document.getElementById('hideout-form');

    data.forEach(hideout => {
      // Create a form for each hideout
      const hideout_form = document.createElement('form');
      hideout_form.className = 'agentForm-input';

      // Create input fields for hideout data
      const hideoutCodeNameInput = document.createElement('input');
      hideoutCodeNameInput.type = 'text';
      hideoutCodeNameInput.value = hideout.hideout_code_name;
      hideoutCodeNameInput.className = 'chip';
      hideoutCodeNameInput.readOnly = true;

      // Create input fields for hideout data
      const hideoutCountry = document.createElement('input');
      hideoutCountry.type = 'text';
      hideoutCountry.value = 'Pays : ' + ' ' + hideout.hideout_country;
      hideoutCountry.className = 'titleInput';
      hideoutCountry.readOnly = true;

      // Create input fields for hideout data
      const hideoutAddress = document.createElement('input');
      hideoutAddress.type = 'text';
      hideoutAddress.value = 'Adresse : ' + ' ' + hideout.hideout_address;
      hideoutAddress.className = 'titleInput';
      hideoutAddress.readOnly = true;

      // Create input fields for hideout data
      const hideoutCity = document.createElement('input');
      hideoutCity.type = 'text';
      hideoutCity.value = 'Ville : ' + ' ' + hideout.hideout_city;
      hideoutCity.className = 'titleInput';
      hideoutCity.readOnly = true;

      // Create input fields for hideout data
      const hideoutType = document.createElement('input');
      hideoutType.type = 'text';
      hideoutType.value = 'Type : ' + ' ' + hideout.hideout_type;
      hideoutType.className = 'titleInput';
      hideoutType.readOnly = true;

      // Append the elements to the form
      hideout_form.appendChild(hideoutCodeNameInput);
      hideout_form.appendChild(hideoutCountry);
      hideout_form.appendChild(hideoutAddress);
      hideout_form.appendChild(hideoutCity);
      hideout_form.appendChild(hideoutType);
      /*       hideout_form.appendChild(hideoutDetailsButton);
       */
      // Append the form to the main hideout form
      hideoutForm.appendChild(hideout_form);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

/* Insert the different buttons depending if Admin is connected or not */
const hideoutButton = document.getElementById('hideout-button');

const hideoutCreateButton = document.createElement('button');
hideoutCreateButton.innerText = 'Créer';
hideoutCreateButton.id = 'hideoutCreateButton';
hideoutCreateButton.className = 'action-button create_btn';
hideoutCreateButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const hideoutModifyButton = document.createElement('button');
hideoutModifyButton.innerText = 'Modifier';
hideoutModifyButton.id = 'hideoutModifyButton';
hideoutModifyButton.className = 'action-button modify_btn';
hideoutModifyButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const hideoutDeleteButton = document.createElement('button');
hideoutDeleteButton.innerText = 'Supprimer';
hideoutDeleteButton.id = 'hideoutDeleteButton';
hideoutDeleteButton.className = 'action-button delete_btn';
hideoutDeleteButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

// Append the button to the main hideout div
hideoutButton.appendChild(hideoutCreateButton);
hideoutButton.appendChild(hideoutModifyButton);
hideoutButton.appendChild(hideoutDeleteButton);

document.addEventListener('DOMContentLoaded', function () {
  const hideoutCreateButton = document.getElementById('hideoutCreateButton');
  const hideoutModifyButton = document.getElementById('hideoutModifyButton');
  const hideoutDeleteButton = document.getElementById('hideoutDeleteButton');

  // Add click event listeners for the Modify and Delete buttons
  hideoutCreateButton.addEventListener('click', handleCreate);
  hideoutModifyButton.addEventListener('click', handleModify);
  hideoutDeleteButton.addEventListener('click', handleDelete);
});

function handleCreate() {
  // Redirect to the hideout modify page or perform the necessary actions
  window.location.href = './hideoutsCreate.php';
}

function handleModify() {
  // Redirect to the hideout modify page or perform the necessary actions
  window.location.href = './hideoutsModify.php';
}

function handleDelete() {
  // Implement the delete functionality or perform the necessary actions
  window.location.href = './hideoutsDelete.php';
}

