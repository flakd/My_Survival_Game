import WelcomeModal from './components/WelcomeModal';
import MusicOff from './components/MusicOff';
import RAoGModal from './components/RAoGModal';
import Test from './components/Test';
import SkyBox from './components/SkyBox';
import Map from './components/Map';
import StatusesContainer from './components/status/StatusesContainer';
import InputOutput from './components/InputOutput';
import './App.css';
import Modal from './components/Modal';
import Backdrop from './components/Backdrop';

function App() {
  return (
    <>
      <WelcomeModal />
      <MusicOff />
      <RAoGModal />
      {/* <Test /> */}
      <StatusesContainer />
      <InputOutput />
      <Modal />
      <Backdrop />
    </>
  );
}

export default App;
