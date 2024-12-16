import { Route, Switch } from 'wouter';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Editor } from './components/editor';

const App = () => {
  return (
    <ErrorBoundary fallback={<p>Something went wrong! try to refresh :)</p>}>
      <Switch>
        <Route path='projects/:name' component={Editor} />
      </Switch>
    </ErrorBoundary>
  );
};

export default App;
