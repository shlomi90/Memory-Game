
//  Alon Segev 315870543
//  Shlomi Karavani 203576582



$(document).ready(function () {
    var cards = [];
    var flippedCards = [];
    var canFlip = true;
    var score = 0;
    var startTime, endTime;

    function generateCards(numPairs) {
        var icons = [
            "fa-globe",
            "fa-sun",
            "fa-moon",
            "fa-star",
            "fa-umbrella",
            "fa-envelope",
            "fa-rocket",
            "fa-tree",
            "fa-plane",
            "fa-book",
            "fa-cloud",
            "fa-gift",
            "fa-laptop",
            "fa-phone",
            "fa-paw",
        ];
        var selectedIcons = icons.slice(0, numPairs);

        for (var i = 0; i < numPairs; i++) {
            cards.push(selectedIcons[i]);
            cards.push(selectedIcons[i]);
        }

        shuffleCards(cards);
    }

    function shuffleCards(cards) {
        var currentIndex = cards.length;
        var temp, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temp = cards[currentIndex];
            cards[currentIndex] = cards[randomIndex];
            cards[randomIndex] = temp;
        }
    }

    function startGame(playerName, numPairs) {
        generateCards(numPairs);

        $("#player-heading").text("Player: " + playerName);
        $("#score").text("Score: 0");

        var board = $(".board");
        board.empty();

        for (var i = 0; i < numPairs * 2; i++) {
            var card = $("<div class='card'></div>");
            var icon = $("<i></i>").addClass("fas").addClass(cards[i]);
            var cardInner = $("<div class='card-inner'></div>").append(icon);
            card.append(cardInner);
            board.append(card);
        }

        $(".card").click(function () {
            if (!canFlip || $(this).hasClass("matched") || $(this).hasClass("flipped") || flippedCards.length === 2) {
                return;
            }

            $(this).addClass("flipped");

            flippedCards.push($(this));

            if (flippedCards.length === 2) {
                canFlip = false;
                checkCards();
            }
        });

        startTimer();
    }

    function checkCards() {
        var card1 = flippedCards[0];
        var card2 = flippedCards[1];

        if (card1.find("i").hasClass(card2.find("i").attr("class"))) {
            card1.addClass("matched");
            card2.addClass("matched");

            score += 2;
            $("#score").text("Score: " + score);

            flippedCards = [];

            if (score === cards.length) {
                stopTimer();
                showEndGameMessage();
            } else {
                canFlip = true;
            }
        } else {
            setTimeout(function () {
                card1.removeClass("flipped");
                card2.removeClass("flipped");

                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    function showEndGameMessage() {
        var totalTime = Math.floor((endTime - startTime) / 1000);
        var message = "Congratulations! You completed the game in " + totalTime + " seconds.";
        $("#score").text(message);
        $("#timer").hide();
        $("#restart-btn").show();
    }

    function startTimer() {
        startTime = new Date().getTime();

        setInterval(function () {
            var currentTime = new Date().getTime();
            var elapsedTime = currentTime - startTime;

            var seconds = Math.floor(elapsedTime / 1000);
            $("#timer").text("Time: " + seconds + "s");
        }, 1000);
    }

    function stopTimer() {
        endTime = new Date().getTime();
    }

    $("#game-setup").submit(function (event) {
        event.preventDefault();

        var playerName = $("#player-name").val();
        var numPairs = parseInt($("#card-amount").val());

        $("#game-setup").hide();
        $("#game-container").show();

        startGame(playerName, numPairs);
    });

    $("#restart-btn").click(function () {
        $("#game-container").hide();
        $("#game-setup").show();
        $("#restart-btn").hide();

        cards = [];
        flippedCards = [];
        canFlip = true;
        score = 0;
        startTime = null;
        endTime = null;

        $("#timer").text("Time: 0s");
    });
});
