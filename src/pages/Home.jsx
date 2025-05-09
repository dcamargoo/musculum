import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; // 👈 Importa o useEffect aqui
import './Home.css';
import logo from './assets/musculum.png';

function Home() {
  const navigate = useNavigate();

  const irParaSlots = () => {
    navigate('/slots');
  };

  // 👇 useEffect dentro da função Home
  useEffect(() => {
    fetch('http://18.210.183.73:3000/api/teste')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

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
