import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RankingTable = ({ interns, onEvaluate }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    setAnimationComplete(true);
  }, []);

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.08, duration: 0.5, ease: 'easeOut' },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const getRankingColor = (index) => {
    if (index === 0) return 'from-yellow-400 to-yellow-300';
    if (index === 1) return 'from-slate-300 to-slate-200';
    if (index === 2) return 'from-orange-400 to-orange-300';
    return 'from-cyan-400 to-purple-500';
  };

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '⭐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h2 className="text-cyan-300 text-3xl font-bold">Ranking de Estagiários CER</h2>
          <p className="text-cyan-200">Critérios: Habilidades Interpessoais (Comunicação, Proatividade, Trabalho em Equipe)</p>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={animationComplete ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="space-y-4"
      >
        {interns.map((intern, index) => (
          <motion.div
            key={intern.id}
            custom={index}
            variants={rowVariants}
            className="relative"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-cyan-400/20 to-purple-500/20 shadow-lg shadow-purple-500/20" />
            <div className="relative p-4 rounded-xl bg-slate-900/70 backdrop-blur-xl border border-cyan-500/20">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{getMedalEmoji(index)}</span>
                    <h3 className="text-2xl font-bold text-cyan-300">{intern.name}</h3>
                  </div>
                  <p className="text-cyan-100 text-xs mt-1">Ranking: #{intern.ranking}</p>
                </div>

                <div className="text-right">
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{intern.overall.toFixed(2)}</p>
                  <span className="text-xs text-cyan-300 uppercase tracking-wider">Score Geral</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-2 bg-slate-800/60 rounded-lg border border-purple-400/20">
                  <p className="text-purple-200 text-xs uppercase">Soft Skills</p>
                  <p className="text-purple-100 text-lg font-semibold">{intern.softSkillsAverage.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-slate-800/60 rounded-lg border border-cyan-400/20">
                  <p className="text-cyan-200 text-xs uppercase">Avaliações</p>
                  <p className="text-cyan-100 text-lg font-semibold">{intern.evaluations.length}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => onEvaluate(intern)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:brightness-110 transition-all"
                >
                  Avaliar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RankingTable;

