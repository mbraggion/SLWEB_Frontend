import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
// import ReactLoading from 'react-loading';

export default function SimpleBackdrop() {
	const classes = useStyles();

	return (
		<div>
			<Backdrop className={classes.backdrop} open={true} onClick={() => {}}>
				<CircularProgress color='inherit' />
			</Backdrop>
		</div>
	);
}

// export default function Loading() {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'none',
//         maxHeight: '90vh',
//         minHeight:  '79vh',
//         width: '100%'
//       }}
//     >
//         <ReactLoading type='spin' color='#000000' height='10%' width='10%' />
//     </div>
//   )
// }

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));
