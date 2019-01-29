import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _ from 'lodash';

function Square(props) {
    return (
        <button className={ props.highlight ? 'square highlight' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                highlight={this.props.highlight && this.props.highlight.includes(i) ? true : false}
            />
        );
    }

    render() {
        let rows = [];

        for (let i=0;i<3;i++) {
            let row = [];
            for (let j=0;j<3;j++) {
                row.push(this.renderSquare(j + (i*3)));
            }
            rows.push(<div key={i} className="board-row">{row}</div>);
        }

        return (
            <div>{rows}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinates: {
                    column: 'col',
                    row: 'row'
                }
            }],
            stepNumber: 0,
            xIsNext: true,
            movesOrderAsc: 'asc',
            highlight: null,
            draw: false
        }
    }

    jumpTo(step) {
        const winner = calculateWinner(this.state.history[step].squares);
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            highlight: winner ? winner.highlight : null,
            draw: !winner && (step === 9) ? true : false
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinates: {
                    column: (i + 1) % 3 === 0 ? 3 : (i + 1) % 3,
                    row: Math.ceil((i + 1) / 3)
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });

        const winner = calculateWinner(squares);

        if(winner) {
            this.setState({highlight: winner.highlight});
        }

        if(this.state.stepNumber === 8 && !winner) {
            this.setState({draw: true})
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner.player;
        }else if(this.state.draw) {
            status = 'The match is a tie';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let moves = history.map((step, move) => {
            const desc = move ?
                move === this.state.stepNumber ? <b>Go to move # {move} </b> : 'Go to move #' + move :
                move === this.state.stepNumber ? <b>Go to game start</b> : 'Go to game start'

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                    ({this.state.history[move].coordinates.column}, {this.state.history[move].coordinates.row})
                </li>
            );
        });

        return (
            <div className="game">
                <h3>Tic Tac Toe</h3>
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        highlight={this.state.highlight}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button className="order-button" onClick={() => this.setState({ movesOrderAsc: this.state.movesOrderAsc === 'asc' ? 'desc' : 'asc' })}>
                        Order {this.state.movesOrderAsc === 'asc' ? 'Descending' : 'Ascending'}
                    </button>
                    <ol>{_.orderBy(moves, ['key'], this.state.movesOrderAsc)}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                player: squares[a],
                highlight: [a, b, c]
            }
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
