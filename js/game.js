'use strict'

// Din Ben Dor - Sprint 1 - mInEsWeePer


// Game elements consts

const EMPTY = ''

const elSmiley = document.querySelector('.smiley-button')

const SMILEY_SMILE = '<img src="img/smiley-smile.png">'
const SMILEY_SHOCKED = '<img src="img/smiley-shocked.png">'
const SMILEY_DEAD = '<img src="img/smiley-dead.png">'
const SMILEY_COOL = '<img src="img/smiley-cool.png">'

const SAFECLICK3 = '<img src="img/shield-3.png">'
const SAFECLICK2 = '<img src="img/shield-2.png">'
const SAFECLICK1 = '<img src="img/shield-1.png">'
const SAFECLICK0 = '<img src="img/shield-0.png">'

const HINT3 = '<img src="img/lightbulb-yellow-3.png">'
const HINT2 = '<img src="img/lightbulb-yellow-2.png">'
const HINT1 = '<img src="img/lightbulb-yellow-1.png">'
const HINT0 = '<img src="img/lightbulb-yellow-0.png">'

const MEGAHINT1 = '<img src="img/lightbulb-blue-1.png">'
const MEGAHINT0 = '<img src="img/lightbulb-blue-0.png">'

const CLICK_SOUND = new Audio('sound/click.mp3')
const WIN_SOUND = new Audio('sound/win.wav')
const MINE_SOUND = new Audio('sound/lose.wav')
const FLAG_SOUND = new Audio('sound/flag.mp3')
const START_SOUND = new Audio('sound/start.mp3')
const TERMINATOR_SOUND = new Audio('sound/terminator.mp3')
const CONSTRUCTION_SOUND = new Audio('sound/construction.mp3')
const SET_MINE_SOUND = new Audio('sound/set_mine.mp3')
const UNDO_SOUND = new Audio('sound/undo.mp3')
const SAFECLICK_SOUND = new Audio('sound/safeclick.mp3')
const HINT_SOUND = new Audio('sound/hint.mp3')
const MEGAHINT_SOUND = new Audio('sound/megahint.mp3')

CLICK_SOUND.volume = 0.1
WIN_SOUND.volume = 0.4
MINE_SOUND.volume = 0.3
FLAG_SOUND.volume = 0.5
START_SOUND.volume = 0.13
TERMINATOR_SOUND.volume = 0.25
CONSTRUCTION_SOUND.volume = 0.3
SET_MINE_SOUND.volume = 0.1
UNDO_SOUND.volume = 1
HINT_SOUND.volume = 1
MEGAHINT_SOUND.volume = 0.3


// Game designs for different board sizes consts

const EASY_DIFF_TD_STYLE = 'style="width: 76px; max-width: 76px; height: 86.5px; max-height: 82px; font-size: 24px;"'
const EASY_DIFF_IMG_STYLE = 'style="height: 43.5px; max-height:43.5px; width: 43.5px; max-width: 43.5px;"'
const MEDIUM_DIFF_TD_STYLE = 'style="width: 42.3px; max-width: 42.3px; height: 42.3px; max-height: 42.3px; font-size: 13px;"'
const MEDIUM_DIFF_IMG_STYLE = 'style="height: 24px; max-height:24px; width: 24px; max-width: 24px;"'
const HARD_DIFF_TD_STYLE = 'style="width: 27.5px; max-width: 27.5px; height: 27.5px; max-height: 27.5px; font-size: 10px;"'
const HARD_DIFF_IMG_STYLE = 'style="height: 17px; max-height:17px; width: 17px; max-width: 17px;"'


// Game global vars (gLevel activated to a default value)

var gGame
var gBoard
var gLevel = {
    SIZE: 12,
    MINES: 32,
    isConstructed: false,
    minesPlacedCounter: 0,
    TD_STYLE: HARD_DIFF_TD_STYLE,
    IMG_STYLE: HARD_DIFF_IMG_STYLE
}
var gIsListenerOn = false
var gTimerInterval
var gPrevBoards = []


// The init function // 

