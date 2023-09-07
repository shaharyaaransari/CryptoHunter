
import './App.css';
import Header from './component/Header';
import MainRouter from './routes/MainRouter';
import { makeStyles } from '@material-ui/core/styles';
function App() {
  const useStyles = makeStyles({
    App: {
      backgroundColor: '#14161a',
        color:"white",
            minHeight:"100vh"
     
    },
  });
     const classes = useStyles()
  return (
    <div className={classes.App}>
   <Header/>
   
     <MainRouter/>
    </div>
  );
}

export default App;
