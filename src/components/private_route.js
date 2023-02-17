import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (sessionStorage.getItem('token')) {
					return <Component {...props} />;
				} else {
					return (
						<Redirect
							to={{
								pathname: '/unauthorized',
								state: { from: props.location },
							}}
						/>
					);
				}
			}}
		/>
	);
}

export default PrivateRoute;
