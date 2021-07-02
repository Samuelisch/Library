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

class Library {
    //IIFE?
}

class Book {
    constructor(title, author, pages, pagesRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.pagesRead = pagesRead;
    }

    addToLibrary() {

    }

    display() {

    }
}

form.submitBtn.addEventListener('click', e => {
        e.stopPropagation();
        addBook();
    });