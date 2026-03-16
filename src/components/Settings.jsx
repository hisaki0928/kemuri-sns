import { useState, useEffect } from 'react';
import {
  Save, Moon, Sun, User, Target, Check,
  RefreshCw, AlertCircle,
  Lock, LockOpen, Eye, EyeOff, ShieldCheck,
  Plus, Trash2, Pencil, X, Smartphone, KeyRound,
} from 'lucide-react';

const API_KEY_STORAGE = 'sns_anthropic_api_key';

// ── アカウントカラーパレット ──────────────────────────────────────────
const COLOR_PRESETS = [
  { color: 'from-pink-500 to-rose-500',     bgLight: 'bg-pink-50',    borderColor: 'border-pink-300',   textColor: 'text-pink-600',   badgeBg: 'bg-pink-100',   dot: 'bg-pink-500',   label: 'ピンク' },
  { color: 'from-purple-500 to-violet-500', bgLight: 'bg-purple-50',  borderColor: 'border-purple-300', textColor: 'text-purple-600', badgeBg: 'bg-purple-100', dot: 'bg-purple-500', label: 'パープル' },
  { color: 'from-amber-500 to-orange-500',  bgLight: 'bg-amber-50',   borderColor: 'border-amber-300',  textColor: 'text-amber-600',  badgeBg: 'bg-amber-100',  dot: 'bg-amber-500',  label: 'オレンジ' },
  { color: 'from-blue-500 to-cyan-500',     bgLight: 'bg-blue-50',    borderColor: 'border-blue-300',   textColor: 'text-blue-600',   badgeBg: 'bg-blue-100',   dot: 'bg-blue-500',   label: 'ブルー' },
  { color: 'from-green-500 to-emerald-500', bgLight: 'bg-green-50',   borderColor: 'border-green-300',  textColor: 'text-green-600',  badgeBg: 'bg-green-100',  dot: 'bg-green-500',  label: 'グリーン' },
  { color: 'from-teal-500 to-cyan-500',     bgLight: 'bg-teal-50',    borderColor: 'border-teal-300',   textColor: 'text-teal-600',   badgeBg: 'bg-teal-100',   dot: 'bg-teal-500',   label: 'ティール' },
  { color: 'from-indigo-500 to-purple-600', bgLight: 'bg-indigo-50',  borderColor: 'border-indigo-300', textColor: 'text-indigo-600', badgeBg: 'bg-indigo-100', dot: 'bg-indigo-500', label: 'インディゴ' },
  { color: 'from-red-500 to-rose-600',      bgLight: 'bg-red-50',     borderColor: 'border-red-300',    textColor: 'text-red-600',    badgeBg: 'bg-red-100',    dot: 'bg-red-500',    label: 'レッド' },
];

const EMPTY_FORM = { name: '', handle: '', icon: '📱', colorIndex: 3 };

/**
 * Settings ページ
 */
