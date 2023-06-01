'use strict'

// Din Ben Dor - Sprint 1 - mInEsWeePer


// Game elements consts

const EMPTY = ''

const elSmiley = document.querySelector('.smiley-button')

const SMILEY_SMILE = '<img src="img/smiley-smile.png">'
const SMILEY_SHOCKED = '<img src="img/smiley-shocked.png">'
const SMILEY_DEAD = '<img src="img/smiley-dead.png">'
const SMILEY_COOL = '<img src="img/smiley-cool.png">'

const CLICK_SOUND = new Audio('sound/click.mp3')
const WIN_SOUND = new Audio('sound/win.wav')
const MINE_SOUND = new Audio('sound/lose.wav')
const FLAG_SOUND = new Audio('sound/flag.mp3')
const START_SOUND = new Audio('sound/start.mp3')
CLICK_SOUND.volume = 0.1
WIN_SOUND.volume = 0.9
MINE_SOUND.volume = 0.5
FLAG_SOUND.volume = 0.7
START_SOUND.volume = 0.13


// Game designs for different board sizes consts

const EASY_DIFF_TD_STYLE = 'style="width: 76px; max-width: 76px; height: 82px; max-height: 82px; font-size: 24px;"'
const EASY_DIFF_IMG_STYLE = 'style="height: 45px; max-height:45px; width: 45px; max-width: 45px;"'
const MEDIUM_DIFF_TD_STYLE = 'style="width: 40px; max-width: 40px; height: 40px; max-height: 40px; font-size: 13px;"'
const MEDIUM_DIFF_IMG_STYLE = 'style="height: 24px; max-height:24px; width: 24px; max-width: 24px;"'
const HARD_DIFF_TD_STYLE = 'style="width: 26px; max-width: 26px; height: 26px; max-height: 26px; font-size: 10px;"'
const HARD_DIFF_IMG_STYLE = 'style="height: 17px; max-height:17px; width: 17px; max-width: 17px;"'


// Game global vars (gLevel activated to a default value)

var gGame
var gBoard
var gLevel = {
    SIZE: 12,
    MINES: 32,
    TD_STYLE: HARD_DIFF_TD_STYLE,
    IMG_STYLE: HARD_DIFF_IMG_STYLE
}
var gIsListenerOn = false
var gTimerInterval


// The init function // 

function onInit() {

    // gLevel = {
    //     SIZE: 4,
    //     MINES: 2
    // }

    // Activating the resized images for the game
    globalThis.MINE = `<img ${gLevel.IMG_STYLE} src="img/mine.png">`
    globalThis.FLAG = `<img ${gLevel.IMG_STYLE} src="img/flag.png">`

    // Activating the gGame object fresh    
    gGame = {
        isOn: true,
        isVictory: false,
        isFirstMove: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        livesLeft: 3
    }

    /* building the initial gBoard 
    (leaving space for different values of height and width on purpose) */
    gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE)


    // gBoard[1][1].isMine = true
    // gBoard[1][1].cellClass = 'mine',
    // gBoard[1][1].cellContent =  MINE

    // gBoard[2][1].isMine = true
    // gBoard[2][1].cellClass = 'mine',
    // gBoard[2][1].cellContent =  MINE


    // rendering the final game board
    renderBoard(gBoard)

    // Rendering the initial marks-left
    renderMarksLeft()

    // Rendering the initial Smiley button
    elSmiley.classList.add('three-lives-Left')
    renderSmiley()

    /* Deactivating right-click and sending the event 
    to my onCellMarked function*/
    if (!gIsListenerOn) {
        gIsListenerOn = true
        document.addEventListener('contextmenu', function (event) {
            event.preventDefault()
            onCellMarked(event.target)
        })
    }
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


// a board HTML rendering function

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var currCellContent = ''
            var currCellClass = ''
            currCellClass += currCell.cellClass

            if (currCell.isMarked) {
                currCellClass += ' hidden'
                currCellContent = FLAG
            } else if (!currCell.isShown) {
                currCellClass += ' hidden'
            } else {
                currCellContent += currCell.cellContent
            }

            strHTML += `<td ${gLevel.TD_STYLE} data-i="${i}" data-j="${j}" class="${currCellClass}" onclick="onCellClicked(this)">${currCellContent}</td>`
        }
        strHTML += '</tr>'
    }

    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
}


/* a function that is activated when the gamer 
clicks on a cell on the game board */

