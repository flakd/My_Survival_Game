import {useState} from 'react';
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
import HelpButton from './components/status/HelpButton';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModalHandler = (e) => {
    setIsModalOpen(false);
    console.log('isModalOpen1: ', isModalOpen);
  };
  const showModalHandler = (e) => {
    setIsModalOpen(true);
    console.log('isModalOpen2: ', isModalOpen);
  };
  return (
    <>
      <WelcomeModal />
      <HelpButton showModal={showModalHandler} />
      <RAoGModal />
      {/* <Test /> */}
      <StatusesContainer />
      <InputOutput />
      {isModalOpen && <Modal closeModal={closeModalHandler} />}
      {isModalOpen && <Backdrop closeModal={closeModalHandler} />}
    </>
  );
}

export default App;
