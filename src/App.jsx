import { HomeView } from './components/home';

const App = () => {

  return (
    <div className="App">
      <div className="container">
        { HomeView() }
      </div>
    </div>
  );
};

export default App;