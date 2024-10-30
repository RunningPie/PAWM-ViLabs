let draggedTask = null;
let touchOffset = { x: 0, y: 0 };

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

    // Buat event perawalan drag di mobile
    item.addEventListener('touchstart', function(e) {
        draggedTask = this;
        touchOffset.x = e.touches[0].clientX - this.getBoundingClientRect().left;
        touchOffset.y = e.touches[0].clientY - this.getBoundingClientRect().top;
        setTimeout(() => this.style.opacity = '0.5', 0);

        // Supaya ga ke-reselect
        this.style.pointerEvents = 'none';
    });

    // Buat event pas geser jarinya
    item.addEventListener('touchmove', function(e) {
        e.preventDefault();
        this.style.opacity = '0.5';
    });

    // Penanganan saat touch selesai maka ditaro dalam container
    item.addEventListener('touchend', function(e) {
        this.style.opacity = '1';
        this.style.pointerEvents = '';
        
        let dropped = false;
        
        document.querySelectorAll('.subgroup-container, #main-recipe').forEach(container => {
            const containerRect = container.getBoundingClientRect();
            const touch = e.changedTouches[0];

            // Mastiin dropnya di dalem container ato ga
            if (touch.clientX >= containerRect.left && touch.clientX <= containerRect.right &&
                touch.clientY >= containerRect.top && touch.clientY <= containerRect.bottom) {
                container.appendChild(this);
                dropped = true;
            }
        });
        draggedTask = null;
    });
});

// Membuat zona drop tasksnya
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

// Buat ngecek terus nyalain next chapter
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
