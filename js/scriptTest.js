const form = (() => {
    const infoCell = document.querySelector('.info'); //first cell in page - to initiate form
    const icon = document.querySelector('.add-prompt');
    const bookForm = document.querySelector('.adding-book-form');
    const cancelBtn = document.querySelector('.fa-window-close');
    const submitBtn = document.querySelector('.form-submit button');

    function displayForm() {
        icon.classList.toggle('no-display');
        bookForm.classList.toggle('no-display');
    }

    

    infoCell.addEventListener('click', displayForm); //displays form upon click on infoCell
    cancelBtn.addEventListener('click', e => {
        e.stopPropagation(); //stops event bubbling back to the cell
        removeForm();
    });
    submitBtn.addEventListener('click', e => {
        e.stopPropagation();
        addBookToLibrary();
    });
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