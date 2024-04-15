// JavaScript

const projectsContainer = document.getElementById('projects');
const addProjectForm = document.getElementById('addProjectForm');
const addTaskForm = document.getElementById('addTaskForm');
const searchTaskForm = document.getElementById('searchTaskForm');
const searchResultsContainer = document.getElementById('searchResults');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

let projects = [];

addProjectForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const projectName = document.getElementById('projectName').value;
  const projectDescription = document.getElementById('projectDescription').value;

  if (!projectName) {
    alert('Por favor ingresa el nombre del proyecto.');
    return;
  }

  if (projects.some(project => project.name === projectName)) {
    alert('Ya existe un proyecto con ese nombre.');
    return;
  }

  const project = {
    id: generateId(),
    name: projectName,
    description: projectDescription,
    tasks: []
  };

  projects.push(project);
  renderProjects();
  addProjectForm.reset();
});
function renderProjects() {
  projectsContainer.innerHTML = '';
  projects.forEach(project => {
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project');
    projectDiv.setAttribute('data-project-id', project.id);
    projectDiv.innerHTML = `
      <h3>${project.name}</h3>
      ${project.description ? `<p>${project.description}</p>` : ''}
      <div class="buttons">
        <button class="button" onclick="showAddTaskForm('${project.id}')">Agregar Tarea</button>
        <button class="button" onclick="showTasks('${project.id}')">Mostrar Tareas</button>
      </div>
    `;
    projectsContainer.appendChild(projectDiv);
  });
}
function showTasks(projectId) {
  const project = projects.find(project => project.id === projectId);
  if (!project) return;

  const projectDiv = projectsContainer.querySelector(`[data-project-id="${projectId}"]`);

  // Elimina cualquier lista de tareas anterior
  const existingTaskList = projectDiv.querySelector('.task-list');
  if (existingTaskList) {
      projectDiv.removeChild(existingTaskList);
  }

  // Elimina el botón "Volver" si ya existe
  const existingBackButton = projectDiv.querySelector('.back-btn');
  if (existingBackButton) {
      projectDiv.removeChild(existingBackButton);
  }

  const taskList = document.createElement('ul');
  taskList.classList.add('task-list');
  project.tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.textContent = `${task.description} - ${task.completed ? 'Completada' : 'Pendiente'} - ${task.dueDate ? task.dueDate : 'Sin fecha de vencimiento'}`;
      taskList.appendChild(listItem);

      const completeButton = document.createElement('button');
      completeButton.textContent = task.completed ? 'Marcar como Pendiente' : 'Marcar como Completada';
      completeButton.onclick = function() {
          toggleTaskCompletion(projectId, task.id);
      };
      listItem.appendChild(completeButton);
  });

  const backButton = document.createElement('button');
  backButton.textContent = 'Volver';
  backButton.classList.add('back-btn'); // Add a class to identify the back button
  backButton.onclick = function() {
      projectDiv.removeChild(taskList);
      projectDiv.removeChild(backButton);
  };

  projectDiv.appendChild(taskList);
  projectDiv.appendChild(backButton);
}

function showAddTaskForm(projectId) {
  const project = projects.find(project => project.id === projectId);
  if (!project) return;

  modal.style.display = 'block';

  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  addTaskForm.onsubmit = function(event) {
    event.preventDefault();

    const taskDescription = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('dueDate').value;

    const task = {
      id: generateId(),
      description: taskDescription,
      completed: false,
      dueDate: dueDate || null
    };

    project.tasks.push(task);
    renderProjects();
    addTaskForm.reset();
    modal.style.display = 'none';
  };
}
function toggleTaskCompletion(projectId, taskId) {
  const project = projects.find(project => project.id === projectId);
  if (!project) return;

  const task = project.tasks.find(task => task.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  renderProjects();
}
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}
function searchTasksByDueDate(projectId, dueDate) {
  const project = projects.find(project => project.id === projectId);
  if (!project) return [];

  const filteredTasks = project.tasks.filter(task => task.dueDate === dueDate);
  return filteredTasks;
}
function displaySearchResults(tasks) {
  searchResultsContainer.innerHTML = '';

  if (tasks.length === 0) {
      searchResultsContainer.innerHTML = '<p>No se encontraron tareas para la fecha especificada.</p>';
  } else {
      const taskList = document.createElement('ul');
      taskList.classList.add('task-list');
      tasks.forEach(task => {
          const listItem = document.createElement('li');
          listItem.textContent = `${task.description} - ${task.completed ? 'Completada' : 'Pendiente'} - ${task.dueDate ? task.dueDate : 'Sin fecha de vencimiento'}`;
          taskList.appendChild(listItem);
      });
      searchResultsContainer.appendChild(taskList);
  }
}

searchTaskForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const searchDueDate = document.getElementById('searchDueDate').value;

  if (!searchDueDate) {
    alert('Por favor ingresa una fecha de vencimiento para buscar tareas.');
    return;
  }

  const results = searchTasksByDueDate(searchDueDate);
  displaySearchResults(results);
});

function searchTasksByDueDate(dueDate) {
  console.log("Fecha de búsqueda:", dueDate);
  const tasks = [];
  projects.forEach(project => {
    project.tasks.forEach(task => {
      console.log("Fecha de vencimiento de la tarea:", task.dueDate);
      if (task.dueDate === dueDate) {
        tasks.push({
          project: project.name,
          description: task.description,
          completed: task.completed,
          dueDate: task.dueDate || 'Sin fecha de vencimiento'
        });
      }
    });
  });
  return tasks;
}


function displaySearchResults(tasks) {
  searchResultsContainer.innerHTML = '';

  if (tasks.length === 0) {
    searchResultsContainer.innerHTML = '<p>No se encontraron tareas para la fecha especificada.</p>';
  } else {
    const taskList = document.createElement('ul');
    taskList.classList.add('task-list');
    tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.textContent = `Proyecto: ${task.project}, Descripción: ${task.description}, Estado: ${task.completed ? 'Completada' : 'Pendiente'}, Fecha de vencimiento: ${task.dueDate}`;
      taskList.appendChild(listItem);
    });
    searchResultsContainer.appendChild(taskList);
  }
}

