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
        for (let book in myLibrary) {
            delete myLibrary[book];
        }
        bookCells.forEach(cell => cell.remove());
    }
})();

const form = (() => {
    const infoCell = document.querySelector('.info'); //first cell in page - to initiate form
    const icon = document.querySelector('.add-prompt');
    const bookForm = document.querySelector('.adding-book-form');
    const cancelBtn = document.querySelector('.fa-window-close');
    const submitBtn = document.querySelector('.form-submit button');
    let formDisplay = false;

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
        return parseFloat(num) < 1;
    };

    function invalidPagesRead(num) {
        return parseInt(num) < 0 || parseFloat(num) > parseFloat(bookPages.value)
    };

    infoCell.addEventListener('click', displayForm); //displays form upon click on infoCell
    cancelBtn.addEventListener('click', e => {
        e.stopPropagation(); //stops event bubbling back to the cell
        removeForm();
    });

    return {
        submitBtn,
        invalidTotalPages,
        invalidPagesRead,
        empty,
        removeForm
    };
})();

const library = (() => {
    let myLibrary = [];

    function loadBooks() { //from localStorage

    }

    function addBook() { //after form submit or from localStorage

    }

    function displayBooks(book) { //function from load book or add book

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

form.submitBtn.addEventListener('click', e => {
        e.stopPropagation();
        addBook();
    });