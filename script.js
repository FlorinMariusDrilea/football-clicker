var game = {
    score: 0,
    totalScore: 0,
    totalClicks: 0,
    clickValue: 1,
    version: 0.000,

    addToScore: function(amount) {
        this.score += amount;
        this.totalScore += amount;
        display.updateScore();
    },

    getScorePerSecond: function() {
        var scorePerSecond = 0;
        for(i = 0; i < building.name.length; i++) {
            scorePerSecond += building.income[i] * building.count[i];
        }
        return scorePerSecond;
    }
};

var building = {
    name: [
        "Ball",
        "AmateurPlayer",
        "BasicManager"
    ],
    image: [
        "ball.jpg",
        "amateurPlayer.jpg",
        "basicManager.jpg"
    ],
    count: [0, 0, 0],
    income: [
        1,
        10,
        50
    ],
    cost: [
        10,
        100,
        500
    ],
    purchase: function(index) {
        if(game.score >= this.cost[index]){
            game.score -= this.cost[index];
            this.count[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.50);
            display.updateScore();
            display.updateShop();
            display.updateUpgrades();
        }
    }
};

var display = {
    updateScore: function() {
        document.getElementById("score").innerHTML = game.score;
        document.getElementById("scorePerSecond").innerHTML = game.getScorePerSecond();
        document.title = game.score + " balls - Football Clicker";
    },

    updateShop: function() {
        document.getElementById("shopContainer").innerHTML = "";
        for(i = 0; i < building.name.length; i++) {
            document.getElementById("shopContainer").innerHTML += '<table class="shopButton unselectable" onclick = "building.purchase('+i+')"><tr><td id = "image"><img src = "images/'+building.image[i]+'"></td><td id = "nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span> balls</p></td><td id = "amount"><span>'+building.count[i]+'</span></td></tr></table>';
        }
    },

    updateUpgrades: function() {
        document.getElementById("upgradeContainer").innerHTML = "";
        for(i = 0; i < upgrade.name.length; i++) {
            if(!upgrade.purchased[i]) {
                if(upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src = "images/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' balls)" onclick="upgrade.purchase('+i+')">';
                } else if(upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]) {
                    document.getElementById("upgradeContainer").innerHTML += '<img src = "images/' + upgrade.image[i] + '" title="' + upgrade.name[i] + ' &#10; ' + upgrade.description[i] + ' &#10; (' + upgrade.cost[i] + ' balls)" onclick="upgrade.purchase('+i+')">';
                }
            }
        }
    },

    updateAchievement: function() {
        document.getElementById("achievementContainer").innerHTML = "";
        for(i = 0; i < achievement.name.length; i++) {
            if(achievement.awarded[i]) {
                document.getElementById("achievementContainer").innerHTML += '<img src = "images/' + achievement.image[i]+'"title = "' + achievement.name[i] + ' &#10; ' + achievement.description[i] + '">';
            }
        }
    }
};

var upgrade = {
    name: [
        "BallUpgrade",
        "PlayerUpgrade",
        "ManagerUpgrade"
    ],
    description: [
        "Balls double scoring!",
        "Player doubles!",
        "Manager doubles!"
    ],
    image: [
        "ball.jpg",
        "amateurPlayer.jpg",
        "basicManager.jpg"
    ],
    type: [
        "building",
        "building",
        "building"
    ],
    cost: [
        300,
        500,
        1000
    ],
    buildingIndex: [
        0,
        1,
        2
    ],
    requirement: [
        10,
        50,
        100
    ],
    bonus: [
        2,
        2,
        2
    ],

    purchased: [false],
    
    purchase: function(index) {
        if(!this.purchased[index] && game.score >= this.cost[index]) {
            if (this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]) {
                game.score -= this.cost[index];
                building.income[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
                display.updateScore();
            } else if (this.type[index] == "click" && game.totalClicks >= this.requirement[index]) {
                game.score -= this.cost[index];
                game.clickValue *= this.bonus[index];
                this.purchased[index] = true;
                display.updateUpgrades();
                display.updateScore();
            }
        }
    }
};

var achievement = {
    name: [
        "Achievement 1",
        "Achievement 2",
        "Achievement 3"
    ],
    description: [
        "Buy 1 ball",
        "Gather 100 ball",
        "Click 1000 times on the ball"
    ],
    image: [
        "ball.jpg",
        "amateurPlayer.jpg",
        "basicManager.jpg"
    ],
    type: [
        "building",
        "score",
        "click"
    ],
    requirement: [
        1,
        100,
        1000
    ],
    objectIndex: [
        0,
        -1,
        -1
    ],
    awarded: [false, false, false],

    earn: function(index) {
        this.awarded[index] = true;
    }
};

function saveGame() {
    var gameSave = {
        score: game.score,
        totalScore: game.totalScore,
        totalClicks: game.totalClicks,
        clickValue: game.clickValue,
        version: game.version,
        buildingCount: building.count,
        buildingIncome: building.income,
        buildingCost: building.cost,
        upgradePurchased: upgrade.purchased,
        achievementAwarded: achievement.awarded
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame() {
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if(localStorage.getItem("gameSave") !== null) {
        if(typeof savedGame.score !== "undefined") game.score = savedGame.score;
        if(typeof savedGame.totalScore !== "undefined") game.totalScore = savedGame.totalScore;
        if(typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if(typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
        if(typeof savedGame.buildingCount !== "undefined") {
            for(i = 0; i < savedGame.buildingCount.length; i++) {
                building.count[i] = savedGame.buildingCount[i];
            }
        }
        if(typeof savedGame.buildingIncome !== "undefined") {
            for(i = 0; i < savedGame.buildingIncome.length; i++) {
                building.income[i] = savedGame.buildingIncome[i];
            }
        }
        if(typeof savedGame.buildingCost !== "undefined") {
            for(i = 0; i < savedGame.buildingCost.length; i++) {
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if(typeof savedGame.upgradePurchased !== "undefined") {
            for(i = 0; i < savedGame.upgradePurchased.length; i++) {
                upgrade.purchased[i] = savedGame.upgradePurchased[i];
            }
        }
        if(typeof savedGame.achievementAwarded !== "undefined") {
            for(i = 0; i < savedGame.achievementAwarded.length; i++) {
                achievement.awarded[i] = savedGame.achievementAwarded[i];
            }
        }
    }
}

function resetGame() {
    if (confirm("Are you sure you want to reset the game?")) {
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
}

setInterval(function() {
    saveGame();
}, 3000);

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.which == 83) {
        event.preventDefault();
        saveGame();
    }
}, false);

document.getElementById("clicker").addEventListener("click", function() {
    game.totalClicks++;
    game.addToScore(game.clickValue);
}, false);

window.onload = function() {
    loadGame();
    display.updateScore();
    display.updateUpgrades();
    display.updateAchievement();
    display.updateShop();
};

setInterval(function() {
    display.updateScore();
    display.updateUpgrades();
}, 10000)

setInterval(function () {
    for(i = 0; i < achievement.name.length; i++) {
        
        if(achievement.type[i] == "score" && game.totalScore >= achievement.requirement[i]) {
            achievement.earn(i);
        }
        else if (achievement.type[i] == "click" && game.totalClicks >= achievement.requirement[i]) {
            achievement.earn(i);
        }
        else if (achievement.type[i] == "building" && building.count[achievement.objectIndex[i]] >= achievement.requirement[i]) {
            achievement.earn(i);
        }
    }
    game.score += game.getScorePerSecond();
    game.totalScore += game.getScorePerSecond();
    display.updateScore();
    display.updateAchievement();
}, 1000);