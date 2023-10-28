let chatHistory = [];

function textGenerator() {
    const inputElement = document.getElementById("myInput");
    const url = "http://127.0.0.1:5000/textGeneration";

    const userChat = {
        role: "user",
        content: inputElement.value
    };

    chatHistory.push(userChat);

    const data = {
        chat: chatHistory
    };

    console.log(data);

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((parsedData) => {
            chatHistory.push({
                role: "assistant",
                content: parsedData.gpt_choice.message.content
            });
             console.log(chatHistory)
            displayChatHistory();
          
            inputElement.value = "";
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation: " + error.message);
        });
}

// Function to display the entire chat history in the right container
function displayChatHistory() {
    const rightContainer = document.getElementById("right");
    rightContainer.innerHTML = "";

    for (const chat of chatHistory) {
        const chatMessage = document.createElement("p");
        chatMessage.textContent = `[${chat.role}]: ${chat.content}`;
        rightContainer.appendChild(chatMessage);
    }
}

function emotionRecogination() {
    let inputElement = document.getElementById("myInput");
    const url = "http://127.0.0.1:5000/analyze";
    let data = {
        text: inputElement.value,
    }

    console.log(data)

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((data) => {
            return data.json().then(parsedData => {
                appendData(parsedData.result)
            });
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation: " + error.message);
        });
}

let file = ""


function getfile(event){
    file = event.target.files[0]
    // console.log(event)

    

}

function fileUploader() {
    const fileInput = document.getElementById("save_file");
    const newFile = fileInput.files[0];
    console.log(typeof(newFile));
    const formData = new FormData();
    formData.append("pdFile", newFile.name); 
    const url = "http://127.0.0.1:5000/summarization";

    console.log(formData);

    fetch(url, {
        method: "POST",
        body: formData, // Send the FormData object directly
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((parsedData) => {
            appendData(parsedData.data);
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation: " + error.message);
        });
}






function appendData(result) {
    let div = document.createElement("div")
    div.append(result)
    document.getElementById("right").append(div)
}