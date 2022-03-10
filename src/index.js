import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import {Game} from './game.js'

import 'bootstrap/dist/css/bootstrap.min.css';

class Home extends React.Component{
	render(){
		return(
			<>
				<Navbar bg="dark" variant="dark">
					<Container>
						<Navbar.Brand>Tic Tac Toe</Navbar.Brand>
					</Container>
				</Navbar>
				<Container>
					<Game />
				</Container>
			</>
		);
	}
}

ReactDOM.render(
  <Home />,
  document.getElementById('root')
);