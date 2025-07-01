let notes = [];
let editingNoteId = null;

function loadNotes() {
  const existingNotes = localStorage.getItem("quickNotes");
  return existingNotes ? JSON.parse(existingNotes) : [];
}

function takeNote(event) {
  // prevent page from refresh when clicking submit button
  event.preventDefault();

  // trim any white space
  const title = document.getElementById("noteTitle").value.trim();
  const content = document.getElementById("noteContent").value.trim();
  if (editingNoteId) {
    // Exist, so edit note
    // pull index to find the right content and update
    const noteIndex = notes.findIndex((note) => note.id === editingNoteId);
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title,
      content: content,
    };
  } else {
    // Not exist
    // add any new notes to beginning of the array
    notes.unshift({
      id: generateId(),
      title: title,
      content: content,
    });
  }
  closeNoteDialog();
  saveNotesToLocal();
  renderNotesGrid();
}

function generateId() {
  return Date.now().toString();
}

function saveNotesToLocal() {
  localStorage.setItem("quickNotes", JSON.stringify(notes));
}

function deleteNote(noteId) {
  // delete the only out that is matching the noteId out of the note
  notes = notes.filter((note) => note.id != noteId);
  saveNotesToLocal();
  renderNotesGrid();
}

function renderNotesGrid() {
  const notesContainer = document.getElementById("notesContainer");

  if (notes.length === 0) {
    // show fall back elements
    notesContainer.innerHTML = `
    <div class="empty-state">
    <h2>No notes yet</h2>
    <p>Create your first note to get started!</p>
    <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
    </div>
    `;

    return;
  }

  notesContainer.innerHTML = notes
    .map(
      (notes) => `
    <div class="note-card">
    <h3 class="note-title">${notes.title}</h3>
    <p class="note-content">${notes.content}</p>
    <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${notes.id}')" title="Edit Note">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23"><path d="M184-184v-83.77l497.23-498.77q5.15-5.48 11.07-7.47 5.93-1.99 11.99-1.99 6.06 0 11.62 1.54 5.55 1.54 11.94 7.15l38.69 37.93q5.61 6.38 7.54 12 1.92 5.63 1.92 12.25 0 6.13-2.24 12.06-2.24 5.92-7.22 11.07L267.77-184H184Zm505.15-466.46L744-704.54 704.54-744l-54.08 54.85 38.69 38.69Z"/>
            </svg>
        </button>

        <button class="delete-btn" onclick="deleteNote('${notes.id}')" title="Delete Note">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23"><path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/>
            </svg>
        </button>
    </div>
    </div>
    `
    )
    .join("");
}

function openNoteDialog(noteId = null) {
  const dialog = document.getElementById("noteDialog");
  const titleInput = document.getElementById("noteTitle");
  const contentInput = document.getElementById("noteContent");

  // edit mode
  if (noteId) {
    // pull it out for display
    const noteToEdit = notes.find((note) => note.id === noteId);
    editingNoteId = noteId;
    document.getElementById("dialogTitle").textContent = "Edit Note";
    titleInput.value = noteToEdit.title;
    contentInput.value = noteToEdit.content;
  } else {
    // Add Note mode
    editingNoteId = null;
    document.getElementById("dialogTitle").textContent = "Add New Note";
    titleInput.value = "";
    contentInput.value = "";
  }

  dialog.showModal();
  titleInput.focus();
}

function closeNoteDialog() {
  document.getElementById("noteDialog").close();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.getElementById("themeToggleBtn").textContent = isDark ? "☀️" : "🌙";
}

function appStoredTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    document.getElementById("themeToggleBtn").textContent = "☀️";
  }
}

// Main
document.addEventListener("DOMContentLoaded", function () {
  // Apply stored theme
  appStoredTheme();
  notes = loadNotes();
  renderNotesGrid();

  // submit form action
  document.getElementById("noteForm").addEventListener("submit", takeNote);
  document
    .getElementById("themeToggleBtn")
    .addEventListener("click", toggleTheme);
  document
    .getElementById("noteDialog")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        closeNoteDialog();
      }
    });
});
