import { useState } from 'react';
import { Bell, Lock, LockOpen } from 'lucide-react';

import Sidebar from './components/Sidebar';
import AccountSwitcher from './components/AccountSwitcher';
import Dashboard from './components/Dashboard';
import KanbanBoard from './components/KanbanBoard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import SnsManagement from './components/SnsManagement';
import PinLockScreen from './components/PinLockScreen';

// マネージャーロックが必要な画面
const MANAGER_ROUTES = new Set(['dashboard', 'analytics', 'settings']);

import { useLocalStorage } from './hooks/useLocalStorage';
import {
  initialCustomers, initialAccounts,
  initialPosts, initialIdeas, initialHashtagSets, initialEngagements,
  initialConcepts, initialTemplates,
} from './data/dummyData';

/**
 * App.jsx ─ アプリ全体の「唯一の真実の源泉（Single Source of Truth）」
 *
 * 全状態をここで管理し、子コンポーネントには
 *   ① データ（props）
 *   ② ハンドラー（callbacks）
 * だけを渡す Top-Down 単方向データフロー。
 */
export default function App() {
  // ── ナビ状態（localStorageに保存しない）──────────────────────────
  const [activeView,        setActiveView]        = useState('dashboard');
  // マネージャーロック（セッション中のみ保持）
  const [isManagerUnlocked, setIsManagerUnlocked] = useState(false);
  const [lockTarget,        setLockTarget]        = useState(null); // PIN入力画面を表示中の対象view

  // ── 永続化状態（localStorageに保存）──────────────────────────────
  const [selectedAccount, setSelectedAccount] = useLocalStorage(
    'sns_selectedAccount',
    'all'
  );
  const [customers, setCustomers] = useLocalStorage(
    'sns_customers',
    initialCustomers
  );
  const [accounts, setAccounts] = useLocalStorage(
    'sns_accounts',
    initialAccounts
  );
  const [settings, setSettings] = useLocalStorage('sns_settings', {
    username: '管理者',
    darkMode: false,
  });

  // ── SNS 運用データ ────────────────────────────────────────────────
  const [posts,        setPosts]        = useLocalStorage('sns_posts',       initialPosts);
  const [ideas,        setIdeas]        = useLocalStorage('sns_ideas',       initialIdeas);
  const [hashtagSets,  setHashtagSets]  = useLocalStorage('sns_hashtags',    initialHashtagSets);
  const [engagements,  setEngagements]  = useLocalStorage('sns_engagements', initialEngagements);
  const [concepts,     setConcepts]     = useLocalStorage('sns_concepts',    initialConcepts);
  const [templates,    setTemplates]    = useLocalStorage('sns_templates',   initialTemplates);

  // ── 顧客ハンドラー ────────────────────────────────────────────────
  const addCustomer = (customer) =>
    setCustomers((prev) => [...prev, customer]);

  /** カードをドラッグ&ドロップで移動したときに呼ばれる */
  const moveCustomer = (customerId, newPhase) =>
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, phase: newPhase } : c))
    );

  const deleteCustomer = (customerId) =>
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));

  // ── ロック判定ヘルパー ───────────────────────────────────────────
  const lockEnabled = settings.managerLock?.enabled && !!settings.managerLock?.pin;

  /** サイドバーのナビクリック → ロックが必要なら PIN画面を挟む */
  const handleViewChange = (view) => {
    if (lockEnabled && MANAGER_ROUTES.has(view) && !isManagerUnlocked) {
      setLockTarget(view);   // PIN画面を表示
    } else {
      setActiveView(view);
    }
  };

  /** PIN送信 → 正解なら解錠して遷移、不正解なら false を返す */
  const handlePinUnlock = (pin) => {
    if (pin === settings.managerLock.pin) {
      setIsManagerUnlocked(true);
      setActiveView(lockTarget);
      setLockTarget(null);
      return true;
    }
    return false;
  };

  /** 手動再ロック（ヘッダーの錠前アイコン） */
  const handleManualLock = () => {
    setIsManagerUnlocked(false);
    // マネージャー限定画面にいる場合はカンバンへ追い出す
    if (MANAGER_ROUTES.has(activeView)) setActiveView('kanban');
  };

  // ── 設定ハンドラー ────────────────────────────────────────────────
  const updateSettings = (patch) =>
    setSettings((prev) => {
      // managerLock は deep merge
      if (patch.managerLock) {
        return { ...prev, managerLock: { ...(prev.managerLock ?? {}), ...patch.managerLock } };
      }
      return { ...prev, ...patch };
    });

  const updateAccountGoal = (accountId, goalPatch) =>
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === accountId
          ? { ...a, goal: { ...a.goal, ...goalPatch } }
          : a
      )
    );

  // ── アカウント管理ハンドラー ──────────────────────────────────────
  const addAccount = (data) =>
    setAccounts((prev) => [
      ...prev,
      {
        ...data,
        id: Date.now(),
        goal: { monthlyRevenue: 0, currentRevenue: 0, monthlyDeals: 0 },
      },
    ]);

  const updateAccount = (accountId, patch) =>
    setAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, ...patch } : a))
    );

  const deleteAccount = (accountId) => {
    setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    if (selectedAccount === accountId) setSelectedAccount('all');
  };

  /** デモデータにリセット */
  const resetData = () => {
    setCustomers(initialCustomers);
    setAccounts(initialAccounts);
    setSettings({ username: '管理者', darkMode: false });
    setSelectedAccount('all');
    setPosts(initialPosts);
    setIdeas(initialIdeas);
    setHashtagSets(initialHashtagSets);
    setEngagements(initialEngagements);
    setConcepts(initialConcepts);
    setTemplates(initialTemplates);
  };

  // ── 派生値 ───────────────────────────────────────────────────────
  const currentAccount =
    selectedAccount === 'all'
      ? null
      : accounts.find((a) => a.id === selectedAccount);

  // 全コンポーネントに渡す共通 props
  const baseProps = { selectedAccount, accounts, customers };

  const renderView = () => {
    // ロックが有効・未解錠・マネージャー専用画面なら PIN画面を表示
    if (lockEnabled && !isManagerUnlocked && MANAGER_ROUTES.has(activeView)) {
      return (
        <PinLockScreen
          targetView={activeView}
          onUnlock={handlePinUnlock}
          onStaffMode={() => setActiveView('kanban')}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard {...baseProps} />;

      case 'kanban':
        return (
          <KanbanBoard
            {...baseProps}
            currentUser={settings.username}
            onAddCustomer={addCustomer}
            onMoveCustomer={moveCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        );

      case 'analytics':
        return <Analytics {...baseProps} />;

      case 'settings':
        return (
          <Settings
            accounts={accounts}
            settings={settings}
            onUpdateSettings={updateSettings}
            onUpdateAccountGoal={updateAccountGoal}
            onResetData={resetData}
            onAddAccount={addAccount}
            onUpdateAccount={updateAccount}
            onDeleteAccount={deleteAccount}
          />
        );

      case 'sns':
        return (
          <SnsManagement
            selectedAccount={selectedAccount}
            accounts={accounts}
            currentUser={settings.username}
            posts={posts}
            ideas={ideas}
            hashtagSets={hashtagSets}
            engagements={engagements}
            concepts={concepts}
            templates={templates}
            onPostsChange={setPosts}
            onIdeasChange={setIdeas}
            onHashtagSetsChange={setHashtagSets}
            onEngagementsChange={setEngagements}
            onConceptsChange={setConcepts}
            onTemplatesChange={setTemplates}
          />
        );

      default:
        return null;
    }
  };

  return (
    // ダークモード：dark クラスをルートに付与 → children の dark: 接頭辞が有効になる
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        <Sidebar activeView={activeView} onViewChange={handleViewChange} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* ─── トップバー ─────────────────────────────────────────── */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between shrink-0 transition-colors">
            <AccountSwitcher
              accounts={accounts}
              selectedAccount={selectedAccount}
              onSelect={setSelectedAccount}
            />

            <div className="flex items-center gap-3">
              {/* 選択中アカウントバッジ */}
              {currentAccount && (
                <span
                  className={`hidden md:flex items-center gap-1.5 text-xs font-medium
                    px-3 py-1.5 rounded-full ${currentAccount.badgeBg} ${currentAccount.textColor}`}
                >
                  <span>{currentAccount.icon}</span>
                  {currentAccount.handle}
                </span>
              )}

              {/* 通知ベル */}
              <button className="relative w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center text-gray-500 dark:text-gray-300">
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
              </button>

              {/* 再ロックボタン（マネージャー解錠中のみ表示） */}
              {lockEnabled && isManagerUnlocked && (
                <button
                  onClick={handleManualLock}
                  title="ロックをかける"
                  className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors flex items-center justify-center text-indigo-600 dark:text-indigo-400"
                >
                  <LockOpen size={16} />
                </button>
              )}

              {/* アバター（ユーザー名の頭文字） */}
              <div
                title={settings.username}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-default select-none"
              >
                {(settings.username || '管').charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* ─── メインコンテンツ ────────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto p-6 transition-colors">
            {renderView()}
          </main>

          {/* ─── PIN入力オーバーレイ（サイドバー遷移時） ─────────────── */}
          {lockTarget && (
            <PinLockScreen
              targetView={lockTarget}
              onUnlock={handlePinUnlock}
              onStaffMode={() => { setLockTarget(null); setActiveView('kanban'); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
