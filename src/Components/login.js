import React, { useState } from "react";
// import CircularProgress from "@material-ui/core/CircularProgress";
import {
    TextField,
    Paper,
    makeStyles,
    Typography,
    Button,
    StepButton
} from "@material-ui/core";
import axios,{setToken} from '../api'
// import ErrorSnackBar from "../Components/SnackBar";
// import axios from "axios";
import { Redirect } from "react-router-dom";
// import { api } from "../api";
const styles = makeStyles({
    paper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        margin: "0",
        padding: "0",
        backgroundColor: "#f7f7f7"
    },
    input: {
        display: "flex",
        flexDirection: "column"
    },
    button: {
        marginTop: "2rem"
    }
});

const Login = ({isLogin,setLogin}) => {
    // const [btnLoader, setLoader] = useState(false);

    const classes = styles();
    const [username, setUsername] = useState("");
    const [password , setPassword] = useState("")

    // //SnackBar operations
    // const [messege, setMessege] = React.useState("");
    // const [openSnack, setOpen] = React.useState(false);
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = (reason) => {
    //     if (reason === "clickaway") {
    //         return;
    //     }
    //     setOpen(false);
    // };

    // const handleChange = event => {
    //     setUsername(event.target.value)
    // };
    // const misMatch = () => {
    //     handleOpen();
    //     setCheck("");
    //     setLoader(false);
    // };
    // const handleSubmit = () => {
    //     setLoader(true);
    //     axios
    //         .get(`${api}/login/`)
    //         .then(res => {
    //             if (check === res.data[0].password) {
    //                 localStorage.setItem("token", "anyrandomstring");
    //                 props.setLogin(true);
    //             } else misMatch();
    //         })
    //         .catch(() => {
    //             setMessege("Server Error!");
    //             handleOpen();
    //             setLoader(false);
    //         });
    // };
    // if (props.isLogin) {
    //     return <Redirect to="/" />;
    // }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        try{
            const {data} = await axios.post('/login',{userName:username,password})
            setToken(data.token)
            setLogin(true)
            localStorage.setItem("token",data.token)
            
            

        }catch(e){
            console.log(e)
        }
        if(isLogin){
            return <Redirect to="/" />;
        }
    }

    return (
        <React.Fragment>
            <Paper style={{ height: "100vh" }}>
                <div className={classes.paper}>
                    <Typography
                        variant="h4"
                        style={{ fontWeight: "bold", marginBottom: "20px" }}
                    >
                        Rice Mill System
                    </Typography>
                    <div className={classes.input}>
                    <TextField
                            name="Username"
                            label="Username"
                            value={username}
                            variant="filled"
                            onChange={(e)=>setUsername(e.target.value)}
                        />
                        <TextField
                            type="password"
                            name="password"
                            label="Password"
                            value={password}
                            variant="filled"
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            LOGIN
                            {/* {btnLoader ? (
                                <CircularProgress color="secondary" />
                            ) : (
                                "LOGIN"
                            )} */}
                        </Button>
                    </div>
                </div>
            </Paper>
            {/* <ErrorSnackBar
                open={openSnack}
                handleClose={handleClose}
                messege={messege || "Password Incorrect!!"}
            /> */}
        </React.Fragment>
    );
};

export default Login;