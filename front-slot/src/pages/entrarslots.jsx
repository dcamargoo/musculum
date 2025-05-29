import './EntrarSlots.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';

function EntrarSlots() {
  const navigate = useNavigate();
  const location = useLocation();
  const slotId = location.state?.slotId;
  const slotNome = location.state?.slotNome;

  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [form, setForm] = useState({
    idade: '',
    altura: '',
    peso: '',
    objetivo: '',
    experiencia: '',
    equipamentos: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const confirmar = async () => {
    try {
      const response = await fetch('http://localhost:3000/criar-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          nomeSlot: slotNome,
          peso: form.peso,
          altura: form.altura,
          objetivo: form.objetivo,
          experiencia: form.experiencia,
          equipamentos: form.equipamentos.split(',').map(e => e.trim())
        })
      });

      if (!response.ok) throw new Error("Erro ao gerar treino.");

      const data = await response.json();
      const treino = data.treino;

      const slotsData = JSON.parse(localStorage.getItem('slotsData') || '[]');
      const atualizados = slotsData.map(s =>
        s.id === slotId ? { ...s, treino } : s
      );

      localStorage.setItem('slotsData', JSON.stringify(atualizados));
      alert('✅ Treino gerado com sucesso!');
      navigate('/slots');

    } catch (err) {
      console.error(err);
      alert('Erro ao gerar treino.');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <img
          src={logo}
          alt="Logo Musculum"
          className="logo-center"
          onClick={() => navigate('/')}
        />
        <img src={perfilImg} alt="Perfil" className="perfil-icon" />
      </header>

      <main className="main-content center-content">
        <button className="workout-button" onClick={() => setMostrarPopup(true)}>
          Criar treino para {slotNome}
        </button>
      </main>

      {mostrarPopup && (
        <div className="popup">
          <h2>Gerar treino para: {slotNome}</h2>

          <input name="idade" value={form.idade} onChange={handleChange} placeholder="Idade" />
          <input name="altura" value={form.altura} onChange={handleChange} placeholder="Altura (cm)" />
          <input name="peso" value={form.peso} onChange={handleChange} placeholder="Peso (kg)" />
          <input name="objetivo" value={form.objetivo} onChange={handleChange} placeholder="Objetivo" />
          <input name="experiencia" value={form.experiencia} onChange={handleChange} placeholder="Experiência" />
          <input name="equipamentos" value={form.equipamentos} onChange={handleChange} placeholder="Equipamentos (separados por vírgula)" />

          <div className="popup-buttons">
            <button onClick={() => setMostrarPopup(false)}>Cancelar</button>
            <button className="confirm" onClick={confirmar}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EntrarSlots;
