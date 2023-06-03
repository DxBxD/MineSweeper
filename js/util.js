'use strict'

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is inclusive and the minimum is inclusive
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] =
            [array[randomIndex], array[currentIndex]]
    }
}

function onCellHovered(event) {
    var cell = event.target
    if (cell.tagName.toLowerCase() !== 'td') return

    var rowIdx = parseInt(cell.dataset.i)
    var colIdx = parseInt(cell.dataset.j)

    removeTemporaryHighlight()

    var topLeftRowIdx = (gGame.megaHintFirstStepIdxs.rowIdx < rowIdx) ? gGame.megaHintFirstStepIdxs.rowIdx : rowIdx
var topLeftColIdx = (gGame.megaHintFirstStepIdxs.colIdx < colIdx) ? gGame.megaHintFirstStepIdxs.colIdx : colIdx
var bottomRightRowIdx = (gGame.megaHintFirstStepIdxs.rowIdx > rowIdx) ? gGame.megaHintFirstStepIdxs.rowIdx : rowIdx
var bottomRightColIdx = (gGame.megaHintFirstStepIdxs.colIdx > colIdx) ? gGame.megaHintFirstStepIdxs.colIdx : colIdx

    for (var i = topLeftRowIdx; i <= bottomRightRowIdx; i++) {
        for (var j = topLeftColIdx; j <= bottomRightColIdx; j++) {
            var cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            cell.classList.add('temporary-highlight')
        }
    }
}

function removeTemporaryHighlight() {
    var cells = document.querySelectorAll('.temporary-highlight')
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('temporary-highlight')
    }
}