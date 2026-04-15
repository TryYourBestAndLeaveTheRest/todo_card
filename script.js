const dueDate = new Date("2026-04-16T15:00:00.000Z");

const card = document.querySelector('[data-testid="test-todo-card"]');
const title = document.querySelector('[data-testid="test-todo-title"]');
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
const toggle = document.querySelector('[data-testid="test-todo-complete-toggle"]');
const editButton = document.querySelector('[data-testid="test-todo-edit-button"]');
const deleteButton = document.querySelector('[data-testid="test-todo-delete-button"]');

function formatTimeRemaining(targetDate) {
  const diffMs = targetDate.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

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
  timeRemaining.textContent = formatTimeRemaining(dueDate);
}

function syncCompletedState() {
  const completed = toggle.checked;
  card.classList.toggle("is-done", completed);
  statusBadge.textContent = completed ? "Done" : "Pending";
  statusBadge.setAttribute("aria-label", `Task status ${statusBadge.textContent}`);
  title.setAttribute("aria-label", completed ? "Completed task title" : "Pending task title");
}

toggle.addEventListener("change", syncCompletedState);

editButton.addEventListener("click", () => {
  console.log("edit clicked");
});

deleteButton.addEventListener("click", () => {
  alert("Delete clicked");
});

syncCompletedState();
updateTimeRemaining();
setInterval(updateTimeRemaining, 30 * 1000);
