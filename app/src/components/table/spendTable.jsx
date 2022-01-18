import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function SpendTable(creditSum,debitSum) {
    let rows = [{name:"Credit",amount:creditSum},{name:"Debit",amount:debitSum},{name:"Net",amount:creditSum-debitSum}]
    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }}>
            <TableHead>
            <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}
