const dueDate = new Date("2026-04-16T15:00:00.000Z");

const card = document.querySelector('[data-testid="test-todo-card"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const description = document.querySelector('[data-testid="test-todo-description"]');
const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const toggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');
const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
const collapsibleSection = document.querySelector('[data-testid="test-todo-collapsible-section"]');
const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');

const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
const editDescriptionInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
const saveButton = document.querySelector('[data-testid="test-todo-save-button"]');
const cancelButton = document.querySelector('[data-testid="test-todo-cancel-button"]');

let isEditing = false;

function formatTimeRemaining(targetDate) {
  const diffMs = targetDate.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < 0) {
    overdueIndicator.style.display = 'inline';
  } else {
    overdueIndicator.style.display = 'none';
  }

  if (absMs < minute) {
    return "Due now!";
  }

  if (diffMs > 0) {
    if (absMs < day) {
      const hours = Math.round(absMs / hour);
      return hours <= 1 ? "Due in 1 hour" : `Due in ${hours} hours`;
    }

    const days = Math.round(absMs / day);
    if (days === 1) {
      return "Due tomorrow";
    }

    return `Due in ${days} days`;
  }

  if (absMs < day) {
    const hours = Math.round(absMs / hour);
    return hours <= 1 ? "Overdue by 1 hour" : `Overdue by ${hours} hours`;
  }

  const days = Math.round(absMs / day);
  return days <= 1 ? "Overdue by 1 day" : `Overdue by ${days} days`;
}

function updateTimeRemaining() {
  if (statusControl.value !== 'Done') {
    timeRemaining.textContent = formatTimeRemaining(dueDate);
  } else {
    timeRemaining.textContent = 'Completed';
  }
}

function syncCompletedState() {
  const completed = toggle.checked;
  card.classList.toggle("is-done", completed);
  statusControl.value = completed ? "Done" : "Pending";
  title.setAttribute("aria-label", completed ? "Completed task title" : "Pending task title");
  updateTimeRemaining();
}

function handleStatusChange() {
  const isDone = statusControl.value === 'Done';
  toggle.checked = isDone;
  card.classList.toggle("is-done", isDone);
  updateTimeRemaining();
}

function handlePriorityChange() {
    const priority = editPrioritySelect.value;
    priorityIndicator.className = `priority-indicator priority-indicator--${priority.toLowerCase()}`;
}

function toggleEditMode() {
  isEditing = !isEditing;
  editForm.style.display = isEditing ? 'grid' : 'none';
  
  if (isEditing) {
    editTitleInput.value = title.textContent;
    editDescriptionInput.value = description.textContent;
    editPrioritySelect.value = document.querySelector('[data-testid="test-todo-priority"]').textContent;
    editDueDateInput.value = new Date(dueDate.getTime() - (dueDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  }
}

function saveChanges() {
  title.textContent = editTitleInput.value;
  description.textContent = editDescriptionInput.value;
  document.querySelector('[data-testid="test-todo-priority"]').textContent = editPrioritySelect.value;
  
  const newDueDate = new Date(editDueDateInput.value);
  dueDate.setTime(newDueDate.getTime());
  document.querySelector('[data-testid="test-todo-due-date"]').textContent = `Due ${newDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  handlePriorityChange();
  toggleEditMode();
  updateTimeRemaining();
}

function toggleDescription() {
    const isExpanded = collapsibleSection.classList.toggle('expanded');
    expandToggle.textContent = isExpanded ? 'Collapse' : 'Expand';
    expandToggle.setAttribute('aria-expanded', isExpanded);
}

toggle.addEventListener("change", syncCompletedState);
statusControl.addEventListener('change', handleStatusChange);
editButton.addEventListener("click", toggleEditMode);
saveButton.addEventListener("click", saveChanges);
cancelButton.addEventListener("click", toggleEditMode);
expandToggle.addEventListener('click', toggleDescription);
deleteButton.addEventListener("click", () => {
  alert("Delete clicked");
});

syncCompletedState();
updateTimeRemaining();
setInterval(updateTimeRemaining, 30 * 1000);
handlePriorityChange();
