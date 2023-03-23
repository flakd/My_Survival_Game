import {useState} from 'react';
import WelcomeModal from './components/modals/WelcomeModal';
import MusicOff from './components/MusicOff';
import RAoGModal from './components/modals/RAoGModal';
import StatusesContainer from './components/status/StatusesContainer';
import InputOutput from './components/InputOutput';
import Modal from './components/modals/Modal';
import Backdrop from './components/modals/Backdrop';
import HelpButton from './components/status/HelpButton';
import getGameHelpContent from './components/modals/helpModal';

import './App.css';

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
      {isModalOpen && (
        <Modal
          priButton='OK'
          closeModal={closeModalHandler}
          title='Game Help'
          content={getGameHelpContent()}
        />
      )}
      {isModalOpen && <Backdrop closeModal={closeModalHandler} />}
    </>
  );
}

export default App;
