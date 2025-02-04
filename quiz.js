let namee = JSON.parse(localStorage.getItem("name"));
let bdy = document.getElementById("h1");
bdy.innerHTML = `${namee}!`;
console.log(namee);

const params = new URLSearchParams({
  limit: "5", // Number of questions to fetch
  category: "", // Category of questions
  difficulty: "", // Difficulty level
});

function submit() {
  const category = document.getElementById("categories");
  console.log(category.value);
  if (category.value === "Next.js") {
    params.set("category", "Next.js");
  } else if (category.value === "nodeJS") {
    params.set("category", "nodeJS");
  } else if (category.value === "React") {
    params.set("category", "React");
  } else if (category.value === "Linux") {
    params.set("category", "Linux");
  } else {
    alert("select category");
  }

  //   switch (category.value) {
  //     case "Next.js":

  //         break;

  //     default:
  //         break;
  //   }
  const level = document.getElementById("level");
  if (level.value === "easy") {
    params.set("difficulty", "easy");
  } else if (level.value === "medium") {
    params.set("difficulty", "medium");
  } else if (level.value === "hard") {
    params.set("difficulty", "hard");
  } else {
    alert("select a level");
  }
  getQuest();
}

const API_KEY = "NtIMAlsNUBEBdD9TXe4FHt7KILeO52g1GTVgWUr5";

async function getQuest() {
  const url = "https://quizapi.io/api/v1/questions";
  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY, // Pass API key in headers
      },
    });
    const data = await response.json();
    console.log(data);
    startQuiz(data);
    //   info2(data);
  } catch (e) {
    let pops = document.getElementById("pops");
    setTimeout(() => {
      pops.classList.remove("popup");
      pops.classList.add("pop");
      pops.innerHTML = `<h2>Unable to get questions at the moment, try later.</h2>`;
      setTimeout(() => {
        pops.classList.add("popup");
        pops.classList.remove("pop");
      }, 5000);
    }, 0);
    console.warn(e);
  }
}

let currentQuestionIndex = 0;
let correctCount = 0;

// Fetch quiz data
function startQuiz(data) {
  // Start the quiz with the fetched data
  renderQuestion(data, 0);
}

function renderQuestion(data, index) {
  // Ensure `data` is properly passed here
  if (index >= data.length) {
    showResults(data);
    return;
  }

  const questionData = data[index];
  const {
    // category,
    question,
    answers,
    correct_answers,
    multiple_correct_answers,
    explanation,
  } = questionData;
  //   localStorage.setItem("quizCategory", category);
  // Get correct answers
  const correctKeys = Object.entries(correct_answers)
    .filter(([key, value]) => value === "true") // Find the correct ones
    .map(([key]) => key.replace("_correct", "")); // Remove '_correct' to match 'answers'

  const correctAnswers = correctKeys.map((key) => answers[key]);

  // Render question and options
  document.getElementById("questions1").innerHTML = `
    <h2>${question}</h2>
    <div>
      <label><input type="checkbox" name="answer" value="${
        answers.answer_a
      }" /> ${answers.answer_a}</label><br/>
      <label><input type="checkbox" name="answer" value="${
        answers.answer_b
      }" /> ${answers.answer_b}</label><br/>
      <label><input type="checkbox" name="answer" value="${
        answers.answer_c
      }" /> ${answers.answer_c}</label><br/>
      <label><input type="checkbox" name="answer" value="${
        answers.answer_d
      }" /> ${answers.answer_d}</label><br/>
    </div>
    <button class="m-5 pr-[10px] pl-[10px] bg-green-500 text-white text-[20px] rounded-[50px] mt-10 transition ease-in-out delay-150  focus:-translate-y-1 focus:scale-110 hover:bg-green-600 duration-300 " onclick="submitAnswer(${index}, ${JSON.stringify(
    correctAnswers
  ).replace(/"/g, "&quot;")}, ${JSON.stringify(data).replace(
    /"/g,
    "&quot;"
  )})">Next</button>
  `;
}

function submitAnswer(index, correctAnswers, data) {
  // Collect selected answers
  const selectedAnswers = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map((input) => input.value);

  // Compare selected answers with correct answers
  const isCorrect =
    selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every((answer) => correctAnswers.includes(answer));

  // Update score if correct
  if (isCorrect) {
    correctCount++;
    localStorage.setItem("correctAnswers", correctCount.toString());
  }

  // Store user answer for review
  const userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");
  userAnswers.push({
    questionIndex: index,
    correctAnswers,
    userSelected: selectedAnswers,
    isCorrect,
  });
  localStorage.setItem("userAnswers", JSON.stringify(userAnswers));

  // Move to the next question
  currentQuestionIndex++;
  renderQuestion(data, currentQuestionIndex);
}

