// Fetch data from the API
fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('table-body');
        const itemsPerPage = 10;
        let currentPage = 1;

        // Function to create a table row
        function createRow(user) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="select-row"></td>
                <td>${user.id}</td>
                <td contenteditable="true">${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

            // Add event listener for the "Edit" button
            row.querySelector('.edit').addEventListener('click', () => {
                const nameField = row.querySelector('[contenteditable="true"]');
                nameField.focus();
            });

            // Add event listener for the "Delete" button
            row.querySelector('.delete').addEventListener('click', () => {
                tableBody.removeChild(row);
            });

            return row;
        }

        // Populate the table with data for the specified page
        function populateTable(pageNumber, dataToDisplay) {
            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = dataToDisplay.slice(startIndex, endIndex);

            tableBody.innerHTML = "";
            pageData.forEach(user => {
                const row = createRow(user);
                tableBody.appendChild(row);
            });
        }

        // Initial population of the table
        populateTable(currentPage, data);

        // Function to update pagination buttons
        function updatePagination(filteredData) {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            const pageNumbersElement = document.querySelector('.page-numbers');
            pageNumbersElement.textContent = `Page ${currentPage} of ${totalPages}`;

            const firstPageButton = document.querySelector('.first-page');
            const previousPageButton = document.querySelector('.previous-page');
            const nextPageButton = document.querySelector('.next-page');
            const lastPageButton = document.querySelector('.last-page');

            firstPageButton.disabled = currentPage === 1;
            previousPageButton.disabled = currentPage === 1;
            nextPageButton.disabled = currentPage === totalPages;
            lastPageButton.disabled = currentPage === totalPages;
        }

        // Add event listeners for pagination buttons
        document.querySelector('.first-page').addEventListener('click', () => {
            if (currentPage !== 1) {
                populateTableWithPagination(data, 1);
            }
        });

        document.querySelector('.previous-page').addEventListener('click', () => {
            if (currentPage > 1) {
                populateTableWithPagination(data, currentPage - 1);
            }
        });

        document.querySelector('.next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(data.length / itemsPerPage);
            if (currentPage < totalPages) {
                populateTableWithPagination(data, currentPage + 1);
            }
        });

        document.querySelector('.last-page').addEventListener('click', () => {
            const totalPages = Math.ceil(data.length / itemsPerPage);
            if (currentPage !== totalPages) {
                populateTableWithPagination(data, totalPages);
            }
        });

        // Add event listener for "Delete Selected" button
        document.querySelector('.bulk-delete').addEventListener('click', () => {
            const selectedRows = document.querySelectorAll('.select-row:checked');
            selectedRows.forEach(row => tableBody.removeChild(row.parentElement.parentElement));
        });

        // Add event listener for the search bar
        const searchBar = document.querySelector('.search-bar');
        searchBar.addEventListener('input', () => {
            const searchValue = searchBar.value.trim().toLowerCase();

            if (searchValue === "") {
                // If the search box is empty, display the entire dataset
                populateTableWithPagination(data, currentPage);
            } else {
                const filteredData = data.filter(user => user.id.toLowerCase().includes(searchValue));

                if (filteredData.length > 0) {
                    // Display only the matching entries
                    populateTableWithPagination(filteredData, 1);
                    updatePagination(filteredData);
                } else {
                    // Display a message if no matching entry is found
                    tableBody.innerHTML = "<tr><td colspan='6'>No matching results</td></tr>";
                }
            }
        });

        // Function to populate the table with pagination
        function populateTableWithPagination(dataToDisplay, pageNumber) {
            currentPage = pageNumber;
            populateTable(pageNumber, dataToDisplay);
            updatePagination(dataToDisplay);
        }
    })
    .catch(error => console.error(error));
