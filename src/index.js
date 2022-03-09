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

	render() {
		const num_rows = 3;
		const num_cols = 3;
		
		var rows = [];
		
		//build the first row of labels
		var labels = []
		// build the first empty label
		labels.push(<Label value='' key="label_xy" />);
		for(let x = 0; x < num_cols; x++){
			// generate a unique key for each label
			let k = "label_x" + x;
			labels.push(<Label value={x} key={k}  />);
		}
		rows.push(React.createElement('div', {className: 'board-row', key: 'row_0'}, labels));
		
		//build the board
		for(let y = 0; y < num_rows; y++){
			let squares = [];
			// generate a unique key for each label
			let lk = "label_y" + y;
			//add the label to the front of the row
			squares.push(<Label value={y} key={lk} />);
			
			for(let x = 0; x < num_cols; x++){
				let i = (num_cols * y) + x;
				// generate a unique key for each square
				let k = "square_" + i;
				squares.push(<Square value={i} key={k} onClick={() => this.props.onClick(i)}/>);
			}
			let rk = "row_" + (y+1);
			rows.push(React.createElement('div', {className: 'board-row', key: rk}, squares));
		}
		return React.createElement('div', {}, rows);
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
