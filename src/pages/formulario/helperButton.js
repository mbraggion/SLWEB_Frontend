import React from 'react';

import { Fab, Zoom } from '@material-ui/core';
import { ContactSupport as ContactSupportIcons } from '@material-ui/icons';

export const HelperButton = ({ helperModalOpen, handleOpenHelperModal }) => {
	return (
		<div
			style={{
				position: 'fixed',
				right: '16px',
				bottom: '16px',
			}}
		>
			<Zoom
				in={!helperModalOpen}
				timeout={transitionDuration}
				style={{
					transitionDelay: `${
						!helperModalOpen ? transitionDuration.exit : 0
					}ms`,
				}}
				unmountOnExit
			>
				<Fab
					onClick={handleOpenHelperModal}
					color='primary'
					style={{
						boxShadow: '2px 2px 3px #999',
						backgroundColor: '#0056C7',
					}}
				>
					<ContactSupportIcons fontSize='large' />
				</Fab>
			</Zoom>
		</div>
	);
};

const transitionDuration = {
	appear: 300,
	enter: 300,
	exit: 300,
};
