import React from 'react';
import { Container, Content, ButtonClose } from './style';

const Modal = () => {
	return (
		<Container>
			<Content>
				<ButtonClose>
					<span>Fechar</span>
				</ButtonClose>
			</Content>
		</Container>
	);
};

export default Modal;
