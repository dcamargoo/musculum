import './slots.css';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';
import lixeiraImg from './assets/lixeira.png';
import plusIcon from './assets/plus.png';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Slots() {
  const navigate = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nomeSlot, setNomeSlot] = useState('');
  const [slots, setSlots] = useState([]);
  const [popupExcluir, setPopupExcluir] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState({});

  useEffect(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem('slotsData')) || [];
    setSlots(dadosSalvos);
  }, []);

  const abrirPopup = () => setMostrarPopup(true);

  const confirmarNome = () => {
    if (nomeSlot.trim() === '') return;

    const novoSlot = {
      id: Date.now(),
      nome: nomeSlot.trim(),
      treino: ''
    };
    const atualizados = [...slots, novoSlot];
    setSlots(atualizados);
    localStorage.setItem('slotsData', JSON.stringify(atualizados));
    setNomeSlot('');
    setMostrarPopup(false);
  };

  const confirmarExclusao = () => {
    const atualizados = slots.filter(slot => slot.id !== popupExcluir.id);
    setSlots(atualizados);
    localStorage.setItem('slotsData', JSON.stringify(atualizados));
    setPopupExcluir(null);
  };

  const acessarSlot = (slot) => {
    navigate('/entrar-slots', { state: { slotId: slot.id, slotNome: slot.nome } });
  };

  const avaliarSlot = async (slotId, nota) => {
    setAvaliacoes(prev => ({ ...prev, [slotId]: nota }));

    if (nota < 4) {
      const slot = slots.find(s => s.id === slotId);
      if (!slot) return;

      try {
        const response = await fetch('http://localhost:3000/criar-slot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: slotId,
            nomeSlot: slot.nome,
            peso: 70,
            altura: 170,
            objetivo: "revisar treino anterior",
            experiencia: "intermediário",
            equipamentos: []
          })
        });

        const data = await response.json();
        const novosSlots = slots.map(s =>
          s.id === slotId ? { ...s, treino: data.treino } : s
        );
        setSlots(novosSlots);
        localStorage.setItem('slotsData', JSON.stringify(novosSlots));
        alert('Novo treino gerado com sucesso!');
      } catch (err) {
        console.error('Erro ao gerar novo treino:', err);
      }
    }
  };

  const renderEstrelas = (slotId) => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            onClick={() => avaliarSlot(slotId, n)}
            className="star"
            style={{ opacity: avaliacoes[slotId] >= n ? 1 : 0.4 }}
          >
            ★
          </span>
        ))}
      </div>
    );
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
              <div className="slot-card" onClick={() => acessarSlot(slot)}>
                <div style={{ maxHeight: '180px', overflowY: 'auto', paddingRight: '8px' }}>
                  <div><strong>{slot.nome}</strong></div>
                  <div style={{
                    marginTop: '12px',
                    fontSize: '16px',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {slot.treino || 'Clique para gerar treino'}
                  </div>
                </div>
              </div>
              <button className="delete-btn" onClick={() => setPopupExcluir({ id: slot.id, index })}>
                <img src={lixeiraImg} alt="Deletar" className="trash-icon" />
              </button>
            </div>
            {slot.treino && renderEstrelas(slot.id)}
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