function onInit() {

    // gLevel = {
    //     SIZE: 4,
    //     MINES: 2
    // }

    // Activating the resized images for the game
    globalThis.MINE = `<img ${gLevel.IMG_STYLE} src="img/mine.png">`
    globalThis.FLAG = `<img ${gLevel.IMG_STYLE} src="img/flag.png">`
    globalThis.SHIELD = `<img ${gLevel.IMG_STYLE} src="img/shield.png"`

    // Activating the gGame object fresh    
    gGame = {
        isOn: true,
        isVictory: false,
        isFirstMove: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        livesLeft: 3,
        currMineCount: gLevel.MINES,
        hintsLeft: 3,
        megaHintsLeft: 1,
        safeClicksLeft: 3,
        isHintOn: false,
        isMegaHintOn: false,
        megaHintStepCounter: 0,
        megaHintFirstStepIdxs: null,
        megaHintSecondStepIdxs: null,
        isTerminatorOn: true,
        prevBoards: []
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

    // var tds = document.querySelectorAll('td')
    // for (var i = 0; i < tds.length; i++) {
    //     tds[i].classList.add('easy');
    // }

    // Rendering the initial marks-left
    renderMarksLeft()

    // Rendering the initial Smiley button
    renderSmiley()

    // Rendering Hints Button
    renderHintButton()

    // Rendering Megahint Button
    renderMegahintButton()

    // Rendering Safeclicks Button
    renderSafeClicksButton()

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
    var isShownVal = false
    if (gLevel.isConstructed) isShownVal = true

    for (var i = 0; i < height; i++) {
        board[i] = []
        for (var j = 0; j < width; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: isShownVal,
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

        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            var currCellContent = ''
            var currCellClass = ''
            currCellClass += currCell.cellClass

            if (currCell.isMarked) {
                currCellClass += ' hidden'
                currCellContent = FLAG
            } else if (!currCell.isShown && currCell.cellContent !== SHIELD) {
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
    gGame.prevBoards.push(strHTML)
}


/* a function that is activated when the gamer 
clicks on a cell on the game board */

function onCellClicked(elCell) {
    if (!gGame.isOn) return

    var rowIdx = +elCell.dataset.i
    var colIdx = +elCell.dataset.j
    var currCell = gBoard[rowIdx][colIdx]

    if (gLevel.isConstructed) {
        SET_MINE_SOUND.play()
        if (gLevel.minesPlacedCounter <= gLevel.MINES) {
            if (currCell.isMine) return
            currCell.isMine = true
            currCell.cellClass = 'mine'
            currCell.cellContent = MINE
            gLevel.minesPlacedCounter++
            renderBoard(gBoard)
        } 
        if (gLevel.minesPlacedCounter === gLevel.MINES) {
            gGame.isFirstMove = false
            setTimeout(() => {
                hideAllCells(gBoard)
                handleMines(gBoard)
            }, 500)
        }
        return
    }

    if (currCell.isShown) return

    if (gGame.isFirstMove) {
        handleMines(gBoard, rowIdx, colIdx)
        gGame.isFirstMove = false
        activateTimer()
        saveCurrBoardForUndo()
    }

    if (currCell.isMarked) return

    if (gGame.isMegaHintOn) {
        handleMegaHint(rowIdx, colIdx)
        return
    }


    if (gGame.isHintOn) {
        revealCellAndNegs(gBoard, rowIdx, colIdx)
        setTimeout(() => {
            hideCellAndNegs(gBoard, rowIdx, colIdx)
        }, 1000)
        gGame.isHintOn = false
        CLICK_SOUND.play()
        return
    }

    if (currCell.isMine) {
        saveCurrBoardForUndo()
        handleMineClicked(currCell)
    } else if (currCell.cellContent === EMPTY) {
        saveCurrBoardForUndo()
        revealCellAndNegsRecursive(gBoard, rowIdx, colIdx)
    } else {
        saveCurrBoardForUndo()
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

    var marksLeft = gGame.currMineCount - gGame.markedCount
    var rowIdx = +elCell.dataset.i
    var colIdx = +elCell.dataset.j
    var currCell = gBoard[rowIdx][colIdx]

    if (currCell.isShown) return

    if (!currCell.isMarked && marksLeft > 0) {
        saveCurrBoardForUndo()
        currCell.isMarked = true
        gGame.markedCount++
        // console.log(gGame.markedCount)
    } else if (currCell.isMarked) {
        saveCurrBoardForUndo()
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
        renderSmiley()
        currCell.isShown = true
    } else if (gGame.livesLeft === 2) {
        MINE_SOUND.play()
        gGame.markedCount++
        renderMarksLeft()
        gGame.livesLeft--
        currCell.cellClass = 'mine-clicked-2'
        renderSmiley()
        currCell.isShown = true
    } else {
        MINE_SOUND.play()
        gGame.markedCount++
        renderMarksLeft()
        gGame.livesLeft--
        currCell.cellClass = 'mine-clicked-1'
        renderSmiley()
        gGame.isOn = false
        gGame.isVictory = false
    }
}


// A function that handles the initial mine placing on the board

function handleMines(board, firstCellRowIdx, firstCellColIdx) {
    // setting the mines, while making sure to exclude the first cell and construction mode
    if (!gLevel.isConstructed) {
        setMines(board, gGame.currMineCount, firstCellRowIdx, firstCellColIdx)
    } else {
        gLevel.isConstructed = false
        gLevel.minesPlacedCounter = 0
    }

    // setting the mines count for each cell
    setMinesNegsCount(board)

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
            if (board[i][j].minesAroundCount === 0) {
                board[i][j].cellContent = EMPTY
                continue
            }

            board[i][j].cellContent = String(currCellMineCount)

            if (board[i][j].cellClass === 'terminated') continue

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
    } else if (gGame.shownCount === gLevel.SIZE ** 2 - gGame.currMineCount &&
        gGame.markedCount === gGame.currMineCount) {
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

function revealCellAndNegsRecursive(board, rowIdx, colIdx) {
    var currCell = board[rowIdx][colIdx]

    if (currCell.isShown || currCell.isMine) return

    currCell.isShown = true
    gGame.shownCount++

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            // if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            if (currCell.minesAroundCount === 0) {
                // console.log(gGame.shownCount)
                revealCellAndNegsRecursive(board, i, j)
            } else if (!currCell.isShown) {
                currCell.isShown = true
                gGame.shownCount++
            }
        }
    }
    renderBoard(board)
}


function revealCellAndNegs(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            // if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            currCell.isShown = true
        }
    }
    renderBoard(board)
}


function hideCellAndNegs(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            // if (i === rowIdx && j === colIdx) continue
            var currCell = board[i][j]
            currCell.isShown = false
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
    gPrevBoards = []
    gLevel.isConstructed = false
    gLevel.minesPlacedCounter = 0
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
    gPrevBoards = []
    gLevel.isConstructed = false
    gLevel.minesPlacedCounter = 0
    onInit()
}


// a function for starting\restarting the timer

function activateTimer() {
    
    if (gTimerInterval) {
        clearInterval(gTimerInterval)
    }
    
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
    if (timeStr.length > 3) {
        timeStr = "999"
    }
    document.querySelector('.timer').innerText = timeStr
}


// a function for rendering marks left

function renderMarksLeft() {
    var marksLeft = gGame.currMineCount - gGame.markedCount
    var marksLeftStr
    if (marksLeft < 0) {
        marksLeftStr = "000"
    } else if (marksLeft < 10) {
        marksLeftStr = "00" + marksLeft
    } else if (marksLeft < 100) {
        marksLeftStr = "0" + marksLeft
    }
    document.querySelector('.marks-left').innerText = marksLeftStr
}


// a function for rendering smiley

function renderSmiley() {
    // console.log(elSmiley)
    elSmiley.innerHTML = SMILEY_SHOCKED

    if (gGame.livesLeft === 3) {
        elSmiley.classList.remove('two-lives-Left')
        elSmiley.classList.remove('one-life-Left')
        elSmiley.classList.remove('zero-lives-Left')
        elSmiley.classList.add('three-lives-Left')
    } else if (gGame.livesLeft === 2) {
        elSmiley.classList.remove('three-lives-Left')
        elSmiley.classList.remove('one-life-Left')
        elSmiley.classList.remove('zero-lives-Left')
        elSmiley.classList.add('two-lives-Left')
    } else if (gGame.livesLeft === 1) {
        elSmiley.classList.remove('three-lives-Left')
        elSmiley.classList.remove('two-lives-Left')
        elSmiley.classList.remove('zero-lives-Left')
        elSmiley.classList.add('one-life-Left')
    } else {
        elSmiley.classList.remove('three-lives-Left')
        elSmiley.classList.remove('two-lives-Left')
        elSmiley.classList.remove('one-life-Left')
        elSmiley.classList.add('zero-lives-Left')
    }

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


function onUndoButtonClicked() {
    renderPrevBoard()
    activateTimer()
}


function saveCurrBoardForUndo() {
    gPrevBoards.push({ GAME: structuredClone(gGame), BOARD: structuredClone(gBoard) })
}


function renderPrevBoard() {
    var prevBoard = gPrevBoards.pop()
    if (prevBoard === undefined) return
    gGame = structuredClone(prevBoard.GAME)
    gBoard = structuredClone(prevBoard.BOARD)
    renderSmiley()
    renderMarksLeft()
    renderSafeClicksButton()
    renderHintButton()
    renderMegahintButton()
    renderMarksLeft()
    renderTimer()
    renderBoard(gBoard)
    UNDO_SOUND.play()
}


function onConstructionButtonClicked() {
    gLevel.isConstructed = false
    gLevel.minesPlacedCounter = 0
    CONSTRUCTION_SOUND.play()
    gLevel.isConstructed = true
    clearInterval(gTimerInterval)
    document.querySelector('.timer').innerText = '000'
    onInit()
}


function hideAllCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j]
            currCell.isShown = false
        }
    }
}


