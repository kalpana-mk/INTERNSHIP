let selectedTopics = new Set();
let countdownInterval;
let lastTestState = 'quiz'; // 'quiz', 'success', or 'lockout'
const mockUserData = {
    name: "Dhinesh", email: "dinsee@example.com", streak: 5,
    profilePictureUrl: "https://i.pravatar.cc/40?img=3",
    savedTopics: [
        { name: "AI & Tech", time: "09:00" },
        { name: "History", time: "14:00" }
    ]
};
const mockQuizData = [ { question: "What does 'GPT' stand for in models like GPT-3?", options: ["General Purpose Technology", "Generative Pre-trained Transformer", "Global Positioning Transmitter", "Graphical Processing Toolbox"], correctAnswer: "Generative Pre-trained Transformer" } ];

function updateProfileUI(userData) {
    document.getElementById('welcome-message').textContent = `Welcome, ${userData.name}!`;
    document.getElementById('profile-pic').src = userData.profilePictureUrl;
    document.getElementById('streak-count').textContent = userData.streak;
    document.getElementById('streak-icon').src = userData.streak > 0 ? 'assests/fire-on.svg' : 'assests/fire-off.svg';

    // Update profile section details
    document.getElementById('profile-pic-large').src = userData.profilePictureUrl.replace('40', '80'); // Larger pic for profile
    document.getElementById('profile-username').textContent = `Hey, ${userData.name}!`;
    document.getElementById('profile-email-display').textContent = userData.email;
    renderUserTopics(userData.savedTopics);
}

function initializeTopicSelection(savedTopics) {
    const topicTags = document.querySelectorAll('.topic-tag:not(.topic-tag-add)');
    // Convert savedTopics array of objects to a Set of topic names for selection logic
    selectedTopics = new Set(savedTopics.map(topic => topic.name));
    topicTags.forEach(tag => {
        tag.classList.toggle('selected', selectedTopics.has(tag.dataset.topic));
    });
}

function populateTimeSelect() {
    const timeSelect = document.getElementById('time-select');
    if (!timeSelect) return;
    timeSelect.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        let hour = i % 12;
        hour = hour ? hour : 12;
        const ampm = i >= 12 ? 'PM' : 'AM';
        const option = new Option(`${hour}:00 ${ampm}`, `${i.toString().padStart(2, '0')}:00`);
        timeSelect.appendChild(option);
    }
}

function loadQuiz() {
    const questionsContainer = document.getElementById('questions-container');
    const userAnswers = {};
    if(!questionsContainer) return userAnswers;
    questionsContainer.innerHTML = '';
    mockQuizData.forEach((q, index) => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.dataset.questionIndex = index;
        questionCard.innerHTML = `<p class="question-text">${index + 1}. ${q.question}</p><div class="options-container"></div>`;
        const optionsContainer = questionCard.querySelector('.options-container');
        q.options.forEach(opt => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = opt;
            optionDiv.addEventListener('click', () => {
                if (document.querySelector('.quiz-container').classList.contains('answered')) return;
                userAnswers[index] = opt;
                questionCard.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                optionDiv.classList.add('selected');
            });
            optionsContainer.appendChild(optionDiv);
        });
        questionsContainer.appendChild(questionCard);
    });
    return userAnswers;
}

