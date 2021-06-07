const libraryGrid = document.querySelector('.library-grid')
const infoCell = document.querySelector('.info');
const icon = document.querySelector('.add-prompt');
const bookForm = document.querySelector('.adding-book-form');
const cancelBtn = document.querySelector('.fa-window-close');
const submitBtn = document.querySelector('.form-submit button');
const bookCells = document.querySelectorAll('.book');

//selectors for book form
const bookTitle = document.getElementById('add-title');
const bookAuthor = document.getElementById('add-author');
const bookPages = document.getElementById('add-pages');
const bookPagesRead = document.getElementById('add-pages-read');

//initialisation of flags
let iconDisplay = true; //icon is being displayed

//initialisation of objects for storage
let myLibrary = [];

class Book {
    constructor(title, author, pages, pagesRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.pagesRead = pagesRead;
    }
}

//event listener for adding book to library array
function addBookToLibrary() {
    // check for inconsistencies in from values
    if (formEmpty()) {
        alert('Please properly state all details of the book.');
        bookForm.reset();
        return;
    }
    if (invalidTotalPages(bookPages.value) || invalidPagesRead(bookPagesRead.value)) {
        alert('Enter a proper number of pages');
        bookForm.reset();
        return;
    }
    if (!bookPagesRead.value) {
        bookPagesRead.value = 0;
    }
    let newBook = new Book(bookTitle.value, bookAuthor.value, parseInt(bookPages.value), parseInt(bookPagesRead.value))
    displayBook(newBook); //display only the current book added
    myLibrary.push(newBook);
    removeForm();
}

//function to display entire library upon reload.
//function displayLibrary() {}

//function to display the book being added to the library obj, rather than the entire library.
function displayBook(book) {
    //create cell and assign classes
    const bookCell = document.createElement('div');
    //set data-set attribute to position in Library array.
    bookCell.className = "book cell";
    bookCell.dataset.num = myLibrary.length;
    //create cell elements
    //delete button
    const btnContainer = document.createElement('div');
    btnContainer.className = "del-btn-container"
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button'
    const deleteIcon = document.createElement('i');
    deleteIcon.className = "fas fa-trash-alt fa-lg";
    btnContainer.appendChild(deleteIcon)

    const title = document.createElement('div');
    title.className = "title";
    title.textContent = limitChar(book.title);

    const author = document.createElement('div');
    author.className = "author";
    author.textContent = `by ${limitChar(book.author)}`;

    const progress = document.createElement('div');
    progress.className = "progress";
    const icon = document.createElement('i');
    icon.className = "far fa-check-circle fa-7x"
    progress.append(icon);

    const pagesRead = document.createElement('span');
    pagesRead.className = "pages-read";
    pagesRead.textContent = `${book.pagesRead} / ${book.pages}`;
    const pages = document.createElement('div');
    pages.className = "pages";
    const arrowLeft = document.createElement('i');
    arrowLeft.className = "fas fa-arrow-left fa-lg"
    const arrowRight = document.createElement('i');
    arrowRight.className = "fas fa-arrow-right fa-lg"
    pages.appendChild(arrowLeft);
    pages.appendChild(pagesRead);
    pages.appendChild(arrowRight);

    //append elements
    bookCell.appendChild(btnContainer);
    bookCell.appendChild(title);
    bookCell.appendChild(author);
    bookCell.appendChild(progress);
    bookCell.appendChild(pages);
    libraryGrid.appendChild(bookCell);

    //create eventListener for bookCell
    bookCell.addEventListener('click', cellWindowClick);
}

//function to check if all form values are filled
function formEmpty() {
    const text = Array.from(document.querySelectorAll('.form-text'));
    return text.some(input => input.value == "");
}

function invalidTotalPages(num) {
    return parseFloat(num) < 1;
}

function invalidPagesRead(num) {
    return parseInt(num) < 0 || parseFloat(num) > parseFloat(bookPages.value)
}

function limitChar(text) {
    let textArr = [...text.split('')];
    if (textArr.length > 18) {
        return `${textArr.splice(0, 18).join('')}..`;
    }
    return text;
}

//click event to show add-book form, and toggle off icon.
function displayForm() {
    if (!iconDisplay) return; //return if form is in display
    iconDisplay = false;
    icon.style.display = 'none';
    bookForm.style.display = 'flex';
}

function removeForm() {
    bookForm.reset();
    bookForm.style.display = 'none';
    iconDisplay = true;
    icon.style.display = 'flex';
}

//event handler for clicks within each book-cell window
function cellWindowClick(e) {
    //remove book from display and library
    if (e.target.classList.contains('fa-trash-alt')) {
        const dataNum = e.currentTarget.dataset.num;
        myLibrary.splice(dataNum, 1);
        e.currentTarget.remove();
    }

    if (e.target.classList.contains('fa-arrow-left')) {
        //update data-num to position in array?
    }
}

infoCell.addEventListener('click', displayForm);
cancelBtn.addEventListener('click', e => {
    e.stopPropagation(); //stops event bubbling back to the cell
    removeForm();
});
submitBtn.addEventListener('click', e => {
    e.stopPropagation();
    addBookToLibrary();
});