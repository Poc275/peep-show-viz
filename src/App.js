import './App.css';
import { Switch, Route, useLocation } from 'react-router-dom';
import Explorer from './Explorer';
import Splash from './Splash';

function App() {
  let location = useLocation();

  return (
    <Switch location={location}>
      <Route exact path="/">
        <Splash />
      </Route>

      <Route path="/:series/explore">
        <Explorer />
      </Route>
    </Switch>
  );
}

export default App;
