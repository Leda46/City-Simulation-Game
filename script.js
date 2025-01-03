// Game variables
let time = 0; // Time tracker for charts

// Function to update charts
function updateCharts() {
    time += 1; // Increment time
    populationChart.data.labels.push(time);
    populationChart.data.datasets[0].data.push(population);
    populationChart.update();

    incomeChart.data.labels.push(time);
    incomeChart.data.datasets[0].data.push(income);
    incomeChart.update();
}



// Initial game state variables
let income = 1000;
let population = 2000;
let taxRate = 20;
let powerSupply = 1000;
let powerDemand = 500;
let incomeRate = 0.1;
let birthRate = 0.05;
let deathRate = 0.02;
let migrationRate = 0.03;
const baseIncome = 1000;

const buildings = {
    school: { birthRate: 0.02, powerDemand: 50 },
    hospital: { deathRate: 0.01, powerDemand: 30 },
    house: { populationIncrease: 50, powerDemand: 10 },
    energy: { powerSupplyIncrease: 200 },
};

let buildingCount = { school: 0, hospital: 0, house: 0, energy: 0 };

const taxRateSlider = document.getElementById("taxRateSlider");
const taxRateValueDisplay = document.getElementById("taxRateValue");
const incomeDisplay = document.getElementById('incomeDisplay');
const populationDisplay = document.getElementById('populationDisplay');
const birthRateDisplay = document.getElementById('birthRateDisplay');
const deathRateDisplay = document.getElementById('deathRateDisplay');
const migrationRateDisplay = document.getElementById('migrationRateDisplay');
const powerSupplyDisplay = document.getElementById('powerSupplyDisplay');
const powerDemandDisplay = document.getElementById('powerDemandDisplay');
const buildSchoolButton = document.getElementById("buildSchoolButton");
const buildHospitalButton = document.getElementById("buildHospitalButton");
const buildHouseButton = document.getElementById("buildHouseButton");
const buildEnergyButton = document.getElementById("buildEnergyButton");
const schoolCount = document.getElementById("schoolCount");
const hospitalCount = document.getElementById("hospitalCount");
const houseCount = document.getElementById("houseCount");
const energyCount = document.getElementById("energyCount");
const howToPlayButton = document.getElementById("howToPlayButton");
const rulesModal = document.getElementById("rulesModal");
const closeModalButton = document.getElementById("closeModalButton");
const populationCtx = document.getElementById('populationChart').getContext('2d');
const incomeCtx = document.getElementById('incomeChart').getContext('2d');

const populationChart = new Chart(populationCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Population',
            data: [],
            borderColor: 'blue',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Population' } }
        }
    }
});

const incomeChart = new Chart(incomeCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Income',
            data: [],
            borderColor: 'green',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Time' } },
            y: { title: { display: true, text: 'Income' } }
        }
    }
});

function logActivity(message) {
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    activityLog.appendChild(logEntry);
    activityLog.scrollTop = activityLog.scrollHeight; // Auto-scroll to the bottom
}

function triggerNaturalDisaster() {
    const disasters = [
        {
            name: "Flood",
            effect: () => {
                const lostBuildings = Math.min(buildingCount.house, 3);
                buildingCount.house -= lostBuildings;
                population -= 500;
                logActivity(`Flood: ${lostBuildings} houses lost, population decreased by 500.`);
            }
        },
        {
            name: "Earthquake",
            effect: () => {
                const lostBuildings = Math.min(buildingCount.school, 2);
                buildingCount.school -= lostBuildings;
                population -= 300;
                logActivity(`Earthquake: ${lostBuildings} schools lost, population decreased by 300.`);
            }
        },
        {
            name: "Virus Outbreak",
            effect: () => {
                deathRate += 0.05;
                birthRate -= 0.03;
                logActivity("Virus Outbreak: Death rate increased, birth rate decreased.");
            }
        },
        {
            name: "War",
            effect: () => {
                population -= 700;
                income -= 1000;
                logActivity("War: Population decreased by 700, income decreased by $1000.");
            }
        },
        {
            name: "Inflation",
            effect: () => {
                income -= 300;
                logActivity("Inflation: Income decreased by $300.");
            }
        }
    ];

    const disaster = disasters[Math.floor(Math.random() * disasters.length)];
    disaster.effect();
}

setInterval(() => {
    triggerNaturalDisaster();
}, 20000); // Natural disaster every 20 seconds

function updateIncome() {
    const oldIncome=income;
    let taxIncome = Math.round((taxRate * population) / 100);
    let populationIncome = Math.round(incomeRate * population);
    if (powerDemand > powerSupply) {
        income -= Math.min(income, 50);
        population -= Math.max(10, Math.floor(population * 0.01));
        logActivity("Power shortage: Income and population decreased!");
    }
    income = baseIncome + taxIncome - powerDemand;

     // Add animation when income changes
    if (oldIncome !== income) {
        incomeDisplay.classList.add('highlight-change');
        setTimeout(() => incomeDisplay.classList.remove('highlight-change'), 500); // Remove after animation
}

    incomeDisplay.textContent = `Income: $${income}`;
}

