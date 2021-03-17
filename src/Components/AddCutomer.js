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
} from "@material-ui/core";
import  addCustomerValidation  from "../validation/validator";
import axios from "../api";
import SnackBar from "./SnackBar";

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
  

const AddCutomer = () => {
    const classes = useStyles();
    const [addCustomer,setAddCustomer]=React.useState({
        firstName:"",
        lastName:"",
        age:0,
        address:"",
        gender:"",
        contactNumber:0,
    });
    const [reset , setReset]= React.useState(Object.assign({},addCustomer));
    const [open, setOpen] = React.useState(false);
    const [message,setMessage]= React.useState("");
    const [status,setStatus]= React.useState("");

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

    const handleReset =()=>{
        setAddCustomer({...reset});
    }

    const handleSubmit = async() =>{
        const {error} = addCustomerValidation(addCustomer);
        if(error){
        setMessage(error.details[0].message);
        setStatus("error");
        handleClick();
    }
        if (error){
            console.log(error.details[0].message);
        }
        if(!error){
            try{
            const res = await axios.post("/customer/add",addCustomer);
            setMessage(res.data);
            setStatus("success");
            handleClick();
            console.log(res.data);
            console.log(reset);
            setAddCustomer({...reset});
            }
            catch(e){
                setMessage(e);
                setStatus("error");
                handleClick();
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
                    onClick={handleReset}
                >
                    Reset
                </Button>
            </div>
            </div>
            </Paper>
            </React.Fragment>
            <SnackBar
            messege={message}
            open = {open}
            handleClose={handleClose}
            status={status}
            />
        </div>
    )
}

export default AddCutomer;