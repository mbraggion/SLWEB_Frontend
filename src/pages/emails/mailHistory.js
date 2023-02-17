import React from 'react';

import { Table } from '../../components/table';
import { convertData } from '../../misc/commom_functions';
import { makeStyles } from '@material-ui/core';

export const MailHistory = ({ history }) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Table width='100'>
				<thead>
					<tr>
						<th>Data de Envio</th>
						<th>Filial</th>
						<th>Modelo</th>
						<th>Origem</th>
					</tr>
				</thead>
				<tbody>
					{history.map((reg) => (
						<tr key={`${reg.DataOcor}${reg.A1_GRPVEN}`}>
							<td>{convertData(reg.DataOcor)}</td>
							<td>{reg.M0_CODFIL}</td>
							<td>{reg.msg}</td>
							<td>{reg.origem}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

const useStyles = makeStyles(() => ({
	root: {
		width: '100%',
		maxWidth: '1000px',
		maxHeight: 'calc(100% - 100px)',
		overflowY: 'auto',
		border: '1px solid #CCC',
		padding: '8px',
		borderRadius: '4px',
	},
}));
