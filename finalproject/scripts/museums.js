let allMuseums = [];

async function loadMuseums() {
    try {
        const response = await fetch('data/museums.json');
        const museums = await response.json();
        allMuseums = museums;

        const savedFilter = localStorage.getItem('activeFilter') || 'All';
        setActiveButton(savedFilter);
        displayMuseums(filterMuseums(savedFilter));

    } catch (error) {
        document.getElementById('museums-grid').innerHTML = `<p>Sorry, we could not load the museums. Please try again later.</p>`;
        console.error('Error loading museums:', error);
    }
}

function filterMuseums(filter) {
    if (filter === 'All') return allMuseums;
    if (filter === 'Free') return allMuseums.filter(m => m.free);
    if (filter === 'Family') return allMuseums.filter(m => m.childrenArea);
    return allMuseums.filter(m => m.type === filter);
}

function displayMuseums(museums) {
    const museumsGrid = document.getElementById('museums-grid');

    museumsGrid.innerHTML = museums.map(museum => `
        <div class="museum-card" data-id="${museum.id}" tabindex="0" role="button" aria-label="View details for ${museum.name}">
            <img src="${museum.image}" alt="${museum.name}" width="300" height="140" loading="lazy">
            <div class="museum-card-info">
                <h3>${museum.name}</h3>
                <span class="card-type">${museum.type}</span>
                <span class="card-price">${museum.price === 0 ? 'Free' : `$${museum.price} MXN`}</span>
                <span class="card-schedule">${museum.schedule}</span>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.museum-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id);
            const museum = allMuseums.find(m => m.id === id);
            openModal(museum);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') card.click();
        });
    });
}

function setActiveButton(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.trim() === filter);
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.textContent.trim();
        setActiveButton(filter);
        displayMuseums(filterMuseums(filter));
        localStorage.setItem('activeFilter', filter);
    });
});

function openModal(museum) {
    const modal = document.getElementById('museum-modal');
    const closeModal = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <img src="${museum.image}" alt="${museum.name}" width="500" height="200" loading="lazy">
        <span class="modal-type">${museum.type}</span>
        <h2>${museum.name}</h2>
        <p>${museum.description}</p>
        <div class="modal-meta">
            <span>📍 ${museum.address}</span>
            <span>🕐 ${museum.schedule}</span>
            <span>🎟️ ${museum.price === 0 ? 'Free entry' : `$${museum.price} MXN`}</span>
            <span>👨‍👩‍👧 Family friendly: ${museum.childrenArea ? 'Yes' : 'No'}</span>
        </div>
    `;

    modal.showModal();
    closeModal.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('museum-modal').close();
    }
});

loadMuseums();