taxRateSlider.addEventListener("input", function () {
    taxRate = parseInt(taxRateSlider.value);
    taxRateValueDisplay.textContent = taxRate;

    

    logActivity(`Tax rate changed to ${taxRate}%`);
});

function updatePopulation() {
const oldPopulation = population;
const oldBirthRate = birthRate;
const oldMigrationRate = migrationRate; // Move this line here

population += Math.round(birthRate * population - deathRate * population + migrationRate * population + buildingCount.house * buildings.house.populationIncrease);
population = Math.max(population, 0);

migrationRate = 0.03 - (taxRate / 100) * 0.02;
birthRate = 0.05 - (taxRate / 100) * 0.03 + (buildingCount.school * buildings.school.birthRate);

populationDisplay.textContent = population;
birthRateDisplay.textContent = birthRate.toFixed(2);
deathRateDisplay.textContent = deathRate.toFixed(2);
migrationRateDisplay.textContent = migrationRate.toFixed(2);

// Add animation when population changes
if (oldBirthRate !== birthRate) {
birthRateDisplay.classList.add('highlight-change');
setTimeout(() => birthRateDisplay.classList.remove('highlight-change'), 500);
}

if (oldPopulation !== population) {
populationDisplay.classList.add('highlight-change');
setTimeout(() => populationDisplay.classList.remove('highlight-change'), 500);
}

if (oldMigrationRate !== migrationRate) {
migrationRateDisplay.classList.add('highlight-change');
setTimeout(() => migrationRateDisplay.classList.remove('highlight-change'), 500);
}
}


function updatePower() {
    powerDemand = 500;
    powerDemand += buildingCount.school * buildings.school.powerDemand;
    powerDemand += buildingCount.hospital * buildings.hospital.powerDemand;
    powerDemand += buildingCount.house * buildings.house.powerDemand;
    powerSupply = 1000 + buildingCount.energy * buildings.energy.powerSupplyIncrease;

    powerSupplyDisplay.textContent = powerSupply;
    powerDemandDisplay.textContent = powerDemand;
}

function buildBuilding(buildingType) {
    const cost = buildingType === 'energy' ? 300 : 200;
    if (income >= cost) {
        income -= cost;
        buildingCount[buildingType]++;
        applyBuildingEffects(buildingType);
        updateBuildingSummary();

        const buildingNames = {
            school: "School",
            hospital: "Hospital",
            house: "House",
            energy: "Renewable Energy Plant"
        };
        logActivity(`${buildingNames[buildingType]} built!`);
    } else {
        alert("Not enough income to build this!");
    }
}

function applyBuildingEffects(type) {
    
    if (type === "hospital") {
        deathRate -= buildings.hospital.deathRate;
    }
}

function updateBuildingSummary() {
    schoolCount.textContent = buildingCount.school;
    hospitalCount.textContent = buildingCount.hospital;
    houseCount.textContent = buildingCount.house;
    energyCount.textContent = buildingCount.energy;
}

buildSchoolButton.addEventListener("click", () => buildBuilding("school"));
buildHospitalButton.addEventListener("click", () => buildBuilding("hospital"));
buildHouseButton.addEventListener("click", () => buildBuilding("house"));
buildEnergyButton.addEventListener("click", () => buildBuilding("energy"));

// Select elements


let gamePaused = false;  // Flag to track if the game is paused

// Function to pause the game
function pauseGame() {
gamePaused = true;
// Implement pausing logic, like stopping timers, animations, or game loops
}

// Function to resume the game
function resumeGame() {
gamePaused = false;
// Implement logic to resume the game (e.g., restarting timers, animations)
}

// Event listener to open the modal and pause the game
howToPlayButton.addEventListener("click", () => {
rulesModal.style.display = "block";  // Show the modal
pauseGame();  // Pause the game when the modal opens
});

// Event listener to close the modal and resume the game
closeModalButton.addEventListener("click", () => {
rulesModal.style.display = "none";  // Hide the modal
resumeGame();  // Resume the game when the modal is closed
});

// Optional: Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
if (event.target === rulesModal) {
rulesModal.style.display = "none";
resumeGame();  // Resume the game if the user clicks outside the modal
}
});


const gameInterval = setInterval(() => {
if (gamePaused) {
    return;  // Skip the game update if the game is paused
}
if (population <= 0 || income <= 0) {
    alert("Game Over! Population or income is too low.");
    clearInterval(gameInterval); // Stop the game loop
} else {
    updatePopulation();
    updateIncome();
    updatePower();
    updateCharts();
}
}, 1000); // Update game every second