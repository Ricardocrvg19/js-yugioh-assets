const state = {
    
    score: {
        playerscore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    }, 
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },  
    fieldCards: {
        player: document.getElementById('player-card'),
        computer: document.getElementById('computer-card'),
    },
    playerSides : {
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX: document.querySelector('#computer-cards'),
    },
    actions:{
        buttons: document.getElementById('next-duel'),
    },

  
}

const  playerSides = {
        player1: 'player-cards',
        computer: 'computer-cards',
    }

const pathImages = './src/assets/icons/'

const cardData = [
    
    {
        id: 0,
        name: 'Dragon',
        type: 'Paper', 
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
        
    },    
    {
        id: 1,
        name: 'Exodia',
        type: 'Rock', 
        img: `${pathImages}exodia.png`,
        WinOf: [2],
        LoseOf: [0],

    },    
    {

        id: 2,
        name: 'Magician',
        type: 'Scissors', 
        img: `${pathImages}magician.png`,
        WinOf: [0],
        LoseOf: [1],

    }
]

async function getRandomCardId() {
    const randomIndex =  Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    if(fieldSide === playerSides.player1){

        cardImage.addEventListener('click', () =>{
            setCardsField(cardImage.getAttribute('data-id'))
        })
         cardImage.addEventListener('mouseover', () => {
        drawSelectCard(idCard)
    })
    }
   

    return cardImage
}


async function removeAllCardsImages() {
    let cards = state.playerSides.computerBOX;
    let imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove())

    cards = state.playerSides.player1BOX;
    imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove())
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Attribute: ' + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage)

    }
}


async function setCardsField(cardId) {
    await removeAllCardsImages()

    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'

    hiddenCardDetails()

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore();
    await drawButton(duelResults)
}

async function hiddenCardDetails() {

    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';
}

async function drawButton(text) {
    state.actions.buttons.innerText = text.toUpperCase();
    state.actions.buttons.style.display = 'block';
}

async function updateScore() {
    state.score.scoreBox.innerText = `win: ${state.score.playerscore} | lose ${state.score.computerScore}`
}


async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = 'draw';
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = 'win';
        state.score.playerscore++;
    } 

    
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = 'lose';
        state.score.computerScore++;
    }

    await playAudio(duelResults)

    return duelResults
}

async function resetDuel() {

    state.cardSprites.avatar.src = '';
    state.actions.buttons.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';


    init()

}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play()
}

function init() {
    drawCards(5, playerSides.player1)
    drawCards(5, playerSides.computer)

    const bgm = document.getElementById('bgm');
    bgm.play()
}

init()