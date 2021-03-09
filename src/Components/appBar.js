import React from "react";
import { makeStyles,
        MenuItem,
        Drawer,
        AppBar,
        Toolbar,
        CssBaseline,
        Typography,
        Divider,
        IconButton,
        Container } 
from "@material-ui/core";
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import PostAddRoundedIcon from '@material-ui/icons/PostAddRounded';
import AllInboxRoundedIcon from '@material-ui/icons/AllInboxRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { Link } from "react-router-dom";


const drawerWidth = 290;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },

  menuButton: {
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  iconSpacing: {
    display: "flex",
    marginLeft: theme.spacing(3)
  },
  backButton: {
    display: "flex",
    justifyContent: "center"
  },
  paragraph:{
    fontSize:18,
  },
  user:{
    // marginRight:theme.spacing(0),
    // marginLeft: theme.spacing(150),
    felx:"1 auto"
  },
  toolbar:{
    display: "flex",
    // flex:"1 auto",
    justifyContent:"space-between"
  },
bartext:{
 flex:  "1 auto"

}
}));

export default function Apppbar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar>
        <Toolbar className = {classes.toolbar}>
          <IconButton
            color="inherit"
            size="medium"
            edge="start"
            onClick={handleDrawer}
          >
          <MenuIcon/>
          </IconButton>
          <Container className={classes.bartext}>
            <Typography align="center">LABORATORY INFORMATION MANAGEMENT SYSTEM</Typography> 
          </Container>
          <Container className={classes.user}>
          <Typography>
          <IconButton
            color="inherit"
            size="medium"
          >
            <AccountCircleIcon/>
            <p className={classes.paragraph}>User</p>
            </IconButton>
              </Typography>
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
          <ArrowBackIosIcon/>
          </Container>
        </MenuItem>
        <Divider />
        <MenuItem >
        <CollectionsBookmarkIcon/>
          <Typography className={classes.iconSpacing}>Test</Typography>
        </MenuItem>
        <Divider/>

        <MenuItem onClick={handleDrawer} component={Link} to={"/"} >
        <HourglassEmptyIcon/>
          <Typography className={classes.iconSpacing}>Pending Sample</Typography>
        </MenuItem>
        <MenuItem onClick={handleDrawer} component={Link} to={"/addCustomer"} >
        <PersonAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>Add Customer</Typography>
        </MenuItem>

        <MenuItem onClick={handleDrawer} component={Link} to={"/addTest"} >
        <PostAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>Add Test </Typography>
        </MenuItem>

        <MenuItem onClick={handleDrawer} component={Link} to={"/allSample"}>
       <AllInboxRoundedIcon/>
          <Typography className={classes.iconSpacing}>All sample </Typography>
        </MenuItem>
        <Divider/>
        {/* Inventory Management */}
        <MenuItem >
        <CollectionsBookmarkIcon/>
          <Typography className={classes.iconSpacing}>Inventory Management</Typography>
        </MenuItem>
        <Divider/>
        <MenuItem onClick={handleDrawer} component={Link} to={"/allReagent"} >
        <PostAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>All Reagent </Typography>
        </MenuItem>
        <MenuItem onClick={handleDrawer} component={Link} to={"/addReagent"} >
        <PostAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>Add Reagent</Typography>
        </MenuItem>
        <MenuItem onClick={handleDrawer} component={Link} to={"/importReagent"} >
        <PostAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>Import Reagent </Typography>
        </MenuItem>
        <MenuItem onClick={handleDrawer} component={Link} to={"/register"} >
        <PersonAddRoundedIcon/>
          <Typography className={classes.iconSpacing}>Register Staff</Typography>
        </MenuItem>


      </Drawer>
    </div>
  );
}
