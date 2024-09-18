let extractedData = [];
let clipboardText = "";
let lockStatus = false;
let extractedContentById = {};
let fileContent = "";

// File upload and filter extraction
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent = e.target.result;
        };
        reader.readAsText(file);
    }
});

document.getElementById("filterBtn").addEventListener("click", function() {
    if (fileContent) {
        const regex = /"text":"(.*?)"/g;
        extractedData = [...fileContent.matchAll(regex)].map((match, index) => ({
            id: index + 1,
            text: match[1]
        }));
        renderExtractedData();
    }
});

function renderExtractedData() {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    extractedData.forEach(data => {
        const contentBox = document.createElement("div");
        contentBox.classList.add("content-box");
        contentBox.innerHTML = `
            <div id="content-${data.id}">
                <p class="extracted-text">${data.text}</p>
                <button onclick="copyText(${data.id})">Copy</button>
                <textarea id="input-${data.id}" placeholder="Paste or edit text here"></textarea>
                <button onclick="pasteText(${data.id})">Paste</button>
            </div>`;
        outputDiv.appendChild(contentBox);
    });
}

// Copy and paste functions
function copyText(id) {
    clipboardText = extractedData.find(data => data.id === id).text;
}

function pasteText(id) {
    if (clipboardText) {
        document.getElementById(`input-${id}`).value = clipboardText;
    }
}

// Show/Hide ID functionality
document.getElementById("showIdBtn").addEventListener("click", function() {
    extractedData.forEach(data => {
        const contentBox = document.getElementById(`content-${data.id}`);
        const idElement = document.createElement("p");
        idElement.classList.add("content-id");
        idElement.innerText = `ID: ${data.id}`;
        contentBox.appendChild(idElement);
    });
});

document.getElementById("hideIdBtn").addEventListener("click", function() {
    document.querySelectorAll(".content-id").forEach(el => el.remove());
});

// Overview Button functionality
document.getElementById("overviewBtn").addEventListener("click", function() {
    const overviewDisplay = document.getElementById("overviewDisplay");
    let overviewText = "";
    extractedData.forEach(data => {
        overviewText += `{${data.id}} ${data.text}\n\n`;
    });
    overviewDisplay.value = overviewText;
    overviewDisplay.style.display = "block";
});

// Overview Input functionality
document.getElementById("overviewInputBtn").addEventListener("click", function() {
    const overviewInput = document.getElementById("overviewInput");
    overviewInput.value = document.getElementById("overviewDisplay").value;
    overviewInput.style.display = "block";
});

document.getElementById("lockBtn").addEventListener("click", function() {
    lockStatus = true;
});

document.getElementById("unlockBtn").addEventListener("click", function() {
    lockStatus = false;
});

// Build file functionality
document.getElementById("buildFileBtn").addEventListener("click", function() {
    let newFileContent = fileContent;

    extractedData.forEach(data => {
        const newText = document.getElementById(`input-${data.id}`).value;
        if (newText.trim() !== "") {
            newFileContent = newFileContent.replace(`"text":"${data.text}"`, `"text":"${newText}"`);
        } else {
            alert(`ID ${data.id} is missing new data!`);
            return;
        }
    });

    const blob = new Blob([newFileContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "updated_file.txt";
    link.click();
});
