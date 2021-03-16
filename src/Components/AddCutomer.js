import React from 'react';
import "./myStyle.css";
import {
    makeStyles,
    Select,
    InputLabel,
    Button,
    FormControl,
    TextField,
    MenuItem,
    theme,
    CircularProgress,
    Paper,
    Snackbar,
} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import  addCustomerValidation  from "../validation/validator";
import axios, { setToken } from "../api";


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        marginBottom: theme.spacing(7)
        
    },
    position: {
        marginLeft: theme.spacing(8),
        flex : "1 auto",
    },
    buttons: {
        marginTop: theme.spacing(6),
        marginLeft: theme.spacing(120)
    },
    button:{
        margin:"5px 10px 5px 5px"
    },
    label:{
         marginLeft: theme.spacing(9)
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  

const AddCutomer = () => {
    const classes = useStyles();
    const [addCustomer,setAddCustomer]=React.useState({
        firstName:"",
        lastName:"",
        age:undefined,
        address:"",
        gender:"",
        contactNumber:undefined,
    });
    const [open, setOpen] = React.useState(false);
    const [message,setMessage]= React.useState("");

    // const customerDetails={
    //     firstName:addCustomer.firstName,
    //     lastName:addCustomer.lastName,
    //     age: addCustomer.age,
    //     address: addCustomer.address,
    //     gender:addCustomer.gender,
    //     contactNumber:addCustomer.contactNumber
    // }

    const handleClick = () => {
      setOpen(true);
    };
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };

    const handleChange = (input) => event => {
        setAddCustomer({ ...addCustomer, [input]: event.target.value });
    };

    const handleSubmit = async() =>{
        const {error} = addCustomerValidation(addCustomer);
        if(error){
        setMessage(error.details[0].message);
        handleClick();}
        if (error){
            console.log(error.details[0].message);
        }
        if(!error){
            try{
            const res = await axios.post("/customer",addCustomer);
            setMessage(res);
            }
            catch(e){
                setMessage(e);
                console.log(e);
            }
        }
    }

    return (
        <div>
           <React.Fragment>
           <Paper
                style={{
                    padding: "1em 2em 2em 2em",
                    margin: "8em 2em 2em 2em"
                }}
                elevation={3}
            >
            <h1 align="center">Customer Registration Page</h1>
           <h4>Customer Details</h4>
            <div className={classes.root}>
                <TextField
                    name="First Name"
                    label="First Name"
                    variant="outlined"
                    value={addCustomer.firstName}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                    onChange={handleChange("firstName")}
                />
                   <TextField
                    label="Last Name"
                    variant="outlined"
                    value={addCustomer.lastName}
                    style={{ width: 80 }}
                    className={classes.position}
                    type = "string"
                    onChange={handleChange("lastName")}
                />
                  <TextField
                    label="Age"
                    variant="outlined"
                    value={addCustomer.age}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                   onChange={handleChange("age")}
                />
            </div>
            <div className={classes.root}>
            <FormControl className={classes.formControl}>
                  <InputLabel className={classes.label}>Gender</InputLabel>
                        <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={addCustomer.gender}
                        label="Gender"
                        className={classes.position}
                        style={{ width: 120}}
                       onChange={handleChange("gender")}
                        >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="others">Others</MenuItem>
                        </Select>
                </FormControl> 
            <TextField
                    label="Location"
                    variant="outlined"
                    value={addCustomer.address}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="string"
                   onChange={handleChange("address")}
            />
             <TextField
                    label="Contact Number"
                    variant="outlined"
                    value={addCustomer.contactNumber}
                    style={{ width: 80 }}
                    className={classes.position}
                    type="number"
                   onChange={handleChange("contactNumber")}
                />

            </div>
            <div>
            <div className={classes.buttons}>
                <Button
                    variant="contained"
                    style={{ width: "200px",paddingLeft:"20px" }}
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmit}
                >
                  Add
                </Button>
                <Button
                    variant="contained"
                    style={{ width: "200px" ,paddingRight:"20px"}}
                    color="secondary"
                    className={classes.button}
                >
                    Reset
                </Button>
            </div>
            </div>
            </Paper>
            </React.Fragment>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
        </div>
    )
}

export default AddCutomer;