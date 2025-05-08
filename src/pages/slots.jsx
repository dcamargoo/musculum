import './slots.css';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';
import lixeiraImg from './assets/lixeira.png';
import plusIcon from './assets/plus.png';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import necessário

function App() {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nomeSlot, setNomeSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [popupExcluir, setPopupExcluir] = useState(null);

  const abrirPopup = () => setMostrarPopup(true);

  const confirmarNome = () => {
    if (nomeSlot.trim() === '') return;

    const novoSlot = {
      id: Date.now(),
      nome: nomeSlot.trim(),
    };

    setSlots([...slots, novoSlot]);
    setNomeSlot('');
    setMostrarPopup(false);
  };

  const confirmarExclusao = () => {
    setSlots(slots.filter(slot => slot.id !== popupExcluir.id));
    setPopupExcluir(null);
  };

  return (
    <div className="app">
      <header className="header">
        <Link to="/">
          <img src={logo} alt="Logo Musculum" className="logo-center" />
        </Link>
        <img src={perfilImg} alt="Perfil" className="perfil-icon" />
      </header>

      <main className="main-content">
        {slots.map((slot, index) => (
          <div key={slot.id} className="slot-container">
            <p className="slot-title">Slot {index + 1}</p>
            <div className="slot-row">
              <div className="slot-card">{slot.nome}</div>
              <button className="delete-btn" onClick={() => setPopupExcluir({ id: slot.id, index })}>
                <img src={lixeiraImg} alt="Deletar" className="trash-icon" />
              </button>
            </div>
          </div>
        ))}

        {slots.length > 0 && (
          <div className="plus-floating">
            <img
              src={plusIcon}
              alt="Adicionar slot"
              className="plus-icon-large"
              onClick={abrirPopup}
            />
          </div>
        )}
      </main>

      {slots.length === 0 && (
        <div className="footer">
          <button className="workout-button" onClick={abrirPopup}>
            Criar <br /> slot de treino
          </button>
        </div>
      )}

      {mostrarPopup && (
        <div className="popup">
          <h2 className="popup-title">Qual nome deseja colocar no seu slot de treino?</h2>
          <input
            type="text"
            placeholder="Ex: Peito"
            value={nomeSlot}
            onChange={(e) => setNomeSlot(e.target.value)}
          />
          <button onClick={confirmarNome}>Confirmar</button>
        </div>
      )}

      {popupExcluir && (
        <div className="popup">
          <h2>Deseja excluir o Slot {popupExcluir.index + 1}?</h2>
          <div className="popup-buttons">
            <button onClick={() => setPopupExcluir(null)}>Cancelar</button>
            <button className="confirm" onClick={confirmarExclusao}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
