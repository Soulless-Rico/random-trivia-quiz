let score = 0;
let currentQuestionIndex = 0;
const progressLišta = document.querySelector('.progress-fill');


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function hideElement(containerId) {
    document.getElementById(containerId).classList.add('hidden');
    console.log(`The element '${containerId}' was made hidden.`)
}

function showElement(containerId) {
    document.getElementById(containerId).classList.remove('hidden');
    console.log(`The element '${containerId}' was made visible.`);
}

async function fetchQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10');  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    switch (data.response_code) {
        case 0:
            break;
        case 1:
            throw new Error('API Error: No results could be found for your query.');
        case 2:
            throw new Error('API Error: Invalid parameter was supplied.');
        case 3:
            throw new Error('API Error: Token not found.');
        case 4:
            throw new Error('API Error: Token empty/expired.');
        default:
            throw new Error(`API Error: Unknown response code: ${data.response_code}`);
    }

    return data;
}

async function loadQuestions() {

    const quizContainer = document.getElementById('quiz-container');
    const loadingState = document.getElementById('loading-state');
    
    try {
        const questionsObject = await fetchQuestions();
        const questionsArray = questionsObject.results;

        console.log(`Success! Loaded questions: ${questionsObject}}`);

        if (!questionsArray.length) {
            throw new Error('Questions array is empty.')
        }

        hideElement('loading-state');
        showElement(quizContainer.id);

        quizContainer.innerHTML = '';

        questionsArray.forEach((question, index) => {
            
            const decodedQuestion = decodeHTML(question.question);
            const decodedAnswer = decodeHTML(question.correct_answer);
            const incorrectAnswers = question.incorrect_answers.map(decodeHTML);
            
            let allAnswers = [decodedAnswer, ...incorrectAnswers];
            allAnswers = shuffleArray(allAnswers);

            let answersHTML = '';
            allAnswers.forEach(answer => {
            const isCorrect = (answer === decodedAnswer) ? 'data-correct="true"' : '';
            answersHTML += `<button class="answer-btn" ${isCorrect}>${answer}</button>`;
            })  
               
            const questionHTML = `
                <div class="question-card">
                    <p class="question-number">Question ${index + 1} of ${questionsArray.length} - ${question.category}</p>
                    <p class="question-text">${decodedQuestion}</p>

                    <div class="answers-grid">
                        ${answersHTML}
                    </div>
                </div>
            `;
            quizContainer.innerHTML += questionHTML;
});

        
function handleAnswerClick(event) {
    const selectedButton = event.target;
    const isCorrect = selectedButton.hasAttribute('data-correct');
    
    // Zisti ktorá question-card bola zvolená
    const questionCard = selectedButton.closest('.question-card');
    const answerButtons = questionCard.querySelectorAll('.answer-btn');

    answerButtons.forEach(button => {
        button.disabled = true; // Zakaže všetky tlačidlá
        if (button.getAttribute('data-correct')) {
            button.classList.add('correct'); // Vždy ukáže správnu odpoveď
        }
        const progressPercent = (currentQuestionIndex / questionsArray.length) * 100;
        progressLišta.style.width = progressPercent + '%';
    });
    if (isCorrect) {
        
        selectedButton.classList.add('correct');
        score++;
        currentQuestionIndex++;
    } else {
        selectedButton.classList.add('incorrect');
        currentQuestionIndex++;
    }

    if (currentQuestionIndex === questionsArray.length) {
        hideElement(quizContainer.id);
        const resultsTitle = document.getElementById('results-title');
        resultsTitle.innerHTML = `
            <h2 class="results-badge">${score} / ${questionsArray.length}</h2>
            <h3 class="results-message">Congratulations, you have achieved the end of the most sigma quiz of all time</h3>
            <button id="restart-quiz-btn" class="restart-btn sigma-btn" onclick="restartQuiz()">Restart Quiz</button>
        `;
        hideElement('progress-bar');
        showElement(resultsTitle.id);
    }
}

    const answerButtons = quizContainer.querySelectorAll('.answer-btn');
answerButtons.forEach(button => {
    button.addEventListener('click', handleAnswerClick);
});
    }
     catch (error) {
        console.error(`An error occured during data loading: ${error}`);
        hideElement('loading-state');
        showElement(quizContainer.id);

        quizContainer.innerHTML =  `
            <div class="question-card" style="border-color:#ff3333; box-shadow: 0 0 30px rgba(255, 51, 51, 0.5);">
                <p class="question-text" style="color: #ff3333;">Error loading quiz: ${error.message}</p>
            </div>
        `;
    }
}

function decodeHTML(html) {
    /** 
     * Takes a string with HTML entities (like &quot;) and converts them to 
     * their corresponding characters (like ").
     */
    const text = document.createElement('textarea');
    text.innerHTML = html;

    return text.value;
}

function restartQuiz() {
    window.location.reload();
}


loadQuestions();
