

async function fetchQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=1");

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json();
    const result = data.results[0];

    const difficulty = data.results[0].difficulty;
    const category = data.results[0].category;
    const question = data.results[0].question;

    const answers = [...result.incorrect_answers, result.correct_answer];



const container = document.getElementById("quiz");
container.innerHTML = `
    <h2>Difficulty: ${difficulty}</h2>
    <h2>Category: ${category}</h2>
    <h2>Question: ${question}</h2>
    <h2>Answers: ${answers}</h2>
`;



}


fetchQuestions()