function showLockoutScreen(lockoutEndTime) {
    const testSection = document.getElementById('test-section');
    const quizContainer = document.querySelector('#test-section .quiz-container');
    const lockoutView = document.getElementById('lockout-view');
    const countdownTimer = document.getElementById('countdown-timer');
    gsap.to(quizContainer, {opacity: 0, duration: 0.3, onComplete: () => {
        quizContainer.style.display = 'none';
        lockoutView.style.display = 'flex';
        gsap.fromTo(lockoutView, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
    }});
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = lockoutEndTime - now;
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownTimer.parentElement.innerHTML = "You can try again now!";
            return;
        }
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownTimer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function runPageLoadAnimations() {
    gsap.set(['.logo', '.headline', '.subtitle', '#get-started-btn', '.navbar-container'], { y: 20, opacity: 0 });
    gsap.set(['.profile-photo', '.streak-btn'], { scale: 0.7, opacity: 0 });
    gsap.to('.logo', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 });
    gsap.to(['.headline', '.subtitle', '#get-started-btn'], { y: 0, opacity: 1, duration: 0.7, stagger: 0.2, ease: 'power3.out', delay: 0.4 });
    gsap.to('.navbar-container', { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.8 });
    gsap.to(['.streak-btn', '.profile-photo'], { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', delay: 1.2 });
    gsap.to('body', {
                '--blob-green-size': '52vw',
                '--blob-dark-green-size': '47vw',
                '--blob-green-pos': 'top -22vw left -22vw',
                '--blob-dark-green-pos': 'bottom -22vw right -22vw',
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                onUpdate: function() {
                    // Animate background-size and background-position using CSS variables
                    document.body.style.backgroundSize = `${getComputedStyle(document.body).getPropertyValue('--blob-green-size')}, ${getComputedStyle(document.body).getPropertyValue('--blob-dark-green-size')}, 15px 15px, auto`;
                    document.body.style.backgroundPosition = `${getComputedStyle(document.body).getPropertyValue('--blob-green-pos')}, ${getComputedStyle(document.body).getPropertyValue('--blob-dark-green-pos')}, 0 0, 0 0`;
                }
            });
            // Set initial CSS variables for blobs
            document.body.style.setProperty('--blob-green-size', '50vw');
            document.body.style.setProperty('--blob-dark-green-size', '45vw');
            document.body.style.setProperty('--blob-green-pos', 'top -20vw left -20vw');
            document.body.style.setProperty('--blob-dark-green-pos', 'bottom -20vw right -20vw');
            document.body.style.backgroundSize = '50vw, 45vw, 15px 15px, auto';
            document.body.style.backgroundPosition = 'top -20vw left -20vw, bottom -20vw right -20vw, 0 0, 0 0';
}

// Function to render user's selected topics
function renderUserTopics(topics) {
    const userTopicsList = document.getElementById('user-topics-list');
    const noTopicsMessage = document.getElementById('no-topics-message');
    userTopicsList.innerHTML = ''; // Clear existing topics

    if (topics.length === 0) {
        noTopicsMessage.style.display = 'block';
        return;
    } else {
        noTopicsMessage.style.display = 'none';
    }

    topics.forEach((topic, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'profile-topic-item';
        listItem.innerHTML = `
            <div class="topic-info">
                <span>${topic.name}</span>
                <small>Daily at ${formatTime(topic.time)}</small>
            </div>
            <div class="topic-actions">
                <button class="edit-topic-btn" data-index="${index}">Edit</button>
                <button class="remove-topic-btn" data-index="${index}">Remove</button>
            </div>
        `;
        userTopicsList.appendChild(listItem);
    });

    // Add event listeners for edit and remove buttons
    userTopicsList.querySelectorAll('.edit-topic-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            editTopic(index);
        });
    });

    userTopicsList.querySelectorAll('.remove-topic-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeTopic(index);
        });
    });
}

