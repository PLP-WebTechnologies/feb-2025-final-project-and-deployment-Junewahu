// Chatbot Elements
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWindow = document.querySelector('.chatbot-window');
const closeChatbot = document.querySelector('.close-chatbot');
const chatMessages = document.querySelector('.chatbot-messages');
const chatInput = document.querySelector('.chatbot-input input');
const sendMessage = document.querySelector('.send-message');

// Chatbot State
let isChatbotOpen = false;
let currentQuestionIndex = 0;

// Health Assessment Questions
const healthQuestions = [
    {
        question: "Hello! I'm your AI health assistant. Are you experiencing any severe symptoms like chest pain, difficulty breathing, or loss of consciousness?",
        type: "yesNo",
        next: {
            yes: "Please seek immediate medical attention. These symptoms require emergency care.",
            no: "question2"
        }
    },
    {
        question: "Are you currently taking any medications?",
        type: "yesNo",
        next: {
            yes: "question3",
            no: "question4"
        }
    },
    {
        question: "Please list your current medications:",
        type: "text",
        next: "question4"
    },
    {
        question: "Do you have any known allergies to medications?",
        type: "yesNo",
        next: {
            yes: "question5",
            no: "question6"
        }
    },
    {
        question: "Please list your medication allergies:",
        type: "text",
        next: "question6"
    },
    {
        question: "Have you had IV therapy before?",
        type: "yesNo",
        next: {
            yes: "question7",
            no: "question8"
        }
    },
    {
        question: "Did you experience any adverse reactions to previous IV therapy?",
        type: "yesNo",
        next: {
            yes: "question8",
            no: "question8"
        }
    },
    {
        question: "Are you currently pregnant or breastfeeding?",
        type: "yesNo",
        next: {
            yes: "pregnancyWarning",
            no: "question9"
        }
    },
    {
        question: "Do you have any chronic medical conditions?",
        type: "yesNo",
        next: {
            yes: "question10",
            no: "finalAssessment"
        }
    },
    {
        question: "Please describe your chronic conditions:",
        type: "text",
        next: "finalAssessment"
    }
];

// Special Responses
const specialResponses = {
    pregnancyWarning: "IV therapy may not be suitable during pregnancy or breastfeeding. Please consult your healthcare provider before proceeding.",
    finalAssessment: "Based on your responses, you appear to be a suitable candidate for our IV therapy services. However, this is not a medical diagnosis. Our licensed healthcare providers will perform a final assessment before treatment."
};

// Chatbot Functions
function toggleChatbot() {
    isChatbotOpen = !isChatbotOpen;
    chatbotWindow.classList.toggle('hidden');
    
    if (isChatbotOpen) {
        startAssessment();
    } else {
        resetChatbot();
    }
}

function resetChatbot() {
    currentQuestionIndex = 0;
    chatMessages.innerHTML = '';
}

function startAssessment() {
    addBotMessage(healthQuestions[0].question);
}

function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'bot-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleUserResponse(response) {
    const currentQuestion = healthQuestions[currentQuestionIndex];
    addUserMessage(response);
    
    if (currentQuestion.type === 'yesNo') {
        const nextStep = currentQuestion.next[response.toLowerCase()];
        if (typeof nextStep === 'string' && nextStep.startsWith('question')) {
            currentQuestionIndex = parseInt(nextStep.replace('question', '')) - 1;
            setTimeout(() => {
                addBotMessage(healthQuestions[currentQuestionIndex].question);
            }, 500);
        } else {
            setTimeout(() => {
                addBotMessage(nextStep);
                if (nextStep === specialResponses.finalAssessment) {
                    setTimeout(() => {
                        addBotMessage("Would you like to proceed with booking a treatment?");
                    }, 1000);
                }
            }, 500);
        }
    } else if (currentQuestion.type === 'text') {
        const nextStep = currentQuestion.next;
        if (typeof nextStep === 'string' && nextStep.startsWith('question')) {
            currentQuestionIndex = parseInt(nextStep.replace('question', '')) - 1;
            setTimeout(() => {
                addBotMessage(healthQuestions[currentQuestionIndex].question);
            }, 500);
        } else {
            setTimeout(() => {
                addBotMessage(specialResponses[nextStep]);
                if (nextStep === 'finalAssessment') {
                    setTimeout(() => {
                        addBotMessage("Would you like to proceed with booking a treatment?");
                    }, 1000);
                }
            }, 500);
        }
    }
}

// Event Listeners
chatbotToggle.addEventListener('click', toggleChatbot);
closeChatbot.addEventListener('click', toggleChatbot);

sendMessage.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        handleUserResponse(message);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
            handleUserResponse(message);
            chatInput.value = '';
        }
    }
});

// Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isChatbotOpen) {
        toggleChatbot();
    }
}); 