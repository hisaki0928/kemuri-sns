import { ChevronDown, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function AccountSwitcher({ accounts, selectedAccount, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    selectedAccount === 'all'
      ? { name: '全アカウント', handle: 'すべてのデータを表示', icon: '📊', color: 'from-gray-500 to-gray-600' }
      : accounts.find((a) => a.id === selectedAccount) ?? accounts[0];

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (value) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* トリガーボタン */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all min-w-[180px]"
      >
        <div
          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${current.color} flex items-center justify-center text-sm shrink-0`}
        >
          {current.icon}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-none">
            {current.name}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 leading-none truncate max-w-[120px]">
            {current.handle}
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ドロップダウン */}
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 min-w-[220px] overflow-hidden animate-modal-in">
          {/* 全アカウント */}
          <button
            onClick={() => select('all')}
            className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
              selectedAccount === 'all' ? 'bg-gray-50 dark:bg-gray-700/60' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-sm shrink-0">
              📊
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                全アカウント
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">すべてのデータを表示</div>
            </div>
            {selectedAccount === 'all' && (
              <Check size={14} className="text-blue-500 shrink-0" />
            )}
          </button>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => select(account.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                selectedAccount === account.id ? 'bg-gray-50 dark:bg-gray-700/60' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center text-sm shrink-0`}
              >
                {account.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {account.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {account.handle}
                </div>
              </div>
              {selectedAccount === account.id && (
                <Check size={14} className="text-blue-500 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