function onSafeclickButtonClicked() {
    if (!gGame.isOn) return
    if (gGame.isMegaHintOn) return
    if (gGame.isHintOn) return
    if (gLevel.isConstructed) return
    if (gGame.safeClicksLeft === 0) return
    if (gGame.isFirstMove) {
        saveCurrBoardForUndo()
        handleMines(gBoard, 0, 0)
        activateTimer()
        gGame.isFirstMove = false
    } else {
        saveCurrBoardForUndo()
    }

    gGame.safeClicksLeft--

    renderSafeClicksButton()

    var safeCellsIdxs = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                safeCellsIdxs.push({ i, j })
            }
        }
    }

    shuffle(safeCellsIdxs)

    var randomSafeCellIdxs = safeCellsIdxs.pop()
    var randomSafeCell = gBoard[randomSafeCellIdxs.i][randomSafeCellIdxs.j]

    var prevCellContent = ''
    prevCellContent += randomSafeCell.cellContent

    randomSafeCell.cellContent = SHIELD

    renderBoard(gBoard)

    SAFECLICK_SOUND.play()

    setTimeout(() => {
        randomSafeCell.cellContent = prevCellContent
        renderBoard(gBoard)
    }, 2000)
}


function renderSafeClicksButton() {
    var elButton = document.querySelector('.safeclick-button')

    switch (gGame.safeClicksLeft) {
        case 3:
            elButton.innerHTML = SAFECLICK3
            break
        case 2:
            elButton.innerHTML = SAFECLICK2
            break
        case 1:
            elButton.innerHTML = SAFECLICK1
            break
        case 0:
            elButton.innerHTML = SAFECLICK0
            break
    }
}


