// Function to calculate fitness
function calculateFitness(chromosome) {
    let totalImportance = 0;
    let totalCost = 0;

    for (let i = 0; i < totalItems; i++) {
        if (chromosome[i] === 1) {  // If the item is funded
            totalImportance += items[i].importance;
            totalCost += items[i].amount;
        }
    }

    // Penalize over-budget solutions, but give priority to higher importance expenses
    return totalCost > totalIncome ? -1 : totalImportance;  
}

// Generate the next generation
function generateNextGeneration() {
    const newPopulation = Array.from({ length: POPULATION_SIZE }, () => new Array(MAX_ITEMS).fill(0));

    for (let i = 0; i < POPULATION_SIZE; i += 2) {
        const parent1Index = selectParent();
        const parent2Index = selectParent();

        const [child1, child2] = crossover(population[parent1Index], population[parent2Index]);

        mutate(child1);
        mutate(child2);

        newPopulation[i] = child1;
        newPopulation[i + 1] = child2;
    }

    population = newPopulation;  // Copy new generation to population
}

// Function to find and display the best solution in the population
function displayBestSolution() {
    let bestIndex = 0;
    for (let i = 1; i < POPULATION_SIZE; i++) {
        if (fitness[i] > fitness[bestIndex]) {
            bestIndex = i;
        }
    }

    let totalAllocatedSavings = 0;
    let totalAllocatedExpenses = 0;

    console.log("\nOptimal Savings and Expense Allocation:\n");

    // Display expenses first, prioritizing their funding
    console.log("\n--- Expenses ---");
    for (let i = 0; i < totalItems; i++) {
        if (!items[i].isSavingsGoal && population[bestIndex][i] === 1) {
            console.log(`✅ ${items[i].name} (Amount: ${items[i].amount.toFixed(2)}, Importance: ${items[i].importance}): Funded`);
            totalAllocatedExpenses += items[i].amount;
        } else if (!items[i].isSavingsGoal) {
            console.log(`❌ ${items[i].name} (Amount: ${items[i].amount.toFixed(2)}, Importance: ${items[i].importance}): Not Funded`);
        }
    }

    // Display savings goals afterwards
    console.log("\n--- Savings Goals ---");
    for (let i = 0; i < totalItems; i++) {
        if (items[i].isSavingsGoal && population[bestIndex][i] === 1) {
            console.log(`✅ ${items[i].name} (Amount: ${items[i].amount.toFixed(2)}, Importance: ${items[i].importance}): Funded`);
            totalAllocatedSavings += items[i].amount;
        } else if (items[i].isSavingsGoal) {
            console.log(`❌ ${items[i].name} (Amount: ${items[i].amount.toFixed(2)}, Importance: ${items[i].importance}): Not Funded`);
        }
    }

    console.log("\n--- Summary ---");
    console.log(`Total Income: ${totalIncome.toFixed(2)}`);
    console.log(`Total Allocated for Savings: ${totalAllocatedSavings.toFixed(2)}`);
    console.log(`Total Allocated for Expenses: ${totalAllocatedExpenses.toFixed(2)}`);
    console.log(`Remaining Budget: ${(totalIncome - (totalAllocatedSavings + totalAllocatedExpenses)).toFixed(2)}`);
}
