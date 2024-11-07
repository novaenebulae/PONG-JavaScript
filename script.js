// Ajout de la possibilité de démarrer le jeu avec la touche Espace
const scene = document.querySelector("#scene");
const score_bar = document.querySelector("#score_bar");
const startButton = document.querySelector("#button");
const countdownElement = document.querySelector("#countdown");
const balle = document.querySelector("#balle");
const barreL = document.querySelector("#barreL");
const barreR = document.querySelector("#barreR");

const sceneWidth = window.innerWidth - window.innerWidth / 5;
const sceneHeight = window.innerHeight - window.innerHeight / 4;

let balleWidth = 30;
let balleHeight = 30;

let barreLHeight = 150;
const barreLWidth = 20;

let barreRHeight = 150;
const barreRWidth = 20;

const positionbarreLX = 200;
const positionbarreRX = sceneWidth - 200 - barreRWidth;

let positionBalleX, positionBalleY, positionbarreLY, positionbarreRY, vitesseBalleX, vitesseBalleY;
let appuiToucheZ = false;
let appuiToucheS = false;
let appuiToucheHaut = false;
let appuiToucheBas = false;
let end;
let gameInterval;
let vitesseBalle = 7;

let scoreJoueurL = 0;
let scoreJoueurR = 0;

// Fonction d'initialisation du round : place la balle au centre et lui donne un angle de départ "jouable"
function init_round() {
    positionBalleX = sceneWidth / 2 - balleWidth / 2;
    positionBalleY = sceneHeight / 2 - balleHeight / 2;

    let angle;

    // Génère un angle aléatoire "jouable" compris entre 20° et 50° par rapport à l'horizontale
    if (Math.random() < 0.5) {
        // Angle autour de 0° (droite)
        angle = Math.random() < 0.5
            ? (Math.random() * (0.87 - 0.35) + 0.35)
            : -(Math.random() * (0.87 - 0.35) + 0.35);
    } else {
        // Angle autour de 180° (gauche)
        angle = Math.PI + (Math.random() * (0.87 - 0.35) + 0.35) * (Math.random() < 0.5 ? -1 : 1);
    }

    // Calcule les composantes X et Y de la vitesse à partir de l'angle
    vitesseBalleX = vitesseBalle * Math.cos(angle);
    vitesseBalleY = vitesseBalle * Math.sin(angle);

    positionbarreLY = sceneHeight / 2 - barreLHeight / 2;
    positionbarreRY = sceneHeight / 2 - barreRHeight / 2;

    scene.style.width = sceneWidth + "px";
    scene.style.height = sceneHeight + "px";

    balle.style.width = balleWidth + "px";
    balle.style.height = balleHeight + "px";
    balle.style.display = "block";

    balle.style.top = positionBalleY + "px";
    balle.style.left = positionBalleX + "px";

    barreL.style.left = positionbarreLX + "px";
    barreL.style.top = positionbarreLY + "px";
    barreL.style.width = barreLWidth + "px";
    barreL.style.height = barreLHeight + "px";

    barreR.style.left = positionbarreRX + "px";
    barreR.style.top = positionbarreRY + "px";
    barreR.style.width = barreRWidth + "px";
    barreR.style.height = barreRHeight + "px";

    score_bar.innerHTML = "<p style='background-color: blue;'>SCORE JOUEUR #1 : " + scoreJoueurL + "</p>" +
                          "<p style='background-color: red;'>SCORE JOUEUR #2 : " + scoreJoueurR + "</p>";
}

// Fonction de démarrage du round avec un compte à rebours
function start_round() {
    let seconds = 3;

    init_round();

    countdownElement.style.visibility = "visible";

    // Démarre un compte à rebours de 3 secondes avant le début du round
    const countdownInterval = setInterval(() => {
        countdownElement.innerText = seconds;

        if (seconds < 0) {
            clearInterval(countdownInterval);
            startButton.innerText = "GAME STARTED";
            countdownElement.style.visibility = "hidden";
            countdownElement.innerText = "";
            gameInterval = setInterval(round, 15);
        }
        seconds--;
    }, 1000);
}

// Fonction principale d'exécution d'un round
function round() {
    mouvement_balle();
    mouvement_barres();
    update_scores();
    vitesseBalle += 0.001; // Augmente la vitesse de la balle avec le temps
}

