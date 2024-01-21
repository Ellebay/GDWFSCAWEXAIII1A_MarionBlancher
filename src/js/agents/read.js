fetch('../api/agents/read.php') // Adjust the URL as needed
  .then(response => response.json())
  .then(data => {
    const agentForm = document.getElementById('agent-form');

    data.forEach(agent => {
      // Create a form for each agent
      const agent_form = document.createElement('form');
      agent_form.className = 'agentForm-input';

      // Create input fields for agent data
      const agentFirstName = document.createElement('input');
      agentFirstName.type = 'text';
      agentFirstName.value = 'Prénom : ' + ' ' + agent.agent_first_name;
      agentFirstName.className = 'titleInput';
      agentFirstName.readOnly = true;

      // Create input fields for agent data
      const agentLastName = document.createElement('input');
      agentLastName.type = 'text';
      agentLastName.value = 'Nom : ' + ' ' + agent.agent_last_name;
      agentLastName.className = 'titleInput style:text-start';
      agentLastName.readOnly = true;

      // Create input fields for agent data
      const agentBirthDate = document.createElement('input');
      agentBirthDate.type = 'text';
      agentBirthDate.value = 'Date de Naissance : ' + ' ' + agent.agent_birth_date;
      agentBirthDate.className = 'titleInput';
      agentBirthDate.readOnly = true;

      // Create input fields for agent data
      const agentCodeNameInput = document.createElement('input');
      agentCodeNameInput.type = 'text';
      agentCodeNameInput.value = agent.agent_code_name;
      agentCodeNameInput.className = 'chip';
      agentCodeNameInput.readOnly = true;

      // Create input fields for agent data
      const agentNationality = document.createElement('input');
      agentNationality.type = 'text';
      agentNationality.value = 'Nationalité : ' + ' ' + agent.agent_nationality;
      agentNationality.className = 'titleInput';
      agentNationality.readOnly = true;

      // Append the elements to the form
      agent_form.appendChild(agentCodeNameInput);
      agent_form.appendChild(agentFirstName);
      agent_form.appendChild(agentLastName);
      agent_form.appendChild(agentBirthDate);
      agent_form.appendChild(agentNationality);
      /*       agent_form.appendChild(agentDetailsButton);
       */
      // Append the form to the main agent form
      agentForm.appendChild(agent_form);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

/* Insert the different buttons depending if Admin is connected or not */
const agentButton = document.getElementById('agent-button');

const agentCreateButton = document.createElement('button');
agentCreateButton.innerText = 'Créer';
agentCreateButton.id = 'agentCreateButton';
agentCreateButton.className = 'action-button create_btn';
agentCreateButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const agentModifyButton = document.createElement('button');
agentModifyButton.innerText = 'Modifier';
agentModifyButton.id = 'agentModifyButton';
agentModifyButton.className = 'action-button modify_btn';
agentModifyButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

const agentDeleteButton = document.createElement('button');
agentDeleteButton.innerText = 'Supprimer';
agentDeleteButton.id = 'agentDeleteButton';
agentDeleteButton.className = 'action-button delete_btn';
agentDeleteButton.style.display = adminIsConnected ? 'inline' : 'none'; // Check if admin is connected

// Append the button to the main agent div
agentButton.appendChild(agentCreateButton);
agentButton.appendChild(agentModifyButton);
agentButton.appendChild(agentDeleteButton);

document.addEventListener('DOMContentLoaded', function () {
  const agentCreateButton = document.getElementById('agentCreateButton');
  const agentModifyButton = document.getElementById('agentModifyButton');
  const agentDeleteButton = document.getElementById('agentDeleteButton');

  // Add click event listeners for the Modify and Delete buttons
  agentCreateButton.addEventListener('click', handleCreate);
  agentModifyButton.addEventListener('click', handleModify);
  agentDeleteButton.addEventListener('click', handleDelete);
});

function handleCreate() {
  // Redirect to the agent modify page or perform the necessary actions
  window.location.href = './agentsCreate.php';
}

function handleModify() {
  // Redirect to the agent modify page or perform the necessary actions
  window.location.href = './agentsModify.php';
}

function handleDelete() {
  // Implement the delete functionality or perform the necessary actions
  window.location.href = './agentsDelete.php';
}

