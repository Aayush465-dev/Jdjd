let mainText = '';
let extractedData = {};
let isLocked = false;

// Handle file upload for the main file
document.getElementById('mainFileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            mainText = e.target.result;
            processMainFile(mainText);
        };
        reader.readAsText(file);
    }
});

// Process the main file by extracting text and assigning unique IDs
function processMainFile(text) {
    extractedData = {};
    let regex = /\"text\":\"(.*?)\"/g;
    let match;
    let uniqueId = 1;

    while ((match = regex.exec(text)) !== null) {
        const extractedText = match[1];
        extractedData[uniqueId] = extractedText;
        uniqueId++;
    }

    // Show the extracted data in output
    createOutputFile(extractedData);

    // Show download link for filtered file
    createDownloadableFilteredFile(extractedData);

    // Unlock the change file section
    document.getElementById('changeFileSection').classList.remove('hidden');
}

// Create the output with unique IDs and extracted text
function createOutputFile(data) {
    let outputText = '';
    for (let id in data) {
        outputText += `{${id}} - ${data[id]}\n`;
    }
    document.getElementById('output').textContent = outputText;
}

// Create a downloadable filtered text file
function createDownloadableFilteredFile(data) {
    let fileContent = '';
    for (let id in data) {
        fileContent += `{${id}} - ${data[id]}\n`;
    }

    // Create a blob with the filtered text
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Set the download link
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = url;

    // Show the download section
    document.getElementById('downloadSection').classList.remove('hidden');
}

// Handle change file upload and apply changes
document.getElementById('applyChangesButton').addEventListener('click', function () {
    const changeFile = document.getElementById('changeFileInput').files[0];
    if (changeFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const changeText = e.target.result;
            applyChanges(changeText);
        };
        reader.readAsText(changeFile);
    }
});

// Apply changes from the change file based on unique IDs
function applyChanges(changeText) {
    let regex = /\{(\d+)\} - (.*?)\n/g;
    let match;
    let changes = {};

    while ((match = regex.exec(changeText)) !== null) {
        const id = match[1];
        const newText = match[2];
        changes[id] = newText;
    }

    for (let id in changes) {
        const oldText = extractedData[id];
        const newText = changes[id];
        mainText = mainText.replace(`\"text\":\"${oldText}\"`, `\"text\":\"${newText}\"`);
    }

    document.getElementById('output').textContent = 'Changes applied successfully.\n' + mainText;
}

// Lock/Unlock system using localStorage
document.getElementById('lockButton').addEventListener('click', function () {
    localStorage.setItem('lockedMainFile', mainText);
    isLocked = true;
    alert('File locked successfully.');
    document.getElementById('unlockButton').classList.remove('hidden');
});

document.getElementById('unlockButton').addEventListener('click', function () {
    localStorage.removeItem('lockedMainFile');
    isLocked = false;
    alert('File unlocked.');
    document.getElementById('unlockButton').classList.add('hidden');
});

// Check if the file is already locked in localStorage
window.onload = function () {
    const lockedFile = localStorage.getItem('lockedMainFile');
    if (lockedFile) {
        mainText = lockedFile;
        processMainFile(mainText);
        alert('Locked file loaded.');
        document.getElementById('unlockButton').classList.remove('hidden');
    }
};
