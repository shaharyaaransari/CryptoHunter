import React, { useContext, useEffect, useState } from 'react';
import { Crypto } from '../../context/CryptoContext';
import axios from 'axios';
import { HistoricalChart } from '../../config/api';
import {
  CircularProgress,
  ThemeProvider,
  createTheme,
  makeStyles,
} from '@material-ui/core';
import { Line } from 'react-chartjs-2/dist';
import { chartDays } from '../../config/data';



function CoinInfo({coin}) {
    const [historicData, setHistoricData] = useState([]);
    const [days, setDays] = useState(1);
    const { currency } = useContext(Crypto);
    const [flag, setFlag] = useState(false);
  
    const fetchHistoricData = async () => {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricData(data.prices);
    };
  
    useEffect(() => {
      fetchHistoricData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days,currency]);
  
    const darkTheme = createTheme({
      palette: {
        primary: {
          main: '#fff',
        },
        type: 'dark',
      },
    });
  
    const useStyles = makeStyles((theme) => ({
      container: {
        width: '75%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        padding: 40,
        [theme.breakpoints.down('md')]: {
          width: '100%',
          marginTop: 0,
          padding: 20,
          paddingTop: 0,
        },
      },
    }));
  
    const classes = useStyles();
  
  return (
    <ThemeProvider theme={darkTheme}>
    <div className={classes.container}>
      {!historicData || flag === false ? (
        <CircularProgress style={{ color: 'gold' }} size={250} thickness={1} />
      ) : (
        <>
          <Line
            data={{
              labels: historicData.map((coinData) => {
                let date = new Date(coinData[0]);
                let time =
                  date.getHours() > 12
                    ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                    : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),
              datasets: [
                {
                  data: historicData.map((coin) => coin[1]),
                  label: `Price (Past ${days} Days ) in ${currency}`,
                  borderColor: "#EEDC1D"
                },

              ]
            }}
            options={{
              elements: {
                point: {
                  radius: 1,
                }
              }
            }}
          />
          <div style={{
            display: "flex",
            marginTop: 20,
            justifyContent: "space-between",
            width: "100%"
          }}>
            
          </div>
        </>
      )}
    </div>
  </ThemeProvider>
  )
}

export default CoinInfo