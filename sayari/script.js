const sayariData = [
    {
        id: 1,
        category: 'poetry',
        content: "सुना है ऊपर समय बहुत जल्दी बीत जाता है,<br>नीचे वालों के मुक़ाबले हर पल सदियों सा लग जाता है।<br><br>कहते हैं ग़ालिब ने भी इक आशिक़ का हाल सुनाया था,<br>वो मरने की आरज़ू में भी एक राज़ छुपाया था।<br><br>कहता था — मर जाऊँ तो दूरी मिट जाएगी,<br>ऊपर के कुछ दिन ही सही, उससे मुलाक़ात हो जाएगी।<br><br>यहाँ जुदाई का हर लम्हा क़यामत बन जाता है,<br>वहाँ शायद एक पल में पूरा जहाँ सिमट जाता है।<br><br>उसने सब्र को भी उम्मीद बना रखा था,<br>मरने के बाद मिलन का सपना सजा रखा था।<br><br>कहता था — ऊपर का समय हवा सा तेज़ बहता है,<br>नीचे का हर पल दिल पर बोझ सा रहता है।<br><br>शायद इसी आस में वो मुस्कुराकर चल देता है,<br>कि मरकर भी प्रेम का सफ़र जल्दी पूरा हो जाता है।",
        date: "Apr 2024"
    }
];

function renderCards(data) {
    const container = document.getElementById('sayari-container');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">No items found.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'sayari-card';
        card.innerHTML = `
            <span class="card-category">${item.category === 'sayari' ? '<i class="fas fa-heart"></i> Sayari' : '<i class="fas fa-leaf"></i> Poetry'}</span>
            <div class="card-content">
                <i class="fas fa-quote-left quote-icon"></i>
                <p>${item.content}</p>
            </div>
            <div class="card-footer">
                <span class="card-date">${item.date}</span>
                <i class="fas fa-share-alt card-share" title="Share"></i>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initial render
// Execute immediately since script is at end of body
(function initSayari() {
    // Mobile menu toggle (if needed by main nav)
    const menuBtn = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    if(menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('fa-times');
            navbar.classList.toggle('active');
        });
    }

    renderCards(sayariData);

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.closest('button').classList.add('active');

            const filter = e.target.closest('button').dataset.filter;
            if (filter === 'all') {
                renderCards(sayariData);
            } else {
                const filteredData = sayariData.filter(item => item.category === filter);
                renderCards(filteredData);
            }
        });
    });
})();
