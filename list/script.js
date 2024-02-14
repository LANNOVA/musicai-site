document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const resultsPerPage = 10; // Number of results to display per page
    let currentPage = 1;

    searchButton.addEventListener('click', searchAndUpdateTable);
    fetchAndCreateRecommendationTable();

    function fetchAndCreateRecommendationTable() {
        fetch('model_data.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.trim().split('\n');
                const entries = rows.map(row => {
                    const [name, link] = row.split(',');
                    return { name: name.trim(), link: link.trim() };
                });

                createTable(entries);
            })
            .catch(error => console.error('Error fetching or parsing data:', error));
    }

    function searchAndUpdateTable() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        fetch('model_data.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.trim().split('\n');
                const entries = rows.map(row => {
                    const [name, link] = row.split(',');
                    return { name: name.trim(), link: link.trim() };
                });
                const filteredEntries = entries.filter(entry =>
                    entry.name.toLowerCase().includes(searchTerm)
                );
                createTable(filteredEntries);
            })
            .catch(error => console.error('Error fetching or parsing data:', error));
    }

    function createTable(entries) {
        const startIdx = (currentPage - 1) * resultsPerPage;
        const endIdx = startIdx + resultsPerPage;
        const paginatedEntries = entries.slice(startIdx, endIdx);

        const table = document.createElement('table');
        table.classList.add('search-table');
    
        paginatedEntries.forEach(entry => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            const linkCell = row.insertCell();
    
            const linkElement = document.createElement('a');
            linkElement.href = entry.link;
            linkElement.textContent = entry.link;
            linkElement.addEventListener('click', function(event) {
                event.preventDefault(); 
                navigator.clipboard.writeText(entry.link)
                    .then(() => alert('Link copied to clipboard'))
                    .catch(error => console.error('Error copying link:', error));
            });
    
            const nameElement = document.createElement('div');
            nameElement.textContent = entry.name;
    
            linkCell.appendChild(linkElement);
            nameCell.appendChild(nameElement);
        });
    
        searchResults.innerHTML = '';
        searchResults.appendChild(table);

        renderPagination(entries.length);
    }

    function renderPagination(totalEntries) {
        const totalPages = Math.ceil(totalEntries / resultsPerPage);
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.addEventListener('click', function() {
                currentPage = i;
                searchAndUpdateTable();
            });
            paginationContainer.appendChild(pageButton);
        }

        searchResults.appendChild(paginationContainer);
    }
});
