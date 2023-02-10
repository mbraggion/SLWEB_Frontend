import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../assets/svg/undraw_Current_location.svg';
import './style.css';

function PAGE_404() {
	return (
		<div className='not_found'>
			<img src={Image} alt='Pagina de erro - Perdido' />
			<div className='not_found_lost'>
				<h1>Ops!</h1>
				<h3>
					Parece que você se perdeu! Clique no botão abaixo para voltar a tela
					inicial.
				</h3>
				<Link to='/'>
					<p className='button'>Clique aqui para voltar à tela inicial.</p>
				</Link>
			</div>
		</div>
	);
}

export default PAGE_404;
