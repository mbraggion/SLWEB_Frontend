import React from 'react';
import { Caption, Slide, Slider } from 'react-materialize';

import { Button } from '@material-ui/core';

import { BoxTitle } from '../../components/commom_in';

export const News = ({ onOpenModal, News }) => {
	return (
		<Slider
			fullscreen={false}
			options={{
				duration: 500,
				indicators: true,
				interval: 6000,
			}}
		>
			

			{News.map((n) => (
				<Slide
					key={n.NewsId}
					image={
						<img
							alt=''
							src={`https://source.unsplash.com/1280x720/?coffee/${n.NewsId}`}
						/>
					}
				>
					<Caption placement={n.BannerAlign}>
						<BoxTitle>
							<h3>{n.BannerTitle}</h3>
							<h5>{n.BannerDescription}</h5>
						</BoxTitle>
						{n.ModalContent !== null ? (
							<Button
								style={{
									margin: '100px 0px 0px 0px',
								}}
								onClick={() => onOpenModal(n)}
								variant='contained'
								color='primary'
							>
								Saiba mais
							</Button>
						) : null}
					</Caption>
				</Slide>
			))}
		</Slider>
	);
}