function onHintButtonClicked() {
    if (!gGame.isOn) return
    if (gGame.isHintOn) return
    if (gGame.isMegaHintOn) return
    if (gLevel.isConstructed) return
    if (gGame.hintsLeft === 0) return

    if (gGame.isFirstMove) {
        saveCurrBoardForUndo()
        handleMines(gBoard, 0, 0)
        activateTimer()
        gGame.isFirstMove = false
    } else {
        saveCurrBoardForUndo()
    }

    gGame.hintsLeft--
    gGame.isHintOn = true

    renderHintButton()

    HINT_SOUND.play()
}


function renderHintButton() {
    var elButton = document.querySelector('.hint-button')

    switch (gGame.hintsLeft) {
        case 3:
            elButton.innerHTML = HINT3
            break
        case 2:
            elButton.innerHTML = HINT2
            break
        case 1:
            elButton.innerHTML = HINT1
            break
        case 0:
            elButton.innerHTML = HINT0
            break
    }
}


function onMegahintButtonClicked() {
    if (!gGame.isOn) return
    if (gGame.megaHintsLeft === 0) return
    if (gGame.isMegaHintOn) return
    if (gGame.isHintOn) return
    if (gLevel.isConstructed) return
    
    if (gGame.isFirstMove) {
        saveCurrBoardForUndo()
        handleMines(gBoard, 0, 0)
        activateTimer()
        gGame.isFirstMove = false
    } else {
        saveCurrBoardForUndo()
    }
    
    gGame.megaHintsLeft--
    gGame.isMegaHintOn = true
    gGame.megaHintStepCounter++
    
    renderMegahintButton()

    MEGAHINT_SOUND.play()
}