function onCellClicked(elCell) {
    if (!gGame.isOn) return

    var rowIdx = +elCell.dataset.i
    var colIdx = +elCell.dataset.j
    var currCell = gBoard[rowIdx][colIdx]

    if (currCell.isShown) return

    if (gGame.isFirstMove) {
        handleMines(gBoard, rowIdx, colIdx)
        activateTimer()
    }

    if (currCell.isMarked) return

    if (currCell.isMine) {
        handleMineClicked(currCell)
    } else if (currCell.cellContent === EMPTY) {
        revealCellAndNegs(gBoard, rowIdx, colIdx)
    } else {
        currCell.isShown = true
        elCell.classList.remove('hidden')
        gGame.shownCount++
        console.log(gGame.shownCount)
    }

    CLICK_SOUND.play()
    renderBoard(gBoard)

    checkGameOver()
}


/* a function that is activated when the gamer 
tries to mark a cell on the game board */

function onCellMarked(elCell) {
    if (!gGame.isOn) return

    if (elCell.tagName === 'IMG') {
        elCell = elCell.parentElement
    }

    var markLeft = gLevel.MINES - gGame.markedCount
    var rowIdx = +elCell.dataset.i
    var colIdx = +elCell.dataset.j
    var currCell = gBoard[rowIdx][colIdx]

    if (currCell.isShown) return

    if (!currCell.isMarked && markLeft > 0) {
        currCell.isMarked = true
        gGame.markedCount++
        // console.log(gGame.markedCount)
    } else if (currCell.isMarked) {
        currCell.isMarked = false
        gGame.markedCount--
        // console.log(gGame.markedCount)
    } else {
        return
    }

    renderMarksLeft()
    renderBoard(gBoard)
    FLAG_SOUND.play()
    checkGameOver()
}


// a function that handles what happens once the gamer clicks on a mine

function handleMineClicked(currCell) {
    if (currCell.isShown) return
    if (gGame.livesLeft === 3) {
        MINE_SOUND.play()
        gGame.livesLeft--
        gGame.markedCount++
        renderMarksLeft()
        currCell.cellClass = 'mine-clicked-3'
        elSmiley.classList.remove('three-lives-Left')
        elSmiley.classList.add('two-lives-Left')
        currCell.isShown = true
    } else if (gGame.livesLeft === 2) {
        MINE_SOUND.play()
        gGame.markedCount++
        renderMarksLeft()
        gGame.livesLeft--
        currCell.cellClass = 'mine-clicked-2'
        elSmiley.classList.remove('two-lives-Left')
        elSmiley.classList.add('one-life-Left')
        currCell.isShown = true
    } else {
        MINE_SOUND.play()
        gGame.markedCount++
        renderMarksLeft()
        gGame.livesLeft--
        currCell.cellClass = 'mine-clicked-1'
        elSmiley.classList.remove('one-life-Left')
        elSmiley.classList.add('zero-lives-Left')
        gGame.isOn = false
        gGame.isVictory = false
    }
}


// A function that handles the initial mine placing on the board

function handleMines(board, firstCellRowIdx, firstCellColIdx) {
    // setting the mines, while making sure to exclude the first cell
    setMines(board, gLevel.MINES, firstCellRowIdx, firstCellColIdx)

    // setting the mines count for each cell
    setMinesNegsCount(board)

    // Turns the first move switch
    gGame.isFirstMove = false

    // render the board changes
    renderBoard(board)
}


// a funtion for setting mines

function setMines(board, minesNum, firstCellrowIdx, firstCellcolIdx) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (i === firstCellrowIdx && j === firstCellcolIdx) continue
            emptyCells.push({ i: i, j: j })
        }
    }
    shuffle(emptyCells)
    for (var m = 0; m < minesNum; m++) {
        var randCell = emptyCells[m]
        gBoard[randCell.i][randCell.j].isMine = true
        gBoard[randCell.i][randCell.j].cellClass = 'mine'
        gBoard[randCell.i][randCell.j].cellContent = MINE
    }
}


// a function for setting the mines count for each cell

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            var currCellMineCount = countMineNegs(board, i, j)
            board[i][j].minesAroundCount = currCellMineCount

            if (board[i][j].isMine) continue
            if (board[i][j].minesAroundCount === 0) continue

            board[i][j].cellContent = String(currCellMineCount)

            switch (currCellMineCount) {
                case 1:
                    board[i][j].cellClass = 'one'
                    break
                case 2:
                    board[i][j].cellClass = 'two'
                    break
                case 3:
                    board[i][j].cellClass = 'three'
                    break
                case 4:
                    board[i][j].cellClass = 'four'
                    break
                case 5:
                    board[i][j].cellClass = 'five'
                    break
                case 6:
                    board[i][j].cellClass = 'six'
                    break
                case 7:
                    board[i][j].cellClass = 'seven'
                    break
                case 8:
                    board[i][j].cellClass = 'eight'
                    break
            }
        }
    }
}


