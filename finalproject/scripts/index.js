async function loadMuseums() {
    try {
        const response = await fetch('data/museums.json');
        const museums = await response.json();
        displayFeatured(museums);
    } catch (error) {
        console.error('Error loading museums:', error);
    }
}

function displayFeatured(museums) {
    const featuredGrid = document.getElementById('featured-grid');
    const shuffled = [...museums].sort(() => Math.random() - 0.5);
    const featured = shuffled.slice(0, 6);

    featuredGrid.innerHTML = featured.map(museum => `
        <div class="museum-card" data-id="${museum.id}">
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
            const museum = museums.find(m => m.id === id);
            openModal(museum);
        });
    });
}

function openModal(museum) {
    const modal = document.getElementById('museum-modal');
    const closeModal = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');

    modalContent.innerHTML = `
        <img src="${museum.image}" alt="${museum.name}" width="450" height="200" loading="lazy">
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
    saveLastVisited(museum);

    closeModal.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('museum-modal');
        modal.close();
    }
});

function saveLastVisited(museum) {
    localStorage.setItem('lastVisited', JSON.stringify({
        id: museum.id,
        name: museum.name,
        type: museum.type
    }));
}

loadMuseums();