function handleMegaHint(rowIdx, colIdx) {
    if (gGame.megaHintStepCounter === 1) {
        gGame.megaHintStepCounter++
        gGame.megaHintFirstStepIdxs = { rowIdx: rowIdx, colIdx: colIdx }
        document.querySelector('.board').addEventListener('mouseover', onCellHovered)
        return
    } else if (gGame.megaHintStepCounter === 2) {
        document.querySelector('.board').removeEventListener('mousemove', onCellHovered)
        removeTemporaryHighlight()
        gGame.megaHintSecondStepIdxs = { rowIdx: rowIdx, colIdx: colIdx }
        if (gGame.megaHintSecondStepIdxs.rowIdx < gGame.megaHintFirstStepIdxs.rowIdx) {
            [gGame.megaHintFirstStepIdxs.rowIdx, gGame.megaHintSecondStepIdxs.rowIdx] = [gGame.megaHintSecondStepIdxs.rowIdx, gGame.megaHintFirstStepIdxs.rowIdx]
        }
        if (gGame.megaHintSecondStepIdxs.colIdx < gGame.megaHintFirstStepIdxs.colIdx) {
            [gGame.megaHintFirstStepIdxs.colIdx, gGame.megaHintSecondStepIdxs.colIdx] = [gGame.megaHintSecondStepIdxs.colIdx, gGame.megaHintFirstStepIdxs.colIdx]
        }
        for (var i = gGame.megaHintFirstStepIdxs.rowIdx; i <= gGame.megaHintSecondStepIdxs.rowIdx; i++) {
            for (var j = gGame.megaHintFirstStepIdxs.colIdx; j <= gGame.megaHintSecondStepIdxs.colIdx; j++) {
                revealAndHideCell(i, j)
            }
        }
        renderBoard(gBoard)
        setTimeout(() => {
            renderBoard(gBoard)
        }, 3100)
        gGame.isMegaHintOn = false
        gGame.megaHintStepCounter = 0
        gGame.megaHintFirstStepIdxs = null
        gGame.megaHintSecondStepIdxs = null
        return
    }
}


function revealAndHideCell(i, j) {
    gBoard[i][j].isShown = true
    setTimeout(() => {
        gBoard[i][j].isShown = false
    }, 3000)
}


function renderMegahintButton() {
    var elButton = document.querySelector('.megahint-button')
    switch (gGame.megaHintsLeft) {
        case 1:
            elButton.innerHTML = MEGAHINT1
            break
        case 0:
            elButton.innerHTML = MEGAHINT0
            break
    }
}


function onTerminatorButtonClicked() {
    if (!gGame.isOn) return

    if (gGame.isHintOn) return
    if (gGame.isMegaHintOn) return
    if (gLevel.isConstructed) return

    if (!gGame.isTerminatorOn) {
        TERMINATOR_SOUND.play()
        return
    }
    if (gGame.isFirstMove) {
        saveCurrBoardForUndo()
        handleMines(gBoard, 0, 0)
        activateTimer()
        gGame.isFirstMove = false
    } else {
        saveCurrBoardForUndo()
    }

    TERMINATOR_SOUND.play()
    MINE_SOUND.play()

    var mineCells = []
    var minesToTerminateCount = 3

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine && !currCell.isMarked) {
                mineCells.push({ i: i, j: j })
            }
        }
    }
    shuffle(mineCells)

    for (var m = 0; m < minesToTerminateCount; m++) {
        var currRandomMine = mineCells.pop()
        gBoard[currRandomMine.i][currRandomMine.j].isShown = true
        gBoard[currRandomMine.i][currRandomMine.j].isMine = false
        gBoard[currRandomMine.i][currRandomMine.j].cellContent = EMPTY
        gBoard[currRandomMine.i][currRandomMine.j].cellClass = 'terminated'
        gGame.shownCount++
        gGame.currMineCount--
    }

    setMinesNegsCount(gBoard)

    renderBoard(gBoard)

    renderMarksLeft()

    gGame.isTerminatorOn = false
}