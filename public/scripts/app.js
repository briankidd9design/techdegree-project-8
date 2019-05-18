
//const creates and array of all of the books by using querySelectorAll
const totalBooks = document.querySelectorAll('tbody tr');
const totalPages = Math.ceil(totalBooks.length / 5);
// creating the buttons for the pagination
const divPages = document.querySelector('#paginationLinks');
const ulPagination = document.createElement('ul');
divPages.appendChild(ulPagination);
for (let i = 0; i < totalPages; i++) {
	const liPagination = document.createElement('li');
	const paginationButton = document.createElement('a');
	paginationButton.className = "pagination-button";
	paginationButton.href = '#';
	paginationButton.textContent = i + 1;
	liPagination.appendChild(paginationButton);
	ulPagination.appendChild(liPagination);
}
//This function is used to either show or hide the appropriate pages for the pagination
const showPage = (totalBooks, page) => {
	// loop over items in the list parameter
	for (let i = 0; i < totalBooks.length; i++) {
		//the bottom index number of the range of students to show on the page
		let itemsPerPageFirst = (page * 5) - 5;
		//the top index number of the range of students to show on the page
		let itemsPerPageLast = (page * 5) - 1;
		// if the index of a list item is >= the index of the first item that should be shown on
		//the page, (index starts out 0 - 4 ))
		//&& the list item index is <= the index of the last item that should be shown on page then show items
		if (i >= itemsPerPageFirst && i <= itemsPerPageLast) {
			totalBooks[i].style.display = "";
		} // else hide items
		else {
			totalBooks[i].style.display = "none";
		}
	}
}
//calling the showPage function displays the correct number of books on page load
showPage(totalBooks, 1);
// event listener for the pagination's buttons
divPages.addEventListener('click', (e) => {
	const buttonClicked = event.target.textContent;
	const pagesButtons = document.querySelectorAll('div ul li a');
	// when a pagination button is clicked, it takes the class 'active'
	for (let i = 0; i < totalPages; i++) {
		pagesButtons[i].classList.remove('active');
	}
	event.target.classList.add('active');
	showPage(totalBooks, buttonClicked);
});