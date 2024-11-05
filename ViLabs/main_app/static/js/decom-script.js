let draggedTask = null;
let touchOffset = { x: 0, y: 0 };
const csrftoken = getCookie('csrftoken');

const feedback = document.getElementById('feedback');
const nextChapterBtn = document.getElementById('next-chapter');

async function loadProgress() {
    try {
        const response = await fetch('/api/get_progress/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const progressData = await response.json();

            // Restore items to their respective categories based on saved progress
            progressData.items.forEach(item => {
                const taskElement = document.getElementById(item.id);
                const targetCategory = document.getElementById(item.category);
                if (taskElement && targetCategory) {
                    targetCategory.appendChild(taskElement);
                }
            });

            if (!progressData.reset) {
                if (progressData.completed) {
                    feedback.textContent = "Perfect! All tasks are in their correct categories! 🎉";
                    feedback.style.color = 'green';
                    nextChapterBtn.disabled = false; // Enable the Next Chapter button
                } else {
                    feedback.textContent = "Some tasks are in the wrong categories. Try again! 😊";
                    feedback.style.color = 'red';
                    nextChapterBtn.disabled = true; // Keep the Next Chapter button disabled
                }
            } else {
                feedback.textContent = "";
                nextChapterBtn.disabled = true;
            }

        } else {
            console.error('Failed to load progress:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Call the function on page load
window.addEventListener('DOMContentLoaded', loadProgress);


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
    
    let isCorrect = true;

    document.querySelectorAll('.subgroup-container').forEach(container => {
        const category = container.id;
        const items = container.querySelectorAll('.task-item');
        
        if (items.length > 0) {
            items.forEach(item => {
                if (item.dataset.category !== category) {
                    // console.log(`Task ${item.id} is in the wrong category.`);
                    isCorrect = false;
                }
            });
        }
    });

    console.log(isCorrect);

    if (isCorrect) {
        feedback.textContent = "Perfect! All tasks are in their correct categories! 🎉";
        feedback.style.color = 'green';
        nextChapterBtn.disabled = false; // Enable the Next Chapter button
    } else {
        feedback.textContent = "Some tasks are in the wrong categories. Try again! 😊";
        feedback.style.color = 'red';
        nextChapterBtn.disabled = true; // Keep the Next Chapter button disabled
    }

    saveProgress(isCorrect, false); // Save progress to the server
});

document.getElementById('reset-exercise').addEventListener('click', resetExercise);

async function resetExercise() {
    // Select the default container where tasks should be moved
    const defaultContainer = document.getElementById('main-recipe');
    
    // Move all task items back to the default container
    document.querySelectorAll('.task-item').forEach(item => {
        defaultContainer.appendChild(item);
    });

    // Reset feedback message
    feedback.textContent = "Exercise has been reset.";
    feedback.style.color = 'black';

    nextChapterBtn.disabled = true;

    // Set a timeout to clear the feedback message after 3 seconds (3000 ms)
    setTimeout(() => {
        feedback.textContent = ""; // Clear the feedback message
    }, 3000);

    // Save reset progress (completed status is false)
    await saveProgress(false, true);
}



async function saveProgress(completed_status, reset_status) {
    const progressData = {
        exerciseId: 'decomposition',
        items: [...document.querySelectorAll('.task-item')].map(item => ({
            id: item.id,
            category: item.closest('.subgroup-container')?.id || 'main-recipe'
        })),
        completed: completed_status,
        reset: reset_status
    };
    await fetch('/api/save_progress/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
         },
        body: JSON.stringify(progressData)
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
