import React, { useState } from 'react';
import {
	TextField,
	Paper,
	makeStyles,
	Typography,
	Button,
	FormControl,
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';

import jwt_decode from 'jwt-decode';

import { useDispatch } from 'react-redux';
import { setUser } from '../action/setUser';
import { Redirect } from 'react-router';
import { loginvalidation } from '../validation/validator';

const styles = makeStyles({
	paper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		height: '100%',
		width: '100%',
		margin: '0',
		padding: '0',
		backgroundColor: '#f7f7f7',
	},
	input: {
		display: 'flex',
		flexDirection: 'column',
	},
	button: {
		marginTop: '2rem',
	},
});
function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Login = ({ isLogin, setLogin }) => {
	const dispatch = useDispatch();
	const classes = styles();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const url =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:5000'
			: 'https://lims.onrender.com';

	// //SnackBar operations
	const [messege, setMessege] = useState('');
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = (reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};

	const handleSubmit = async () => {
		const { error } = loginvalidation({ userName: username, password });
		if (error) {
			setMessege(error.details[0].message);
			handleOpen();
			return;
		}
		try {
			const { data } = await axios.post(`${url}/login`, {
				userName: username,
				password,
			});
			const { id, role } = jwt_decode(data.token);
			localStorage.setItem('token', data.token);
			// window.axios.defaults.headers.common["Authorization"] =
			//     "Bearer " + localStorage.getItem("token");
			dispatch(setUser(id, role));
			setLogin(true);
			window.location.assign('/');
		} catch (e) {
			console.log(e);
			setUsername('');
			setPassword('');
			setMessege(e.response.data);
			handleOpen();
		}
	};

	if (isLogin) {
		return <Redirect to="/" />;
	}

	return (
		<React.Fragment>
			<Paper style={{ height: '100vh' }}>
				<div className={classes.paper}>
					<Typography
						variant="h4"
						style={{ fontWeight: 'bold', marginBottom: '20px' }}
					>
						Laboratory Management System
					</Typography>
					<FormControl>
						<div className={classes.input}>
							<TextField
								name="Username"
								required
								label="Username"
								value={username}
								variant="filled"
								onChange={(e) => setUsername(e.target.value)}
							/>
							<TextField
								required
								type="password"
								name="password"
								label="Password"
								value={password}
								variant="filled"
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button
								className={classes.button}
								variant="contained"
								color="primary"
								onClick={handleSubmit}
							>
								LOGIN
							</Button>
						</div>
					</FormControl>
				</div>
			</Paper>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<Alert onClose={handleClose} severity="error">
					{messege}
				</Alert>
			</Snackbar>
		</React.Fragment>
	);
};

export default Login;
