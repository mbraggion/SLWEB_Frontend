import React from 'react';

import { Fab, Grow } from '@material-ui/core';

import Loading from '../../components/loading_screen';
import { Panel } from '../../components/commom_in';
import { GREEN_PRIMARY } from '../../misc/colors';
import ExcelLogo from '../../assets/svg/EXCEL.svg';

import { InfoContainer } from './infoContainer';
import { ReceitaModal } from './modals/detalhesReceitaModal';
import { MovimentoModal } from './modals/gravarMovimentoModal';
import { Options } from './options';

import { useConsumo } from '../../hooks/useConsumo';

function ApontaConsumo() {
	const {
		uiControl: { loaded, podeLancarInventario },
		actions: { onRequestExcel },
	} = useConsumo();

	return !loaded ? (
		<Loading />
	) : (
		<Panel style={{ flexWrap: 'nowrap' }}>
			<ReceitaModal />
			<MovimentoModal />
			<Options />
			<InfoContainer />
			<div
				className='YAlign'
				style={{
					position: 'absolute',
					right: '16px',
					bottom: '16px',
					alignItems: 'flex-end',
					zIndex: '999',
				}}
			>
				<Grow
					in={podeLancarInventario}
					style={{ transformOrigin: '0 0 0' }}
					{...(podeLancarInventario ? { timeout: 1500 } : {})}
				>
					<Fab
						disabled={!podeLancarInventario}
						onClick={() => onRequestExcel()}
						variant='extended'
						style={{
							backgroundColor: GREEN_PRIMARY,
							margin: '0px 0px 8px 0px',
							color: '#FFF',
							width: '100%',
							display: 'flex',
							justifyContent: 'flex-start',
						}}
					>
						<img
							src={ExcelLogo}
							width='23px'
							height='23px'
							alt='Excel Icon'
							style={{ marginRight: '8px' }}
						/>
						Excel
					</Fab>
				</Grow>
			</div>
		</Panel>
	);
}

export default ApontaConsumo;
