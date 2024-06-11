document.getElementById('loadWords').addEventListener('click', loadWords);
document.getElementById('prevWord').addEventListener('click', showPreviousWord);
document.getElementById('nextWord').addEventListener('click', showNextWord);
document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('stopRecording').addEventListener('click', stopRecording);
document.getElementById('saveRecording').addEventListener('click', saveAudio);
document.getElementById('discardRecording').addEventListener('click', discardAudio);

let words = [];
let currentWordIndex = 0;
let mediaRecorder;
let audioChunks = [];
let audioBlob;

function loadWords() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const json = JSON.parse(event.target.result);
            words = json;
            currentWordIndex = 0;
            displayCurrentWord();
            updateNavigationButtons();
        };
        reader.readAsText(file);
    }
}

function displayCurrentWord() {
    const wordContainer = document.getElementById('wordContainer');
    wordContainer.innerHTML = words.length > 0 ? words[currentWordIndex].word : 'No words loaded';
}

function showPreviousWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        displayCurrentWord();
        updateNavigationButtons();
    }
}

function showNextWord() {
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        displayCurrentWord();
        updateNavigationButtons();
    }
}

function updateNavigationButtons() {
    document.getElementById('prevWord').disabled = currentWordIndex === 0;
    document.getElementById('nextWord').disabled = currentWordIndex === words.length - 1;
}

function startRecording() {
    if (words.length === 0) {
        alert('Please load a dictionary first.');
        return;
    }

    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;
    highlightCurrentWord();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = reviewAudio;
            mediaRecorder.start();
        });
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
}

function reviewAudio() {
    audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioPlayback = document.getElementById('audioPlayback');
    audioPlayback.src = audioUrl;

    document.getElementById('review-section').style.display = 'block';
    audioChunks = [];
}

function saveAudio() {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${words[currentWordIndex].word}.wav`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);

    document.getElementById('review-section').style.display = 'none';
    moveToNextWord();
}

function discardAudio() {
    document.getElementById('review-section').style.display = 'none';
    alert('Recording discarded.');
    moveToNextWord();
}

function moveToNextWord() {
    currentWordIndex++;
    if (currentWordIndex < words.length) {
        displayCurrentWord();
        updateNavigationButtons();
    } else {
        alert('All words recorded.');
    }
}

function highlightCurrentWord() {
    // Placeholder for any additional visual indication for the current word
}


/*
document.getElementById('loadWords').addEventListener('click', loadWords);
document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('stopRecording').addEventListener('click', stopRecording);

let words = [];
let currentWordIndex = 0;
let mediaRecorder;
let audioChunks = [];

function loadWords() {
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const json = JSON.parse(event.target.result);
            words = json.words;
            displayWords();
        };
        reader.readAsText(file);
    }
}

function displayWords() {
    const wordContainer = document.getElementById('wordContainer');
    wordContainer.innerHTML = '';

    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';

    words.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = word;
        li.id = `word-${index}`;
        wordList.appendChild(li);
    });
}

function startRecording() {
    if (words.length === 0) {
        alert('Please load a dictionary first.');
        return;
    }

    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;
    currentWordIndex = 0;
    highlightCurrentWord();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = saveAudio;
            mediaRecorder.start();
        });
}

function stopRecording() {
    mediaRecorder.stop();
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
}

function highlightCurrentWord() {
    if (currentWordIndex < words.length) {
        document.querySelectorAll('#wordList li').forEach(li => li.style.backgroundColor = '');
        const currentWordElement = document.getElementById(`word-${currentWordIndex}`);
        currentWordElement.style.backgroundColor = 'yellow';
    }
}

function saveAudio() {
    const blob = new Blob(audioChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${words[currentWordIndex]}.wav`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    audioChunks = [];

    currentWordIndex++;
    if (currentWordIndex < words.length) {
        highlightCurrentWord();
        mediaRecorder.start();
    } else {
        alert('Recording complete');
    }
}

*/