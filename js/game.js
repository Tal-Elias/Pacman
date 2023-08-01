'use strict'

const WALL = '🪨'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍕'
const CHERRY = '🍒'

const gGame = {
    score: 0,
    isOn: false
}
var gBoard
var gfoodCount
var gCherryInterval = -1


function onInit() {
    gGame.isOn = true
    gGame.score = 0
    gfoodCount = 56

    gBoard = buildBoard()

    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)

    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    // checkFoodCount(gBoard)

    updateScore(0)
    toggleModal(true, true)
    gCherryInterval = setInterval(addCherry, 15000)
}

function toggleModal(isOpen, isWin) {
    const elModal = document.querySelector('.modal')
    elModal.style.display = isOpen ? 'none' : 'block'
    const elModalH2 = document.querySelector('.modal h2')
    elModalH2.innerText = isWin ? 'Victory 🏆' : 'You lost...'
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }

    board[1][1] = SUPER_FOOD
    board[1][8] = SUPER_FOOD
    board[8][1] = SUPER_FOOD
    board[8][8] = SUPER_FOOD

    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // update model
    gGame.score += diff
    // update dom
    document.querySelector('.score').innerText = gGame.score
}

// Counts food on board
function checkFoodCount(board) {
    gfoodCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (gBoard[i][j] === FOOD) gfoodCount++
        }
    }
    return gfoodCount
}

// Add new cherry every few seconds
function addCherry() {
    var emptyCells = getEmptyCells(gBoard)
    var emptyCell = emptyCells[getRandomIntExclusive(0, emptyCells.length)]
    if (!emptyCell) return
    // Model
    gBoard[emptyCell.i][emptyCell.j] = CHERRY
    // DOM
    renderCell(emptyCell, CHERRY)
}

// GameOver
function gameOver() {
    toggleModal(false, false)
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    renderCell(gPacman.location, '🪦')
    gGame.isOn = false
}

// Victory
function victory() {
    toggleModal(false, true)
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)
    gGame.isOn = false
}