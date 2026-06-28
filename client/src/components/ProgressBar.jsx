function ProgressBar({ value = 0 }) {
  const percentage = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300">Progresso</span>
        <span className="text-purple-400 font-semibold">{percentage}%</span>
      </div>

      <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-700">
        <div
          className="bg-purple-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;