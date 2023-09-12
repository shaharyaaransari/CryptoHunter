import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { CoinList } from '../../config/api'
import { Crypto } from '../../context/CryptoContext'
import { Container, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider, Typography, createTheme, makeStyles } from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '@material-ui/lab'

function CoinTable() {
    const [coins, setCoins] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
     const [page, setPage] = useState(1)
    const { currency, symbol } = useContext(Crypto)
    
    const navigate = useNavigate();
    const fetchCoins = ( ) => {
        setLoading(true)
        axios.get(CoinList(currency))
            .then((res) => {
                setLoading(false);
            
                if (res.data) {
                    setCoins(res.data);
                       console.log(res.data);
                } else {
                    console.error("API response is empty or undefined");
                }

            })
            .catch((err) => {
                setLoading(false)
                //console.log(err)
            })
    }
    useEffect(() => {
        fetchCoins()
    }, [currency,page])

    const darkTheme = createTheme({
        palette: {
            primary: {
                main: "#fff"
            },
            type: 'dark',
        },
    });
    const handleSearch = () => {
        return coins.filter((coin) => (
            coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
        ))
    }

    const useStyles = makeStyles(() => ({
        row: {
            backgroundColor: "#16171a",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#131111"
            },
            fontFamily: "Montserrat"
        },
        pagination:{
              "& .MuiPaginationItem-root":{
                color:"gold",
              }
        }
    }))
    const classes = useStyles()
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  return (
    <ThemeProvider theme={darkTheme}>
    <Container style={{ textAlign: "center" }}>
        <Typography variant='h4' style={{ margin: 18, fontFamily: "Montserrat" }}>
            Cryptocurrency Prices by market Cap
        </Typography>
        <TextField onChange={(e) => setSearch(e.target.value)} label="Search For a Crypto Currency.." variant='outlined' style={{ marginBottom: 20, width: "100%" }} />
        <TableContainer>
            {
                loading ? (<LinearProgress
                    style={{ backgroundColor: "gold" }} />) : (<Table>
                        <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                            <TableRow>
                                {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                    <TableCell style={{
                                        color: "black",
                                        fontWeight: "700",
                                        fontFamily: "Montsrrat"
                                    }}
                                        key={head}
                                        align={head === "Coin" ? "inherit" : "right"}
                                    >
                                        {head}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {handleSearch()?.slice((page-1)*10,(page-1)*10+10).map((row) => {
                                const profit = row.price_change_percentage_24h > 0
                                return (
                                    <TableRow className={classes.row} key={row.id}
                                        onClick={() => navigate(`/coins/${row.id}`)}>
                                        <TableCell component="th" scope='row'
                                            style={{ display: "flex", gap: 15 }}>
                                            <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ textTransform: "upppercase", fontSize: 22 }}>
                                                    {row.symbol}
                                                </span>
                                                <span style={{ color: "darkgray" }}>
                                                    {row.name}
                                                </span>
                                            </div>
                                        </TableCell >
                                        <TableCell align='right' style={{
                                            fontWeight: 500
                                        }}>
                                            {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                                        </TableCell>
                                        <TableCell align='right' style={{
                                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                                            fontWeight: 500
                                        }}>
                                            {profit && "+"} {row?.price_change_percentage_24h?.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align='right'>
                                            {symbol} {" "} {numberWithCommas(row?.market_cap.toString().slice(0, -6)
                                            )}M
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>)
            }
        </TableContainer>
          
          <Pagination 
            variant="outlined"
            style={{padding:20,
            width:"100%",
         display:"flex",
        justifyContent:"center"}}
          classes={{ul:classes.pagination}}
            onChange={(_,value)=>{
                   setPage(value)
                     window.scroll(0,450)
            }}
          count={Math.ceil(handleSearch()?.length/10)}/>
    </Container>
</ThemeProvider>
  )
}

export default CoinTable