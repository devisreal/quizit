import axios from "./libs/axios.js";

const scores = { correct: 0, incorrect: 0 };

async function getQuestions() {
  try {
    const { data } = await axios.get(
      "https://opentdb.com/api.php?amount=3&category=26&difficulty=easy&type=multiple"
    );
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

let questions = await getQuestions();

let currentQuestion = 0;
let currentQuestionNumber = 0;
const currentQuestionEl = document.querySelector(
  ".stats-bar__questions-current"
);
currentQuestionEl.innerHTML = currentQuestionNumber;
const totalQuestionsEl = document.querySelector(".stats-bar__questions-total");
totalQuestionsEl.innerHTML = questions.length;

const statsCorrectEl = document.querySelector(".stats-bar__correct-number");
const statsIncorrectEl = document.querySelector(".stats-bar__incorrect-number");
const quizContainer = document.querySelector(".quiz");
const quizQuestionEl = document.querySelector(".quiz__question");
const quizSubmitButton = document.querySelector(".quiz__submit-button");
const optionsContainerEl = document.querySelector(".quiz__options");
const validationMsgEl = document.querySelector(".quiz__validation-msg");
const quizRetryLink = document.querySelector(".quiz__submit__retry-link");

const selectedClassName = "quiz__option--selected";
const removeSelectedClassName = function () {
  const selectedOptionEl = document.querySelector(`.${selectedClassName}`);
  if (selectedOptionEl) {
    selectedOptionEl.classList.remove(selectedClassName);
  }
};

const createOption = (question) => {
  const optionEl = document.createElement("button");
  optionEl.classList.add("quiz__option");
  optionEl.innerHTML = question;
  optionsContainerEl.appendChild(optionEl);

  optionEl.addEventListener("click", (event) => {
    removeSelectedClassName();
    event.target.classList.add(selectedClassName);
  });
};

const renderQuestions = (currentQuestion) => {
  if (currentQuestionNumber < questions.length) {
    currentQuestionNumber++;
    currentQuestionEl.innerHTML = currentQuestionNumber;
    quizQuestionEl.innerHTML = questions[currentQuestion].question;
    optionsContainerEl.innerHTML = "";

    const allQuestions = [
      ...questions[currentQuestion].incorrect_answers,
      questions[currentQuestion].correct_answer,
    ];

    allQuestions.forEach((question) => {
      createOption(question);
    });
  } else {
    quizQuestionEl.innerHTML = "";
    optionsContainerEl.innerHTML = "";
    quizSubmitButton.innerHTML = "Answered";
    quizSubmitButton.setAttribute("disabled", "true");
    quizRetryLink.style.display = "inline";
  }
};

quizSubmitButton.addEventListener("click", () => {
  const selectedOption = document.querySelector(".quiz__option--selected");

  if (selectedOption === null) {
    validationMsgEl.innerHTML = "Pick an option!";
    return;
  } else {
    validationMsgEl.innerHTML = "";
  }

  if (
    `${selectedOption.innerHTML}` ===
    `${questions[currentQuestion].correct_answer}`
  ) {
    scores.correct++;
  } else {
    scores.incorrect++;
  }

  if (currentQuestion < questions.length) {
    currentQuestion++;
    renderQuestions(currentQuestion);
  } else {
    validationMsgEl.innerHTML = "Max number of tries";
  }

  removeSelectedClassName();
  statsCorrectEl.innerHTML = scores.correct;
  statsIncorrectEl.innerHTML = scores.incorrect;
});

renderQuestions(currentQuestion);
