import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SnackBar({ messege, open, handleClose, status }) {
	return (
		<div>
			<Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
				<Alert onClose={handleClose} severity={status}>
					{messege}
				</Alert>
			</Snackbar>
		</div>
	);
}
