fetch('./controller/contacts/read.php') // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    const contactForm = document.getElementById('contact-form');

    data.forEach(contact => {
      // Create a form for each contact
      const contact_form = document.createElement('form');
      contact_form.className = 'contactForm-input';

      // Create input fields for contact data
      const contactFirstName = document.createElement('input');
      contactFirstName.type = 'text';
      contactFirstName.value = 'Prénom : ' + ' ' + contact.contact_first_name;
      contactFirstName.className = 'titleInput';
      contactFirstName.readOnly = true;

      // Create input fields for contact data
      const contactLastName = document.createElement('input');
      contactLastName.type = 'text';
      contactLastName.value = 'Nom : ' + ' ' + contact.contact_last_name;
      contactLastName.className = 'titleInput';
      contactLastName.readOnly = true;

      // Create input fields for contact data
      const contactBirthDate = document.createElement('input');
      contactBirthDate.type = 'text';
      contactBirthDate.value = 'Date de Naissance : ' + ' ' + contact.contact_birth_date;
      contactBirthDate.className = 'titleInput';
      contactBirthDate.readOnly = true;

      // Create input fields for contact data
      const contactCodeNameInput = document.createElement('input');
      contactCodeNameInput.type = 'text';
      contactCodeNameInput.value = contact.contact_code_name;
      contactCodeNameInput.className = 'chip';
      contactCodeNameInput.readOnly = true;

      // Create input fields for contact data
      const contactNationality = document.createElement('input');
      contactNationality.type = 'text';
      contactNationality.value = 'Nationalité : ' + ' ' + contact.contact_nationality;
      contactNationality.className = 'titleInput';
      contactNationality.readOnly = true;

      // Append the elements to the form
      contact_form.appendChild(contactCodeNameInput);
      contact_form.appendChild(contactFirstName);
      contact_form.appendChild(contactLastName);
      contact_form.appendChild(contactBirthDate);
      contact_form.appendChild(contactNationality);
      /*       contact_form.appendChild(contactDetailsButton);
       */
      // Append the form to the main contact form
      contactForm.appendChild(contact_form);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

/* Insert the different buttons depending if Admin is connected or not */
const contactButton = document.getElementById('contact-button');

const contactCreateButton = document.createElement('button');
contactCreateButton.innerText = 'Créer';
contactCreateButton.id = 'contactCreateButton';
contactCreateButton.className = 'action-button create_btn';
contactCreateButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const contactModifyButton = document.createElement('button');
contactModifyButton.innerText = 'Modifier';
contactModifyButton.id = 'contactModifyButton';
contactModifyButton.className = 'action-button modify_btn';
contactModifyButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const contactDeleteButton = document.createElement('button');
contactDeleteButton.innerText = 'Supprimer';
contactDeleteButton.id = 'contactDeleteButton';
contactDeleteButton.className = 'action-button delete_btn';
contactDeleteButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

// Append the button to the main contact div
contactButton.appendChild(contactCreateButton);
contactButton.appendChild(contactModifyButton);
contactButton.appendChild(contactDeleteButton);

document.addEventListener('DOMContentLoaded', function () {
  const contactCreateButton = document.getElementById('contactCreateButton');
  const contactModifyButton = document.getElementById('contactModifyButton');
  const contactDeleteButton = document.getElementById('contactDeleteButton');

  // Add click event listeners for the Modify and Delete buttons
  contactCreateButton.addEventListener('click', handleCreate);
  contactModifyButton.addEventListener('click', handleModify);
  contactDeleteButton.addEventListener('click', handleDelete);
});

function handleCreate() {
  // Redirect to the contact modify page or perform the necessary actions
  window.location.href = './contactsCreate.php';
}

function handleModify() {
  // Redirect to the contact modify page or perform the necessary actions
  window.location.href = './contactsModify.php';
}

function handleDelete() {
  // Implement the delete functionality or perform the necessary actions
  window.location.href = './contactsDelete.php';
}

