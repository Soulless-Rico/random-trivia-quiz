const questionContainer = document.getElementById('question-container');

async function fetctQuestions() {
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
    try {
        const questions = await fetchQuestions();
        console.log(`Success! Loaded questions: ${questions}}`);

        const questionsArray = questions.results;
        if (questionsArray.lenght > 0) {
            throw new Error('Questions array is empty.')
        }

    } catch (error) {
        console.error(`An error occured during data loading: ${error}`);
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

loadQuestions();
