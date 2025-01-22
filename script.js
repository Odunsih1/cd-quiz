let nameInput = document.getElementById("nameInput");
let startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (nameInput.value) {
    let name = JSON.stringify(nameInput.value);
    localStorage.setItem("name", name);
    window.location.href = "quiz.html";
  } else {
    alert("Please enter your name");
  }
});
