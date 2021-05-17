import React from 'react';
import {
	makeStyles,
	MenuItem,
	Drawer,
	AppBar,
	Toolbar,
	CssBaseline,
	Typography,
	Divider,
	IconButton,
	Container,
	Button,
} from '@material-ui/core';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded';
import AllInboxRoundedIcon from '@material-ui/icons/AllInboxRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 290;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},

	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	iconSpacing: {
		display: 'flex',
		marginLeft: theme.spacing(3),
	},
	backButton: {
		display: 'flex',
		justifyContent: 'center',
	},
	paragraph: {
		fontSize: 18,
		marginLeft: '5px',
	},
	container: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	title: {
		width: '700%',
	},
	lims: {},
}));

export default function Apppbar(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const state = useSelector((state) => state.auth);
	const handleDrawer = () => {
		setOpen(!open);
	};
	return (
		<React.Fragment>
			<style>{`@media print {.no-print{display: none;}}`}</style>
			<div className={(classes.root, 'no-print')}>
				<CssBaseline />
				<AppBar className={classes.appbar}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							color="inherit"
							size="medium"
							edge="start"
							onClick={handleDrawer}
						>
							<MenuIcon />
						</IconButton>
						<Container className={classes.title}>
							<Typography align="center" className={classes.lims}>
								LABORATORY INFORMATION MANAGEMENT SYSTEM
							</Typography>
						</Container>
						<Container className={classes.container}>
							<Typography>
								<IconButton color="inherit" size="medium">
									<AccountCircleIcon />
									<p className={classes.paragraph}> {state[0].role}</p>
								</IconButton>
							</Typography>
							<Button
								variant="contained"
								color="secondary"
								style={{ margin: '20px 4px 20px 4px' }}
								onClick={() => {
									localStorage.removeItem('token');
									window.location.assign('/login');
								}}
							>
								Logout
							</Button>
						</Container>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="persistent"
					className={classes.root}
					open={open}
					classes={{ paper: classes.drawer }}
				>
					<MenuItem onClick={handleDrawer}>
						<Container className={classes.backButton}>
							<ArrowBackIosIcon />
						</Container>
					</MenuItem>
					<Divider />
					<MenuItem>
						<CollectionsBookmarkIcon />
						<Typography className={classes.iconSpacing}>Test</Typography>
					</MenuItem>
					<Divider />

					<MenuItem onClick={handleDrawer} component={Link} to={'/'}>
						<HourglassEmptyIcon />
						<Typography className={classes.iconSpacing}>
							Pending Sample
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={'/addCustomer'}>
						<PersonAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Add Customer
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={'/addSample'}>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>Add Sample </Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={'/addTest'}>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>Add Test </Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={"/addAnimal"}>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>Add Animals</Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={"/allTest"}>
					<MenuItem
						onClick={handleDrawer}
						component={Link}
						to={'/addReference'}
					>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Add Reference{' '}
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={'/allTest'}>
						<AllInboxRoundedIcon />
						<Typography className={classes.iconSpacing}>All Test </Typography>
					</MenuItem>

					<MenuItem onClick={handleDrawer} component={Link} to={'/allSample'}>
						<AllInboxRoundedIcon />
						<Typography className={classes.iconSpacing}>All sample </Typography>
					</MenuItem>

					<Divider />
					{/* Inventory Management */}
					<MenuItem>
						<CollectionsBookmarkIcon />
						<Typography className={classes.iconSpacing}>
							Inventory Management
						</Typography>
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleDrawer} component={Link} to={'/allReagent'}>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							All Reagent{' '}
						</Typography>
					</MenuItem>
					<MenuItem onClick={handleDrawer} component={Link} to={'/addReagent'}>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>Add Reagent</Typography>
					</MenuItem>
					<MenuItem
						onClick={handleDrawer}
						component={Link}
						to={'/importReagent'}
					>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Import Reagent{' '}
						</Typography>
					</MenuItem>
					<Divider />
					{/* Equipment Management */}
					<MenuItem>
						<CollectionsBookmarkIcon />
						<Typography className={classes.iconSpacing}>
							Equipment Management
						</Typography>
					</MenuItem>
					<MenuItem
						onClick={handleDrawer}
						component={Link}
						to={'/allEquipment'}
					>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							All Equipment{' '}
						</Typography>
					</MenuItem>
					<MenuItem
						onClick={handleDrawer}
						component={Link}
						to={'/addEquipment'}
					>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Add Equipment{' '}
						</Typography>
					</MenuItem>
					<MenuItem
						onClick={handleDrawer}
						component={Link}
						to={'/handleEquipment'}
					>
						<PostAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Handle Equipment{' '}
						</Typography>
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleDrawer} component={Link} to={'/register'}>
						<PersonAddRoundedIcon />
						<Typography className={classes.iconSpacing}>
							Register Staff
						</Typography>
					</MenuItem>
				</Drawer>
			</div>
		</React.Fragment>
	);
}
