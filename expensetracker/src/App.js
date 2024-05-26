import ExpenseTracker from './ExpenseTracker';
import {SnackbarProvider} from 'notistack'
import './App.css';

function App() {
  return (
    <SnackbarProvider>
      <div className="App">
        <ExpenseTracker/>
      </div>
    </SnackbarProvider>
  );
}

export default App;
