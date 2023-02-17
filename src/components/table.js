import React from 'react';
import { Table as Tabela } from 'react-materialize';

export const Table = (props) => (
	<div
		className='tableFixHead'
		style={{
			height: `${props.height}vh`,
			width: `${props.width}%`,
			maxHeight: '70vh',
			minWidth: '55%',
			borderBottom: '1px solid black',
			// fontSize: '0.8em',
		}}
	>
		<Tabela {...props}>{props.children}</Tabela>
	</div>
);
