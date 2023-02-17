import React from 'react';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast = (message, type, id, sub) => {
	switch (type) {
		case 'success':
			return toast.success(message);

		case 'warn':
			return toast.warn(message);

		case 'error':
			return toast.error(message);

		case 'info':
			return toast.info(message);

		case 'wait':
			return toast.loading(message);

		case 'update':
			return toast.update(id, {
				render: message,
				type: sub,
				isLoading: false,
				autoClose: 3000,
			});

		default:
			return toast.info(message);
	}
};

export const ToastyContainer = () => {
	return (
		<ToastContainer
			position='top-right'
			autoClose={3000}
			hideProgressBar={false}
			newestOnTop={true}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss={true}
			draggable={true}
			pauseOnHover={true}
		/>
	);
};
