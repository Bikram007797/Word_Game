document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const puzzleContainer = document.getElementById('puzzle-container');
    const checkButton = document.getElementById('check-button');
    const messageElement = document.getElementById('message');
    const levelScreen = document.getElementById('level-screen');
    const resultScreen = document.getElementById('result-screen');
    const wordDetailsElement = document.getElementById('word-details');
    const inputModal = document.getElementById('input-modal');
    const letterInput = document.getElementById('letter-input');
    const submitButton = document.getElementById('submit-letter');
    const cancelButton = document.getElementById('cancel-input');
    const levelTitle = document.getElementById('level-title');
    const nextLevelButton = document.getElementById('next-level-button');
    const coinDisplay = document.getElementById('coin-display');
    const coinRewardMessage = document.getElementById('coin-reward-message');

    // Profile Elements
    const profileButton = document.getElementById('profile-button');
    const profileScreen = document.getElementById('profile-screen');
    const completedLevelsSpan = document.getElementById('completed-levels');
    const totalCoinsSpan = document.getElementById('total-coins');
    const closeProfileButton = document.getElementById('close-profile');

    // --- GAME DATA & STATE ---
    const GAME_LEVELS = [
        // Level 1: Missing 2 letters
        {
            words: [
                { word: "EUPHORIA", missingIndices: [2, 5], meaning: "Intense excitement and happiness.", partOfSpeech: "Noun", synonyms: ["Joy", "Bliss", "Elation", "Rapture", "Glee"], antonyms: ["Sadness", "Misery", "Gloom", "Depression", "Woe"], sentence: "She was in a state of sheer euphoria after winning." },
                { word: "VIVACIOUS", missingIndices: [0, 4, 8], meaning: "Attractively lively and animated.", partOfSpeech: "Adjective", synonyms: ["Lively", "Spirited", "Bubbly", "Sparkling", "Energetic"], antonyms: ["Dull", "Lifeless", "Apathetic", "Subdued", "Quiet"], sentence: "Her vivacious personality made her the life of the party." },
                { word: "EPHEMERAL", missingIndices: [3, 6, 8], meaning: "Lasting for a very short time.", partOfSpeech: "Adjective", synonyms: ["Transient", "Fleeting", "Short-lived", "Momentary", "Brief"], antonyms: ["Permanent", "Eternal", "Lasting", "Enduring", "Perpetual"], sentence: "The beauty of the sunset was ephemeral." }
            ]
        },
        // Level 2: Missing 3 letters, slightly harder words
        {
            words: [
                { word: "SERENDIPITY", missingIndices: [1, 4, 8], meaning: "The occurrence of events by chance in a happy or beneficial way.", partOfSpeech: "Noun", synonyms: ["Chance", "Luck", "Fortune", "Accident", "Fluke"], antonyms: ["Bad luck", "Misfortune", "Bad break", "Curse", "Tragedy"], sentence: "It was pure serendipity that I found my old wallet." },
                { word: "EQUILIBRIUM", missingIndices: [0, 5, 10], meaning: "A state in which opposing forces or influences are balanced.", partOfSpeech: "Noun", synonyms: ["Balance", "Stability", "Poise", "Composure", "Harmony"], antonyms: ["Instability", "Imbalance", "Disorder", "Unease", "Chaos"], sentence: "He struggled to maintain his emotional equilibrium." },
                { word: "ELOQUENCE", missingIndices: [2, 6, 8], meaning: "Fluent or persuasive speaking or writing.", partOfSpeech: "Noun", synonyms: ["Rhetoric", "Persuasion", "Fluency", "Articulacy", "Vividness"], antonyms: ["Inarticulateness", "Mumbling", "Haltingness", "Stammering", "Dullness"], sentence: "The politician spoke with great eloquence." }
            ]
        },
        // --- Add more levels here (up to 10 for the prototype) ---
        { words: [{ word: "VELOCITY", missingIndices: [1, 4], meaning: "The speed of something in a given direction.", partOfSpeech: "Noun", synonyms: ["Speed", "Pace", "Tempo", "Rate", "Momentum"], antonyms: ["Slowness", "Stillness", "Dullness", "Inaction", "Inertia"], sentence: "The rocket achieved escape velocity." },
                   { word: "TRANQUIL", missingIndices: [3, 7], meaning: "Free from disturbance; calm.", partOfSpeech: "Adjective", synonyms: ["Peaceful", "Quiet", "Serene", "Calm", "Relaxing"], antonyms: ["Stormy", "Agitated", "Frenzied", "Turbulent", "Noisy"], sentence: "The lake was perfectly tranquil." },
                   { word: "OMINOUS", missingIndices: [0, 4, 6], meaning: "Giving the worrying impression that something bad is going to happen.", partOfSpeech: "Adjective", synonyms: ["Threatening", "Menacing", "Foreboding", "Sinister", "Grim"], antonyms: ["Promising", "Auspicious", "Hopeful", "Encouraging", "Favorable"], sentence: "Ominous clouds gathered on the horizon." }]
        },
        // Level 4 (Placeholder)
        { words: [{ word: "NOSTALGIA", missingIndices: [1, 4, 6], meaning: "A sentimental longing or wistful affection for the past.", partOfSpeech: "Noun", synonyms: ["Wistfulness", "Reminiscence", "Longing", "Sentimentality", "Pining"], antonyms: ["Forgetfulness", "Oblivion", "Present", "Future", "Anticipation"], sentence: "The old photos filled him with nostalgia." },
                   { word: "INEVITABLE", missingIndices: [3, 7], meaning: "Certain to happen; unavoidable.", partOfSpeech: "Adjective", synonyms: ["Unavoidable", "Unescapable", "Certain", "Foreordained", "Sure"], antonyms: ["Avoidable", "Uncertain", "Doubtful", "Contingent", "Preventable"], sentence: "Death is an inevitable part of life." },
                   { word: "JUXTAPOSE", missingIndices: [0, 4, 8], meaning: "Place or deal with close together for contrasting effect.", partOfSpeech: "Verb", synonyms: ["Contrast", "Compare", "Pair", "Place side by side", "Oppose"], antonyms: ["Separate", "Disjoin", "Unlink", "Keep apart", "Isolate"], sentence: "The artist juxtaposed bright colors with dark shades." }]
        },
        // Level 5 (Placeholder)
        { words: [{ word: "WHIMSICAL", missingIndices: [2, 5, 8], meaning: "Playfully quaint or fanciful, especially in an appealing and amusing way.", partOfSpeech: "Adjective", synonyms: ["Fanciful", "Playful", "Quaint", "Capricious", "Impish"], antonyms: ["Serious", "Dull", "Boring", "Logical", "Mundane"], sentence: "The story was filled with whimsical characters." },
                   { word: "RESILIENT", missingIndices: [0, 3, 6], meaning: "Able to withstand or recover quickly from difficult conditions.", partOfSpeech: "Adjective", synonyms: ["Tough", "Strong", "Hardy", "Flexible", "Unbreakable"], antonyms: ["Fragile", "Delicate", "Weak", "Vulnerable", "Brittle"], sentence: "He remained resilient despite the setbacks." },
                   { word: "PARADOX", missingIndices: [1, 4, 6], meaning: "A seemingly absurd or self-contradictory statement that when investigated or explained may prove to be well founded or true.", partOfSpeech: "Noun", synonyms: ["Contradiction", "Inconsistency", "Anomaly", "Puzzle", "Mystery"], antonyms: ["Consistency", "Truth", "Clarity", "Obviousness", "Logic"], sentence: "It's a paradox that the most reserved person is the most popular." }]
        },
        // Levels 6-10 would contain increasing word difficulty and complexity of missing indices
    ];
    const MAX_LEVELS = GAME_LEVELS.length;
    const COINS_PER_LEVEL = 50;
    const HINT_COST = 50;
    const MAX_HINTS = 2; // Hints are limited to 2 per word for now

    let currentLevel = 1;
    let currentLevelWords = [];
    let currentCell = null;
    let hintsUsed = [0, 0, 0]; // Track hints per word

    // --- Local Storage Management ---

    function getGameState() {
        const state = JSON.parse(localStorage.getItem('wordPuzzleState')) || {};
        return {
            level: state.level || 1,
            coins: state.coins || 0,
            theme: state.theme || 'default',
            completed: state.completed || 0 // Total unique levels completed
        };
    }

    function saveGameState(newState) {
        const currentState = getGameState();
        const updatedState = { ...currentState, ...newState };
        localStorage.setItem('wordPuzzleState', JSON.stringify(updatedState));
        updateUI(updatedState);
    }
    
    // --- UI Update ---

    function updateUI(state) {
        coinDisplay.textContent = `💰 ${state.coins}`;
        document.body.className = `theme-${state.theme}`;

        // Update Profile Screen
        completedLevelsSpan.textContent = state.completed;
        totalCoinsSpan.textContent = state.coins;
    }

    // --- Core Game Functions ---

    function initializeGame(levelToLoad) {
        const gameState = getGameState();
        
        currentLevel = levelToLoad;
        const levelIndex = (currentLevel - 1) % MAX_LEVELS; // Loop back to level 1 after max
        currentLevelWords = JSON.parse(JSON.stringify(GAME_LEVELS[levelIndex].words)); // Deep copy the data
        hintsUsed = [0, 0, 0];
        
        // Reset screens
        puzzleContainer.innerHTML = '';
        messageElement.textContent = '';
        levelScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        profileScreen.classList.add('hidden');
        inputModal.classList.add('hidden');
        
        levelTitle.textContent = `Level ${currentLevel}: Unscramble the Words`;

        currentLevelWords.forEach((wordData, wordIndex) => {
            const wordPuzzleDiv = document.createElement('div');
            wordPuzzleDiv.classList.add('word-puzzle');

            const wordRowDiv = document.createElement('div');
            wordRowDiv.classList.add('word-row');

            // Create letter boxes
            for (let i = 0; i < wordData.word.length; i++) {
                const letterBox = document.createElement('div');
                letterBox.classList.add('letter-box');
                letterBox.dataset.wordIndex = wordIndex;
                letterBox.dataset.letterIndex = i;
                letterBox.dataset.correctLetter = wordData.word[i];

                if (wordData.missingIndices.includes(i)) {
                    letterBox.classList.add('missing');
                    letterBox.textContent = '_';
                    letterBox.addEventListener('click', openModal);
                } else {
                    letterBox.textContent = wordData.word[i];
                }
                wordRowDiv.appendChild(letterBox);
            }
            wordPuzzleDiv.appendChild(wordRowDiv);

            // Create Hint Button
            const hintButton = document.createElement('button');
            hintButton.classList.add('hint-button');
            hintButton.textContent = `Hint (${MAX_HINTS} left)`;
            hintButton.dataset.wordIndex = wordIndex;
            hintButton.addEventListener('click', handleHint);

            wordPuzzleDiv.appendChild(hintButton);
            puzzleContainer.appendChild(wordPuzzleDiv);
        });
        
        updateUI(gameState);
    }
    
    function openModal(event) {
        currentCell = event.target;
        letterInput.value = '';
        inputModal.classList.remove('hidden');
        letterInput.focus();
    }

    function closeModal() {
        inputModal.classList.add('hidden');
        currentCell = null;
        letterInput.value = '';
    }

    function handleSubmitLetter() {
        if (!currentCell) return;

        const input = letterInput.value.trim().toUpperCase();
        if (input.length === 1 && input.match(/[A-Z]/)) {
            currentCell.textContent = input;
            currentCell.classList.add('filled');
            closeModal();
        } else {
            messageElement.textContent = "Please enter a single valid letter.";
            messageElement.className = 'error';
        }
    }
    
    function handleHint(event) {
        const wordIndex = parseInt(event.target.dataset.wordIndex);
        if (hintsUsed[wordIndex] >= MAX_HINTS) {
            messageElement.textContent = `No more hints left for this word!`;
            messageElement.className = 'error';
            return;
        }

        const gameState = getGameState();
        if (gameState.coins < HINT_COST) {
            messageElement.textContent = `Need ${HINT_COST} coins to use a hint! You have ${gameState.coins}.`;
            messageElement.className = 'error';
            return;
        }
        
        // Find the first unfilled missing spot
        const letterBoxes = document.querySelectorAll(`.letter-box[data-word-index="${wordIndex}"].missing`);
        for (let box of letterBoxes) {
            if (!box.classList.contains('filled')) {
                const correctLetter = box.dataset.correctLetter;
                box.textContent = correctLetter;
                box.classList.add('filled');
                box.classList.remove('missing');
                box.removeEventListener('click', openModal);
                
                // Deduct coin and update state
                saveGameState({ coins: gameState.coins - HINT_COST });
                hintsUsed[wordIndex]++;
                event.target.textContent = `Hint (${MAX_HINTS - hintsUsed[wordIndex]} left)`;
                
                if (hintsUsed[wordIndex] >= MAX_HINTS) {
                     event.target.disabled = true;
                }
                
                messageElement.textContent = `Hint used! ${HINT_COST} coins deducted.`;
                messageElement.className = 'success';
                return; 
            }
        }
    }

    function checkGame() {
        let isComplete = true;
        let isCorrect = true;

        const allCells = document.querySelectorAll('.letter-box');
        allCells.forEach(cell => {
            const isMissing = cell.classList.contains('missing') || cell.classList.contains('filled');
            
            if (isMissing && cell.textContent === '_') {
                isComplete = false;
            }

            if (isMissing && cell.textContent.toUpperCase() !== cell.dataset.correctLetter.toUpperCase()) {
                isCorrect = false;
            }
        });

        if (!isComplete) {
            messageElement.textContent = 'Please fill all the missing letters.';
            messageElement.className = 'error';
        } else if (isCorrect) {
            messageElement.textContent = `Level ${currentLevel} Complete!`;
            messageElement.className = 'success';
            awardCoinsAndShowResult();
        } else {
            messageElement.textContent = 'Some words are incorrect. Review your answers!';
            messageElement.className = 'error';
        }
    }

    function awardCoinsAndShowResult() {
        const gameState = getGameState();
        
        // Award coins
        const newCoins = gameState.coins + COINS_PER_LEVEL;
        
        // Track completed levels (only increment if level number is higher than current completed count)
        const newCompleted = Math.max(gameState.completed, currentLevel);
        
        saveGameState({ coins: newCoins, completed: newCompleted, level: currentLevel + 1 });
        
        coinRewardMessage.textContent = `You earned ${COINS_PER_LEVEL} coins! Total: ${newCoins}`;
        
        showResultScreen();
    }

    function showResultScreen() {
        levelScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        wordDetailsElement.innerHTML = '';
        
        currentLevelWords.forEach(wordData => {
            const card = document.createElement('div');
            card.classList.add('detail-card');
            
            // Function to generate list HTML
            const createListHTML = (items) => items.map(item => `<li>${item}</li>`).join('');

            card.innerHTML = `
                <h3>${wordData.word}</h3>
                <p><strong>Part of Speech:</strong> ${wordData.partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${wordData.meaning}</p>
                <p><strong>Example Sentence:</strong> <em>${wordData.sentence}</em></p>
                
                <p><strong>Synonyms:</strong></p>
                <ul class="synonym-list">${createListHTML(wordData.synonyms)}</ul>
                
                <p><strong>Antonyms:</strong></p>
                <ul class="antonym-list">${createListHTML(wordData.antonyms)}</ul>
            `;
            // NOTE: Bookmark option is removed as it also requires persistent storage of the actual word list, which is an advanced feature for static hosting.
            wordDetailsElement.appendChild(card);
        });
    }
    
    // --- Profile & Theme Logic ---
    
    function showProfile() {
        levelScreen.classList.add('hidden');
        resultScreen.classList.add('hidden');
        profileScreen.classList.remove('hidden');
        
        updateUI(getGameState()); // Refresh coin and level count
    }
    
    function closeProfile() {
        profileScreen.classList.add('hidden');
        levelScreen.classList.remove('hidden');
    }
    
    // --- Event Listeners ---
    
    checkButton.addEventListener('click', checkGame);
    submitButton.addEventListener('click', handleSubmitLetter);
    cancelButton.addEventListener('click', closeModal);
    nextLevelButton.addEventListener('click', () => {
        initializeGame(getGameState().level); // Load the next level saved in state
    });

    profileButton.addEventListener('click', showProfile);
    closeProfileButton.addEventListener('click', closeProfile);
    
    // Theme changing logic
    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const theme = e.target.dataset.theme;
            // Simplified logic: only apply default theme for now
            if (theme === 'default') {
                 saveGameState({ theme: theme });
                 // Logic to enable/disable other buttons based on coins would go here
            } else {
                alert("This theme costs 500 coins! (Feature disabled in prototype)");
            }
        });
    });

    // Initial load
    const savedState = getGameState();
    initializeGame(savedState.level); 
});
