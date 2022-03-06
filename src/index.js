import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button 
			className="square" 
			onClick={() => props.onClick()} 
		>
			{props.value}
		</button>
	);
}

function Label(props){
	return (
		<button 
			className="label" 
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	
	renderSquare(i) {
		return (<Square 
			value={this.props.squares[i]} 
			onClick={() => this.props.onClick(i)}
		/>);
	}

  render() {
	return (
	  <div>
	  <div className="board-row">
			<Label value='' />
			<Label value='0' />
			<Label value='1' />
			<Label value='2' />
		</div>
		<div className="board-row">
			<Label value='0' />
			{this.renderSquare(0)}
			{this.renderSquare(1)}
			{this.renderSquare(2)}
		</div>
		<div className="board-row">
			<Label value='1' />
			{this.renderSquare(3)}
			{this.renderSquare(4)}
			{this.renderSquare(5)}
		</div>
		<div className="board-row">
			<Label value='2' />
			{this.renderSquare(6)}
			{this.renderSquare(7)}
			{this.renderSquare(8)}
		</div>
	  </div>
	);
  }
}

class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				selected: null
			}],
			stepNumber: 0,
			xIsNext: true,
		}
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		//const selectedSpace = current.selected;
		
		// do nothing if the game has been won or the square is already clicked
		if(calculateWinner(squares) || squares[i]){
			return;
		}
		
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		
		this.setState({
			history: history.concat([{
				squares: squares,
				selected: i,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		const moves = history.map((step, move) => {
			const desc = move ?
				'Go to move #' + move + ' ' + getSpceDesc(history[move].selected):
				'Go to game start';
			const moveClass = this.state.stepNumber === move ? "current" : null;
			return (
				<li key={move}>
				<button
					onClick={() => this.jumpTo(move)}
					className={moveClass}
				>{desc}</button>
				</li>
			);
		});
		
		let status;
		if(winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		return (
		  <div className="game">
			<div className="game-board">
			  <Board
				squares={current.squares}
				onClick={(i) => this.handleClick(i)}
			  />
			</div>
			<div className="game-info">
			  <div>{status}</div>
			  <ol>{moves}</ol>
			</div>
		  </div>
		);
	}
}

function calculateWinner(squares) {
	//all possible lines for winning
	// 		0  1  2
	// 		3  4  5
	// 		6  7  8
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
			return squares[a];
		}
	}
	//no winner at this time
	return null;
}

function getSpceDesc(space){
	let column;
	let row;
	
	row = (space < 3) ? 0 : ((space < 6) ? 1 : 2);
	column = space - (row * 3);
	return ('(' + row + ', ' + column + ')');
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
