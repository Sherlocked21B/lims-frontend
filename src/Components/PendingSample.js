import React, { useState} from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";
import { Style } from "@material-ui/icons";


const PendingSample = () => {
    
    return (
        <div>
             <div style={Styles.table}>
        <TableContainer style={Styles.tables}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Sample Id</TableCell>
            <TableCell>Test</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell>Collected By</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell style={Style.text}>Pending</TableCell>
                <TableCell>
                <Button
                         style={Styles.button}
                            variant="contained"
                            color="primary"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell style={Style.text}>Pending</TableCell>
                <TableCell>
                <Button
                         style={Styles.button}
                            variant="contained"
                            color="primary"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell color="secondary">Pending</TableCell>
                <TableCell>
                <Button
                         style={Styles.button}
                            variant="contained"
                            color="primary"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell color="secondary">Pending</TableCell>
                <TableCell>
                <Button
                         style={Styles.button}
                            variant="contained"
                            color="primary"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>101</TableCell>
                <TableCell>Urine Test</TableCell>
                <TableCell>Rajesh</TableCell>
                <TableCell>2020/01/20</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Ravish</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>
                <Button
                         style={Styles.button}
                            variant="contained"
                            color="primary"
                            color="black-text"
                        >
                           Generate Report
                        </Button>
                </TableCell>
            </TableRow>
        </TableBody>
        </Table>
        </TableContainer>
        </div>
        </div>
    )
}

const Styles = {
    tables: {
        height: "380px",
      },
      table: {
        marginTop:"7%",
        marginLeft: "3%",
      },
      button: {
        marginTop: "1rem",
        backgroundColor:"#27E208",
        
    },
  
}


export default PendingSample;