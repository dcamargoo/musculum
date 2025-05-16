import './EntrarSlots.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/musculum.png';
import perfilImg from './assets/perfil.png';

function EntrarSlots() {
  const navigate = useNavigate();
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [form, setForm] = useState({
    tipo: '',
    idade: '',
    altura: '',
    peso: '',
    objetivo: '',
    equipamentos: '',
    salvar: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const confirmar = () => {
    console.log('Treino criado:', form);
    setMostrarPopup(false);
    alert("Treino criado com sucesso!");
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
          Criar treino
        </button>
      </main>

      {mostrarPopup && (
        <div className="popup">
          <h2>Criar novo treino</h2>
          <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo de treino (ex: peito, perna...)" />
          <input name="idade" value={form.idade} onChange={handleChange} placeholder="Sua idade" />
          <input name="altura" value={form.altura} onChange={handleChange} placeholder="Sua altura (ex: 1.75)" />
          <input name="peso" value={form.peso} onChange={handleChange} placeholder="Seu peso (kg)" />
          <input name="objetivo" value={form.objetivo} onChange={handleChange} placeholder="Objetivo (ex: emagrecer)" />
          <input name="equipamentos" value={form.equipamentos} onChange={handleChange} placeholder="Equipamentos disponíveis" />

          <div className="checkbox-area">
            <input type="checkbox" id="salvar" name="salvar" checked={form.salvar} onChange={handleChange} />
            <label htmlFor="salvar">Deseja salvar seus dados para próximos treinos criados?</label>
          </div>

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
