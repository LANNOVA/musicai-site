document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

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

                const recommendationEntries = entries.slice(0, 15);
                createTable(recommendationEntries);
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
                updateTable(filteredEntries);
            })
            .catch(error => console.error('Error fetching or parsing data:', error));
    }

    function createTable(entries) {
        const table = document.createElement('table');
        table.classList.add('search-table');
    
        entries.forEach(entry => {
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
    
        
            nameCell.style.color = 'white';
        });
    
        searchResults.innerHTML = '';
        searchResults.appendChild(table);
    }
    
    function updateTable(entries) {
        const table = document.createElement('table');
        table.classList.add('search-table');
    
        entries.forEach(entry => {
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

            nameCell.style.color = 'white';
        });
    
        searchResults.innerHTML = '';
        searchResults.appendChild(table);
    }
    
});
