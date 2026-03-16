export default function GoalCard({ label, current, goal, unit, color, icon }) {
  const pct = goal > 0 ? Math.min(Math.round((current / goal) * 100), 100) : 0;
  const isGood = pct >= 70;
  const isCritical = pct < 40;

  const barColor = isCritical
    ? 'bg-gradient-to-r from-red-400 to-red-500'
    : isGood
    ? `bg-gradient-to-r ${color}`
    : 'bg-gradient-to-r from-yellow-400 to-amber-500';

  const badgeClass = isCritical
    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
    : isGood
    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';

  const fmt = (val) =>
    unit === '¥' ? `¥${val.toLocaleString()}` : `${val}${unit}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </span>
        </div>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {pct}%
        </span>
      </div>

      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {fmt(current)}
        </span>
        <span className="text-sm text-gray-400 dark:text-gray-500 ml-1">
          / {fmt(goal)}
        </span>
      </div>

      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        残り: {fmt(Math.max(goal - current, 0))}
      </div>
    </div>
  );
}