// a function for countng the mines around a cell

function countMineNegs(board, rowIdx, colIdx) {
    var mineCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.cellContent === MINE) mineCount++
        }
    }
    return mineCount
}


/* a function for checking if the game 
is over after each reveal\marking */

function checkGameOver() {
    if (!gGame.isOn && !gGame.isVictory) {
        revealMines(gBoard)
    } else if (gGame.shownCount === gLevel.SIZE ** 2 - gLevel.MINES &&
        gGame.markedCount === gLevel.MINES) {
        gGame.isOn = false
        gGame.isVictory = true
        WIN_SOUND.play()
    }
    if (gGame.isOn) {
        renderSmiley()
        return
    }
    renderSmiley()
    clearInterval(gTimerInterval)
}


/* a function for revealing the mines 
when the gamer clicks on a mine */

function revealMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = true
                board[i][j].isMarked = false
                board[i][j].cellContent = MINE
            }
        }
    }
    renderBoard(board)
}


/* a function for revealing the curr cell
and its neighbor cells (*recursion added) */

function revealCellAndNegs(board, rowIdx, colIdx) {
    var currCell = board[rowIdx][colIdx]
    
    if (currCell.isShown || currCell.isMine) return
    
    currCell.isShown = true
    gGame.shownCount++

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.minesAroundCount === 0) {
                // console.log(gGame.shownCount)
                revealCellAndNegs(board, i, j)
            }
        }
    }
    renderBoard(board)
}


/* a function that's activated when 
the gamer clicks on a difficulty changing button */

function onDifficultyButtonClicked(tableSize, minesNum) {
    document.querySelector('.timer').innerText = '000'
    elSmiley.classList.remove('zero-lives-Left')
    elSmiley.classList.remove('one-life-Left')
    elSmiley.classList.remove('two-lives-Left')
    elSmiley.classList.remove('three-lives-Left')
    clearInterval(gTimerInterval)
    gLevel.SIZE = Number(tableSize)
    gLevel.MINES = Number(minesNum)
    switch (gLevel.SIZE) {
        case 4:
            gLevel.TD_STYLE = EASY_DIFF_TD_STYLE
            gLevel.IMG_STYLE = EASY_DIFF_IMG_STYLE
            break
        case 8:
            gLevel.TD_STYLE = MEDIUM_DIFF_TD_STYLE
            gLevel.IMG_STYLE = MEDIUM_DIFF_IMG_STYLE
            break
        case 12:
            gLevel.TD_STYLE = HARD_DIFF_TD_STYLE
            gLevel.IMG_STYLE = HARD_DIFF_IMG_STYLE
            break
    }
    START_SOUND.play()
    onInit()
}


/* a function that's activated when
the gamer clicks on smiley */

function onSmileyClicked() {
    elSmiley.classList.remove('zero-lives-Left')
    elSmiley.classList.remove('one-life-Left')
    elSmiley.classList.remove('two-lives-Left')
    elSmiley.classList.remove('three-lives-Left')
    renderSmiley()
    document.querySelector('.timer').innerText = '000'
    clearInterval(gTimerInterval)
    START_SOUND.play()
    onInit()
}


// a function for starting\restarting the timer

function activateTimer() {
    gTimerInterval = setInterval(function () {
        gGame.secsPassed++;
        renderTimer();
    }, 1000);
}


// a function for rendering the time every second

function renderTimer() {
    var timeStr = String(gGame.secsPassed)
    while (timeStr.length < 3) {
        timeStr = "0" + timeStr
    }
    document.querySelector('.timer').innerText = timeStr
}


// a function for rendering marks left

function renderMarksLeft() {
    var marksLeftStr = String(gLevel.MINES - gGame.markedCount)
    if (marksLeftStr.length < 2) {
        marksLeftStr = "00" + marksLeftStr
    } else if (marksLeftStr.length < 3) {
        marksLeftStr = "0" + marksLeftStr
    }
    document.querySelector('.marks-left').innerText = marksLeftStr
}


// a function for rendering smiley

function renderSmiley() {
    // console.log(elSmiley)
    elSmiley.innerHTML = SMILEY_SHOCKED

    setTimeout(() => {
        if (gGame.isOn) {
            elSmiley.innerHTML = SMILEY_SMILE
        } else {
            if (!gGame.isVictory) {
                elSmiley.innerHTML = SMILEY_DEAD
            } else {
                elSmiley.innerHTML = SMILEY_COOL
            }
        }
    }, 200)
}