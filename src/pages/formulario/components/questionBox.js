import React from 'react';
import { motion } from 'framer-motion';

import { IconButton, Typography } from '@material-ui/core';
import {
	ArrowForwardIos as ArrowForwardIosIcon,
	ArrowBackIos as ArrowBackIosIcon,
} from '@material-ui/icons';

// import { Toast } from '../../../components/toasty'
import { FormBox } from '../styles';

export const QuestionBox = ({
	question,
	answer,
	validation,
	validationErrorAction,
	onChangeAnswer,
	onAdvance,
	alignArrow,
	answerOnly,
	onRetreat,
}) => {
	const onRequestAdvance = () => {
		if (validation()) {
			onAdvance();
		} else {
			validationErrorAction();
		}
	};

	const onRequestRetreat = () => {
		onRetreat();
	};

	return (
		<FormBox
			as={motion.div}
			key={question}
			initial={{ opacity: 0, y: 100 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -100 }}
		>
			<div
				className='XAlign'
				style={{
					justifyContent: 'flex-start',
					flexWrap: 'nowrap',
					alignItems: 'center',
				}}
			>
				<IconButton color='primary' onClick={onRequestRetreat} size='medium'>
					<ArrowBackIosIcon />
				</IconButton>
			</div>
			{!answerOnly ? (
				<div
					style={{
						display: 'flex',
						width: '100%',
						height: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography variant='body1' align='center'>
						{question}
					</Typography>
				</div>
			) : null}
			<div
				className='XAlign'
				style={{
					justifyContent: 'space-between',
					flexWrap: 'nowrap',
					alignItems: alignArrow ? alignArrow : 'center',
					height: answerOnly ? 'calc(100% - 46.5px)' : 'unset',
				}}
			>
				<form
					style={{
						width: '100%',
						marginRight: '8px',
						height: answerOnly ? '100%' : 'unset',
						overflowY: answerOnly ? 'auto' : 'unset',
					}}
					onSubmit={(e) => {
						e.preventDefault();
						onRequestAdvance();
					}}
				>
					{answer !== null && onChangeAnswer !== null
						? React.cloneElement(answer, {
								onChange: onChangeAnswer,
						  })
						: answer}
				</form>
				<IconButton color='primary' onClick={onRequestAdvance} size='medium'>
					<ArrowForwardIosIcon />
				</IconButton>
			</div>
		</FormBox>
	);
};