export default function Settings({
  accounts,
  settings,
  onUpdateSettings,
  onUpdateAccountGoal,
  onResetData,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
}) {
  const [username,         setUsername]         = useState(settings.username);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved,            setSaved]            = useState(false);

  // ── マネージャーロック ローカル状態 ──────────────────────────────
  const lock = settings.managerLock ?? { enabled: false, pin: '' };
  const [lockEnabled,  setLockEnabled]  = useState(lock.enabled);
  const [pinInput,     setPinInput]     = useState('');
  const [pinConfirm,   setPinConfirm]   = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [showPinVal,   setShowPinVal]   = useState(false);
  const [pinError,     setPinError]     = useState('');
  const [pinSaved,     setPinSaved]     = useState(false);

  // ── アカウントごとの目標値 ───────────────────────────────────────
  const [goalEdits, setGoalEdits] = useState(() =>
    Object.fromEntries(
      accounts.map((a) => [
        a.id,
        { monthlyRevenue: a.goal.monthlyRevenue, monthlyDeals: a.goal.monthlyDeals },
      ])
    )
  );

  // 新しいアカウントが追加されたとき goalEdits を同期
  useEffect(() => {
    setGoalEdits((prev) => {
      const next = { ...prev };
      accounts.forEach((a) => {
        if (!next[a.id]) {
          next[a.id] = { monthlyRevenue: a.goal.monthlyRevenue, monthlyDeals: a.goal.monthlyDeals };
        }
      });
      return next;
    });
  }, [accounts]);

  // ── Claude API キー ──────────────────────────────────────────────
  const [apiKey,       setApiKey]       = useState(() => localStorage.getItem(API_KEY_STORAGE) || '');
  const [showApiKey,   setShowApiKey]   = useState(false);
  const [apiKeySaved,  setApiKeySaved]  = useState(false);

  const handleSaveApiKey = () => {
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  // ── アカウント管理モーダル状態 ───────────────────────────────────
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState(null); // null = 追加モード
  const [accountForm,      setAccountForm]      = useState(EMPTY_FORM);
  const [accountFormError, setAccountFormError] = useState('');
  const [deleteConfirmId,  setDeleteConfirmId]  = useState(null);

  const patchGoal = (accountId, key, val) => {
    setGoalEdits((prev) => ({
      ...prev,
      [accountId]: { ...prev[accountId], [key]: val },
    }));
  };

  // ── PIN設定の保存 ────────────────────────────────────────────────
  const handleSavePin = () => {
    setPinError('');
    if (pinInput.length < 4) { setPinError('4桁以上のPINを入力してください'); return; }
    if (pinInput !== pinConfirm) { setPinError('PINが一致しません'); return; }
    onUpdateSettings({ managerLock: { enabled: true, pin: pinInput } });
    setLockEnabled(true);
    setPinInput(''); setPinConfirm(''); setShowPinInput(false);
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2500);
  };

  const handleToggleLock = (next) => {
    if (next) {
      if (!lock.pin) setShowPinInput(true);
      else onUpdateSettings({ managerLock: { ...lock, enabled: true } });
      setLockEnabled(true);
    } else {
      onUpdateSettings({ managerLock: { ...lock, enabled: false } });
      setLockEnabled(false);
      setShowPinInput(false);
    }
  };

  const handleSave = () => {
    if (username.trim()) onUpdateSettings({ username: username.trim() });
    accounts.forEach((a) => {
      onUpdateAccountGoal(a.id, {
        monthlyRevenue: Number(goalEdits[a.id]?.monthlyRevenue ?? a.goal.monthlyRevenue) || 0,
        monthlyDeals:   Number(goalEdits[a.id]?.monthlyDeals   ?? a.goal.monthlyDeals)   || 0,
      });
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => { onResetData(); setShowResetConfirm(false); };

  // ── アカウントモーダル操作 ───────────────────────────────────────
  const openAddModal = () => {
    setEditingAccountId(null);
    setAccountForm(EMPTY_FORM);
    setAccountFormError('');
    setShowAccountModal(true);
  };

  const openEditModal = (account) => {
    const colorIndex = COLOR_PRESETS.findIndex((c) => c.color === account.color);
    setEditingAccountId(account.id);
    setAccountForm({
      name: account.name,
      handle: account.handle,
      icon: account.icon,
      colorIndex: colorIndex >= 0 ? colorIndex : 3,
    });
    setAccountFormError('');
    setShowAccountModal(true);
  };

  const handleSaveAccount = () => {
    if (!accountForm.name.trim()) { setAccountFormError('アカウント名を入力してください'); return; }
    if (!accountForm.handle.trim()) { setAccountFormError('ハンドル（@ID）を入力してください'); return; }
    const preset = COLOR_PRESETS[accountForm.colorIndex];
    const { dot: _dot, label: _label, ...presetStyles } = preset;
    const data = {
      name:   accountForm.name.trim(),
      handle: accountForm.handle.trim().startsWith('@')
        ? accountForm.handle.trim()
        : '@' + accountForm.handle.trim(),
      icon:   accountForm.icon.trim() || '📱',
      ...presetStyles,
    };
    if (editingAccountId !== null) {
      onUpdateAccount(editingAccountId, data);
    } else {
      onAddAccount(data);
    }
    setShowAccountModal(false);
  };

  // ── スタイル定数 ─────────────────────────────────────────────────
  const inputCls =
    'w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 transition-colors';

  const SectionCard = ({ children }) => (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      {children}
    </section>
  );

  const SectionTitle = ({ icon: Icon, children, iconClass = 'text-gray-400 dark:text-gray-500' }) => (
    <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
      <Icon size={18} className={iconClass} />
      {children}
    </h2>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">設定</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">アプリの設定を管理します</p>
      </div>

      {/* ── プロフィール ─────────────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={User}>プロフィール</SectionTitle>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">ユーザー名</label>
          <input
            className={inputCls}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="管理者"
          />
        </div>
      </SectionCard>

      {/* ── SNSアカウント管理 ─────────────────────────────────────────── */}
      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Smartphone size={18} className="text-gray-400 dark:text-gray-500" />
            SNSアカウント管理
          </h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all active:scale-95"
          >
            <Plus size={13} />
            アカウントを追加
          </button>
        </div>

        <div className="space-y-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-gray-200 dark:hover:border-gray-600 transition-colors group"
            >
              {/* アイコン */}
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center text-lg shrink-0`}>
                {account.icon}
              </div>

              {/* 名前・ハンドル */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {account.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{account.handle}</div>
              </div>

              {/* 操作ボタン */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(account)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  title="編集"
                >
                  <Pencil size={13} />
                </button>

                {deleteConfirmId === account.id ? (
                  <div className="flex items-center gap-1 animate-slide-in">
                    <button
                      onClick={() => { onDeleteAccount(account.id); setDeleteConfirmId(null); }}
                      className="px-2 py-0.5 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                    >
                      削除
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(account.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="削除"
                    disabled={accounts.length <= 1}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {accounts.length === 0 && (
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
            アカウントがありません。追加してください。
          </p>
        )}
      </SectionCard>

      {/* ── 外観（ダークモード） ─────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle
          icon={settings.darkMode ? Moon : Sun}
          iconClass={settings.darkMode ? 'text-blue-400' : 'text-amber-500'}
        >
          外観
        </SectionTitle>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">ダークモード</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">暗い背景テーマに切り替えます</div>
          </div>
          <button
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className={[
              'relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700',
              settings.darkMode ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600',
            ].join(' ')}
            aria-label="ダークモード切り替え"
          >
            <div className={[
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center',
              settings.darkMode ? 'translate-x-6' : 'translate-x-0.5',
            ].join(' ')}>
              {settings.darkMode
                ? <Moon size={10} className="text-blue-500" />
                : <Sun  size={10} className="text-amber-400" />
              }
            </div>
          </button>
        </div>
      </SectionCard>

      {/* ── Claude API キー（AI分析機能用） ─────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={KeyRound} iconClass="text-purple-400">
          Claude API キー（AI分析）
        </SectionTitle>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 leading-relaxed">
          SNS運用の「AI分析」タブでスクリーンショット分析を使うために必要です。
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
            className="text-purple-500 hover:text-purple-700 ml-1 underline">
            Anthropic Console
          </a> で取得できます。
        </p>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            className={inputCls}
            placeholder="sk-ant-api03-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowApiKey((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <button
          onClick={handleSaveApiKey}
          className={[
            'mt-3 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95',
            apiKeySaved
              ? 'bg-green-500 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white',
          ].join(' ')}
        >
          {apiKeySaved ? <><Check size={13} />保存しました！</> : <><KeyRound size={13} />APIキーを保存</>}
        </button>
        {apiKey && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
            <Check size={10} className="text-green-500" />
            APIキー設定済み（このデバイスのみ保存）
          </p>
        )}
      </SectionCard>

      {/* ── マネージャーロック ───────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle
          icon={lockEnabled && lock.pin ? ShieldCheck : Lock}
          iconClass={lockEnabled && lock.pin ? 'text-indigo-500' : 'text-gray-400 dark:text-gray-500'}
        >
          マネージャーロック
        </SectionTitle>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">ロックを有効にする</div>
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {lockEnabled && lock.pin
                ? 'ダッシュボード・アナリティクス・設定にPINが必要'
                : 'PINを設定して機密情報を保護'}
            </div>
          </div>
          <button
            onClick={() => handleToggleLock(!lockEnabled)}
            className={[
              'relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300',
              lockEnabled && lock.pin ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600',
            ].join(' ')}
            aria-label="ロック切り替え"
          >
            <div className={[
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center',
              lockEnabled && lock.pin ? 'translate-x-6' : 'translate-x-0.5',
            ].join(' ')}>
              {lockEnabled && lock.pin
                ? <Lock size={10} className="text-indigo-500" />
                : <LockOpen size={10} className="text-gray-400" />
              }
            </div>
          </button>
        </div>

        {lock.pin && !showPinInput && (
          <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo-500" />
              <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                PIN設定済み（{lock.pin.length}桁）
              </span>
            </div>
            <button
              onClick={() => { setShowPinInput(true); setPinInput(''); setPinConfirm(''); setPinError(''); }}
              className="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              変更する
            </button>
          </div>
        )}

        {(!lock.pin || showPinInput) && (
          <div className="space-y-3 animate-slide-in">
            <p className="text-xs text-gray-500 dark:text-gray-400">4桁以上の数字でPINを設定してください。</p>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">新しいPIN</label>
              <div className="relative">
                <input
                  type={showPinVal ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  className={inputCls}
                  placeholder="例: 1234"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, '')); setPinError(''); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPinVal((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPinVal ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">PINを再入力</label>
              <input
                type={showPinVal ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                className={inputCls}
                placeholder="もう一度入力"
                value={pinConfirm}
                onChange={(e) => { setPinConfirm(e.target.value.replace(/\D/g, '')); setPinError(''); }}
              />
            </div>
            {pinError && (
              <p className="text-xs text-red-500 flex items-center gap-1 animate-slide-in">
                <AlertCircle size={12} /> {pinError}
              </p>
            )}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSavePin}
                className={[
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95',
                  pinSaved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white',
                ].join(' ')}
              >
                {pinSaved ? <><Check size={13} />保存しました！</> : <><Lock size={13} />PINを設定</>}
              </button>
              {showPinInput && lock.pin && (
                <button
                  onClick={() => { setShowPinInput(false); setPinInput(''); setPinConfirm(''); setPinError(''); }}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  キャンセル
                </button>
              )}
            </div>
          </div>
        )}

        {lockEnabled && lock.pin && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p className="font-medium text-gray-600 dark:text-gray-300 mb-1.5">🔒 ロック対象</p>
            <p>・ダッシュボード（売上・KPI）</p>
            <p>・アナリティクス（詳細分析）</p>
            <p>・設定（このページ）</p>
            <p className="pt-1 text-gray-400 dark:text-gray-500">🟢 スタッフは フェーズ管理・SNS運用 のみ使用可</p>
          </div>
        )}
      </SectionCard>

      {/* ── 月間目標 ─────────────────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={Target}>月間目標</SectionTitle>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center text-lg shrink-0`}>
                  {account.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{account.name}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{account.handle}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">売上目標（円）</label>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    value={goalEdits[account.id]?.monthlyRevenue ?? ''}
                    onChange={(e) => patchGoal(account.id, 'monthlyRevenue', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">成約目標（件）</label>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    value={goalEdits[account.id]?.monthlyDeals ?? ''}
                    onChange={(e) => patchGoal(account.id, 'monthlyDeals', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── データ管理 ───────────────────────────────────────────────── */}
      <SectionCard>
        <SectionTitle icon={AlertCircle} iconClass="text-red-400">データ管理</SectionTitle>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          デモデータにリセットします。この操作は元に戻せません。
        </p>
        {showResetConfirm ? (
          <div className="flex gap-3 animate-slide-in">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium active:scale-95 transition-all"
            >
              <RefreshCw size={14} />実行する
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-800 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all"
          >
            <RefreshCw size={14} />デモデータにリセット
          </button>
        )}
      </SectionCard>

      {/* ── 保存ボタン ───────────────────────────────────────────────── */}
      <button
        onClick={handleSave}
        className={[
          'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm',
          saved
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700',
        ].join(' ')}
      >
        {saved ? <><Check size={16} />保存しました！</> : <><Save size={16} />設定を保存</>}
      </button>

      {/* ── アカウント追加・編集モーダル ─────────────────────────────── */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-modal-in">
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">
                {editingAccountId !== null ? 'アカウントを編集' : 'アカウントを追加'}
              </h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* フォーム */}
            <div className="px-6 py-5 space-y-4">
              {/* アカウント名 */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                  アカウント名 <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="例: コスメ用、食品PR用"
                  value={accountForm.name}
                  onChange={(e) => { setAccountForm((f) => ({ ...f, name: e.target.value })); setAccountFormError(''); }}
                  autoFocus
                />
              </div>

              {/* ハンドル */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                  ハンドル（@ID）<span className="text-red-400">*</span>
                </label>
                <input
                  className={inputCls}
                  placeholder="例: @my_account_jp"
                  value={accountForm.handle}
                  onChange={(e) => { setAccountForm((f) => ({ ...f, handle: e.target.value })); setAccountFormError(''); }}
                />
              </div>

              {/* アイコン */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
                  アイコン（絵文字）
                </label>
                <input
                  className={`${inputCls} text-2xl text-center`}
                  placeholder="📱"
                  value={accountForm.icon}
                  onChange={(e) => setAccountForm((f) => ({ ...f, icon: e.target.value }))}
                  maxLength={4}
                />
              </div>

              {/* カラーテーマ */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  カラーテーマ
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAccountForm((f) => ({ ...f, colorIndex: i }))}
                      className={[
                        'flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all',
                        accountForm.colorIndex === i
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500',
                      ].join(' ')}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${preset.color}`} />
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-none">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* プレビュー */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">プレビュー</p>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COLOR_PRESETS[accountForm.colorIndex].color} flex items-center justify-center text-base shrink-0`}>
                    {accountForm.icon || '📱'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {accountForm.name || 'アカウント名'}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {accountForm.handle
                        ? (accountForm.handle.startsWith('@') ? accountForm.handle : '@' + accountForm.handle)
                        : '@handle'}
                    </div>
                  </div>
                </div>
              </div>

              {/* エラー */}
              {accountFormError && (
                <p className="text-xs text-red-500 flex items-center gap-1 animate-slide-in">
                  <AlertCircle size={12} /> {accountFormError}
                </p>
              )}
            </div>

            {/* フッター */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleSaveAccount}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all active:scale-95"
              >
                <Check size={14} />
                {editingAccountId !== null ? '変更を保存' : 'アカウントを追加'}
              </button>
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
