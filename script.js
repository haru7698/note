const $ = document;
const addBox = $.querySelector(".add-box"),
  popupBox = $.querySelector(".popup-box"),
  popupTitle = $.querySelector("header p"),
  popupClose = $.querySelector("header i"),
  inputElem = $.querySelector("input"),
  textareaElem = $.querySelector("textarea"),
  popupBtn = $.querySelector("button"),
  wrapper = $.querySelector(".wrapper");

let isUpdate = false;
let updateID = null;
let notes = [];

addBox.addEventListener("click", showModal);

popupBtn.addEventListener("click", () => {
  if (isUpdate) {
    let all = getLocalStorageNotes();
    all.some((note, index) => {
      if (index === updateID) {
        note.title = inputElem.value;
        note.des = textareaElem.value;
      }
    });
    setNotes(all);
    generateNotes(all);
    closeModal();
    clearainputs();
    isUpdate = false;
  } else {
    let newNote = {
      title: inputElem.value,
      des: textareaElem.value,
      date: getNowDate(),
    };
    notes.push(newNote);
    setNotes(notes);
    closeModal();
    generateNotes(notes);
    clearainputs();
  }
});

popupClose.addEventListener("click", () => {
  closeModal();
});
function getNowDate() {
  let now = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "",
  ];
  let today = now.getDay();
  let nowMonth = now.getMonth();
  let nowYear = now.getFullYear();
  let dayOfMonth = now.getDate();
  return `${months[nowMonth]} ${dayOfMonth},${nowYear} (${day[today]})`;
}
function clearainputs() {
  inputElem.value = "";
  textareaElem.value = "";
}
function showModal(noteTitle, noteDes) {
  if (isUpdate) {
    popupTitle.innerHTML = "Update Note";
    popupBtn.innerHTML = "Update Note";
    inputElem.value = noteTitle;
    textareaElem.value = noteDes;
  } else {
    popupTitle.innerHTML = "Add a New Note";
    popupBtn.innerHTML = "Add Note";
  }
  inputElem.focus();
  popupBox.classList.add("show");
}
function closeModal() {
  popupBox.classList.remove("show");
}

function generateNotes(notes) {
  $.querySelectorAll(`.note`).forEach((note) => note.remove());
  notes.forEach((note, index) => {
    wrapper.insertAdjacentHTML(
      "beforeend",
      `<li class="note">
    <div class="details">
      <p>${note.title}</p>
      <span>${note.des}</span>
    </div>
    <div class="bottom-content">
      <span>${note.date}</span>
      <div class="settings">
        <i class="uil uil-ellipsis-h" onclick="showSetting(this)"></i>
        <ul class="menu">
          <li onclick="editNote(${index},'${note.title}','${note.des}')"><i class="uil uil-pen"></i>Edit</li>
          <li onclick="removeNote(${index})"><i class="uil uil-trash"></i>Delete</li>
        </ul>
      </div>
    </div>
  </li>`
    );
  });
}
function removeNote(noteIndex) {
  let confirmDelete = confirm("Delete?");
  if (confirmDelete) {
    let rmLocalNotes = getLocalStorageNotes();
    rmLocalNotes.splice(noteIndex, 1);
    setNotes(rmLocalNotes);
    generateNotes(rmLocalNotes);
  }
}

function editNote(noteId, noteTitle, noteDes) {
  // console.log(noteId, noteTitle, noteDes);
  isUpdate = true;
  showModal(noteTitle, noteDes);
  updateID = noteId;
}

function showSetting(el) {
  el.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target != el) {
      el.parentElement.classList.remove("show");
    }
  });
}
function getLocalStorageNotes() {
  let localStorageNotes = localStorage.getItem("notes");
  if (localStorageNotes) {
    notes = JSON.parse(localStorageNotes);
  } else {
    notes = [];
  }
  return notes;
}

function setNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

window.addEventListener("load", () => {
  let notes = getLocalStorageNotes();
  generateNotes(notes);
});
window.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
