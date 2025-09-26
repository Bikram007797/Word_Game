document.addEventListener('DOMContentLoaded', () => {
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

    // --- GAME DATA (Hard-coded for Level 1) ---
    const GAME_WORDS = [
        {
            word: "EUPHORIA",
            missingIndices: [2, 5], // P and R are missing
            meaning: "A feeling or state of intense excitement and happiness.",
            partOfSpeech: "Noun",
            sentence: "She was in a state of sheer euphoria after winning the championship.",
        },
        {
            word: "VIVACIOUS",
            missingIndices: [0, 4, 8], // V, C, S are missing
            meaning: "Attractively lively and animated.",
            partOfSpeech: "Adjective",
            sentence: "Her vivacious personality made her the life of every party.",
        },
        {
            word: "EPHEMERAL",
            missingIndices: [3, 6, 8], // E, R, L are missing
            meaning: "Lasting for a very short time.",
            partOfSpeech: "Adjective",
            sentence: "The beauty of the sunset was ephemeral, lasting only a few minutes.",
        }
    ];

    let currentCell = null;
    let totalHintsUsed = 0;
    const MAX_HINTS = 2;

    // --- Core Functions ---

    function initializeGame() {
        puzzleContainer.innerHTML = '';
        totalHintsUsed = 0;
        messageElement.textContent = '';
        levelScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        inputModal.classList.add('hidden');

        GAME_WORDS.forEach((wordData, wordIndex) => {
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
            hintButton.textContent = `Hint (2 left)`;
            hintButton.dataset.wordIndex = wordIndex;
            hintButton.addEventListener('click', handleHint);

            wordPuzzleDiv.appendChild(hintButton);
            puzzleContainer.appendChild(wordPuzzleDiv);
        });
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
        if (input.length === 1) {
            currentCell.textContent = input;
            currentCell.classList.add('filled');
            closeModal();
        } else {
            // Optional: show a quick error in modal
            console.error("Please enter a single letter.");
        }
    }

    function handleHint(event) {
        if (totalHintsUsed >= MAX_HINTS) {
            messageElement.textContent = `No more hints left!`;
            messageElement.className = 'error';
            return;
        }

        const wordIndex = parseInt(event.target.dataset.wordIndex);
        const wordData = GAME_WORDS[wordIndex];
        
        // Find the first unfilled missing spot
        const letterBoxes = document.querySelectorAll(`.letter-box[data-word-index="${wordIndex}"].missing`);
        for (let box of letterBoxes) {
            if (!box.classList.contains('filled')) {
                const correctLetter = box.dataset.correctLetter;
                box.textContent = correctLetter;
                box.classList.add('filled');
                box.classList.remove('missing');
                box.removeEventListener('click', openModal);
                
                totalHintsUsed++;
                event.target.textContent = `Hint (${MAX_HINTS - totalHintsUsed} left)`;
                if (totalHintsUsed >= MAX_HINTS) {
                    event.target.disabled = true;
                }
                messageElement.textContent = `Hint used! ${MAX_HINTS - totalHintsUsed} remaining.`;
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
            messageElement.textContent = 'All words are correct!';
            messageElement.className = 'success';
            showResultScreen();
        } else {
            messageElement.textContent = 'Some words are incorrect. Try again!';
            messageElement.className = 'error';
        }
    }

    function showResultScreen() {
        levelScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        wordDetailsElement.innerHTML = '';

        GAME_WORDS.forEach(wordData => {
            const card = document.createElement('div');
            card.classList.add('detail-card');
            
            card.innerHTML = `
                <h3>${wordData.word}</h3>
                <p><strong>Part of Speech:</strong> ${wordData.partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${wordData.meaning}</p>
                <p><strong>Example Sentence:</strong> <em>${wordData.sentence}</em></p>
                <p><strong>Synonyms:</strong> (Feature requires database/API - placeholder)</p>
                <p><strong>Antonyms:</strong> (Feature requires database/API - placeholder)</p>
            `;
            wordDetailsElement.appendChild(card);
        });
    }

    // --- Event Listeners ---
    checkButton.addEventListener('click', checkGame);
    submitButton.addEventListener('click', handleSubmitLetter);
    cancelButton.addEventListener('click', closeModal);
    
    // Allow enter key press to submit letter from modal
    letterInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmitLetter();
        }
    });

    // Handle "Next Level" button (just reloads for the prototype)
    document.getElementById('next-level-button').addEventListener('click', initializeGame);

    // Start the game!
    initializeGame();
});
