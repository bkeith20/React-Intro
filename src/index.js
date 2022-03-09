import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	let classes = props.highlight ? "square winning_square" : "square";
	return (
		<button 
			className={classes} 
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
		
		const winningLine = this.props.winningLine;
		
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
				let highlight = (winningLine && winningLine.includes(i));
				squares.push(<Square value={this.props.squares[i]} key={k} highlight={highlight} onClick={() => this.props.onClick(i)}/>);
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
			historySortAsc: true,
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
	
	toggleSort(){
		this.setState({
			historySortAsc: !this.state.historySortAsc
		})
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winResult = calculateWinner(current.squares);
		
		//build our history list
		var moves = Array(history.length);
		for(let i = 0; i < history.length; i++){
			//decide how history will be sorted
			let moves_ndx =  this.state.historySortAsc ? i : (moves.length - 1 - i);
			const desc = i ?
				'Go to move #' + i + ' ' + getSpceDesc(history[i].selected):
				'Go to game start';
			const moveClass = this.state.stepNumber === i ? "current" : null;
			moves[moves_ndx] = (<li key={i}><button onClick={() => this.jumpTo(i)} className={moveClass}>{desc}</button></li>);
		}
		
		//check for a winner
		let status;
		if(winResult) {
			status = 'Winner: ' + winResult.winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
		let sortLabel = this.state.historySortAsc ? "Sort Desc." : "Sort Asc.";
		return (
		  <div className="game">
			<div className="game-board">
			  <Board
				winningLine={winResult ? winResult.line : null}
				squares={current.squares}
				onClick={(i) => this.handleClick(i)}
			  />
			</div>
			<div className="game-info">
			  <div>{status}</div>
			  <button onClick={() => this.toggleSort()}>
				{sortLabel}
			  </button>
			  <ol>{moves}</ol>
			</div>
		  </div>
		);
	}
}

function calculateWinner(squares) {
	//all possible lines for winning given board numbered as following
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
			return {winner: squares[a], line: lines[i]};
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
