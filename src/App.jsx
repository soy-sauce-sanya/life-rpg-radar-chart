import { useState, useEffect } from 'react';

function App() {
  // Load from localStorage or use defaults
  const loadState = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const [skills, setSkills] = useState(() => loadState('lifeRpgSkills', [
    { name: 'Writing', level: 2, maxLevel: 10, icon: '✍️', color: '#3B82F6' },
    { name: 'Financial', level: 1, maxLevel: 10, icon: '💰', color: '#22C55E' },
    { name: 'Learning', level: 2, maxLevel: 10, icon: '📚', color: '#A855F7' },
    { name: 'Health', level: 1, maxLevel: 10, icon: '🏋️', color: '#F97316' },
    { name: 'Creativity', level: 3, maxLevel: 10, icon: '🎨', color: '#EC4899' },
    { name: 'Coding', level: 4, maxLevel: 10, icon: '💻', color: '#6B7280' },
  ]));

  const [lifeAreas, setLifeAreas] = useState(() => loadState('lifeRpgAreas', [
    { name: 'Body', level: 1, xp: 0, maxXp: 1000, icon: '💪', color: '#F97316' },
    { name: 'Mind', level: 1, xp: 0, maxXp: 1000, icon: '🧠', color: '#3B82F6' },
    { name: 'Spirit', level: 1, xp: 0, maxXp: 1000, icon: '✨', color: '#A855F7' },
    { name: 'Willpower', level: 1, xp: 0, maxXp: 1000, icon: '🔥', color: '#EF4444' },
    { name: 'Harmony', level: 1, xp: 0, maxXp: 1000, icon: '⚖️', color: '#22C55E' },
  ]));

  const [character, setCharacter] = useState(() => loadState('lifeRpgCharacter', {
    name: 'Hero',
    level: 1,
    xp: 0,
    maxXp: 1000,
    hp: 100,
    maxHp: 100,
    coins: 100,
  }));

  const [editMode, setEditMode] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('lifeRpgSkills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('lifeRpgAreas', JSON.stringify(lifeAreas));
  }, [lifeAreas]);

  useEffect(() => {
    localStorage.setItem('lifeRpgCharacter', JSON.stringify(character));
  }, [character]);

  const centerX = 150;
  const centerY = 150;
  const maxRadius = 110;
  const levels = 5;

  const calculatePoint = (index, value, total, maxValue) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (value / maxValue) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const createPolygonPoints = (data, maxValue) => {
    return data
      .map((item, i) => {
        const point = calculatePoint(i, item.level, data.length, maxValue);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  };

  const createGridPolygon = (level) => {
    const points = [];
    for (let i = 0; i < skills.length; i++) {
      const point = calculatePoint(i, level, skills.length, levels);
      points.push(`${point.x},${point.y}`);
    }
    return points.join(' ');
  };

  const updateSkillLevel = (index, newLevel) => {
    const updated = [...skills];
    updated[index].level = Math.max(0, Math.min(10, newLevel));
    setSkills(updated);
  };

  const updateLifeArea = (index, field, value) => {
    const updated = [...lifeAreas];
    updated[index][field] = Number(value);
    // Auto level up
    if (field === 'xp' && updated[index].xp >= updated[index].maxXp) {
      updated[index].level += 1;
      updated[index].xp = updated[index].xp - updated[index].maxXp;
      updated[index].maxXp = Math.floor(updated[index].maxXp * 1.5);
    }
    setLifeAreas(updated);
  };

  const ProgressBar = ({ value, max, color, height = 8 }) => (
    <div className="w-full bg-gray-700 rounded-full overflow-hidden" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }}
      />
    </div>
  );

  const resetData = () => {
    if (confirm('Reset all data to defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">🎮 LIFE RPG</h1>
            <p className="text-gray-400 text-xs">Interactive Skill Radar</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {editMode ? '✓ Done' : '✏️ Edit'}
            </button>
            <button
              onClick={resetData}
              className="px-3 py-1 rounded text-sm font-medium bg-gray-700 hover:bg-red-600 transition-colors"
            >
              🔄
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Character Stats */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-3">🧙 Character</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {editMode ? (
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                    className="bg-gray-700 px-2 py-1 rounded text-lg font-semibold w-32 border border-gray-600"
                  />
                ) : (
                  <span className="text-lg font-semibold">{character.name}</span>
                )}
                <span className="bg-yellow-600 px-2 py-1 rounded-full text-xs font-bold">
                  Lv. {character.level}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>⭐ XP</span>
                  <span>{character.xp} / {character.maxXp}</span>
                </div>
                <ProgressBar value={character.xp} max={character.maxXp} color="#FBBF24" height={6} />
                {editMode && (
                  <input
                    type="range"
                    min="0"
                    max={character.maxXp}
                    value={character.xp}
                    onChange={(e) => setCharacter({ ...character, xp: Number(e.target.value) })}
                    className="w-full mt-1 accent-yellow-500 h-2"
                  />
                )}
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>❤️ HP</span>
                  <span>{character.hp} / {character.maxHp}</span>
                </div>
                <ProgressBar value={character.hp} max={character.maxHp} color="#EF4444" height={6} />
                {editMode && (
                  <input
                    type="range"
                    min="0"
                    max={character.maxHp}
                    value={character.hp}
                    onChange={(e) => setCharacter({ ...character, hp: Number(e.target.value) })}
                    className="w-full mt-1 accent-red-500 h-2"
                  />
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span>🪙</span>
                  <span className="font-bold">{character.coins} Coins</span>
                </div>
                {editMode && (
                  <input
                    type="number"
                    value={character.coins}
                    onChange={(e) => setCharacter({ ...character, coins: Number(e.target.value) })}
                    className="bg-gray-600 w-20 px-2 py-1 rounded text-sm text-right"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h2 className="text-lg font-bold mb-2 text-center">🎯 Skill Radar</h2>
            <div className="flex justify-center">
              <svg width="300" height="300" className="overflow-visible">
                {/* Grid */}
                {[1, 2, 3, 4, 5].map((level) => (
                  <polygon
                    key={level}
                    points={createGridPolygon(level)}
                    fill="none"
                    stroke="#374151"
                    strokeWidth="1"
                  />
                ))}
                {/* Axes */}
                {skills.map((_, i) => {
                  const point = calculatePoint(i, levels, skills.length, levels);
                  return (
                    <line key={i} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="#374151" strokeWidth="1" />
                  );
                })}
                {/* Data polygon */}
                <polygon
                  points={createPolygonPoints(skills, 10)}
                  fill="rgba(139, 92, 246, 0.3)"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                {/* Points */}
                {skills.map((skill, i) => {
                  const point = calculatePoint(i, skill.level, skills.length, 10);
                  return (
                    <circle
                      key={i}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#8B5CF6"
                      stroke="#fff"
                      strokeWidth="2"
                      className="transition-all duration-500"
                    />
                  );
                })}
                {/* Labels */}
                {skills.map((skill, i) => {
                  const point = calculatePoint(i, levels + 1.5, skills.length, levels);
                  return (
                    <text
                      key={i}
                      x={point.x}
                      y={point.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-white text-xs font-medium"
                    >
                      {skill.icon} {skill.level}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h2 className="text-lg font-bold mb-3">📈 Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill, index) => (
              <div key={skill.name} className="bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{skill.icon} {skill.name}</span>
                  <span className="bg-gray-600 px-2 py-0.5 rounded text-xs font-bold">
                    Lv.{skill.level}
                  </span>
                </div>
                <ProgressBar value={skill.level} max={skill.maxLevel} color={skill.color} height={6} />
                {editMode && (
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={skill.level}
                    onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                    className="w-full mt-2 accent-purple-500 h-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Life Areas */}
        <div className="mt-3 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h2 className="text-lg font-bold mb-3">🌟 Life Areas</h2>
          <div className="grid grid-cols-5 gap-2">
            {lifeAreas.map((area, index) => (
              <div
                key={area.name}
                className="bg-gray-700 rounded-lg p-2 text-center border-2 transition-all"
                style={{ borderColor: area.color }}
              >
                <div className="text-xl">{area.icon}</div>
                <div className="font-bold text-xs">{area.name}</div>
                <div className="text-xs mt-1" style={{ color: area.color }}>
                  Lv.{area.level}
                </div>
                <ProgressBar value={area.xp} max={area.maxXp} color={area.color} height={4} />
                <div className="text-xs text-gray-400 mt-1">
                  {area.xp}/{area.maxXp}
                </div>
                {editMode && (
                  <input
                    type="number"
                    value={area.xp}
                    onChange={(e) => updateLifeArea(index, 'xp', e.target.value)}
                    className="w-full mt-1 bg-gray-600 rounded text-xs text-center p-1"
                    placeholder="XP"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-500 mt-4 text-xs">
          Data auto-saves to your browser • Click Edit to modify values
        </p>
      </div>
    </div>
  );
}

export default App;
