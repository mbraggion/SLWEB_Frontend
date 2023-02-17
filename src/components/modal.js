import React, { useState } from 'react';
import { Button, Icon, Modal } from 'react-materialize';
import { GOBACK_BUTTON_COLOR } from '../misc/colors';

export default function ModalOld(props) {
	const [open, setOpen] = useState(false);

	return (
		<Modal
			actions={[
				props.actions,
				<Button
					modal='close'
					{...props}
					style={{
						backgroundColor: GOBACK_BUTTON_COLOR,
						color: '#000',
						boxShadow: 'none',
					}}
				>
					<Icon left>close</Icon>
					Fechar
				</Button>,
			]}
			bottomSheet={false}
			fixedFooter={false}
			header={props.header}
			id={`Modal-${new Date()}`}
			open={open}
			options={{
				dismissible: false,
				endingTop: '10%',
				inDuration: 250,
				onCloseEnd: null,
				onCloseStart: (e) => setOpen(false),
				onOpenEnd: null,
				onOpenStart: (e) => {
					setOpen(true);
				},
				opacity: 0.5,
				outDuration: 250,
				preventScrolling: true,
				startingTop: '4%',
			}}
			trigger={props.trigger}
		>
			{props.children}
		</Modal>
	);
}
