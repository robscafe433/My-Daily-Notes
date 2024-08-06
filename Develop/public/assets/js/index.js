let noteForm;
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
    noteForm = document.querySelector('.note-form');
    noteTitle = document.querySelector('.note-title'); // .note-title is notes.html-class name. - binding
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    clearBtn = document.querySelector('.clear-btn');
    noteList = document.querySelectorAll('.list-container .list-group'); //Note: on "Specific targeting"
    //This targets only .list-group elements that are descendants of .list-container elements. That is
    // why both classes are included.
}

// Show an element
const show = (elem) => {
    elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
    elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// fetch call similar to requests made on thunderClient . Here it is a GET -route reqeust.
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });

const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const renderActiveNote = () => {
    hide(saveNoteBtn); // saveNoteBtn is a binding to notes.html first button element. Changes ->  elem.style.display = 'none';
    hide(clearBtn);

    if (activeNote.id) {
        show(newNoteBtn);
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
    } else {
        hide(newNoteBtn);
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

const handleNoteSave = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };
    saveNote(newNote).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete the clicked note
const handleNoteDelete = (e) => {
    // Prevents the click listener for the list from being called when the
    // button inside of it is clicked
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
        activeNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Sets the activeNote and displays it   // Note: this previously being called from the
// dynamically-created -> span-element.
const handleNoteView = (e) => {
    e.preventDefault();
    //Note: activeNote was previously created as an empty object { } .
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    // So activeNote which is an empty object {  } stores data-note,  see console.log.
    console.log(
        'From handleNoteView function , takes in e and targets parentElement from e .getAttribute -> data-note . Also here is data-note',
        activeNote
    );
    renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
    activeNote = {};
    show(clearBtn); //clearBtn is the binding to html element (above).
    renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
    show(clearBtn);
    if (!noteTitle.value.trim() && !noteText.value.trim()) {
        hide(clearBtn);
    } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();

    if (window.location.pathname === '/notes') {
        // resets innerHTML to ' ' nothing. -> prevents duplicates if adding in future.
        //So will erase and
        // alert('stop - beore deleltion of notelist');
        noteList.forEach((el) => (el.innerHTML = '')); // noteList is binding for UL element
        // alert('after deletion of notelist');
    }

    let noteListItems = [];

    // Returns HTML element with or without a delete button
    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li'); // Dynamically creates a "list item",
        //This element is not yet added to the DOM; it is simply created in memory and
        //can be manipulated or appended to the DOM later.

        //So ul was hard coded in notes.html *And above dynamically creates the li items.

        liEl.classList.add('list-group-item'); // "classList.add" allows for a class
        // "list-group-item" to be dynamically created and added to the element at runtime.

        const spanEl = document.createElement('span');
        spanEl.classList.add('list-item-title');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView); // Note: eventListener is attached to the spanEl,
        // handleNoteView will target the parent element to get data-note (line 210 .)

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note'
            );
            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl; // returns the dynamically created <li> and appends.
    }; // returns dynamically created variables liEl and appends.
    // Note: createLi is like a function, has a function declaraiont assigned to it.

    //

    //

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        // So this forEach pushes the dynamically created elements
        // along with data in respective slots (span.innerHTML through createLi call and
        // also sets note-data as an attribute of li element) and pushes each one to the array
        // noteListItems. And that is all.

        console.log('Here is individual note', note);
        const li = createLi(note.title); // createLi function dynamically creates
        // the li element, and stores this in const liEl.
        // the purpose of this function-call is to send->add innerHTML to the span and save
        // the dyncamically created liEl/appends to this newly created const called li.

        li.dataset.note = JSON.stringify(note); // this creates the data-note attribute on the
        // li variable. *Notice that they have to be JSON strings.

        noteListItems.push(li); // noteListItems initially is an empty [ ] array.
    });

    console.log('Here is the compilation of noteListItems: ', noteListItems);

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note)); // noteList is
        // binding for ul in , in this case for notes.html // noteList[0] is part of the
        //node list. example: there could be more than one "'.list-container .list-group'"
        // this displays the dynamically created elements inside the ul element.
    }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/api/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();
