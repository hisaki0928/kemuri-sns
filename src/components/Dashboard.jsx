import { Users, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import GoalCard from './GoalCard';
import { phases } from '../data/dummyData';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-colors hover:shadow-md">
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
        {sub && (
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Dashboard ─ 全データは App.jsx から props として受け取る。
 * customersByAccount は直接インポートしない → アカウント切替・DnD変更がリアルタイムで反映される。
 */
export default function Dashboard({ selectedAccount, accounts, customers }) {
  // 対象アカウントを絞り込む
  const targetAccounts =
    selectedAccount === 'all'
      ? accounts
      : accounts.filter((a) => a.id === selectedAccount);
  const targetIds = new Set(targetAccounts.map((a) => a.id));

  // 対象顧客（customers は App.jsx のstate → リアクティブ）
  const filtered = customers.filter((c) => targetIds.has(c.accountId));

  // ── 集計値 ───────────────────────────────────────────────────────
  // 売上目標・実績：アカウントのゴールデータから（デモベースライン）
  const totalRevenue = targetAccounts.reduce(
    (s, a) => s + a.goal.currentRevenue,
    0
  );
  const totalRevenueGoal = targetAccounts.reduce(
    (s, a) => s + a.goal.monthlyRevenue,
    0
  );

  // 成約件数：customers state から動的に算出（カンバン操作でリアルタイム更新）
  const closedCount = filtered.filter((c) => c.phase === 'closed').length;
  const totalDealsGoal = targetAccounts.reduce(
    (s, a) => s + a.goal.monthlyDeals,
    0
  );

  // フェーズ別件数（customers state から動的に算出）
  const phaseCounts = phases.map((p) => ({
    ...p,
    count: filtered.filter((c) => c.phase === p.id).length,
  }));

  const accountName =
    selectedAccount === 'all'
      ? '全アカウント'
      : accounts.find((a) => a.id === selectedAccount)?.name;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ダッシュボード
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {accountName} の今月の進捗
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="今月の売上"
          value={`¥${(totalRevenue / 10000).toFixed(1)}万`}
          sub={`目標: ¥${(totalRevenueGoal / 10000).toFixed(0)}万`}
          color="from-green-400 to-emerald-500"
        />
        <StatCard
          icon={ShoppingBag}
          label="成約件数"
          value={`${closedCount}件`}
          sub={`目標: ${totalDealsGoal}件`}
          color="from-blue-400 to-blue-600"
        />
        <StatCard
          icon={Users}
          label="フォロー中の顧客"
          value={`${filtered.length}人`}
          sub="アクティブ"
          color="from-violet-400 to-purple-600"
        />
        <StatCard
          icon={TrendingUp}
          label="商談中"
          value={`${filtered.filter((c) => c.phase === 'negotiation').length}件`}
          sub="クロージング待ち"
          color="from-orange-400 to-amber-500"
        />
      </div>

      {/* ゴールプログレスバー */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
          今月のゴール達成度
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GoalCard
            label="売上目標"
            current={totalRevenue}
            goal={totalRevenueGoal}
            unit="¥"
            color="from-green-400 to-emerald-500"
            icon="💰"
          />
          <GoalCard
            label="成約件数"
            current={closedCount}
            goal={totalDealsGoal}
            unit="件"
            color="from-blue-400 to-blue-600"
            icon="🎯"
          />
        </div>
      </div>

      {/* アカウント別ゴール（全アカウント表示時のみ） */}
      {selectedAccount === 'all' && (
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
            アカウント別 売上進捗
          </h2>
          <div className="space-y-3">
            {accounts.map((account) => {
              const pct = Math.min(
                Math.round(
                  (account.goal.currentRevenue / account.goal.monthlyRevenue) *
                    100
                ),
                100
              );
              return (
                <div
                  key={account.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center text-lg shrink-0`}
                    >
                      {account.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {account.name}
                        </span>
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                          {pct}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {account.handle}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${account.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                    <span>¥{account.goal.currentRevenue.toLocaleString()}</span>
                    <span>¥{account.goal.monthlyRevenue.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* フェーズサマリー */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
          フェーズ別 顧客数
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {phaseCounts.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-4 border ${p.color} dark:bg-gray-800 dark:border-gray-700 transition-colors`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${p.dotColor}`} />
                <span className={`text-xs font-medium ${p.textColor}`}>
                  {p.label}
                </span>
              </div>
              <div className={`text-3xl font-bold ${p.textColor}`}>
                {p.count}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                人
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
