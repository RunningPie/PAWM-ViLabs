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

// Check categorization
document.getElementById('check-order').addEventListener('click', function() {
    const feedback = document.getElementById('feedback');
    let isCorrect = true;

    document.querySelectorAll('.subgroup-container').forEach(container => {
        const category = container.id;
        const items = container.querySelectorAll('.task-item');
        
        items.forEach(item => {
            if (item.dataset.category !== category) {
                isCorrect = false;
            }
        });
    });

    if (isCorrect) {
        feedback.textContent = "Perfect! All tasks are in their correct categories! 🎉";
        feedback.style.color = 'green';
    } else {
        feedback.textContent = "Some tasks are in the wrong categories. Try again! 😊";
        feedback.style.color = 'red';
    }
});