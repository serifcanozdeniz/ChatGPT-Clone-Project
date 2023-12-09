const chatInput = document.querySelector("#chat-input")
const sendButton = document.querySelector("#send-btn")
const chatContainer = document.querySelector(".chat-container")
const themeButton = document.querySelector("#theme-btn")
const headerLogo = document.querySelector(".header-logo")
const deleteButton = document.querySelector("#delete-btn")

let userText = null

//const API_KEY = "gizli kalacak"

const initialHeight = chatInput.scrollHeight;

//sayfa yüklendiğinde yerel depodan(localstorage) veri yükler
const loadDataFromLocalStorage = () =>{
    //tema rengini kontrol eder ve geçerli temayı uygular
    const themeColor = localStorage.getItem("theme-color");
    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    //tema rengini yerel depoda günceller
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    //sohbet içeriğini yerel depodan alır veya varsayılan içeriği uygular
    const defaultText = `
    <div class="default-text">
     <img src="/images/chat.png" height="72" width="72" style="object-fit: cover;" >
     <h1>How can I help you today?</h1>

    </div>`;
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    // sayfayı sohbetin en altına kaydırır
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
};
loadDataFromLocalStorage();

const createElement = (html, className) => {
    // yeni div oluşturma ve belirtilen chat sınıfını ekleme
    // divin html içeriğini ayarlama
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML = html
    return chatDiv
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions"

    const pElement = document.createElement("p")

    // api talebi için özelliklerini ve verilerini tanımlama
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null,
        }),
    }
    //
    try {
        const response = await (await fetch(API_URL, requestOptions)).json()
        console.log(response)
        pElement.textContent = response.choices[0].text.trim()

    } catch (error) {
        console.log(error)

    }
    incomingChatDiv.querySelector(".typing-animation").remove()
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    localStorage.setItem("all-chats", chatContainer.innerHTML);

}

    const showTypingAnimation = () => {
    const html =
        `<div class="chat-content">
                <div class="chat-details">
                    <img src="/images/chatbot.jpg" alt="chat-images">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2"></div>
                        <div class="typing-dot" style="--delay: 0.3"></div>
                        <div class="typing-dot" style="--delay: 0.4"></div>
                    </div>
                </div>
                <span class="material-symbols-outlined">content_copy</span>
        </div>`

    const incomingChatDiv = createElement(html, "incoming")
    chatContainer.appendChild(incomingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    getChatResponse(incomingChatDiv)
}

    const handleOutGoingChat = () => {
    userText = chatInput.value.trim() // chatınput değerini alır ve fazladan boşlukları siler
    if (!userText) return // chatınputun için boş ise çalışmasın
    const html =
    `<div class="chat-content">
        <div class="chat-details">
        <img src="/images/serif.jpg" alt="user-images">
        <p>
            ${userText}
        </p>
        </div>
    </div>`

    const outgoingChatDiv = createElement(html, "outgoing")
    outgoingChatDiv.querySelector("p").textContent = userText
    document.querySelector(".default-text")?.remove()
    chatContainer.appendChild(outgoingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    setTimeout(showTypingAnimation, 500)
}


sendButton.addEventListener("click", handleOutGoingChat)

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", ()=>{
    if(confirm("Tüm sohbetler silinecektir. Emin misiniz ?")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter") {
        e.preventDefault();
        handleOutGoingChat();
    }
});