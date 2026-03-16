import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

/**
 * Analytics ─ customers は App.jsx の state から props で受け取る（リアクティブ）
 */
export default function Analytics({ selectedAccount, accounts, customers }) {
  const targetIds =
    selectedAccount === 'all'
      ? new Set(accounts.map((a) => a.id))
      : new Set([selectedAccount]);

  const all = customers.filter((c) => targetIds.has(c.accountId));
  const closed = all.filter((c) => c.phase === 'closed');

  const totalRevenue = closed.reduce((s, c) => s + c.amount, 0);
  const avgDeal = closed.length
    ? Math.round(totalRevenue / closed.length)
    : 0;
  const conversionRate = all.length
    ? Math.round((closed.length / all.length) * 100)
    : 0;

  const topProducts = [...closed].sort((a, b) => b.amount - a.amount).slice(0, 5);

  // フェーズファネルデータ
  const funnelItems = [
    { id: 'lead',        label: '未接触',  color: 'bg-slate-400' },
    { id: 'dm',          label: 'DM対応',  color: 'bg-blue-400' },
    { id: 'negotiation', label: '商談中',  color: 'bg-yellow-400' },
    { id: 'closed',      label: '成約',    color: 'bg-green-400' },
  ].map((f) => ({ ...f, count: all.filter((c) => c.phase === f.id).length }));
  const maxCount = Math.max(...funnelItems.map((f) => f.count), 1);

  const rankColors = [
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">分析</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          成約データのサマリー
        </p>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'コンバージョン率',
            value: `${conversionRate}%`,
            sub: `${closed.length} / ${all.length} 人`,
            Icon: TrendingUp,
            color: 'from-green-400 to-emerald-500',
          },
          {
            label: '平均成約金額',
            value: `¥${avgDeal.toLocaleString()}`,
            sub: '成約1件あたり',
            Icon: DollarSign,
            color: 'from-blue-400 to-blue-600',
          },
          {
            label: '成約合計金額',
            value: `¥${totalRevenue.toLocaleString()}`,
            sub: '今月の実績',
            Icon: BarChart3,
            color: 'from-violet-400 to-purple-600',
          },
        ].map(({ label, value, sub, Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors hover:shadow-md"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shrink-0`}
            >
              <Icon size={22} className="text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ファネルチャート */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4">
          フェーズ別 ファネル
        </h2>
        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-3xl">📊</span>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              データがありません
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {funnelItems.map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-16 shrink-0">
                  {f.label}
                </span>
                <div className="flex-1 h-7 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg ${f.color} transition-all duration-700 flex items-center justify-end pr-2`}
                    style={{ width: `${(f.count / maxCount) * 100}%` }}
                  >
                    {f.count > 0 && (
                      <span className="text-xs text-white font-bold">
                        {f.count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
                  {f.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* トップ5商品 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
        <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4">
          成約トップ5 商品
        </h2>
        {topProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-3xl">🏆</span>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              成約データがありません
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shrink-0 ${
                    rankColors[i] ??
                    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {c.product}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    @{c.name}
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ¥{c.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
