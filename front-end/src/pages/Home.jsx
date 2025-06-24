import { useNavigate } from 'react-router-dom';
import './Home.css';
import logo from './assets/musculum.png';

function Home() {
  const navigate = useNavigate();

  const irParaSlots = () => {
    navigate('/slots');
  };

  return (
    <div className="home">
      <img src={logo} alt="Logo Musculum" className="logo-home" />

      <div className="home-buttons">
        <button className="home-button" onClick={irParaSlots}>Acessar Slot de treino</button>
        <button className="home-button">Configurações</button>
        <button className="home-button">Perfil</button>
        <button className="home-button">Sair</button>
      </div>

      <footer className="home-footer"></footer>
    </div>
  );
}

export default Home;
