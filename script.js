// script.js (updated)
// Safe selectors (works if some elements are missing on other pages)
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const menuToggle = document.getElementById('menuToggle');
const mainContent = document.getElementById('mainContent');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const sections = document.querySelectorAll('.section');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessage');
const resetChatBtn = document.getElementById('resetChat');

// -----------------------------
// Sidebar toggles
// -----------------------------
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar && sidebar.classList.toggle('collapsed');
    mainContent && mainContent.classList.toggle('expanded');
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    sidebar && sidebar.classList.toggle('active');
  });
}

// -----------------------------
// Sidebar link behavior
// - If a link has an href that is not empty and not "#",
//   allow normal navigation (so exercise1.html will open).
// - Otherwise treat as internal section navigation.
// -----------------------------
sidebarLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // If href exists and is not '#' and not empty -> allow navigation (do nothing)
    if (href && href.trim() !== '' && href.trim() !== '#') {
      // Let browser follow the link (open exercise1.html)
      // Optional: if you want it to open in new tab, add target="_blank" in HTML.
      return;
    }

    // Otherwise this is an in-page section link -> handle manually
    e.preventDefault();

    // Update active classes on sidebar links
    sidebarLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Hide all sections then show the selected one (if exists)
    sections.forEach(section => section.classList.remove('active'));
    const sectionId = link.getAttribute('data-section');
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.classList.add('active');
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('active');
  });
});

// -----------------------------
// Sentiment analysis (simple wordlist-based)
// Make sure words-list.js defines `positiveWords` and `negativeWords` arrays.
// If not present, fallback to empty arrays.
// -----------------------------
const positiveWords = window.positiveWords || [];
const negativeWords = window.negativeWords || [];

function analyzeSentiment(text) {
  const words = text.toLowerCase().split(/\s+/).map(w => w.replace(/[^\w\s]|_/g, "").trim()).filter(Boolean);
  let pos = 0, neg = 0;
  words.forEach(w => {
    if (positiveWords.includes(w)) pos++;
    if (negativeWords.includes(w)) neg++;
  });
  const sentimentScore = pos - neg;
  if (sentimentScore > 0) {
    return { sentiment: "Positive", emoji: "😊", confidence: Math.min(100, Math.round((pos / words.length) * 100)) };
  } else if (sentimentScore < 0) {
    return { sentiment: "Negative", emoji: "😞", confidence: Math.min(100, Math.round((neg / words.length) * 100)) };
  } else {
    return { sentiment: "Neutral", emoji: "😐", confidence: 50, note: "No strong emotion detected." };
  }
}

// -----------------------------
// Chat helper functions (safe if chat elements missing)
// -----------------------------
function addMessage(text, isUser = false) {
  if (!chatMessages) return;
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = text.replace(/\n/g, '<br>');
  messageDiv.appendChild(messageContent);

  chatMessages.appendChild(messageDiv);
  // scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// send message handler
function sendChatMessage() {
  if (!messageInput || !sendMessageBtn) return;
  const raw = messageInput.value.trim();
  if (!raw) return;

  // show user message
  addMessage(raw, true);

  // analyze
  const analysis = analyzeSentiment(raw);
  setTimeout(() => {
    const confidenceText = (typeof analysis.confidence === 'number') ? `Confidence: ${analysis.confidence}%` : `Note: ${analysis.note || analysis.confidence}`;
    addMessage(`I detect ${analysis.sentiment.toLowerCase()} sentiment! ${analysis.emoji}\n${confidenceText}`);
  }, 350);

  messageInput.value = '';
}

// attach send handlers (if present)
if (sendMessageBtn && messageInput) {
  sendMessageBtn.addEventListener('click', sendChatMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

// reset chat
if (resetChatBtn && chatMessages) {
  resetChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    addMessage("Hi there! I'm EmoChat. I can analyze the sentiment of your messages. Try sending 'I love ice cream!' or 'This is terrible.'");
  });
}

// initialize a welcome message when page loads (only if chat exists)
document.addEventListener('DOMContentLoaded', () => {
  if (chatMessages && chatMessages.children.length === 0) {
    addMessage("Hi there! I'm EmoChat. I can analyze the sentiment of your messages. Try sending 'I love ice cream!' or 'This is terrible.'");
  }

  // make sure the first in-page section (if any) shows up:
  if (sections && sections.length) {
    const hasActive = Array.from(sections).some(s => s.classList.contains('active'));
    if (!hasActive) sections[0].classList.add('active');
  }
});

// -----------------------------
// Exercise helpers (if you used the functions from before)
// These are safe no-op if the DOM doesn't contain exercise elements.
// -----------------------------
function updateProgressBar(exerciseId) {
  const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
  if (!questions) return;
  const activeIndex = Array.from(questions).findIndex(q => q.classList.contains('active'));
  const progressBar = document.getElementById(`progressBar${exerciseId.slice(-1)}`);
  if (progressBar && questions.length) {
    progressBar.style.width = `${((activeIndex + 1) / questions.length) * 100}%`;
  }
}

function updateExerciseNav(exerciseId) {
  const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
  if (!questions) return;
  const activeIndex = Array.from(questions).findIndex(q => q.classList.contains('active'));
  const prevBtn = document.getElementById(`${exerciseId}-prev`);
  const nextBtn = document.getElementById(`${exerciseId}-next`);
  if (prevBtn && nextBtn) {
    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === questions.length - 1;
  }
}

function navigateExercise(exerciseId, direction) {
  const questions = document.querySelectorAll(`#${exerciseId} .exercise`);
  if (!questions || !questions.length) return;
  let currentIndex = Array.from(questions).findIndex(q => q.classList.contains('active'));
  if (currentIndex === -1) currentIndex = 0;
  questions[currentIndex].classList.remove('active');
  if (direction === 'next') currentIndex++;
  else currentIndex--;
  if (questions[currentIndex]) questions[currentIndex].classList.add('active');
  updateProgressBar(exerciseId);
  updateExerciseNav(exerciseId);
}

function checkAnswer(element, answerType, exerciseId) {
  const feedbackEl = element.closest('.exercise') ? element.closest('.exercise').querySelector('.feedback') : null;
  if (feedbackEl && answerType === 'correct') feedbackEl.style.display = 'block';
  const options = element.parentElement ? element.parentElement.querySelectorAll('.option') : [];
  options.forEach(opt => opt.style.pointerEvents = 'none');
}
    