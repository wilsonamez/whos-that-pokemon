// get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

//Initialize variables
let usedPokemonIds = [];
let count = 0;
let points = 0;
let showLoading = false;

//Function to fetch one pokemon with ID
 async function fetchPokemonById(id) {
    showLoading = true;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
}

// Test function
// async function testFetch() {
//     const pokemon = await fetchPokemonById(getRandomPokemonId());
//     console.log(pokemon);
// }
// testFetch();

//Function to load questions with options
async function loadQuestionsWithOptions() {
    if(showLoading) {
        showLoadingWindow();
        hidePuzzleWindow();
    }

    //fetch correct answer first
    let pokemonId = getRandomPokemonId();

    //check if current question has already been used
    while(usedPokemonIds.includes(pokemonId)) {
        pokemonId = getRandomPokemonId();
    }

    //If pokemon hasn't yet been displayed yet, add to usedPokemonIds and is set a new const pokemon.
    usedPokemonIds.push(pokemonId);
    const pokemon = await fetchPokemonById(pokemonId);

    //Options array
    const options = [pokemon.name];
    const optionsIds = [pokemon.id];

    //fetch additional random pokemon names to use as options
    while(options.length < 4){
        let randomPokemonId = getRandomPokemonId();

        //Ensure fetched option does not exist inside list, creates a new random ID until it gets one that does not exist in optionids
        while(optionsIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId();
        }
        optionsIds.push(randomPokemonId);

        //Fetching a random pokemon with newly made ID, and adding it to the options array
        const randomPokemon = await fetchPokemonById(randomPokemonId);
        const randomOption = randomPokemon.name;
        options.push(randomOption);

        //Test
        console.log(options);
        console.log(optionsIds);

        //turn off loading if all options have been fetched
        if(options.length === 4) {
            showLoading = false;
        }
    }

    shuffleArray(options);

    // Clear any pervious results and update pokemon image to fetched image URL from the sprites.
    resultElement.textContent = "Who's that Pokemon?";
    pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

    //Create options HTML elements from options array in DOM
    optionsContainer.innerHTML = "";
    options.forEach((option) => {
        const button = document.createElement("button");
        button.textContent = option
        button.onclick = (event) => checkAnswer(option === pokemon.name, event);
        optionsContainer.appendChild(button);
    });

    if(!showLoading) {
        hideLoadingWindow();
        showPuzzleWindow();
    }

}

//Check answer function declaration
function checkAnswer(isCorrect, event) {
    const selectedButton = document.querySelector(".selected")

    if(selectedButton){
        return;
    }

    event.target.classList.add("selected");
    count++;
    totalCount.textContent = count;

    if(isCorrect) {
        displayResult("Correct answer!")
        //if correct, increase point by 1
        points++;
        pointsElement.textContent = points;
        event.target.classList.add("correct");
    }else {
        displayResult("Wrong answer...")
        event.target.classList.add("wrong");
    }

    //Load next question with a 1sec delay so the user can read result
    setTimeout(() => {
        showLoading = true;
        loadQuestionsWithOptions();
    }, 1000)

}

//Initial Load
loadQuestionsWithOptions();


// --- UTILITY FUNCTIONS --- 
 
// Randomize pokemon ID function
function getRandomPokemonId(){
    return Math.floor(Math.random() * 151) + 1;
}

//shuffle array options
function shuffleArray(array){
    return array.sort(() => Math.random() -0.5);
}

//Function to update result text and class name
function displayResult(result) {
    resultElement.textContent = result
}

//Hide loading
function hideLoadingWindow() {
    loadingContainer.classList.add("hide");
}

//Show loading window
function showLoadingWindow() {
    mainContainer[0].classList.remove("show");
    loadingContainer.classList.remove("hide");
    loadingContainer.classList.add("show");
}

//show puzzle window
function showPuzzleWindow() {
    loadingContainer.classList.remove("show");
    mainContainer[0].classList.remove("hide");
    mainContainer[0].classList.add("show");
}

//Hide puzzle window
function hidePuzzleWindow() {
    mainContainer[0].classList.add("hide");
}