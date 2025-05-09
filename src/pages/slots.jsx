import './slots.css';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';
import lixeiraImg from './assets/lixeira.png';
import plusIcon from './assets/plus.png';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Slots() {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nomeSlot, setNomeSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [popupExcluir, setPopupExcluir] = useState(null);

  const id_usuario = 1; // você pode ajustar isso para um usuário logado futuramente

  useEffect(() => {
    fetch(`http://localhost:3000/slot/${id_usuario}`)
      .then(res => res.json())
      .then(data => setSlots(data.slots || []))
      .catch(err => console.error("Erro ao buscar slots:", err));
  }, []);

  const abrirPopup = () => setMostrarPopup(true);

  const confirmarNome = () => {
    if (nomeSlot.trim() === '') return;

    const slotData = {
      treino: nomeSlot.trim(),
      objetivo: "Manter forma",
      avaliacao: false,
      id_usuario: id_usuario
    };

    fetch('http://localhost:3000/slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slotData)
    })
      .then(res => res.json())
      .then(data => {
        setSlots([...slots, data.slot]);
        setNomeSlot('');
        setMostrarPopup(false);
      })
      .catch(err => console.error("Erro ao criar slot:", err));
  };

  const confirmarExclusao = () => {
    fetch(`http://localhost:3000/slot/${popupExcluir.id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setSlots(slots.filter(slot => slot.id_slot !== popupExcluir.id));
        setPopupExcluir(null);
      })
      .catch(err => console.error("Erro ao excluir slot:", err));
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
          <div key={slot.id_slot} className="slot-container">
            <p className="slot-title">Slot {index + 1}</p>
            <div className="slot-row">
              <div className="slot-card">{slot.treino}</div>
              <button className="delete-btn" onClick={() => setPopupExcluir({ id: slot.id_slot, index })}>
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

export default Slots;
