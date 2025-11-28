

async function fetctQuestions() {
    const response = await fetch("https://opentdb.com/api.php?amount=10");

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json();


}