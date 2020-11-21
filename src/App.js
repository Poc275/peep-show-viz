// import logo from './logo.svg';
import './App.css';
import ChordDiagram from './ChordDiagram';
import Welcome from './Welcome';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/* <div className="App"> */}
        {/* <ChordDiagram /> */}
        {/* <Welcome /> */}
      {/* </div> */}

      <Switch>
        <Route exact path="/">
          <Welcome />
        </Route>
        <Route path="/:series/explore">
          <ChordDiagram />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
