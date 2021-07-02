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

    function limitChar(text) { //used with display book
        let textArr = [...text.split('')];
        if (textArr.length > 18) {
            return `${textArr.splice(0, 18).join('')}..`;
        }
        return text;
    }
})();

class Book {
    constructor(title, author, pages, pagesRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.pagesRead = pagesRead;
    }

    updateProgress(book, dataNum) {
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
    
    changePagesRead(e) {
        let dataNum = e.target.dataset.num;
        if (e.target.classList.contains('fa-arrow-left')) {
            let book = myLibrary[dataNum];
            if (book.pagesRead <= 0) return; // return if under limit
            book.pagesRead -= 1;
            updateBook(book, dataNum);
            updateProgress(book, dataNum);
        }
    
        if (e.target.classList.contains('fa-arrow-right')) {
            let book = myLibrary[dataNum];
            if (book.pagesRead >= book.pages) return; //return if over limit
            book.pagesRead += 1;
            updateBook(book, dataNum);
            updateProgress(book, dataNum);
        }
    }

    updateBook(book, dataNum) {
        localStorage.setItem(dataNum, JSON.stringify(myLibrary[dataNum]));
            let allPagesRead = document.querySelectorAll('.pages-read');
            allPagesRead.forEach(cell => {
                if (cell.dataset.num == dataNum) {
                    cell.textContent = `${book.pagesRead} / ${book.pages}`;
                }
            })
    }

    cellWindowClick(e) { //BOOK? not sure if belongs here
        let dataNum = e.currentTarget.dataset.num;
        //remove book from display and library
        if (e.target.classList.contains('fa-trash-alt')) {
            updateKey(dataNum);
            e.currentTarget.remove();
        }
    }

    updateKey(dataNum) {
        myLibrary.splice(dataNum, 1);
        localStorage.clear();
        myLibrary.forEach(book => {
            localStorage.setItem(myLibrary.indexOf(book), JSON.stringify(book));
        });
        bookCells.forEach(cell => {
            cell.dataset.num = parseInt(cell.dataset.num) -1;
        });
    }
}

form.submitBtn.addEventListener('click', e => {
        e.stopPropagation();
        addBook();
    });