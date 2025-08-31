// Exercise navigation and checking
let currentExercises = {};

function navigateExercise(exerciseId, direction) {
    const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
    let currentIndex = 0;
    
    // Find current question
    questions.forEach((q, index) => {
        if (q.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Hide current question
    questions[currentIndex].classList.remove('active');
    
    // Show next/previous question
    if (direction === 'next' && currentIndex < questions.length - 1) {
        questions[currentIndex + 1].classList.add('active');
    } else if (direction === 'prev' && currentIndex > 0) {
        questions[currentIndex - 1].classList.add('active');
    } else if (direction === 'next' && currentIndex === questions.length - 1) {
        // If it's the last question and user clicks next, show completion message
        alert(`Congratulations! You've completed ${exerciseId === 'ex1' ? 'Exercise 1: Basics' : exerciseId === 'ex2' ? 'Exercise 2: Advanced' : 'Exercise 3: Master'}`);
        return;
    }
    
    // Update navigation buttons
    updateExerciseNav(exerciseId);
    
    // Update progress bar
    updateProgressBar(exerciseId);
}

function updateExerciseNav(exerciseId) {
    const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
    let currentIndex = 0;
    
    // Find current question
    questions.forEach((q, index) => {
        if (q.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById(`${exerciseId}-prev`);
    const nextBtn = document.getElementById(`${exerciseId}-next`);
    
    prevBtn.disabled = currentIndex === 0;
    
    if (currentIndex === questions.length - 1) {
        nextBtn.innerHTML = 'Finish <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

function updateProgressBar(exerciseId) {
    const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
    let currentIndex = 0;
    
    // Find current question
    questions.forEach((q, index) => {
        if (q.classList.contains('active')) {
            currentIndex = index;
        }
    });
    
    // Update progress bar
    const progress = ((currentIndex + 1) / questions.length) * 100;
    document.getElementById(`progressBar${exerciseId.slice(2)}`).style.width = `${progress}%`;
}

function checkAnswer(element, correctness, exerciseId) {
    const options = element.parentElement.querySelectorAll('.option');
    options.forEach(opt => {
        opt.onclick = null; // Remove click event after first selection
    });
    
    element.classList.add(correctness);
    
    // Show feedback
    const feedbackId = element.closest('.exercise').querySelector('.feedback').id;
    document.getElementById(feedbackId).style.display = 'block';
    
    // Update progress
    if (!currentExercises[exerciseId]) {
        currentExercises[exerciseId] = 0;
    }
    currentExercises[exerciseId]++;
}