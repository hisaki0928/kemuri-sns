import { LayoutDashboard, KanbanSquare, Settings, TrendingUp, Megaphone } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { id: 'kanban',    label: 'フェーズ管理',   icon: KanbanSquare },
  { id: 'analytics', label: '分析',           icon: TrendingUp },
  { id: 'sns',       label: 'SNS運用',        icon: Megaphone },
  { id: 'settings',  label: '設定',           icon: Settings },
];

// グループ分け（divider）
const DIVIDER_BEFORE = new Set(['sns', 'settings']);

export default function Sidebar({ activeView, onViewChange }) {
  return (
    <aside className="w-16 md:w-56 bg-gray-900 text-white flex flex-col py-6 shrink-0">
      {/* ロゴ */}
      <div className="px-4 mb-8 hidden md:block">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-sm font-bold">S</div>
          <span className="font-bold text-sm leading-tight">SNS<br/>アカウント管理</span>
        </div>
      </div>
      <div className="px-2 mb-8 md:hidden flex justify-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-sm font-bold">S</div>
      </div>

      <nav className="flex flex-col gap-1 px-2 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <div key={id}>
            {DIVIDER_BEFORE.has(id) && (
              <div className="border-t border-white/10 my-2" />
            )}
            <button
              onClick={() => onViewChange(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${
                activeView === id
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden md:block">{label}</span>
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
