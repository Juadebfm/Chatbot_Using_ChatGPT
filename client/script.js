import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

//For when the bot thinks, creating dynamic ellipse
function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

//To give the bot response a typing/human feel
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

//generating a unique id for every message so to map over them
function generateUniqueId() {
  //using the current time and date
  const timestamp = Date.now();
  //make it even more random
  const randomNumber = Math.random();
  //even more random by creating a hex string
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

//creating different colors for the ai and user message
function chatStripe(isAi, value, uniqueId) {
  return `
<div class="wrapper ${isAi && "ai"}">
  <div class="chat">
    <div class="profile">
      <img 
        src="${isAi ? bot : user}"
        alt="${isAi ? "bot" : "user"}"
      />
    </div>
    <div class="message" id=${uniqueId}>
      ${value}
    </div>
  </div>
</div>    
    `;
}

//main function to handle submit
const handleSubmit = async (e) => {
  //default browser behavior after clicking submit on a form is to reload the browser, "e.preventDefault" stops that from happening
  e.preventDefault();

  //get the data typed into the form
  const data = new FormData(form);

  //generate the user chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  //clear the text area input
  form.reset();

  //bot chat stripe
  const uniqueId = generateUniqueId();
  //generate the bot chat stripe // that space in the string will be filled up by function "chatstripe"
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  //this allows the windows scrolldown so the user can see new messages
  chatContainer.scrollTop = chatContainer.scrollHeight;

  //fetch newly created div
  const messageDiv = document.getElementById(uniqueId);

  //turn on the loader// call the loader
  loader(messageDiv);

  //fetch data from the server

  const response = await fetch("https://chatbot-juadebfm.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);

  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
  }
  const err = await response.text();

  messageDiv.innerHTML = "Something went wrong";

  alert(err);
};

//calling the handlesubmit function
form.addEventListener("submit", handleSubmit);

//using the the "enter" key to submit
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
    console.log("Wait for AI");
  }
});
