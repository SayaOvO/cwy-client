import { Route, Switch } from 'wouter';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Project } from './components/project';

const App = () => {
  return (
    <ErrorBoundary fallback={<p>Something went wrong! try to refresh :)</p>}>
      <Switch>
        <Route path='projects/:id' component={Project} />
      </Switch>
    </ErrorBoundary>
  );
};

export default App;
