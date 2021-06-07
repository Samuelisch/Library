const clearStorage = document.querySelector('.clear-storage');
const libraryGrid = document.querySelector('.library-grid')
const infoCell = document.querySelector('.info');
const icon = document.querySelector('.add-prompt');
const bookForm = document.querySelector('.adding-book-form');
const cancelBtn = document.querySelector('.fa-window-close');
const submitBtn = document.querySelector('.form-submit button');
let bookCells = document.querySelectorAll('.book');
let progressIcon = document.querySelectorAll('.progress')
let pagesReadText = document.querySelectorAll('.pages-read');

//selectors for book form
const bookTitle = document.getElementById('add-title');
const bookAuthor = document.getElementById('add-author');
const bookPages = document.getElementById('add-pages');
const bookPagesRead = document.getElementById('add-pages-read');
let arrows = document.querySelectorAll('.arrow');

//initialisation of flags
let iconDisplay = true; //icon is being displayed
let mousedownID = -1;

//localStorage.clear();
//initialisation of localStorage
//check if local storage available
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

//initialisation of objects for storage
let myLibrary = [];
if (localStorage.length) {
    let len = localStorage.length;
    for (let i = 0; i < len; i++) {
        myLibrary.push(JSON.parse(localStorage.getItem(i)));
    }
}
loadBooks();

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
    let newBook = new Book(bookTitle.value, bookAuthor.value, parseInt(bookPages.value), parseInt(bookPagesRead.value)) //display only the current book added
    myLibrary.push(newBook);
    displayBook(newBook);
    localStorage.setItem(localStorage.length, JSON.stringify(newBook));
    removeForm();
    bookCells = document.querySelectorAll('.book');
}

//check if localStorage has existing record, if yes, display items.
function loadBooks() {
    if (myLibrary) {
        myLibrary.forEach(book => displayBook(book));
    }
}

//function to display the book being added to the library obj, rather than the entire library.
function displayBook(book) {
    //create cell and assign classes
    const bookCell = document.createElement('div');
    //set data-set attribute to position in Library array.
    bookCell.className = "book cell";
    bookCell.dataset.num = myLibrary.indexOf(book);
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
    progress.dataset.num = myLibrary.indexOf(book);
    const icon = document.createElement('i');
    icon.className = "far fa-check-circle fa-7x"
    progress.append(icon);

    const pagesRead = document.createElement('span');
    pagesRead.className = "pages-read";
    pagesRead.dataset.num = myLibrary.indexOf(book);
    pagesRead.textContent = `${book.pagesRead} / ${book.pages}`;
    const pages = document.createElement('div');
    pages.className = "pages";
    const arrowLeft = document.createElement('i');
    arrowLeft.className = "fas fa-arrow-left fa-lg arrow"
    arrowLeft.dataset.num = myLibrary.indexOf(book);
    const arrowRight = document.createElement('i');
    arrowRight.className = "fas fa-arrow-right fa-lg arrow"
    arrowRight.dataset.num = myLibrary.indexOf(book);
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
    bookCells = document.querySelectorAll('.book');
    arrows = document.querySelectorAll('.arrow');
    progressIcon = document.querySelectorAll('.progress')
    pagesReadText = document.querySelectorAll('.pages-read');

    updateProgress(book, progress.dataset.num);
}

function updateProgress(book, dataNum) {
    progressIcon.forEach(icon => {
        if (icon.dataset.num == dataNum) {
            if (book.pagesRead == book.pages) {
                icon.style.color = 'rgb(17, 192, 17)';
            } else {
                icon.style.color = 'rgba(189, 186, 186, 0.39)';
            }
        }
    });
}

function changePagesRead(e) {
    let dataNum = e.target.dataset.num;
    if (e.target.classList.contains('fa-arrow-left')) {
        let book = myLibrary[dataNum];
        if (book.pagesRead <= 0) return; // return if under limit
        book.pagesRead -= 1;
        updateBook(book, dataNum);
        updateProgress(book, dataNum);
        console.log(book.pagesRead);
    }

    if (e.target.classList.contains('fa-arrow-right')) {
        let book = myLibrary[dataNum];
        if (book.pagesRead >= book.pages) return; //return if over limit
        book.pagesRead += 1;
        updateBook(book, dataNum);
        updateProgress(book, dataNum);
        console.log(book.pagesRead);
    }
}

function updateBook(book, dataNum) {
    localStorage.setItem(dataNum, JSON.stringify(myLibrary[dataNum]));
        let allPagesRead = document.querySelectorAll('.pages-read');
        allPagesRead.forEach(cell => {
            if (cell.dataset.num == dataNum) {
                cell.textContent = `${book.pagesRead} / ${book.pages}`;
            }
        })
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
    let dataNum = e.currentTarget.dataset.num;
    //remove book from display and library
    if (e.target.classList.contains('fa-trash-alt')) {
        updateKey(dataNum);
        e.currentTarget.remove();
        console.log(myLibrary);
        console.log(localStorage);
    }
}

//update value of data-num and localStorage key, then removes the element to be deleted
function updateKey(dataNum) {
    myLibrary.splice(dataNum, 1);
    localStorage.clear();
    myLibrary.forEach(book => {
        localStorage.setItem(myLibrary.indexOf(book), JSON.stringify(book));
    });
    bookCells.forEach(cell => {
        cell.dataset.num = parseInt(cell.dataset.num) -1;
    });
}

function clearCache() {
    localStorage.clear();
    for (let book in myLibrary) {
        delete myLibrary[book];
    }
    bookCells.forEach(cell => cell.remove());
    console.log(myLibrary);
    console.log(localStorage);
}

clearStorage.addEventListener('click', clearCache);
infoCell.addEventListener('click', displayForm);
cancelBtn.addEventListener('click', e => {
    e.stopPropagation(); //stops event bubbling back to the cell
    removeForm();
});
submitBtn.addEventListener('click', e => {
    e.stopPropagation();
    addBookToLibrary();
});
arrows.forEach(arrow => {
    arrow.addEventListener('click', changePagesRead);
})
bookCells.forEach(cell => cell.addEventListener('click', cellWindowClick));