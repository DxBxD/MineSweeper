'use strict'

// Din Ben Dor - Sprint 1 - mInEsWeePer


// Game elements consts

const EMPTY = ''
const MINE = '<img src="img/mine.png">'


// Game global vars

var gBoard
var gLevel
var gGame


// INIT FUNCTION // 

function onInit() {

// Activating the gLevel object
gLevel = {
    SIZE: 4,
    MINES: 2
}

// Activating the gGame object
gGame = {
    isOn: false,
    isVictory: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// building the initial gBoard 
// (leaving space for different
// values of height and width on purpose)
gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)

// setting the mines for testing
gBoard[1][1].isMine = true
gBoard[1][1].cellClass = 'mine',
gBoard[1][1].cellContent =  MINE

gBoard[2][1].isMine = true
gBoard[2][1].cellClass = 'mine',
gBoard[2][1].cellContent =  MINE

// setting the mines count for each cell
setMinesNegsCount(gBoard)

// rendering the final game board
renderBoard(gBoard)
}


// a function for building the board
function buildBoard(height, width) {
var board = []

for (var i = 0; i < height; i++) {
    board[i] = []
    for (var j = 0; j < width; j++) {
        board[i][j] = {
            minesAroundCount: 0, 
            isShown: false, 
            isMine: false,
            isMarked: false,
            cellClass: 'empty',
            cellContent: EMPTY
        }
    }
}
return board
}


// a function for counting
// the mines around a cell
function countMineNegs(board, rowNum, colNum) {
    var mineCount = 0
    for (var i = rowNum - 1; i <= rowNum + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colNum - 1; j <= colNum + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowNum && j === colNum) continue
            var currCell = board[i][j]
            if (currCell.cellContent === MINE) mineCount++
        }
    }
    return mineCount
}


// a function for setting the mines
//count for each cell
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var currCellMineCount = countMineNegs(board, i, j)
            board[i][j].minesAroundCount = currCellMineCount

            if (board[i][j].isMine) continue

            switch (currCellMineCount) {
                case 1:
                    board[i][j].cellClass = 'one'
                    board[i][j].cellContent = '1'
                    break
                case 2:
                    board[i][j].cellClass = 'two'
                    board[i][j].cellContent = '2'
                    break
                case 3:
                    board[i][j].cellClass = 'three'
                    board[i][j].cellContent = '3'
                    break
                case 4:
                    board[i][j].cellClass = 'four'
                    board[i][j].cellContent = '4'
                    break
                case 5:
                    board[i][j].cellClass = 'five'
                    board[i][j].cellContent = '5'
                    break
                case 6:
                    board[i][j].cellClass = 'six'
                    board[i][j].cellContent = '6'
                    break
                case 7:
                    board[i][j].cellClass = 'seven'
                    board[i][j].cellContent = '7'
                    break
                case 8:
                    board[i][j].cellClass = 'eight'
                    board[i][j].cellContent = '8'
                    break
            }
        }
    }
}


// a board HTML rendering function

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var currCellContent = currCell.cellContent
            var currCellClass = currCell.cellClass
            
            // if (!currCell.isShown) currCellClass += ' hidden'

            strHTML += `<td data-i="${i}" data-j="${j}" class="${currCellClass}" onclick="onCellClicked()">${currCellContent}</td>`
        }
        strHTML += '</tr>'
    }

    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
    }


// a function that's activated when the gamer clicks on a cell 
// on the game board

function onCellClicked(elCell) {
    var i = elCell.dataset.i
    var j = elCell.dataset.j
    var currCell = gBoard[i][j]
    if (currCell.isMine) {
        gGame.isOn = false
        gGame.isVictory = false
    }
    checkGameOver()
}


function onCellMarked(elCell) {

}


function checkGameOver() {
    if (gGame.isOn) return
    if (!gGame.isVictory) {
        revealBoard(gBoard)
    }
}


function expandShown(board, elCell, i, j) {

}


function revealBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].isShown = true
        }
    }
    renderBoard(board)
}