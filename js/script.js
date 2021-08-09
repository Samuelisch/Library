let bookCells = document.querySelectorAll('.book');
let arrows = document.querySelectorAll('.arrow');
let progressIcon = document.querySelectorAll('.progress');
let pagesReadText = document.querySelectorAll('.pages-read');
const libraryGrid = document.querySelector('.library-grid')

//selectors for book form
const bookTitle = document.getElementById('add-title');
const bookAuthor = document.getElementById('add-author');
const bookPages = document.getElementById('add-pages');
const bookPagesRead = document.getElementById('add-pages-read');

const infoCell = document.querySelector('.info'); //first cell in page - to initiate form
const icon = document.querySelector('.add-prompt');
const bookForm = document.querySelector('.adding-book-form');
const cancelBtn = document.querySelector('.fa-window-close');
const submitBtn = document.querySelector('.form-submit button');
let formDisplay = false;
const clearStorage = document.querySelector('.clear-storage');

const storage = (() => {
    //checks if local storage available
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

    function clearCache() {
        localStorage.clear();
        for (let book in library.myLibrary) {
            delete library.myLibrary[book];
        }
        bookCells.forEach(cell => cell.remove());
        console.log(localStorage);
    }

    //get and set are already initialised

    clearStorage.addEventListener('click', clearCache);

    return {
        clearCache,
        storageAvailable
    };
})();

const form = (() => {
    function toggleForm() { //private metod example
        icon.classList.toggle('no-display');
        bookForm.classList.toggle('no-display');
        formDisplay = !formDisplay
    }

    function displayForm() {
        if (formDisplay) return;
        toggleForm();
    };

    function removeForm() {
        bookForm.reset();
        toggleForm();
    };

    function empty() {
        const text = Array.from(document.querySelectorAll('.form-text'));
        return text.some(input => input.value == "");
    };

    function invalidTotalPages(num) {
        return num < 1;
    };

    function invalidPagesRead(num) {
        return parseInt(num) < 0 || parseFloat(num) > parseFloat(bookPages.value)
    };

    function submitEvent(e) {
        e.stopPropagation(); //stops page from refreshing

        if (empty()) {
            alert('Please properly state all details of the book.');
            bookForm.reset();
            return;
        }
        if (invalidTotalPages(parseFloat(bookPages.value)) || invalidPagesRead(parseFloat(bookPagesRead.value))) {
            alert('Enter a proper number of pages');
            bookForm.reset();
            return;
        }
        if (!bookPagesRead.value) {
            bookPagesRead.value = 0;
        }

        library.addBook();
        removeForm();
    };

    infoCell.addEventListener('click', displayForm); //displays form upon click on infoCell
    cancelBtn.addEventListener('click', e => {
        e.stopPropagation(); //stops event bubbling back to the cell
        removeForm();
    });
    submitBtn.addEventListener('click', submitEvent);

    return {
    };
})();

const library = (() => {
    let myLibrary = []; //initialise array for library

    const checkStorage = (() => {
        if (localStorage.getItem('0')) {
            let len = localStorage.length;
            for (let i = 0; i < len; i++) {
                loadBook(JSON.parse(localStorage.getItem(i)));
            }
        }
    });

    function loadBook(book) { //from localStorage - load into myLibrary array
        myLibrary.push(book);
        displayBook(book);
    }

    function addBook() { //after form submit or from loadBooks
        const newBook = new Book(bookTitle.value, bookAuthor.value, parseInt(bookPages.value), parseInt(bookPagesRead.value)) //display only the current book added
        myLibrary.push(newBook);
        displayBook(newBook);
        localStorage.setItem(localStorage.length, JSON.stringify(newBook));
    }

    function displayBook(book) { //function from loadBooks / addBook
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
        //title of book
        const title = document.createElement('div');
        title.className = "title";
        title.textContent = limitChar(book.title);
        //author of book
        const author = document.createElement('div');
        author.className = "author";
        author.textContent = `by ${limitChar(book.author)}`;
        //progress icon of book
        const progress = document.createElement('div');
        progress.className = "progress";
        progress.dataset.num = myLibrary.indexOf(book);
        const icon = document.createElement('i');
        icon.className = "far fa-check-circle fa-7x"
        progress.append(icon);
        //update pages, and pages read
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

        //create / recreate eventListeners for bookCell
        bookCells = document.querySelectorAll('.book');
        arrows = document.querySelectorAll('.arrow');
        progressIcon = document.querySelectorAll('.progress');
        pagesReadText = document.querySelectorAll('.pages-read');

        //eventlisteners for book cell elements upon load
        arrows.forEach(arrow => {
            arrow.addEventListener('click', cellWindow.changePagesRead);
        })
        bookCells.forEach(cell => cell.addEventListener('click', cellWindow.cellWindowClick));

        cellWindow.updateProgress(book, progress.dataset.num);
    }

    function limitChar(text) { //used with display book
        let textArr = [...text.split('')];
        if (textArr.length > 18) {
            return `${textArr.splice(0, 18).join('')}..`;
        }
        return text;
    }

    return {
        addBook,
        bookCells,
        progressIcon,
        pagesReadText,
        myLibrary,
        checkStorage
    }
})();

const cellWindow = (() => {
    function updateProgress(book, dataNum) {
        progressIcon.forEach(icon => {
            if (parseInt(icon.dataset.num) == parseInt(dataNum)) {
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
            let book = library.myLibrary[dataNum];
            if (book.pagesRead <= 0) return; // return if under limit
            book.pagesRead -= 1;
            updateBook(book, dataNum);
            updateProgress(book, dataNum);
        }
    
        if (e.target.classList.contains('fa-arrow-right')) {
            let book = library.myLibrary[dataNum];
            if (book.pagesRead >= book.pages) return; //return if over limit
            book.pagesRead += 1;
            updateBook(book, dataNum);
            updateProgress(book, dataNum);
        }
    }

    function updateBook(book, dataNum) {
        localStorage.setItem(dataNum, JSON.stringify(library.myLibrary[dataNum]));
            let allPagesRead = document.querySelectorAll('.pages-read');
            allPagesRead.forEach(cell => {
                if (cell.dataset.num == dataNum) {
                    cell.textContent = `${book.pagesRead} / ${book.pages}`;
                }
            })
    }

    function cellWindowClick(e) { //BOOK? not sure if belongs here
        let dataNum = e.currentTarget.dataset.num;
        //remove book from display and library
        if (e.target.classList.contains('fa-trash-alt')) {
            updateKey(dataNum);
            e.currentTarget.remove();
        }
    }

    function updateKey(dataNum) {
        library.myLibrary.splice(dataNum, 1);
        localStorage.clear();
        library.myLibrary.forEach(book => {
            localStorage.setItem(library.myLibrary.indexOf(book), JSON.stringify(book));
        });
        bookCells.forEach(cell => {
            cell.dataset.num = parseInt(cell.dataset.num) -1;
        });
    }

    return {
        updateKey,
        cellWindowClick,
        updateBook,
        changePagesRead,
        updateProgress
    }
})();

class Book {
    constructor(title, author, pages, pagesRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.pagesRead = pagesRead;
    }
}

library.checkStorage();