import * as React from 'react';
import { styled } from '@mui/system';
import TablePaginationUnstyled from '@mui/base/TablePaginationUnstyled';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const blue = {
    200: '#A5D8FF',
    400: '#1976D2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
};

const Root = styled('div')(
    ({ theme }) => `
        table {
            font-family: IBM Plex Sans, sans-serif;
            font-size: 1rem;
            border-collapse: collapse;
            width: 100%;
        }

        td,
        th {
            border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
            text-align: left;
            padding: 6px;
        }

        th {
            background-color: ${theme.palette.mode === 'dark' ? grey[900] : blue[400]};
        }
    `,
    );

    const CustomTablePagination = styled(TablePaginationUnstyled)(
    ({ theme }) => `
        & .MuiTablePaginationUnstyled-spacer {
            display: none;
        }
        & .MuiTablePaginationUnstyled-toolbar {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;

            @media (min-width: 768px) {
            flex-direction: row;
            align-items: center;
            }
        }
        & .MuiTablePaginationUnstyled-selectLabel {
            margin: 0;
        }
        & .MuiTablePaginationUnstyled-select {
            padding: 2px;
            border: 1px solid ${grey[800]};
            border-radius: 50px;
            background-color: transparent;
            &:hover {
            background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
            }
            &:focus {
            outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
            }
        }
        & .MuiTablePaginationUnstyled-displayedRows {
            margin: 0;

            @media (min-width: 768px) {
            margin-left: auto;
            }
        }
        & .MuiTablePaginationUnstyled-actions {
            padding: 2px;
            border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
            border-radius: 50px;
            text-align: center;
        }
        & .MuiTablePaginationUnstyled-actions > button {
            margin: 0 8px;
            border: transparent;
            border-radius: 2px;
            background-color: transparent;
            &:hover {
            background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
            }
            &:focus {
            outline: 1px solid ${theme.palette.mode === 'dark' ? blue[400] : blue[200]};
            }
        }
    `,
);

export default function TransactionTable(rows) 
{
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);  
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
    if (rows.length === 0)
        return (
            <h1>No Transaction</h1>
        );
    return (
        <Root sx={{ width: 600, maxWidth: '100%' }}>
            <table aria-label="custom pagination table">
            <thead>
                <tr>
                <th>Date</th>
                <th>Vendor</th>
                <th>Relation</th>
                <th>Amount</th>
                <th>Category</th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {(rowsPerPage > 0? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage): rows
                ).map((row) => (
                <tr key={row._id}>
                    <td>
                        {(new Date(row.date)).toLocaleDateString("en-US",{ year:'numeric',month:'long',day:'numeric'})}
                    </td>
                    <td>
                        {row.person}
                    </td>
                    <td>
                        {row.relation}
                    </td>
                    <td>
                        {row.amount}
                    </td>
                    <td>
                        {row.category}
                    </td>
                    <td>
                        <Button
                            endIcon={<DeleteIcon />}
                            onClick={async (event)=>{
                                event.preventDefault();
                                let trans_id = row._id;
                                await axios({
                                    method: 'post',
                                    url: '/delete_transaction',
                                    headers: {'Content-Type' : 'application/json'},
                                    params: {trans_id}
                                }).then(()=>{
                                    document.getElementById("showtransactionSubmit").click();
                                })
                            }}
                        >
                        </Button>
                    </td>
                </tr>
                ))}
    
                {emptyRows > 0 && (
                <tr style={{ height: 41 * emptyRows }}>
                    <td colSpan={6} />
                </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                <CustomTablePagination
                    rowsPerPageOptions={[5, 10]}
                    colSpan={6}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    componentsProps={{
                    select: {
                        'aria-label': 'rows per page',
                    },
                    actions: {
                        showFirstButton: true,
                        showLastButton: true,
                    },
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </tr>
            </tfoot>
            </table>
        </Root>
    );
}  