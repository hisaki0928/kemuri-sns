import { useState } from 'react';
import { Plus, X, ChevronDown, Save, Tag, Calendar, MessageCircle, UserCircle2 } from 'lucide-react';
import { phases } from '../data/dummyData';

/* ─────────────────────────────────────────────────────────────────────────
   フェーズステッパー — 1→2→3→4 の丸ボタン＋ライン
───────────────────────────────────────────────────────────────────────── */
function PhaseStepper({ currentPhase, customerId, onMove }) {
  const currentIdx = phases.findIndex((p) => p.id === currentPhase);

  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {phases.map((phase, i) => {
        const isCurrent = phase.id === currentPhase;
        const isPast    = i < currentIdx;

        return (
          <span key={phase.id} className="flex items-center gap-0.5">
            <button
              onClick={() => !isCurrent && onMove(customerId, phase.id)}
              title={phase.label}
              className={[
                'w-7 h-7 rounded-full text-xs font-bold transition-all active:scale-90 flex items-center justify-center',
                isCurrent
                  ? `${phase.dotColor} text-white shadow scale-110 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800 ring-current`
                  : isPast
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-500 dark:text-green-400 hover:bg-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-600',
              ].join(' ')}
            >
              {i + 1}
            </button>
            {i < phases.length - 1 && (
              <div
                className={[
                  'w-4 h-0.5 rounded-full',
                  i < currentIdx
                    ? 'bg-green-300 dark:bg-green-700'
                    : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   顧客行 — リスト内の1行
───────────────────────────────────────────────────────────────────────── */
function CustomerRow({ customer, accounts, onMove, onDelete }) {
  const account = accounts.find((a) => a.id === customer.accountId);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group">
      {/* メイン行 */}
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">

        {/* アカウントアイコン */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${account?.color ?? 'from-gray-400 to-gray-500'} flex items-center justify-center text-base shrink-0 shadow-sm hover:scale-105 transition-transform`}
        >
          {account?.icon ?? '?'}
        </button>

        {/* 顧客情報 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              @{customer.name}
            </span>
            {customer.amount > 0 && (
              <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full">
                ¥{customer.amount.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {customer.product}
          </div>
        </button>

        {/* フェーズステッパー */}
        <PhaseStepper
          currentPhase={customer.phase}
          customerId={customer.id}
          onMove={onMove}
        />

        {/* 削除ボタン */}
        <button
          onClick={() => onDelete(customer.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all shrink-0"
          title="削除"
        >
          <X size={13} />
        </button>
      </div>

      {/* 展開パネル（メモ・日付・追加者） */}
      {expanded && (
        <div className="px-4 pb-3 ml-12 animate-slide-in">
          <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3 space-y-2">
            {customer.note && (
              <div className="flex items-start gap-2">
                <MessageCircle size={12} className="text-gray-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400">{customer.note}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={11} className="text-gray-400" />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{customer.date}</span>
              </div>
              {customer.createdBy && (
                <div className="flex items-center gap-1.5">
                  <UserCircle2 size={11} className="text-gray-400" />
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">{customer.createdBy}</span>
                </div>
              )}
            </div>
            {/* フェーズラベル表示 */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {phases.map((p, i) => {
                const isCurrent = p.id === customer.phase;
                return (
                  <button
                    key={p.id}
                    onClick={() => onMove(customer.id, p.id)}
                    className={[
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                      isCurrent
                        ? `${p.headerColor} ${p.textColor} shadow-sm`
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200',
                    ].join(' ')}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? p.dotColor : 'bg-gray-300 dark:bg-gray-600'}`} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   AddCardModal（顧客追加モーダル）
───────────────────────────────────────────────────────────────────────── */
const PRICE_PRESETS = [3000, 5000, 8000, 10000, 15000, 20000, 30000];

function AddCardModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', product: '', amount: '', phase: 'lead', note: '' });
  const [displayAmount, setDisplayAmount] = useState('');
  const [errors, setErrors] = useState({});

  const patch = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const handleAmount = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    setDisplayAmount(digits ? Number(digits).toLocaleString() : '');
    patch('amount', digits);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'アカウント名を入力してください';
    if (!form.product.trim()) e.product = '商品名を入力してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ ...form, amount: Number(form.amount) || 0, date: new Date().toISOString().slice(0, 10), id: Date.now() });
    onClose();
  };

  const inputBase = 'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors';
  const cls = (err) => err
    ? `${inputBase} border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus:ring-red-200`
    : `${inputBase} border-gray-200 dark:border-gray-600 focus:ring-blue-200 dark:focus:ring-blue-700`;

  const Field = ({ id, label, error, children }) => (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white">顧客を追加</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <Field id="f-name" label="アカウント名（Instagram ID）*" error={errors.name}>
            <input id="f-name" className={cls(errors.name)} placeholder="例: tanaka_mika"
              value={form.name} onChange={(e) => patch('name', e.target.value)} />
          </Field>
          <Field id="f-product" label="興味を持っている商品*" error={errors.product}>
            <input id="f-product" className={cls(errors.product)} placeholder="例: フラワープリントワンピース"
              value={form.product} onChange={(e) => patch('product', e.target.value)} />
          </Field>
          <Field id="f-amount" label="金額（円）">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">¥</span>
              <input id="f-amount" type="text" inputMode="numeric" className={`${cls(false)} pl-7`}
                placeholder="0" value={displayAmount} onChange={(e) => handleAmount(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRICE_PRESETS.map((p) => (
                <button key={p} type="button" onClick={() => handleAmount(String(p))}
                  className={['text-xs px-2.5 py-1 rounded-full border transition-all',
                    form.amount === String(p)
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                  ].join(' ')}>¥{p.toLocaleString()}</button>
              ))}
            </div>
          </Field>

          {/* フェーズ選択 — ビジュアルボタン */}
          <div>
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">フェーズ</label>
            <div className="grid grid-cols-2 gap-2">
              {phases.map((p, i) => (
                <button key={p.id} type="button" onClick={() => patch('phase', p.id)}
                  className={['flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                    form.phase === p.id
                      ? `${p.headerColor} ${p.textColor} border-current shadow-sm`
                      : 'border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300',
                  ].join(' ')}>
                  <div className={`w-2 h-2 rounded-full ${p.dotColor}`} />
                  <span className="text-xs">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Field id="f-note" label="メモ">
            <input id="f-note" className={cls(false)} placeholder="例: ストーリーでいいねあり"
              value={form.note} onChange={(e) => patch('note', e.target.value)} />
          </Field>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all">
              キャンセル
            </button>
            <button type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2">
              <Save size={15} /> 追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   KanbanBoard — メインコンポーネント（パイプラインビュー）
───────────────────────────────────────────────────────────────────────── */
export default function KanbanBoard({
  selectedAccount, accounts, customers, currentUser,
  onAddCustomer, onMoveCustomer, onDeleteCustomer,
}) {
  const [showModal,   setShowModal]   = useState(false);
  const [openPhases,  setOpenPhases]  = useState(() => new Set(phases.map((p) => p.id)));

  const targetIds =
    selectedAccount === 'all'
      ? new Set(accounts.map((a) => a.id))
      : new Set([selectedAccount]);

  const filtered = customers.filter((c) => targetIds.has(c.accountId));

  const togglePhase = (phaseId) =>
    setOpenPhases((prev) => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      return next;
    });

  const handleAddCard = (formData) => {
    const accountId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    if (!accountId) return;
    onAddCustomer({ ...formData, accountId, createdBy: currentUser || '管理者' });
  };

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">フェーズ管理</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">顧客の進捗状況を管理</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-sm"
        >
          <Plus size={16} /> 顧客を追加
        </button>
      </div>

      {/* フェーズ概要ミニカード（ファネル） */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((phase, i) => {
          const count  = filtered.filter((c) => c.phase === phase.id).length;
          const amount = filtered.filter((c) => c.phase === phase.id).reduce((s, c) => s + (c.amount || 0), 0);
          return (
            <button
              key={phase.id}
              onClick={() => togglePhase(phase.id)}
              className={[
                'rounded-2xl p-3 text-left transition-all hover:scale-[1.02] active:scale-95',
                phase.color,
                'dark:bg-gray-800/60 dark:border-gray-700',
              ].join(' ')}
            >
              <div className={`text-[10px] font-semibold ${phase.textColor} opacity-70 mb-1 flex items-center gap-1`}>
                <span className="hidden sm:inline">{i + 1}.</span>
                {phase.label.split('（')[0]}
              </div>
              <div className={`text-2xl font-black ${phase.textColor}`}>{count}<span className="text-sm font-medium ml-0.5">件</span></div>
              {amount > 0 && (
                <div className={`text-[11px] ${phase.textColor} opacity-60 mt-0.5`}>
                  ¥{amount.toLocaleString()}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* フェーズ別リスト（アコーディオン） */}
      <div className="space-y-3">
        {phases.map((phase) => {
          const phaseCustomers = filtered.filter((c) => c.phase === phase.id);
          const totalAmount    = phaseCustomers.reduce((s, c) => s + (c.amount || 0), 0);
          const isOpen         = openPhases.has(phase.id);

          return (
            <div
              key={phase.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              {/* フェーズヘッダー（クリックで開閉） */}
              <button
                onClick={() => togglePhase(phase.id)}
                className={`w-full ${phase.headerColor} dark:bg-gray-700/40 px-4 py-3 flex items-center justify-between hover:brightness-95 dark:hover:brightness-110 transition-all`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${phase.dotColor} shrink-0`} />
                  <span className={`font-bold text-sm ${phase.textColor}`}>{phase.label}</span>
                  <span className={`text-xs font-bold ${phase.textColor} bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full`}>
                    {phaseCustomers.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {totalAmount > 0 && (
                    <span className={`text-xs font-semibold ${phase.textColor} opacity-70`}>
                      ¥{totalAmount.toLocaleString()}
                    </span>
                  )}
                  <ChevronDown
                    size={15}
                    className={`${phase.textColor} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* 顧客リスト */}
              {isOpen && (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {phaseCustomers.length === 0 ? (
                    <div className="px-4 py-6 flex flex-col items-center gap-2 text-center">
                      <div className={`w-8 h-8 rounded-full ${phase.headerColor} dark:bg-gray-700 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full ${phase.dotColor} opacity-40`} />
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">このフェーズに顧客はいません</p>
                    </div>
                  ) : (
                    phaseCustomers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        accounts={accounts}
                        onMove={onMoveCustomer}
                        onDelete={onDeleteCustomer}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 全体サマリー */}
      {filtered.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80 mb-1">パイプライン合計</div>
              <div className="text-xl font-black">
                ¥{filtered.reduce((s, c) => s + (c.amount || 0), 0).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">顧客数</div>
              <div className="text-xl font-black">{filtered.length} 件</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">成約率</div>
              <div className="text-xl font-black">
                {filtered.length > 0
                  ? Math.round((filtered.filter((c) => c.phase === 'closed').length / filtered.length) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddCardModal onClose={() => setShowModal(false)} onAdd={handleAddCard} />
      )}
    </div>
  );
}
