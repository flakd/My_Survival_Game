import WelcomeModal from './components/WelcomeModal';
import MusicOff from './components/MusicOff';
import RAoGModal from './components/RAoGModal';
import Test from './components/Test';
import SkyBox from './components/SkyBox';
import Map from './components/Map';
import StatusesContainer from './components/status/StatusesContainer';
import InputOutput from './components/InputOutput';

function App() {
  return (
    <>
      <WelcomeModal />
      <MusicOff />
      <RAoGModal />
      {/* <Test /> */}
      <StatusesContainer />
      <InputOutput />
    </>
  );
}

export default App;
