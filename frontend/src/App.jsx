import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';
import RankingTable from './components/RankingTable';
import './App.css';

const initialInterns = [
  { id: 1, name: 'Lunara', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-01' }] },
  { id: 2, name: 'Hemerson', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-02' }] },
  { id: 3, name: 'Mariana', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-03' }] },
  { id: 4, name: 'Nathalia', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-04' }] },
  { id: 5, name: 'Gusthavo', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-05' }] },
  { id: 6, name: 'Mateus', evaluations: [{ mentor: 'Profissional CER', softSkills: { communication: 0, proactivity: 0, teamwork: 0 }, date: '2026-03-06' }] },
];

const getInternScore = (intern) => {
  const evaluations = intern.evaluations || [];
  if (evaluations.length === 0) return { softSkillsAverage: 0, overall: 0 };

  let totalSoft = 0;
  let itemCount = 0;

  evaluations.forEach((evalItem) => {
    const ss = evalItem.softSkills || { communication: 0, proactivity: 0, teamwork: 0 };

    totalSoft += ss.communication + ss.proactivity + ss.teamwork;
    itemCount += 3;
  });

  const softSkillsAverage = totalSoft / itemCount;
  const overall = softSkillsAverage;

  return { softSkillsAverage, overall };
};

const rankInterns = (interns) => {
  return [...interns]
    .map((intern) => {
      const { softSkillsAverage, overall } = getInternScore(intern);
      return {
        ...intern,
        softSkillsAverage,
        overall,
      };
    })
    .sort((a, b) => b.overall - a.overall)
    .map((intern, index) => ({ ...intern, ranking: index + 1 }));
};

const exportToPDF = (interns) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Ranking de Estagiários CER', 20, 20);
  doc.setFontSize(12);
  doc.text('Critérios: Comunicação, Proatividade, Trabalho em Equipe', 20, 30);
  let y = 50;
  interns.forEach((intern, index) => {
    doc.text(`${index + 1}. ${intern.name} - Score: ${intern.overall.toFixed(2)}`, 20, y);
    y += 10;
  });
  doc.save('ranking-cer.pdf');
};

const validateScore = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 10;
};

function App() {
  const [interns, setInterns] = useState(rankInterns(initialInterns));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    communication: '',
    proactivity: '',
    teamwork: '',
  });

  const handleLogin = (event) => {
    event.preventDefault();

    if (loginPassword === '123456') {
      setIsAuthenticated(true);
      setUserRole('Estagiário');
      setLoginError('');
      return;
    }

    if (loginPassword === 'Reabit@cao25') {
      setIsAuthenticated(true);
      setUserRole('Profissional CER');
      setLoginError('');
      return;
    }

    setLoginError('Senha incorreta. Use 123456 para estagiários ou Reabit@cao25 para profissionais.');
  };

  const openModal = (intern = null) => {
    setSelectedIntern(intern);

    if (intern) {
      setFormData({
        name: intern.name,
        communication: '',
        proactivity: '',
        teamwork: '',
      });
    } else {
      setFormData({
        name: '',
        communication: '',
        proactivity: '',
        teamwork: '',
      });
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedIntern(null);
    setFormData({
      name: '',
      communication: '',
      proactivity: '',
      teamwork: '',
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const saveEvaluation = (event) => {
    event.preventDefault();

    // Validate required fields
    if (!formData.name) {
      setLoginError('Nome do estagiário é obrigatório.');
      return;
    }

    const fields = ['communication', 'proactivity', 'teamwork'];
    for (const field of fields) {
      if (!validateScore(formData[field])) {
        setLoginError('Notas precisam ser inteiros entre 1 e 10.');
        return;
      }
    }

    const newEvaluation = {
      mentor: userRole || 'Avaliação CER',
      date: new Date().toISOString().split('T')[0],
      softSkills: {
        communication: Number(formData.communication),
        proactivity: Number(formData.proactivity),
        teamwork: Number(formData.teamwork),
      },
    };

    let updatedInterns;

    if (selectedIntern) {
      updatedInterns = interns.map((intern) => {
        if (intern.id === selectedIntern.id) {
          return {
            ...intern,
            evaluations: [...intern.evaluations, newEvaluation],
          };
        }
        return intern;
      });
    } else {
      const id = Math.max(0, ...interns.map((x) => x.id)) + 1;
      updatedInterns = [
        ...interns,
        {
          id,
          name: formData.name,
          evaluations: [newEvaluation],
        },
      ];
    }

    setInterns(rankInterns(updatedInterns));
    closeModal();
    setLoginError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-cyan-400/30 rounded-xl p-8 shadow-2xl shadow-cyan-400/50">
          <h1 className="text-3xl font-bold text-cyan-300 text-center mb-4">Portal de Avaliação - CER</h1>
          <p className="text-sm text-cyan-200 mb-6 text-center">Acesso restrito para profissionais e estagiários autorizados.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-cyan-200 text-sm">Senha</label>
              <input
                type="password"
                name="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg border border-cyan-500 bg-slate-800 text-white"
                placeholder="Insira sua senha"
              />
            </div>

            {loginError && <p className="text-red-400 text-sm">{loginError}</p>}

            <button
              type="submit"
              className="w-full mt-2 py-2 text-white font-bold bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg hover:from-cyan-500 hover:to-purple-600 transition-all"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-cyan-300">Portal de Avaliação - CER</h1>
            <p className="text-cyan-200 opacity-90">Usuário logado como: <strong>{userRole}</strong></p>
          </div>

          <div className="flex gap-3">
            {userRole !== 'Estagiário' && (
              <button onClick={() => openModal(null)} className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg font-semibold hover:brightness-110 transition-all">Avaliar Estagiário</button>
            )}
            <button onClick={() => exportToPDF(interns)} className="px-5 py-2 border border-purple-500 text-purple-200 rounded-lg hover:bg-purple-500/20 transition-all">Exportar para PDF</button>
            <button onClick={() => { setIsAuthenticated(false); setUserRole(''); setLoginPassword(''); }} className="px-5 py-2 border border-cyan-500 text-cyan-200 rounded-lg hover:bg-cyan-500/20 transition-all">Sair</button>
          </div>
        </div>

        <RankingTable interns={interns} onEvaluate={openModal} />

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-3xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-purple-500/50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-cyan-300">{selectedIntern ? 'Nova Avaliação' : 'Avaliação de Novo Estagiário'}</h2>
                  <button onClick={closeModal} className="text-cyan-200 hover:text-white">Fechar</button>
                </div>

                <form onSubmit={saveEvaluation} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-cyan-200">Nome do Estagiário</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full p-2 rounded-lg border border-cyan-500 bg-slate-800 text-white"
                      placeholder="Ex: Maria Souza"
                      required
                    />
                  </div>


                  <div>
                    <label className="text-cyan-200">Comunicação</label>
                    <input
                      type="number"
                      name="communication"
                      min={1}
                      max={10}
                      value={formData.communication}
                      onChange={handleFormChange}
                      className="w-full p-2 rounded-lg border border-cyan-500 bg-slate-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-cyan-200">Proatividade</label>
                    <input
                      type="number"
                      name="proactivity"
                      min={1}
                      max={10}
                      value={formData.proactivity}
                      onChange={handleFormChange}
                      className="w-full p-2 rounded-lg border border-cyan-500 bg-slate-800 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-cyan-200">Trabalho em Equipe</label>
                    <input
                      type="number"
                      name="teamwork"
                      min={1}
                      max={10}
                      value={formData.teamwork}
                      onChange={handleFormChange}
                      className="w-full p-2 rounded-lg border border-cyan-500 bg-slate-800 text-white"
                      required
                    />
                  </div>

                  {loginError && <p className="text-red-400 col-span-full">{loginError}</p>}

                  <div className="md:col-span-full flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 border border-cyan-500 text-cyan-200 rounded-lg hover:bg-cyan-500/15 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg font-bold hover:brightness-110 transition-all"
                    >
                      Salvar Avaliação
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

