let nameInput = document.getElementById("nameInput");
let startBtn = document.getElementById("startBtn");
let pops = document.getElementById("pops");

startBtn.addEventListener("click", (stop) => {
  stop.preventDefault();
  if (nameInput.value) {
    let name = JSON.stringify(nameInput.value);
    localStorage.setItem("name", name);
    window.location.href = "quiz.html";
  } else {
    setTimeout(() => {
      pops.classList.remove("popup");
      pops.classList.add("pop");
      setTimeout(() => {
        pops.classList.add("popup");
        pops.classList.remove("pop");
      }, 5000);
    }, 0);
  }
});

let foot = document.getElementById("foot");

function time() {
  let date = new Date().toUTCString();
  foot.innerHTML = date;
}
// time();
setInterval(time, 1000);
