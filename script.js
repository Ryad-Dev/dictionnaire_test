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
