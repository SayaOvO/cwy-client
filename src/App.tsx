import { Route, Switch } from 'wouter';
import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { Editor } from './components/editor';
import { Project } from './components/project';
import { TabContextProvider } from './contexts/tab-context';

const App = () => {
  return (
    <ErrorBoundary fallback={<p>Something went wrong! try to refresh :)</p>}>
      <Switch>
        <TabContextProvider>
          <Route path='projects/:name' component={Project} />
        </TabContextProvider>
      </Switch>
    </ErrorBoundary>
  );
};

export default App;
