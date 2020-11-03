const els ={
    score : null,
    wordToFind : null,
    letterChoice : null,
    recharger : null
};

let lettres = [];
let mot ="";
let motsMapping = [];
let lettresMapping = [];
let scoreCount = 0;
let scoreMax = 7;

const init = () => {
 
    //Récupérer éléments HTML
    els.score = document.getElementById("score");
    els.wordToFind = document.getElementById("wordToFind");
    els.letterChoice = document.getElementById("letterChoice");
    els.recharger = document.getElementById("recharger");
    //afficher potence
    canvas();
    //Choisir un mot
    mot = selectionMot();
    //  -create word mapping
    motsMapping = getMotsMapping(mot);
    //Obtenir les lettres de l'alphabet
    lettres = obtenirLettres();
    // -create choices mapping
    lettresMapping = getLettresMapping(lettres);
    //Afficher le mot
    afficherMot(motsMapping);
    //Afficher le resultat du choix
    afficherLettres(lettresMapping);
    //Afficher le score
    afficherScore();
    //Evenement
    //  -au click de souris
    els.letterChoice.addEventListener('click', ({ target }) => {
        //evt:mouseEvent evt.target => { target }
        if (target.matches('button') === true) {
            checkLettre(target.innerHTML);
        };
    });
    //  -au clavier
    document.addEventListener('keydown', ({ key, code }) => {
        //evt:KeyboardEvent evt.keyCode => {keyCode}
        const lettre = String(key).toUpperCase();
        if (/^[0-9a-zA-Z]$/.test(key)) {
            checkLettre(lettre);
        }
    });
};

const checkLettre = (lettre) => {
    let isLetterInWord = false;
    let isAllLettersFound = true;

    motsMapping.forEach((lettreMap) => {
        if (lettreMap.lettre === lettre) {
            lettreMap.isVisible = true;
            isLetterInWord = true;
        }
        if (lettreMap.isVisible === false) {
            isAllLettersFound = false;
        }
    });

    lettresMapping.forEach((lettreMap) => {
        if (lettreMap.lettre === lettre) {
            lettreMap.isChosen = true;
        }
    });

    afficherLettres(lettresMapping);

    if (isLetterInWord === true) {
        afficherMot(motsMapping);
    } else {
        scoreCount++;
        afficherScore();
        pendrelependu(scoreCount);
    }

    if (scoreCount === scoreMax) {
        endGame();
    }

    if (isAllLettersFound) {
        winGame();
    }
};

window.addEventListener('load',()=>{
    init ();
});