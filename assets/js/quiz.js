// global variables
var score = 0;
var questionIndex = 0;

// DOM elements
var questionsDiv = document.querySelector("#questionsDiv");
var wrapper = document.querySelector("#wrapper");
var highscoreLink = document.querySelector(".highScore-link")
var playAgainLink = document.querySelector("#goBack")
var clearLink = document.querySelector("#reset");
var questionContainer = document.querySelector(".question-container");
var highscoreContainer = document.querySelector(".highScore-container");

// variables for the timer
var timerEl = document.querySelector("#start");
var currentTime = document.querySelector("#currentTime");
var ulCreate = document.createElement("ul");
var secondsLeft = 60;
var holdInterval = 0;
var penalty = 5;


// displays timer and starts whenever 'start quiz' button is pressed. whenever timer hits 0 gameOver function will be called
timerEl.addEventListener("click", function () {
    if (holdInterval === 0) {
        holdInterval = setInterval(function () {
            secondsLeft--;
            currentTime.textContent = "00:" + secondsLeft;
            if (secondsLeft < 10) {
                currentTime.textContent = "00:0" + secondsLeft;
            }
            if (secondsLeft <= 0) {
                clearInterval(holdInterval);
                gameOver();
                currentTime.textContent = "Time's up!";
            }
        }, 1000);
    }
    render(questionIndex);
    return;
});

// questions, choices, and answers in an array.
var questions = [
    {
        question: 'What does HTML stand for?',
        choices: ['Hyper text markdown links', 'Hyper Text Markup Language', 'Home tool makes lasers', 'Hype too many lasers!'],
        answer: 'Hyper Text Markup Language'
    },
    {
        question: 'Which is NOT a data type?',
        choices: ['Boolean', 'Numbers', 'String', 'CSS'],
        answer: 'CSS'
    },
    {
        question: 'Which is NOT a CSS size type?',
        choices: ['cm', 'px', 'meters', 'em'],
        answer: 'meters'
    },
    {
        question: 'Which method prints out "Hello World" to the console in JavaScript?',
        choices: ['print("Hello World");', 'System.out.print("Hello World");', 'console.log("Hello World");', 'Console.Write("Hello World");'],
        answer: 'console.log("Hello World");'
    }
];


// renders questions and choices to page
render = (questionIndex) => {
    questionsDiv.innerHTML = "";
    ulCreate.innerHTML = "";

    // loops through entire questions array
    for (var i = 0; i < questions.length; i++) {
        // appends question title only
        var userQuestion = questions[questionIndex].question;
        var userChoices = questions[questionIndex].choices;
        questionsDiv.textContent = userQuestion;
    }
    // appends questions and choices
    var rule = document.createElement("hr");
    questionsDiv.appendChild(rule);
    userChoices.forEach(function (newItem) {
        var listItem = document.createElement("li");
        var listBtn = document.createElement("btn")
        questionsDiv.appendChild(ulCreate);
        listBtn.textContent = newItem;
        ulCreate.appendChild(listItem);
        listItem.appendChild(listBtn);
        listBtn.setAttribute("class", "btn");
        listBtn.addEventListener("click", (compare));
    });
    var rule = document.createElement("hr");
    questionsDiv.appendChild(rule);
};

// compares the questions to choices
compare = (event) => {
    var element = event.target;

    if (element.matches("btn")) {
        var createDiv = document.createElement("div");
        createDiv.setAttribute("id", "createDiv");
        // correct conditional
        if (element.textContent == questions[questionIndex].answer) {
            score++;
            createDiv.textContent = "Correct!";
            // incorrect conditional
        } else {
            // deducting 5 seconds off of the timer
            secondsLeft = secondsLeft - penalty;
            createDiv.textContent = "Incorrect! The correct answer is:  " + questions[questionIndex].answer;
        };
    };

    // questionIndex determines number question user is on
    questionIndex++;
    if (questionIndex >= questions.length) {
        // All done will append last page with user stats
        gameOver();
        createDiv.textContent = "End of quiz!" + " " + "You got  " + score + "/" + questions.length + " Correct!";
    } else {
        render(questionIndex);
    };
    questionsDiv.appendChild(createDiv);
};

// appends game over page
gameOver = () => {
    questionsDiv.innerHTML = "";
    currentTime.innerHTML = "";

    // heading "Game Over!"
    var createH1 = document.createElement("h1");
    createH1.setAttribute("id", "createH1");
    createH1.textContent = "Game Over!";
    questionsDiv.appendChild(createH1);

    // paragraph
    var createP = document.createElement("p");
    createP.setAttribute("id", "createP");
    questionsDiv.appendChild(createP);

    // calculates time remaining and replaces it with score
    if (secondsLeft >= 0) {
        var timeLeft = secondsLeft;
        var createP2 = document.createElement("p");
        clearInterval(holdInterval);
        createP.textContent = "Your final score is: " + timeLeft;
        questionsDiv.appendChild(createP2);
    };

    // label
    var createLabel = document.createElement("label");
    createLabel.setAttribute("id", "createLabel");
    createLabel.textContent = "Enter your initials: ";
    questionsDiv.appendChild(createLabel);

    // user inputting their initials
    var createInput = document.createElement("input");
    createInput.setAttribute("type", "text");
    createInput.setAttribute("id", "initials");
    createInput.textContent = "";
    questionsDiv.appendChild(createInput);

    // submit button
    var createSubmit = document.createElement("button");
    createSubmit.setAttribute("type", "submit");
    createSubmit.setAttribute("id", "Submit");
    createSubmit.setAttribute("class", "btn");
    createSubmit.textContent = "Submit";
    questionsDiv.appendChild(createSubmit);

    // event listener to capture initials and score for local storage 
    createSubmit.addEventListener("click", function () {
        var initials = createInput.value;
        if (initials === null) {
            alert("Please enter your initials!");
        } else {
            var finalScore = {
                initials: initials,
                score: timeLeft
            }
            console.log(finalScore);
            var allScores = localStorage.getItem("allScores");
            if (allScores === null) {
                allScores = [];
            } else {
                allScores = JSON.parse(allScores);
            }
            allScores.push(finalScore);
            var newScore = JSON.stringify(allScores);
            localStorage.setItem("allScores", newScore);
        };

        // displays highscore content from local storage
        renderHighScores = () => {
            // looping through all highscores in local storage
            for (var i = 0; i < allScores.length; i++) {
                var highscoreUL = document.querySelector("#highScore");
                var highscoreLi = document.createElement("li");
                highscoreLi.innerHTML = (allScores[i]).initials + ": " + (allScores[i]).score;
                highscoreUL.appendChild(highscoreLi);
            };
        };

        // clears highscores
        clearLink.addEventListener("click", function () {
            var highscoreUL = document.querySelector("#highScore");
            window.localStorage.clear();
            highscoreUL.remove();
        });

        // replaces quiz box content with highscore content
        questionContainer.setAttribute("style", "display: none !important")
        highscoreContainer.setAttribute("style", "display: block !important")
        renderHighScores();
    });
};