// Helper to format time (e.g., "09:00" to "9:00 AM")
function formatTime(time24) {
    const [hours, minutes] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function editTopic(index) {
    // For simplicity, let's navigate to the "Your Topics" section
    // In a real application, you might show a modal to edit
    // the topic and time directly.
    showSection('your-topic-section');
    const topicToEdit = mockUserData.savedTopics[index];
    if (topicToEdit) {
        // Pre-select the topic if it's one of the default ones, or highlight the input
        document.querySelectorAll('.topic-tag').forEach(tag => {
            if (tag.dataset.topic === topicToEdit.name.toLowerCase().replace(/ & /g, '-')) {
                tag.classList.add('selected');
                selectedTopics.add(tag.dataset.topic);
            }
        });
        // Set the time in the schedule view
        document.getElementById('time-select').value = topicToEdit.time;
        // Switch to schedule view after selecting topic
        gsap.to(document.getElementById('topic-view'), { opacity: 0, duration: 0.3, onComplete: () => {
            document.getElementById('topic-view').style.display = 'none';
            document.getElementById('schedule-view').style.display = 'block';
            gsap.fromTo(document.getElementById('schedule-view'), {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
        }});
    }
}

function removeTopic(index) {
    if (confirm(`Are you sure you want to remove "${mockUserData.savedTopics[index].name}"?`)) {
        mockUserData.savedTopics.splice(index, 1);
        updateProfileUI(mockUserData); // Re-render the topics list
        // Also update the selectedTopics set for the topic selection page
        selectedTopics = new Set(mockUserData.savedTopics.map(topic => topic.name));
        initializeTopicSelection(mockUserData.savedTopics); // Update the topic selection UI
    }
}

function setupEventListeners(userData, userAnswers) {
    const mainPageWrapper = document.querySelector('.page-wrapper');
    const contentSections = document.querySelectorAll('.content-section');
    const yourTopicLink = document.querySelector('a[href="#your-topic"]');
    const testLink = document.querySelector('a[href="#test"]');
    const logoLink = document.querySelector('a[href="#home"]');
    const topicView = document.getElementById('topic-view');
    const scheduleView = document.getElementById('schedule-view');
    const saveTopicsBtn = document.getElementById('save-topics-btn');
    const confirmScheduleBtn = document.getElementById('confirm-schedule-btn');
    const getStartedBtn = document.getElementById('get-started-btn');
    const submitBtn = document.getElementById('submit-btn');
    const lockoutBackBtn = document.getElementById('lockout-back-btn');
    const successBackBtn = document.getElementById('success-back-btn');
    const quizContainer = document.querySelector('#test-section .quiz-container');
    const lockoutView = document.getElementById('lockout-view');
    const successView = document.getElementById('success-view');
    const profilePicNavbar = document.getElementById('profile-pic');
    const profileSection = document.getElementById('profile-section');
    const profileCloseBtn = document.getElementById('profile-close-btn');


    function showSection(sectionId) {
        gsap.to([mainPageWrapper, ...contentSections], { opacity: 0, duration: 0.4, onComplete: () => {
            mainPageWrapper.style.display = 'none';
            contentSections.forEach(s => s.style.display = 'none');

            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'flex'; // Changed to flex for profile section
                gsap.fromTo(targetSection, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.1 });

                if (sectionId === 'your-topic-section') {
                    topicView.style.display = 'block';
                    scheduleView.style.display = 'none';
                } else if (sectionId === 'test-section') {
                    quizContainer.style.display = 'none';
                    lockoutView.style.display = 'none';
                    successView.style.display = 'none';
                    if (lastTestState === 'success') {
                        successView.style.display = 'flex';
                        gsap.fromTo(successView, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
                    } else if (lastTestState === 'lockout') {
                        lockoutView.style.display = 'flex';
                        gsap.fromTo(lockoutView, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
                    } else {
                        quizContainer.style.display = 'block';
                        gsap.fromTo(quizContainer, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
                    }
                }
            }
        }});
    }

    function showMainPage() {
        gsap.to([...contentSections, profileSection], { opacity: 0, duration: 0.4, onComplete: () => {
            contentSections.forEach(s => s.style.display = 'none');
            profileSection.style.display = 'none';
            mainPageWrapper.style.display = 'flex';
            gsap.to(mainPageWrapper, { opacity: 1, duration: 0.4, delay: 0.1 });
        }});
    }

    logoLink.addEventListener('click', (e) => { e.preventDefault(); showMainPage(); });
    const navbarHomeLinks = document.querySelectorAll('.floating-navbar a[href="#home"]');
    navbarHomeLinks.forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); showMainPage(); });
    });
    getStartedBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('your-topic-section'); });
    yourTopicLink.addEventListener('click', (e) => { e.preventDefault(); showSection('your-topic-section'); });
    testLink.addEventListener('click', (e) => { e.preventDefault(); showSection('test-section'); });
    lockoutBackBtn.addEventListener('click', () => { showMainPage(); });
    successBackBtn.addEventListener('click', () => { showMainPage(); });

    // Event listener for profile photo in navbar
    profilePicNavbar.addEventListener('click', () => {
        updateProfileUI(mockUserData); // Ensure profile data is fresh
        showSection('profile-section');
    });

    // Event listener for closing profile section
    profileCloseBtn.addEventListener('click', () => {
        showMainPage(); // Or go back to the previous view, for now, back to home
    });


    document.querySelectorAll('.topic-tag:not(.topic-tag-add)').forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            const topicName = this.dataset.topic;
            if (this.classList.contains('selected')) {
                selectedTopics.add(topicName);
            } else {
                selectedTopics.delete(topicName);
            }
        });
    });

    document.getElementById('add-new-topic-btn').addEventListener('click', () => {
        const newTopicInput = document.getElementById('new-topic-input');
        const feedbackMessage = document.getElementById('add-topic-feedback');
        const newTopic = newTopicInput.value.trim();
        if (newTopic) {
            // Check if topic already exists to prevent duplicates
            const existingTopicNames = mockUserData.savedTopics.map(t => t.name.toLowerCase());
            if (!existingTopicNames.includes(newTopic.toLowerCase())) {
                // For simplicity, assign a default time for new topics
                mockUserData.savedTopics.push({ name: newTopic, time: "09:00" });
                updateProfileUI(mockUserData); // Update profile to show new topic
                newTopicInput.value = '';
                feedbackMessage.style.opacity = '1';
                setTimeout(() => { feedbackMessage.style.opacity = '0'; }, 2000);
            } else {
                alert('This topic already exists!');
            }
        }
    });

    saveTopicsBtn.addEventListener('click', () => {
        document.getElementById('user-email').textContent = userData.email;

        // Update mockUserData.savedTopics based on current selectedTopics
        const newSavedTopics = Array.from(selectedTopics).map(topicName => {
            // Try to find existing time for the topic, otherwise default to 09:00
            const existingTopic = mockUserData.savedTopics.find(t => t.name === topicName);
            return { name: topicName, time: existingTopic ? existingTopic.time : "09:00" };
        });
        mockUserData.savedTopics = newSavedTopics;

        gsap.to(topicView, { opacity: 0, duration: 0.3, onComplete: () => {
            topicView.style.display = 'none';
            scheduleView.style.display = 'block';
            gsap.fromTo(scheduleView, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
        }});
    });

    confirmScheduleBtn.addEventListener('click', () => {
        const deliveryTime = document.getElementById('time-select').value;

        // Update the time for all currently selected topics in mockUserData.savedTopics
        mockUserData.savedTopics.forEach(topic => {
            // If a topic is selected in the topic-selection-grid, update its time
            // This assumes the user wants to set one time for all selected topics at this stage
            if (selectedTopics.has(topic.name)) {
                topic.time = deliveryTime;
            }
        });

        alert(`Settings Confirmed!\nYour daily drops will be sent at ${formatTime(deliveryTime)}.`);
        updateProfileUI(mockUserData); // Update profile to reflect time change
        showMainPage();
    });

    submitBtn.addEventListener('click', function() {
        const selectedAnswer = userAnswers[0]; // Assuming only one question for simplicity
        if (!selectedAnswer) { alert('Please select an answer.'); return; }

        // Add answered class to quiz container to apply styling for answered state
        quizContainer.classList.add('answered');

        // Visually mark correct/incorrect answers
        const questionCard = document.querySelector('.question-card');
        const options = questionCard.querySelectorAll('.option');
        options.forEach(option => {
            if (option.textContent === mockQuizData[0].correctAnswer) {
                option.classList.add('correct');
            } else if (option.classList.contains('selected')) {
                option.classList.add('incorrect');
            }
        });

        if (selectedAnswer === mockQuizData[0].correctAnswer) {
            mockUserData.streak++;
            updateProfileUI(mockUserData);
            lastTestState = 'success';
            gsap.to(quizContainer, {opacity: 0, duration: 0.3, onComplete: () => {
                quizContainer.style.display = 'none';
                successView.style.display = 'flex';
                gsap.fromTo(successView, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
            }});
        } else {
            const lockoutEndTime = new Date().getTime() + 3600 * 1000; // 1 hour lockout
            lastTestState = 'lockout';
            showLockoutScreen(lockoutEndTime);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateProfileUI(mockUserData);
    initializeTopicSelection(mockUserData.savedTopics);
    populateTimeSelect();
    const userAnswers = loadQuiz();
    setupEventListeners(mockUserData, userAnswers);
    runPageLoadAnimations();
    const feedbackMessage = document.getElementById('add-topic-feedback');
    if (feedbackMessage) feedbackMessage.style.opacity = '0';
});
