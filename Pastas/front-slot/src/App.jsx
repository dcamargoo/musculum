import React from 'react';
import './App.css';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';
import lixeiraImg from './assets/lixeira.png';
import { useState } from 'react';

function App() {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nomeSlot, setNomeSlot] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [equipamentos, setEquipamentos] = useState('');
  const [slots, setSlots] = useState([]);
  const [popupExcluir, setPopupExcluir] = useState(null);

  const abrirPopup = () => setMostrarPopup(true);

  const confirmarNome = async () => {
    if (
      nomeSlot.trim() === '' ||
      peso.trim() === '' ||
      altura.trim() === '' ||
      objetivo.trim() === '' ||
      experiencia.trim() === ''
    ) return;

    const novoId = Date.now();

    try {
      const resposta = await fetch('http://localhost:3000/criar-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: novoId,
          nomeSlot: nomeSlot.trim(),
          peso: parseFloat(peso),
          altura: parseInt(altura),
          objetivo,
          experiencia,
          equipamentos: equipamentos.split(',').map(e => e.trim())
        })
      });

      const dados = await resposta.json();

      const novoSlot = {
        id: novoId,
        nome: nomeSlot.trim(),
        treino: dados.treino
      };

      setSlots([...slots, novoSlot]);
      setNomeSlot('');
      setPeso('');
      setAltura('');
      setObjetivo('');
      setExperiencia('');
      setEquipamentos('');
      setMostrarPopup(false);

    } catch (err) {
      console.error('Erro ao gerar treino:', err);
      alert('Erro ao gerar treino com IA.');
    }
  };

  const confirmarExclusao = () => {
    setSlots(slots.filter(slot => slot.id !== popupExcluir.id));
    setPopupExcluir(null);
  };

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Logo Musculum" className="logo-center" />
        <img src={perfilImg} alt="Perfil" className="perfil-icon" />
      </header>

      <main className="main-content">
        {slots.map((slot, index) => (
          <div key={slot.id} className="slot-container">
            <p className="slot-title">Slot {index + 1}</p>
            <div className="slot-row">
              <div className="slot-card">
                <div style={{
                  maxHeight: '180px',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  <div><strong>{slot.nome}</strong></div>
                  <div style={{
                    marginTop: '12px',
                    fontSize: '16px',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {slot.treino || 'Gerando treino...'}
                  </div>
                </div>
              </div>
              <button className="delete-btn" onClick={() => setPopupExcluir({ id: slot.id, index })}>
                <img src={lixeiraImg} alt="Deletar" className="trash-icon" />
              </button>
            </div>
          </div>
        ))}
      </main>

      {mostrarPopup && (
        <div className="popup">
          <h2 className="popup-title">Monte seu treino</h2>

          <input type="text" placeholder="Nome do slot (ex: Peito)"
            value={nomeSlot} onChange={(e) => setNomeSlot(e.target.value)} />

          <input type="number" placeholder="Peso (kg)"
            value={peso} onChange={(e) => setPeso(e.target.value)} />

          <input type="number" placeholder="Altura (cm)"
            value={altura} onChange={(e) => setAltura(e.target.value)} />

          <input type="text" placeholder="Objetivo (ex: hipertrofia)"
            value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />

          <input type="text" placeholder="Experiência (iniciante, intermediário...)"
            value={experiencia} onChange={(e) => setExperiencia(e.target.value)} />

          <input type="text" placeholder="Equipamentos (ex: halteres, banco...)"
            value={equipamentos} onChange={(e) => setEquipamentos(e.target.value)} />

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

      <div className="footer">
        <button className="workout-button" onClick={abrirPopup}>
          Criar <br /> slot de treino
        </button>
      </div>
    </div>
  );
}

export default App;
