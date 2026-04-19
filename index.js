/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById('games-container');

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
	// loop over each item in the data
	for (let game of games) {
		console.log(game);
		// create a new div element, which will become the game card
		// add the class game-card to the list
		let card = document.createElement('div');
		card.classList.add('game-card');
		// set the inner HTML using a template literal to display some info
		// about each game
		card.innerHTML = `<img class=game-img src=${game.img} /><h3>${game.name}</h3><p>${game.description}</p><p>Backers: ${game.backers}</p>`;

		// append the game to the games-container
		gamesContainer.appendChild(card);
	}
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById('num-contributions');

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((acc, game) => {
	return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p>${totalContributions.toLocaleString('en-US')}</p>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById('total-raised');
let amountRaised = GAMES_JSON.reduce((acc, game) => {
	return acc + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p>$${amountRaised.toLocaleString('en-US')}</p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById('num-games');

let numOfGames = GAMES_JSON.length;

gamesCard.innerHTML = `<p>${numOfGames.toLocaleString('en-US')}</p>`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
	deleteChildElements(gamesContainer);

	// use filter() to get a list of games that have not yet met their goal
	let unfunded = GAMES_JSON.filter((game) => {
		return game.pledged < game.goal;
	});

	// use the function we previously created to add the unfunded games to the DOM
	addGamesToPage(unfunded);
}

// show only games that are fully funded
function filterFundedOnly() {
	deleteChildElements(gamesContainer);

	// use filter() to get a list of games that have met or exceeded their goal
	let funded = GAMES_JSON.filter((game) => {
		return game.pledged >= game.goal;
	});
	// use the function we previously created to add funded games to the DOM
	addGamesToPage(funded);
}

// show all games
function showAllGames() {
	deleteChildElements(gamesContainer);

	// add all games from the JSON data to the DOM
	addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById('unfunded-btn');
const fundedBtn = document.getElementById('funded-btn');
const allBtn = document.getElementById('all-btn');

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);
/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// grab the description container
const descriptionContainer = document.getElementById('description-container');

// use filter or reduce to count the number of unfunded games
let numOfUnfunded = GAMES_JSON.reduce((acc, game) => {
	return game.pledged < game.goal ? acc + 1 : acc;
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
let displayStr = `A total of $${amountRaised.toLocaleString('en-US')} has been raised for ${numOfGames === 1 ? `${numOfGames} game` : `${numOfGames} games`}. Currently, ${numOfUnfunded === 1 ? `${numOfUnfunded} game remains` : `${numOfUnfunded} games remain`} unfunded. We need your help to fund these amazing games!`;
// create a new DOM element containing the template string and append it to the description container
let description = document.createElement('p');
description.textContent = displayStr;
descriptionContainer.appendChild(description);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById('first-game');
const secondGameContainer = document.getElementById('second-game');

const sortedGames = GAMES_JSON.sort((item1, item2) => {
	return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games

let [first, second, ...remainingGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let topPledge = document.createElement('p');
topPledge.textContent = first.name;
firstGameContainer.appendChild(topPledge);

// do the same for the runner up item
let secondPledge = document.createElement('p');
secondPledge.textContent = second.name;
secondGameContainer.appendChild(secondPledge);

/********************************************************************************
 * Customizations
 */
let headerButton = document.getElementById('header-button');
headerButton.addEventListener('click', () => {
	document.getElementById('games-container').scrollIntoView({ behavior: 'smooth' });
});

function filterGames() {
	deleteChildElements(gamesContainer);
	let input = document.getElementById('filter-games');
	let filter = input.value.toUpperCase();

	let matches = GAMES_JSON.filter((game) => {
		return game.name.toUpperCase().indexOf(filter) > -1;
	});
	console.log(matches);

	addGamesToPage(matches);
}

let gamesInput = document.getElementById('filter-games');
gamesInput.addEventListener('keyup', filterGames);
