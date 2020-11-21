// import logo from './logo.svg';
import './App.css';
import Welcome from './Welcome';
import { Switch, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Explorer from './Explorer';

function App() {
  let location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition 
        key={location.key}
        classNames="fade"
        timeout={1300}
      >
        <Switch location={location}>
          <Route exact path="/">
            <Welcome />
          </Route>

          <Route path="/:series/explore">
            <Explorer />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