function showResults(data) {
  const totalQuestions = data.length;
  const score = parseInt(localStorage.getItem("correctAnswers"));
  const category = localStorage.getItem("quizCategory");
  const userAnswers = JSON.parse(localStorage.getItem("userAnswers") || "[]");

  let reviewHtml = userAnswers
    .map(
      (entry) => `
      <div>
        <h3>Question ${entry.questionIndex + 1}: ${
        data[entry.questionIndex].question
      }</h3>
        <p><strong>Correct Answer(s):</strong> ${entry.correctAnswers.join(
          ", "
        )}</p>
        <p><strong>Your Answer(s):</strong> ${
          entry.userSelected.length > 0
            ? entry.userSelected.join(", ")
            : "No answer selected"
        }</p>
        <p class="mb-5"><strong>Result:</strong> ${
          entry.isCorrect ? "Correct ✅" : "Incorrect ❌"
        }</p>
      </div>
    `
    )
    .join("");
  document.getElementById("questions1").innerHTML = `
    <h2>Quiz Completed</h2>
    <p>Category: ${category}</p>
    <p>Total Questions: ${totalQuestions}</p>
    <p>Correct Answers: ${score}</p>
    <p class="mb-5">Score: ${((score / totalQuestions) * 100).toFixed(2)}%</p>
    <hr/>
    ${reviewHtml}
  `;
  //   if ((score / totalQuestions) * 100 < 50) {
  //     document.getElementById(
  //       "questions2"
  //     ).innerHTML = `<h1>Sorry you failed the quiz</h1>`;
  //   } else if ((score / totalQuestions) * 100 >= 50) {
  //     document.getElementById(
  //       "questions2"
  //     ).innerHTML = `<h1>Congratulations you passed the quiz</h1>`;

  // Clear quiz data from localStorage
  localStorage.removeItem("correctAnswers");
  localStorage.removeItem("quizCategory");
  localStorage.removeItem("userAnswers");
}

// Start the quiz

// function info1(data) {
//   let questions = document.getElementById("questions1");
//   const {
//     question,
//     answers,
//     correct_answers,
//     multiple_correct_answers,
//     explanation,
//   } = data[0];
//   questions.innerHTML = `<h1>${question}</h1>
//   <button>${answers.answer_a}</button> <button>${answers.answer_b}</button> <button>${answers.answer_c}</button> <button>${answers.answer_d}</button>`;
// }
// function info2(data) {
//   let questions = document.getElementById("questions2");

//   const {
//     category,
//     question,
//     answers,
//     correct_answers,
//     multiple_correct_answers,
//     explanation,
//   } = data[1];

//   // Get correct answers
//   const correctKeys = Object.entries(correct_answers)
//     .filter(([key, value]) => value === "true") // Find the correct ones
//     .map(([key]) => key.replace("_correct", "")); // Remove '_correct' to match 'answers'

//   // Map correct keys to their corresponding answers
//   const correctAnswers = correctKeys.map((key) => answers[key]);

//   // Render the question and answer options
//   questions.innerHTML = `
//       <h1>${category}</h1>
//       <h2>${question}</h2>
//       <div>
//         <label><input type="checkbox" name="answer" value="${
//           answers.answer_a
//         }" /> ${answers.answer_a}</label><br/>
//         <label><input type="checkbox" name="answer" value="${
//           answers.answer_b
//         }" /> ${answers.answer_b}</label><br/>
//         <label><input type="checkbox" name="answer" value="${
//           answers.answer_c
//         }" /> ${answers.answer_c}</label><br/>
//         <label><input type="checkbox" name="answer" value="${
//           answers.answer_d
//         }" /> ${answers.answer_d}</label><br/>
//       </div>
//       <button onclick="check()">Submit Answer</button>
//       <p id="feedback"></p>
//       ${
//         explanation ? `<p><strong>Explanation:</strong> ${explanation}</p>` : ""
//       }
//     `;

//   // Attach the correct answers to a global variable or data attribute
//   questions.setAttribute(
//     "data-correct-answers",
//     JSON.stringify(correctAnswers)
//   );
// }

// function check() {
//   const questions = document.getElementById("questions2");

//   // Retrieve correct answers from the data attribute
//   const correctAnswers = JSON.parse(
//     questions.getAttribute("data-correct-answers")
//   );

//   // Get all selected answers
//   const selectedAnswers = Array.from(
//     document.querySelectorAll('input[name="answer"]:checked')
//   ).map((input) => input.value);

//   // Compare selected answers with correct answers
//   const isCorrect =
//     selectedAnswers.length === correctAnswers.length &&
//     selectedAnswers.every((answer) => correctAnswers.includes(answer));

//   // Provide feedback to the user
//   const feedback = document.getElementById("feedback");
//   if (isCorrect) {
//     feedback.textContent = "Correct! Well done!";
//     feedback.style.color = "green";
//   } else {
//     feedback.textContent = `Incorrect. The correct answer(s): ${correctAnswers.join(
//       ", "
//     )}`;
//     feedback.style.color = "red";
//   }
// }

// const API_URL = "https://quizapi.io/api/v1/categories";

// const fetchCategories = async () => {
//   try {
//     const response = await fetch(API_URL, {
//       method: "GET",
//       headers: {
//         "X-Api-Key": API_KEY, // Pass API key in headers
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error: ${response.status} - ${response.statusText}`);
//     }

//     const categories = await response.json();
//     console.log("Available Categories:", categories?.name);
//     return categories;
//   } catch (error) {
//     console.error("Error fetching categories:", error.message);
//   }
// };

// // Call the function
// fetchCategories();

// const renderCategoriesDropdown = async () => {
//   const categories = await fetchCategories();
//   const dropdown = document.getElementById("categories-dropdown");

//   if (categories) {
//     categories.forEach((category) => {
//       const option = document.createElement("option");
//       option.value = category;
//       option.textContent = category;
//       dropdown.appendChild(option);
//     });
//   }
// };

// // Example HTML: <select id="categories-dropdown"></select>
// renderCategoriesDropdown();

// function dark() {
//   const dark = document.getElementById("bdy");
//   dark.classList.add("bg-black");
//   dark.classList.add("text-white");
// }
