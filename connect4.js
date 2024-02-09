"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(p1, p2, a=6, b=7) {
    this.height = a;
    this.width = b;
    this.board = [];
    this.players = [p1, p2];
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameFinished = false;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array(this.width).fill(null);
      this.board.push(emptyRow);
    }
  }

  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = "";
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }
      htmlBoard.append(row);
    }
  }
  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
  *    (return null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  endGame(msg) {
    alert(msg);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells => cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer);


    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameFinished = true;
          return true;
        }
      }
    }
    return false;
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    if(this.gameFinished === true) {
      return;
    }
    // get x from ID of clicked cell
    const x = Number(evt.target.id.slice("top-".length));

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.players[0] === this.currPlayer ? this.players[1] : this.players[0];
  }
}

class Player {
  constructor(color) {
    this.color = color;
  }
}

// initialize a newGame variable that doesn't create a game until the start button is clicke
 const startButton = document.getElementById("button");
 startButton.addEventListener("click", function() {
  let color1HTMLElement = document.getElementById("p1color");
  let color2HTMLElement = document.getElementById("p2color");
  let p1 = new Player(color1HTMLElement.value.toLowerCase());
  let p2 = new Player(color2HTMLElement.value.toLowerCase());
  new Game(p1, p2); });
