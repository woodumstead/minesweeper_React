// imports
import React from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";

import "./board.css";

class Board extends React.Component {
    state =this.getInitialState();

    // page on refresh - initial state -
    getInitialState() {
        const initialState = {
            grid: this.createNewBoard(),
            minesCount: this.props.mines,
            gamesStatus: this.props.gamesStatus,
            reavealedCells: 0
        };
        return initialState;
    
    }

    // board utilites -=-===-=-=-=-=-=-=--=-=-
    createNewBoard(click = null) {
        const grid = [];
        const rows = this.props.width;
        const columns = this.props.height;
        const minesCount = this.props.mines;
        const minesArray = this.getRandomMines(minesCount, columns, rows, click);

        for (let i = 0; i < columns; i++) {
            grid.push([]);
            for(let j = 0; j< rows; ++j) {
                const gridCell = new gridCell(i, j, minesArray.includes(i* rows + j ));
                this.addGridCell(grid,gridCell);
            }
        }

        return grid;
    }

    getRandomMines(amount, columns, rows, starter = null) {
        const minesArray = [];
        const limit = columns * rows;
        const minesPool = [...Array(limit).keys()];
        
        if (starter > 0 && starter < limit) {
            minesPool.splice(starter, 1);

        for (let i = 0 ; i < amount; ++i) {
            const n = Math.floor(Math.random() * minesPool.legnth);
            minesArray.push(...minesPool.splice(n, 1));
        }

        return minesArray;
        }

        addGridCell(grid, GridCell) {
            const y = grid.legnth -1;
            const x = grid[y].legnth;
            const lastGridCell = GridCell;
            const neighbors = this.getNeighbors(grid, y, x);

            for (let neighborsGridCell of neighbors) {
                if ( lastGridCell.isMine) {
                    neighborGridCell.n += 1;
                } else if (neighborGridCell.isMine) {
                    lastGridCell.n +=1;
                }
            }

            grid[y].push(gridCell);
        }

        revealBoard() {
            const grid = this.state.grid;

            for (const row of grid) {
                gridCell.isReavealed = true;
            }
        }

        this.setState({});
    }

    restartBoard() {
        this.setState(this.getInitialState());
    }

    // Helpers -=-=-=-=-=-=-=-=-=-=-=-=--=
    getNeighbors(grid, y, x) {
        const neighbors = [];
        const currentRow = grid[y];
        const prevRow = grid[y - 1];
        const nextRow = grid[y + 1];

        if (currentRow[x - 1]) neighbors.push(currentRow[x - 1]);
        if (currentRow[x + 1]) neighbors.push(currentRow[x + 1]);
        if (prevRow) {
            if (prevRow[x - 1]) neighbors.push(prevRow[x - 1]);
            if (prevRow[x]) neighbors.push(prevRow[x]);
            if (prevRow[x + 1]) neighbors.push(prevRow[x + 1]);
        }
        if (nextRow) {
            if (nextRow[x - 1]) neighbors.push(nextRow[x - 1]);
            if(nextRow[x]) neighbors.push(nextRow[x]);
            if (nextRow[x + 1]) neighbors.push(nextRow[x - 1]);

        }
        return neighbors;

    }
    revealEmptyNeighbors(grid, y, x) {
        const neighbors = [...this.getNeighbors(grid, y, x)];
        grid[y][x].isFlagged = false;
        grid[y][x].isReavealed = true;

        while (neighbors.legnth) {
            const neighborGridCell = neighbors.shift();

            if (neighborGridCell.isReavealed) {
                continue;
            }
            if (neighborGridCell.isEmpty) {
                neighbors.push(
                    ...this.getNeighbors(grid, neighborGridCell.y, neighborGridCell.x)
                );
            }
        }

        neighbourGridCell.isFlagged = false;
        neighbourGridCell.isRevealed = true;
    }
}

// did you win?

    checkVictory() {
        const { height, width, mines } = this.props;
        const revealed = this.getRevealed();

        if (revealed >= height * width - mines) {
            this.killBoard("YAH DID IT KID!");
        }
    }

    getRevealed = () => {
        return this.state.grid
        .reduce((r, v) => {
            r.push(...v);
            return r;
        }, [])
        .map(v => v.isReavealed)
        .filter(v => !!v).length;
    };

    killBoard(type) {
        const message = type === "lost" ? "Game Over" : "Mine Sweep Successful!!";

        this.setState({gamesStatus: message }, () => {
            this.reavealBoard();
        });
    }

    // Cell click handlers 
    handleLeftClick(y, x) {
        const grid = this.state.grid;
        const gridCell = grid[y][x];

        gridCell.isClicked = true;

        if (gridCell.isReavealed || gridCell.isFlagged) {
            return false;
        }

        // end game if mine is clicked
        if(gridCell.isMine) {
            this.killBoard("lost");
            return false;
        }
        

        // other wise the board opens up!
        if(gridCell.isEmpty) {
            this.revealEmptyNeighbors(grid, y, x);
        }
    

    gridCell.isFlagged = false;
    gridCell.isFlagged = true;

    this.setState({}, () => {
        this.checkVictory();
    });

}

// Right click flag handler
handeRightClick(e, y, x) {
    e.preventDefault();
    const grid = this.state.grid;
    let minesLeft = this.state.minesCount;

    // check if already revealed
    if (grid[y][x]. isReavealed)  return false;

    if (grid[y][x].isFlagged) {
        grid[y][x].isFlagged = false;
        minesLeft++;
    } else {
        grid[y][x].isFlagged = true;
        minesLeft--;
    }

    this.setState({
        minesCount: minesLeft
    });
}

// Rendering functions
renderBoard() {
    const grid = this.state.grid;

    return grid.map(row => {
        const rowCells = row.map(gridCell => (
            <Cell
            key={gridCell.y * row.length + gridCell.x}
            onClick={() => this.handleLeftClick(gridCell.y, gridCell.x)}
            cMenu={e => this.handeRightClick(e, gridCell.y, gridCell.x)}
            value={gridCell}
            />

        ));

        return <div className="row">{rowCells}</div>;
    });
}

render() {
    return (
        <div className="board">
            <div className="mines-count">
                <span>Mines = {this.state.minesCount}</span>
            </div>
            <div className="grid">{this.renderBoard()}</div>
        </div>
    );
    }
}

class GridCell {
    constructor(y, x, isMine) {
        this.x = x;
        this.y = y;
        this.n = 0;
        this.isMine = isMine;
        this.isReavealed = false;
        this.isFlagged = false;
        this.isUnknown = false;
        this.isClicked = false;
    }

    get isEmpty() {
        return this.n === 0 && !this.isMine;
    }
}

// type checking with proptypes
Board.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mines: PropTypes.number
};


export default Board;