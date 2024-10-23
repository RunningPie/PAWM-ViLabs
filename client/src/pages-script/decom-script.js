let draggedTask = null;

// Initialize drag events for task items
document.querySelectorAll('.task-item').forEach(item => {
    item.addEventListener('dragstart', function(e) {
        draggedTask = this;
        setTimeout(() => this.style.opacity = '0.5', 0);
    });

    item.addEventListener('dragend', function() {
        this.style.opacity = '1';
        draggedTask = null;
    });
});

// Initialize drop zones
[document.getElementById('main-recipe'), ...document.querySelectorAll('.subgroup-container')].forEach(container => {
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });

    container.addEventListener('dragleave', function() {
        this.style.backgroundColor = '';
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        if (draggedTask) {
            this.appendChild(draggedTask);
        }
    });
});

// Check categorization and enable Next Chapter button
document.getElementById('check-order').addEventListener('click', function() {
    const feedback = document.getElementById('feedback');
    const nextChapterBtn = document.getElementById('next-chapter');
    let isCorrect = true;

    document.querySelectorAll('.subgroup-container').forEach(container => {
        const category = container.id;
        const items = container.querySelectorAll('.task-item');
        
        if (items.length > 0) {
            items.forEach(item => {
                if (item.dataset.category !== category) {
                    isCorrect = false;
                }
            });
        } else {
            isCorrect = false;
        }
    });

    if (isCorrect) {
        feedback.textContent = "Perfect! All tasks are in their correct categories! 🎉";
        feedback.style.color = 'green';
        nextChapterBtn.disabled = false; // Enable the Next Chapter button
    } else {
        feedback.textContent = "Some tasks are in the wrong categories. Try again! 😊";
        feedback.style.color = 'red';
        nextChapterBtn.disabled = true; // Keep the Next Chapter button disabled
    }
});