// Fonction de mouvement de la balle avec gestion des collisions
function mouvement_balle() {
    // Collisions avec les murs supérieur et inférieur
    if (positionBalleY <= 0 || positionBalleY >= sceneHeight - balleHeight) {
        vitesseBalleY = -vitesseBalleY;
    }

    // Collisions avec la barre gauche (barreL)
    if (
        positionBalleX <= positionbarreLX + barreLWidth &&
        positionBalleX + balleWidth >= positionbarreLX &&
        positionBalleY + balleHeight >= positionbarreLY &&
        positionBalleY <= positionbarreLY + barreLHeight
    ) {
        vitesseBalleX = -vitesseBalleX;
        vitesseBalleY += (positionBalleY - (positionbarreLY + barreLHeight / 2)) / 10;
    }

    // Collisions avec la barre droite (barreR)
    if (
        positionBalleX + balleWidth >= positionbarreRX &&
        positionBalleX <= positionbarreRX + barreRWidth &&
        positionBalleY + balleHeight >= positionbarreRY &&
        positionBalleY <= positionbarreRY + barreRHeight
    ) {
        vitesseBalleX = -vitesseBalleX;
        vitesseBalleY += (positionBalleY - (positionbarreRY + barreRHeight / 2)) / 10;
    }

    positionBalleX += vitesseBalleX;
    positionBalleY += vitesseBalleY;

    // Empêche la balle de se bloquer contre les rebords
    positionBalleX = Math.max(0, Math.min(positionBalleX, sceneWidth - balleWidth));
    positionBalleY = Math.max(0, Math.min(positionBalleY, sceneHeight - balleHeight));

    balle.style.left = positionBalleX + "px";
    balle.style.top = positionBalleY + "px";
}

// Fonction de mouvement des barres de jeu, contrôlées par les touches du clavier
function mouvement_barres() {
    if (appuiToucheZ) {
        positionbarreLY = Math.max(0, positionbarreLY - 10);
    }
    if (appuiToucheS) {
        positionbarreLY = Math.min(sceneHeight - barreLHeight, positionbarreLY + 10);
    }

    if (appuiToucheHaut) {
        positionbarreRY = Math.max(0, positionbarreRY - 10);
    }
    if (appuiToucheBas) {
        positionbarreRY = Math.min(sceneHeight - barreRHeight, positionbarreRY + 10);
    }

    barreL.style.top = positionbarreLY + "px";
    barreR.style.top = positionbarreRY + "px";
}

// Mise à jour des scores et vérification des conditions de fin de jeu
function update_scores() {
    if (positionBalleX <= 0) {
        balle.style.display = "none";
        scoreJoueurR += 1;
        clearInterval(gameInterval);
        gameInterval = null;
        check_next_round();
    } else if (positionBalleX >= sceneWidth - balleWidth) {
        balle.style.display = "none";
        scoreJoueurL += 1;
        clearInterval(gameInterval);
        gameInterval = null;
        check_next_round();
    }
}

// Vérifie si un joueur a gagné et gère le prochain round
function check_next_round() {
    // Condition de victoire : le premier joueur à 5 points gagne
    if (scoreJoueurL >= 5) {
        score_bar.innerHTML = "<p style = 'background-color: white'>VICTOIRE DU JOUEUR 1 !</p>";
        end = true;
    } else if (scoreJoueurR >= 5) {
        score_bar.innerHTML = "<p style = 'background-color: white'>VICTOIRE DU JOUEUR 2 !</p>";
        end = true;
    }

    // Si personne n'a gagné, démarre un nouveau round
    if (!end) {
        start_round();
    } else {
        startButton.innerText = "RETRY";
        startButton.disabled = false;
    }
}

// Événements de contrôle des barres
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") appuiToucheHaut = true;
    if (e.code === "ArrowDown") appuiToucheBas = true;
    if (e.code === "KeyW") appuiToucheZ = true;
    if (e.code === "KeyS") appuiToucheS = true;
    if (e.code === "Space" && !gameInterval && !end) startButton.click();
});

document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp") appuiToucheHaut = false;
    if (e.code === "ArrowDown") appuiToucheBas = false;
    if (e.code === "KeyW") appuiToucheZ = false;
    if (e.code === "KeyS") appuiToucheS = false;
});

// Initialisation du jeu et configuration du bouton de démarrage
init_round();

startButton.onclick = function() {
    startButton.disabled = true;
    end = false;
    scoreJoueurL = 0;
    scoreJoueurR = 0;
    start_round();
};
