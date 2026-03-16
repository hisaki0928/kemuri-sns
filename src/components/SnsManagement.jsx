import { useState, useRef, useEffect } from 'react';
import {
  Plus, X, Save, Calendar, Lightbulb, Hash, TrendingUp,
  Copy, Check, Trash2, ChevronDown, ArrowUp, ArrowDown,
  Minus, CheckCircle2, Clock, FileEdit, UserCircle2,
  Edit2, BookOpen, MessageSquare, Target, Tag as TagIcon,
  AlignLeft, Pencil, Camera, Image as ImageIcon, Sparkles,
  BarChart2, UploadCloud,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// 定数・スタイルマップ
// ─────────────────────────────────────────────────────────────────────────────
const INPUT = 'w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 transition-colors';
const CARD  = 'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md';

const POST_STATUS = {
  scheduled: { label: '予定',   icon: Clock,         color: 'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400'  },
  published:  { label: '公開済', icon: CheckCircle2,  color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  draft:      { label: '下書き', icon: FileEdit,      color: 'bg-gray-100  text-gray-600  dark:bg-gray-700    dark:text-gray-400'  },
};

const POST_CATEGORIES = {
  product:   { label: '商品紹介',     color: 'bg-pink-100   text-pink-700   dark:bg-pink-900/30   dark:text-pink-400'   },
  styling:   { label: 'スタイリング', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
  lifestyle: { label: 'ライフスタイル',color:'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400'  },
  campaign:  { label: 'キャンペーン', color: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400'    },
  other:     { label: 'その他',       color: 'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400'   },
};

const IDEA_STATUS = {
  idea:  { label: 'アイデア', color: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',   next: 'draft' },
  draft: { label: '下書き中', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', next: 'done'  },
  done:  { label: '投稿済',   color: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',  next: 'idea'  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 共通 Modal ラッパー
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">⚠ {error}</p>}
    </div>
  );
}

function ModalActions({ onClose, onSave, saveLabel = '保存する' }) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
      >
        キャンセル
      </button>
      <button
        type="submit"
        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Save size={14} />
        {saveLabel}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1: 投稿スケジュール
// ─────────────────────────────────────────────────────────────────────────────
function AddPostModal({ onClose, onAdd, accounts, defaultAccountId, currentUser }) {
  const [form, setForm] = useState({
    title: '', caption: '', date: '', time: '18:00',
    status: 'scheduled', category: 'product',
    accountId: defaultAccountId ?? accounts[0]?.id,
  });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.title.trim()) er.title = 'タイトルを入力してください';
    if (!form.date)          er.date  = '日付を選択してください';
    setErrors(er);
    if (Object.keys(er).length) return;
    onAdd({ ...form, id: Date.now(), createdBy: currentUser || '管理者' });
    onClose();
  };

  return (
    <Modal title="投稿を追加" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {/* アカウント選択（全アカウント表示時のみ） */}
        {defaultAccountId === 'all' && (
          <Field label="アカウント">
            <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="タイトル*" error={errors.title}>
          <input className={INPUT} placeholder="投稿のタイトル（管理用）" value={form.title} onChange={(e) => p('title', e.target.value)} />
        </Field>
        <Field label="キャプション">
          <textarea className={`${INPUT} resize-none`} rows={3} placeholder="投稿のキャプション文" value={form.caption} onChange={(e) => p('caption', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="日付*" error={errors.date}>
            <input type="date" className={INPUT} value={form.date} onChange={(e) => p('date', e.target.value)} />
          </Field>
          <Field label="時刻">
            <input type="time" className={INPUT} value={form.time} onChange={(e) => p('time', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="カテゴリ">
            <select className={`${INPUT} appearance-none`} value={form.category} onChange={(e) => p('category', e.target.value)}>
              {Object.entries(POST_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="ステータス">
            <select className={`${INPUT} appearance-none`} value={form.status} onChange={(e) => p('status', e.target.value)}>
              {Object.entries(POST_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
        </div>
        <ModalActions onClose={onClose} saveLabel="追加する" />
      </form>
    </Modal>
  );
}

// ── 投稿編集モーダル ────────────────────────────────────────────────
function EditPostModal({ post, onClose, onUpdate, accounts }) {
  const [form, setForm] = useState({ ...post });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const charCount = form.caption?.length ?? 0;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.title.trim()) er.title = 'タイトルを入力してください';
    if (!form.date)          er.date  = '日付を選択してください';
    setErrors(er);
    if (Object.keys(er).length) return;
    onUpdate(form);
    onClose();
  };

  return (
    <Modal title="投稿を編集" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="アカウント">
          <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
          </select>
        </Field>
        <Field label="タイトル*" error={errors.title}>
          <input className={INPUT} value={form.title} onChange={(e) => p('title', e.target.value)} />
        </Field>
        <Field label={`投稿内容（キャプション）${charCount > 0 ? ` — ${charCount.toLocaleString()} 文字` : ''}`}>
          <textarea
            className={`${INPUT} resize-none font-normal leading-relaxed`}
            rows={8}
            placeholder={'投稿のキャプションを入力\n\n絵文字・改行・ハッシュタグなどを含めた完成形を書いておくと便利です✍️'}
            value={form.caption}
            onChange={(e) => p('caption', e.target.value)}
          />
          {charCount > 2000 && (
            <p className="text-xs text-amber-500 mt-1">⚠ Instagramの推奨文字数（2200字）に近づいています</p>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="日付*" error={errors.date}>
            <input type="date" className={INPUT} value={form.date} onChange={(e) => p('date', e.target.value)} />
          </Field>
          <Field label="時刻">
            <input type="time" className={INPUT} value={form.time} onChange={(e) => p('time', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="カテゴリ">
            <select className={`${INPUT} appearance-none`} value={form.category} onChange={(e) => p('category', e.target.value)}>
              {Object.entries(POST_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="ステータス">
            <select className={`${INPUT} appearance-none`} value={form.status} onChange={(e) => p('status', e.target.value)}>
              {Object.entries(POST_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
        </div>
        <ModalActions onClose={onClose} saveLabel="更新する" />
      </form>
    </Modal>
  );
}

function PostsTab({ posts, accounts, selectedAccount, onPostsChange, currentUser }) {
  const [filter,    setFilter]    = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editPost,  setEditPost]  = useState(null); // 編集中の投稿オブジェクト

  const targetIds = selectedAccount === 'all' ? new Set(accounts.map((a) => a.id)) : new Set([selectedAccount]);
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const filtered = posts
    .filter((p) => targetIds.has(p.accountId))
    .filter((p) => filter === 'all' || p.status === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  const STATUS_FILTERS = [
    { id: 'all', label: '全て' },
    { id: 'scheduled', label: '予定' },
    { id: 'published', label: '公開済' },
    { id: 'draft', label: '下書き' },
  ];

  const deletePost   = (id)          => onPostsChange((prev) => prev.filter((p) => p.id !== id));
  const updateStatus = (id, status)  => onPostsChange((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  const updatePost   = (updated)     => onPostsChange((prev) => prev.map((p) => p.id === updated.id ? updated : p));

  return (
    <div className="space-y-4">
      {/* フィルタ + 追加ボタン */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.id ? 'bg-blue-500 text-white shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-300 dark:hover:border-blue-600'}`}>
              {f.label}
              <span className="ml-1.5 opacity-70">
                {posts.filter((p) => targetIds.has(p.accountId) && (f.id === 'all' || p.status === f.id)).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-sm">
          <Plus size={15} /> 投稿を追加
        </button>
      </div>

      {/* 投稿リスト */}
      {filtered.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 gap-3`}>
          <Calendar size={32} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">投稿がありません</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((post) => {
            const account = accountMap.get(post.accountId);
            const status = POST_STATUS[post.status];
            const category = POST_CATEGORIES[post.category];
            const StatusIcon = status.icon;
            return (
              <div key={post.id} className={`${CARD} p-4`}>
                <div className="flex items-start gap-3">
                  {/* 日付カラム */}
                  <div className="text-center shrink-0 min-w-[44px]">
                    <div className="text-xs text-gray-400 dark:text-gray-500">{post.date.slice(5, 7)}月</div>
                    <div className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-none">{post.date.slice(8)}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{post.time}</div>
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {account && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${account.badgeBg} ${account.textColor} font-medium`}>
                          {account.icon} {account.name}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${category?.color}`}>
                        {category?.label}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{post.title}</div>
                    {post.caption && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{post.caption}</div>
                    )}
                    {post.createdBy && (
                      <div className="flex items-center gap-1 mt-1">
                        <UserCircle2 size={10} className="text-gray-300 dark:text-gray-600" />
                        <span className="text-[10px] text-gray-300 dark:text-gray-500">{post.createdBy}</span>
                      </div>
                    )}
                  </div>

                  {/* ステータス + 操作 */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={post.status}
                      onChange={(e) => updateStatus(post.id, e.target.value)}
                      className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-0 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-300 ${status.color}`}
                    >
                      {Object.entries(POST_STATUS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <button onClick={() => setEditPost(post)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      title="編集">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deletePost(post.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="削除">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddPostModal
          onClose={() => setShowModal(false)}
          onAdd={(post) => onPostsChange((prev) => [...prev, post])}
          accounts={accounts}
          defaultAccountId={selectedAccount}
          currentUser={currentUser}
        />
      )}
      {editPost && (
        <EditPostModal
          post={editPost}
          onClose={() => setEditPost(null)}
          onUpdate={updatePost}
          accounts={accounts}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2: ネタ帳
// ─────────────────────────────────────────────────────────────────────────────
function AddIdeaModal({ onClose, onAdd, accounts, defaultAccountId, currentUser }) {
  const [form, setForm] = useState({
    title: '', category: 'product', memo: '', tagInput: '', status: 'idea',
    accountId: defaultAccountId === 'all' ? accounts[0]?.id : defaultAccountId,
  });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErrors({ title: 'タイトルを入力してください' }); return; }
    const tags = form.tagInput.split(/[,、\s]+/).map((t) => t.trim()).filter(Boolean);
    onAdd({ ...form, tags, id: Date.now(), createdBy: currentUser || '管理者' });
    onClose();
  };

  return (
    <Modal title="アイデアを追加" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {defaultAccountId === 'all' && (
          <Field label="アカウント">
            <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="タイトル*" error={errors.title}>
          <input className={INPUT} placeholder="コンテンツアイデアのタイトル" value={form.title} onChange={(e) => p('title', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="カテゴリ">
            <select className={`${INPUT} appearance-none`} value={form.category} onChange={(e) => p('category', e.target.value)}>
              {Object.entries(POST_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <Field label="ステータス">
            <select className={`${INPUT} appearance-none`} value={form.status} onChange={(e) => p('status', e.target.value)}>
              {Object.entries(IDEA_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="メモ">
          <textarea className={`${INPUT} resize-none`} rows={3} placeholder="企画の詳細・参考メモ" value={form.memo} onChange={(e) => p('memo', e.target.value)} />
        </Field>
        <Field label="タグ（カンマ区切り）">
          <input className={INPUT} placeholder="例: コーデ, 着回し, ビフォーアフター" value={form.tagInput} onChange={(e) => p('tagInput', e.target.value)} />
        </Field>
        <ModalActions onClose={onClose} saveLabel="追加する" />
      </form>
    </Modal>
  );
}

function IdeasTab({ ideas, accounts, selectedAccount, onIdeasChange, currentUser }) {
  const [catFilter, setCatFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const targetIds = selectedAccount === 'all' ? new Set(accounts.map((a) => a.id)) : new Set([selectedAccount]);
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const filtered = ideas
    .filter((i) => targetIds.has(i.accountId))
    .filter((i) => catFilter === 'all' || i.category === catFilter);

  const cycleStatus = (id) =>
    onIdeasChange((prev) => prev.map((i) => i.id === id ? { ...i, status: IDEA_STATUS[i.status].next } : i));
  const deleteIdea = (id) =>
    onIdeasChange((prev) => prev.filter((i) => i.id !== id));

  const CAT_FILTERS = [{ id: 'all', label: '全て' }, ...Object.entries(POST_CATEGORIES).map(([k, v]) => ({ id: k, label: v.label }))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {CAT_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setCatFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${catFilter === f.id ? 'bg-violet-500 text-white shadow-sm' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-600'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-purple-700 active:scale-95 transition-all shadow-sm">
          <Plus size={15} /> アイデアを追加
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 gap-3`}>
          <Lightbulb size={32} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">アイデアがありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((idea) => {
            const account  = accountMap.get(idea.accountId);
            const status   = IDEA_STATUS[idea.status];
            const category = POST_CATEGORIES[idea.category];
            return (
              <div key={idea.id} className={`${CARD} p-4 flex flex-col gap-2.5 group`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${category.color}`}>
                      {category.label}
                    </span>
                    {account && selectedAccount === 'all' && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.badgeBg} ${account.textColor}`}>
                        {account.icon}
                      </span>
                    )}
                  </div>
                  <button onClick={() => deleteIdea(idea.id)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                  {idea.title}
                </div>

                {idea.memo && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {idea.memo}
                  </p>
                )}

                {idea.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-2">
                  {/* ステータスをクリックでサイクル */}
                  <button
                    onClick={() => cycleStatus(idea.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:opacity-80 active:scale-95 ${status.color}`}
                    title="クリックでステータスを変更"
                  >
                    {status.label} →
                  </button>
                  {idea.createdBy && (
                    <div className="flex items-center gap-1">
                      <UserCircle2 size={10} className="text-gray-300 dark:text-gray-600" />
                      <span className="text-[10px] text-gray-300 dark:text-gray-500">{idea.createdBy}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddIdeaModal
          onClose={() => setShowModal(false)}
          onAdd={(idea) => onIdeasChange((prev) => [...prev, idea])}
          accounts={accounts}
          defaultAccountId={selectedAccount}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 3: ハッシュタグセット
// ─────────────────────────────────────────────────────────────────────────────
function AddHashtagModal({ onClose, onAdd, accounts, defaultAccountId, currentUser }) {
  const [form, setForm] = useState({
    name: '',
    tagsText: '',
    accountId: defaultAccountId === 'all' ? accounts[0]?.id : defaultAccountId,
  });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim())     er.name     = 'セット名を入力してください';
    if (!form.tagsText.trim()) er.tagsText = 'ハッシュタグを入力してください';
    setErrors(er);
    if (Object.keys(er).length) return;
    const tags = form.tagsText
      .split(/[\n,\s]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => t.startsWith('#') ? t : `#${t}`);
    onAdd({ ...form, tags, id: Date.now(), createdBy: currentUser || '管理者' });
    onClose();
  };

  return (
    <Modal title="ハッシュタグセットを追加" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {defaultAccountId === 'all' && (
          <Field label="アカウント">
            <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="セット名*" error={errors.name}>
          <input className={INPUT} placeholder="例: アパレル基本セット" value={form.name} onChange={(e) => p('name', e.target.value)} />
        </Field>
        <Field label="ハッシュタグ*（改行・カンマ・スペース区切り）" error={errors.tagsText}>
          <textarea
            className={`${INPUT} resize-none font-mono text-xs`}
            rows={5}
            placeholder={'#プチプラコーデ\n#今日のコーデ\n#ootd'}
            value={form.tagsText}
            onChange={(e) => p('tagsText', e.target.value)}
          />
        </Field>
        <ModalActions onClose={onClose} saveLabel="追加する" />
      </form>
    </Modal>
  );
}

function HashtagsTab({ hashtagSets, accounts, selectedAccount, onHashtagSetsChange, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const targetIds = selectedAccount === 'all' ? new Set(accounts.map((a) => a.id)) : new Set([selectedAccount]);
  const accountMap = new Map(accounts.map((a) => [a.id, a]));
  const filtered = hashtagSets.filter((h) => targetIds.has(h.accountId));

  const copyTags = (set) => {
    navigator.clipboard.writeText(set.tags.join(' ')).then(() => {
      setCopiedId(set.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const deleteSet = (id) => onHashtagSetsChange((prev) => prev.filter((h) => h.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all shadow-sm">
          <Plus size={15} /> セットを追加
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 gap-3`}>
          <Hash size={32} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">ハッシュタグセットがありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((set) => {
            const account = accountMap.get(set.accountId);
            const copied  = copiedId === set.id;
            return (
              <div key={set.id} className={`${CARD} p-5`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {account && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.badgeBg} ${account.textColor}`}>
                          {account.icon} {account.name}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">{set.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{set.tags.length}個のタグ</span>
                      {set.createdBy && (
                        <>
                          <span className="text-gray-200 dark:text-gray-700">·</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-300 dark:text-gray-600">
                            <UserCircle2 size={10} />{set.createdBy}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyTags(set)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                        copied
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {copied ? <><Check size={12} /> コピー済</> : <><Copy size={12} /> コピー</>}
                    </button>
                    <button onClick={() => deleteSet(set.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {set.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddHashtagModal
          onClose={() => setShowModal(false)}
          onAdd={(set) => onHashtagSetsChange((prev) => [...prev, set])}
          accounts={accounts}
          defaultAccountId={selectedAccount}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 4: フォロワー・エンゲージメント記録
// ─────────────────────────────────────────────────────────────────────────────
function AddEngagementModal({ onClose, onAdd, accounts, defaultAccountId, currentUser }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    followers: '', likes: '', comments: '', notes: '',
    accountId: defaultAccountId === 'all' ? accounts[0]?.id : defaultAccountId,
  });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.date)       er.date      = '日付を選択してください';
    if (!form.followers)  er.followers = 'フォロワー数を入力してください';
    setErrors(er);
    if (Object.keys(er).length) return;
    onAdd({
      ...form,
      followers: Number(form.followers),
      likes: Number(form.likes) || 0,
      comments: Number(form.comments) || 0,
      id: Date.now(),
      createdBy: currentUser || '管理者',
    });
    onClose();
  };

  return (
    <Modal title="フォロワーを記録" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {defaultAccountId === 'all' && (
          <Field label="アカウント">
            <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="日付*" error={errors.date}>
          <input type="date" className={INPUT} value={form.date} onChange={(e) => p('date', e.target.value)} />
        </Field>
        <Field label="フォロワー数*" error={errors.followers}>
          <input type="number" min="0" className={INPUT} placeholder="例: 12540" value={form.followers} onChange={(e) => p('followers', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="いいね数（平均）">
            <input type="number" min="0" className={INPUT} placeholder="例: 465" value={form.likes} onChange={(e) => p('likes', e.target.value)} />
          </Field>
          <Field label="コメント数（平均）">
            <input type="number" min="0" className={INPUT} placeholder="例: 28" value={form.comments} onChange={(e) => p('comments', e.target.value)} />
          </Field>
        </div>
        <Field label="メモ">
          <input className={INPUT} placeholder="例: セール告知でフォロー急増" value={form.notes} onChange={(e) => p('notes', e.target.value)} />
        </Field>
        <ModalActions onClose={onClose} saveLabel="記録する" />
      </form>
    </Modal>
  );
}

function EngagementsTab({ engagements, accounts, selectedAccount, onEngagementsChange, currentUser }) {
  const [showModal, setShowModal] = useState(false);

  const targetIds = selectedAccount === 'all' ? new Set(accounts.map((a) => a.id)) : new Set([selectedAccount]);
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const filtered = engagements
    .filter((e) => targetIds.has(e.accountId))
    .sort((a, b) => b.date.localeCompare(a.date));

  const deleteRecord = (id) => onEngagementsChange((prev) => prev.filter((e) => e.id !== id));

  // フォロワー増減を計算（同アカウントの前回レコードと比較）
  const getDiff = (record) => {
    const sameAccount = engagements
      .filter((e) => e.accountId === record.accountId && e.date < record.date)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (!sameAccount.length) return null;
    return record.followers - sameAccount[0].followers;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all shadow-sm">
          <Plus size={15} /> 記録する
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 gap-3`}>
          <TrendingUp size={32} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">記録がありません</p>
        </div>
      ) : (
        <div className={`${CARD} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['日付', 'アカウント', 'フォロワー', '増減', 'いいね', 'コメント', 'ER', 'メモ', '追加者', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => {
                  const account = accountMap.get(rec.accountId);
                  const diff = getDiff(rec);
                  const er = rec.followers > 0
                    ? ((rec.likes + rec.comments) / rec.followers * 100).toFixed(2)
                    : '—';
                  return (
                    <tr key={rec.id} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap font-mono text-xs">{rec.date}</td>
                      <td className="px-4 py-3">
                        {account && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.badgeBg} ${account.textColor}`}>
                            {account.icon} {account.name}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {rec.followers.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {diff === null ? (
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        ) : diff > 0 ? (
                          <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400 font-medium">
                            <ArrowUp size={12} />+{diff.toLocaleString()}
                          </span>
                        ) : diff < 0 ? (
                          <span className="flex items-center gap-0.5 text-red-500 font-medium">
                            <ArrowDown size={12} />{diff.toLocaleString()}
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-gray-400">
                            <Minus size={12} />0
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rec.likes.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{rec.comments.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">{er}%</td>
                      <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 max-w-[120px] truncate">{rec.notes}</td>
                      <td className="px-4 py-3">
                        {rec.createdBy && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-300 dark:text-gray-600 whitespace-nowrap">
                            <UserCircle2 size={10} />{rec.createdBy}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteRecord(rec.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <AddEngagementModal
          onClose={() => setShowModal(false)}
          onAdd={(rec) => onEngagementsChange((prev) => [...prev, rec])}
          accounts={accounts}
          defaultAccountId={selectedAccount}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 5: アカウントコンセプト
// ─────────────────────────────────────────────────────────────────────────────
function ConceptTab({ concepts, accounts, selectedAccount, onConceptsChange }) {
  // 全アカウント表示時は最初のアカウントを選択、個別時はそのアカウント
  const firstId = accounts[0]?.id;
  const [editingId, setEditingId] = useState(
    selectedAccount === 'all' ? firstId : selectedAccount
  );
  const [saved, setSaved] = useState(false);

  const accountId = selectedAccount === 'all' ? editingId : selectedAccount;
  const account   = accounts.find((a) => a.id === accountId);

  // 現在のコンセプト（なければ空テンプレ）
  const current = concepts.find((c) => c.accountId === accountId) ?? {
    accountId, target: '', concept: '', tone: '', pillars: [], ngWords: '',
  };

  const [form, setForm] = useState(current);
  const [pillarInput, setPillarInput] = useState('');

  // アカウントが切り替わったらフォームを更新
  const handleAccountChange = (id) => {
    setEditingId(id);
    const c = concepts.find((c) => c.accountId === id) ?? {
      accountId: id, target: '', concept: '', tone: '', pillars: [], ngWords: '',
    };
    setForm(c);
    setPillarInput('');
  };

  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addPillar = () => {
    const t = pillarInput.trim();
    if (!t || form.pillars.includes(t)) return;
    p('pillars', [...form.pillars, t]);
    setPillarInput('');
  };
  const removePillar = (t) => p('pillars', form.pillars.filter((x) => x !== t));

  const handleSave = () => {
    onConceptsChange((prev) => {
      const exists = prev.some((c) => c.accountId === accountId);
      return exists
        ? prev.map((c) => c.accountId === accountId ? { ...form, accountId } : c)
        : [...prev, { ...form, accountId }];
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const textareaClass = `${INPUT} resize-none leading-relaxed`;

  return (
    <div className="space-y-5">
      {/* アカウント切り替え（全表示時のみ） */}
      {selectedAccount === 'all' && (
        <div className="flex gap-2 flex-wrap">
          {accounts.map((a) => (
            <button key={a.id} onClick={() => handleAccountChange(a.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                editingId === a.id
                  ? `${a.badgeBg} ${a.textColor} ring-2 ring-offset-1 ring-current`
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
              {a.icon} {a.name}
            </button>
          ))}
        </div>
      )}

      <div className={`${CARD} p-5 space-y-5`}>
        {/* ヘッダー */}
        {account && (
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center text-lg`}>
              {account.icon}
            </div>
            <div>
              <div className="font-bold text-gray-800 dark:text-gray-200">{account.name}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">{account.handle}</div>
            </div>
          </div>
        )}

        {/* ターゲット層 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <Target size={13} className="text-blue-500" /> ターゲット層
          </label>
          <textarea className={textareaClass} rows={3}
            placeholder="例: 20〜35歳の女性。プチプラでおしゃれを楽しみたい方。"
            value={form.target} onChange={(e) => p('target', e.target.value)} />
        </div>

        {/* アカウントコンセプト */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <BookOpen size={13} className="text-violet-500" /> アカウントコンセプト
          </label>
          <textarea className={textareaClass} rows={3}
            placeholder="例: プチプラでもスタイリッシュに。毎日のコーデをもっと楽しく。"
            value={form.concept} onChange={(e) => p('concept', e.target.value)} />
        </div>

        {/* 投稿トーン */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <MessageSquare size={13} className="text-green-500" /> 投稿トーン・雰囲気
          </label>
          <textarea className={textareaClass} rows={2}
            placeholder="例: フレンドリーで親しみやすく。友達に話しかけるように。絵文字も積極的に。"
            value={form.tone} onChange={(e) => p('tone', e.target.value)} />
        </div>

        {/* コンテンツの柱 */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <AlignLeft size={13} className="text-amber-500" /> コンテンツの柱
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {form.pillars.map((t) => (
              <span key={t} className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs px-2.5 py-1 rounded-full">
                {t}
                <button onClick={() => removePillar(t)} className="hover:text-red-500 transition-colors ml-0.5">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={`${INPUT} flex-1`}
              placeholder="例: コーデ提案"
              value={pillarInput}
              onChange={(e) => setPillarInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPillar())}
            />
            <button onClick={addPillar}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition-colors active:scale-95">
              追加
            </button>
          </div>
        </div>

        {/* NGワード */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            <TagIcon size={13} className="text-red-400" /> NGワード・ルール
          </label>
          <textarea className={textareaClass} rows={2}
            placeholder="例: 体型に関する否定的な表現、他社批判、誇大広告"
            value={form.ngWords} onChange={(e) => p('ngWords', e.target.value)} />
        </div>

        {/* 保存ボタン */}
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm ${
            saved ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700'
          }`}>
          {saved ? <><Check size={15} />保存しました！</> : <><Save size={15} />コンセプトを保存</>}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 6: 返信・キャプションテンプレート
// ─────────────────────────────────────────────────────────────────────────────
function AddTemplateModal({ onClose, onAdd, accounts, defaultAccountId, currentUser }) {
  const [form, setForm] = useState({
    title: '', content: '', type: 'caption',
    accountId: defaultAccountId === 'all' ? accounts[0]?.id : defaultAccountId,
  });
  const [errors, setErrors] = useState({});
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const charCount = form.content.length;

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.title.trim())   er.title   = 'タイトルを入力してください';
    if (!form.content.trim()) er.content = '内容を入力してください';
    setErrors(er);
    if (Object.keys(er).length) return;
    onAdd({ ...form, id: Date.now(), createdBy: currentUser || '管理者' });
    onClose();
  };

  return (
    <Modal title="テンプレートを追加" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {defaultAccountId === 'all' && (
          <Field label="アカウント">
            <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
            </select>
          </Field>
        )}
        <Field label="種類">
          <div className="flex gap-2">
            {[{ id: 'caption', label: '📝 キャプション' }, { id: 'dm', label: '💬 DM返信' }].map((t) => (
              <button key={t.id} type="button" onClick={() => p('type', t.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                  form.type === t.id
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="テンプレート名*" error={errors.title}>
          <input className={INPUT} placeholder="例: 新商品告知テンプレ" value={form.title} onChange={(e) => p('title', e.target.value)} />
        </Field>
        <Field label={`内容* — ${charCount} 文字`} error={errors.content}>
          <textarea
            className={`${INPUT} resize-none font-normal leading-relaxed`}
            rows={8}
            placeholder={'テンプレートの内容を入力\n【】で囲った部分を差し替えて使えるよう書くと便利です\n\n例:\n✨ 新作入荷しました！\n【商品名】が入荷🎉\n価格：¥【価格】'}
            value={form.content}
            onChange={(e) => p('content', e.target.value)}
          />
        </Field>
        <ModalActions onClose={onClose} saveLabel="追加する" />
      </form>
    </Modal>
  );
}

function TemplatesTab({ templates, accounts, selectedAccount, onTemplatesChange, currentUser }) {
  const [typeFilter,  setTypeFilter]  = useState('caption');
  const [showModal,   setShowModal]   = useState(false);
  const [copiedId,    setCopiedId]    = useState(null);
  const [editTpl,     setEditTpl]     = useState(null);

  const targetIds  = selectedAccount === 'all' ? new Set(accounts.map((a) => a.id)) : new Set([selectedAccount]);
  const accountMap = new Map(accounts.map((a) => [a.id, a]));

  const filtered = templates
    .filter((t) => targetIds.has(t.accountId) && t.type === typeFilter);

  const copyContent = (tpl) => {
    navigator.clipboard.writeText(tpl.content).then(() => {
      setCopiedId(tpl.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const deleteTpl  = (id) => onTemplatesChange((prev) => prev.filter((t) => t.id !== id));
  const updateTpl  = (updated) => onTemplatesChange((prev) => prev.map((t) => t.id === updated.id ? updated : t));

  return (
    <div className="space-y-4">
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {[{ id: 'caption', label: '📝 キャプション' }, { id: 'dm', label: '💬 DM返信' }].map((t) => (
            <button key={t.id} onClick={() => setTypeFilter(t.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 active:scale-95 transition-all shadow-sm">
          <Plus size={15} /> テンプレートを追加
        </button>
      </div>

      {/* テンプレート一覧 */}
      {filtered.length === 0 ? (
        <div className={`${CARD} flex flex-col items-center justify-center py-12 gap-3`}>
          <FileEdit size={32} className="text-gray-300 dark:text-gray-600" />
          <p className="text-sm text-gray-400 dark:text-gray-500">テンプレートがありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((tpl) => {
            const account = accountMap.get(tpl.accountId);
            const copied  = copiedId === tpl.id;
            return (
              <div key={tpl.id} className={`${CARD} p-4`}>
                {/* ヘッダー */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {account && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${account.badgeBg} ${account.textColor}`}>
                        {account.icon} {account.name}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tpl.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => copyContent(tpl)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                        copied
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600'
                      }`}>
                      {copied ? <><Check size={11} />コピー済</> : <><Copy size={11} />コピー</>}
                    </button>
                    <button onClick={() => setEditTpl(tpl)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteTpl(tpl.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* 内容プレビュー */}
                <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">
                  {tpl.content}
                </pre>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-300 dark:text-gray-600">{tpl.content.length}文字</span>
                  {tpl.createdBy && (
                    <span className="flex items-center gap-0.5 text-[10px] text-gray-300 dark:text-gray-600">
                      <UserCircle2 size={10} />{tpl.createdBy}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <AddTemplateModal
          onClose={() => setShowModal(false)}
          onAdd={(tpl) => onTemplatesChange((prev) => [...prev, tpl])}
          accounts={accounts}
          defaultAccountId={selectedAccount}
          currentUser={currentUser}
        />
      )}

      {/* テンプレート編集モーダル（AddTemplateModalを流用） */}
      {editTpl && (
        <Modal title="テンプレートを編集" onClose={() => setEditTpl(null)}>
          <EditTemplateForm
            tpl={editTpl}
            accounts={accounts}
            onSave={(updated) => { updateTpl(updated); setEditTpl(null); }}
            onClose={() => setEditTpl(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI スクリーンショット分析 — バーチャート
// ─────────────────────────────────────────────────────────────────────────────
function SimpleBarChart({ data }) {
  const { labels = [], values = [], title } = data;
  if (!labels.length || !values.length) return null;
  const max = Math.max(...values, 1);
  return (
    <div>
      {title && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">{title}</p>}
      <div className="space-y-2.5">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-20 text-[11px] text-gray-500 dark:text-gray-400 text-right truncate shrink-0">{label}</div>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                style={{ width: `${Math.max((values[i] / max) * 100, 2)}%`, transition: 'width 0.8s ease' }}
              />
            </div>
            <div className="w-14 text-[11px] text-gray-700 dark:text-gray-300 font-medium shrink-0 text-right">
              {(values[i] ?? 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI スクリーンショット分析タブ
// ─────────────────────────────────────────────────────────────────────────────
function ScreenshotAnalysisTab() {
  const [image,      setImage]      = useState(null);   // { base64, mediaType, preview }
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Ctrl+V でクリップボードから画像をペースト
  useEffect(() => {
    const handlePaste = (e) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imgItem = items.find((item) => item.type.startsWith('image/'));
      if (imgItem) processFile(imgItem.getAsFile());
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const [header, base64] = dataUrl.split(',');
      const mediaType = header.match(/:(.*?);/)[1];
      setImage({ base64, mediaType, preview: dataUrl });
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) processFile(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    try {
      const storedKey = localStorage.getItem('sns_anthropic_api_key') || '';
      const res = await fetch('/api/analyze-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: image.base64, mediaType: image.mediaType, apiKey: storedKey }),
      });
      const json = await res.json();
      if (!json.ok) {
        if (json.error === 'NO_API_KEY') {
          throw new Error('APIキーが設定されていません。設定ページ → Claude API キー から登録してください。');
        }
        throw new Error(json.error);
      }
      setResult(json.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => { setImage(null); setResult(null); setError(''); };

  return (
    <div className="space-y-5">
      {/* アップロードエリア */}
      <div className={CARD}>
        <div className="p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
            <Camera size={16} className="text-purple-500" />
            AIスクリーンショット分析
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            SNSのインサイト画面をコピーして Ctrl+V でペースト、またはドラッグ&ドロップしてください
          </p>

          {/* ドロップゾーン */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => !loading && fileInputRef.current?.click()}
            className={[
              'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
              isDragOver
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : image
                  ? 'border-purple-300 bg-purple-50/30 dark:bg-purple-900/10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:bg-purple-50/40 dark:hover:bg-purple-900/10',
            ].join(' ')}
          >
            {image ? (
              <div className="space-y-2">
                <img
                  src={image.preview}
                  alt="プレビュー"
                  className="max-h-52 mx-auto rounded-lg object-contain shadow-sm"
                />
                <p className="text-xs text-gray-400 dark:text-gray-500">クリックして別の画像に変更</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
                  <UploadCloud size={28} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ctrl+V でペースト、またはここをクリック
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    ドラッグ&ドロップも可 / PNG・JPG・WebP 対応
                  </p>
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => processFile(e.target.files[0])}
          />

          {/* ボタン */}
          {image && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={[
                  'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all active:scale-95',
                  loading
                    ? 'bg-purple-100 text-purple-400 dark:bg-purple-900/20 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-sm',
                ].join(' ')}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    AI が分析中...
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    AI で分析する
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-4 py-3 border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-40"
              >
                クリア
              </button>
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 leading-relaxed">
              ⚠{' '}
              {error.includes('ANTHROPIC_API_KEY')
                ? 'APIキーが設定されていません。プロジェクトルートの .env ファイルに ANTHROPIC_API_KEY=sk-ant-... を追加してください。'
                : error}
            </div>
          )}
        </div>
      </div>

      {/* 分析結果 */}
      {result && (
        <div className="space-y-4 animate-fade-in">

          {/* ヘッダー＋サマリー */}
          <div className={`${CARD} p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                <BarChart2 size={18} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200">{result.platform || 'SNS分析'}</div>
                {result.period && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">{result.period}</div>
                )}
              </div>
            </div>
            {result.summary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
                {result.summary}
              </p>
            )}
          </div>

          {/* 指標カード */}
          {result.metrics?.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {result.metrics.map((m, i) => (
                <div key={i} className={`${CARD} p-4`}>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500 mb-1 truncate">{m.name}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">{m.value}</div>
                  {m.changePct && (
                    <div className={[
                      'flex items-center gap-1 text-xs font-semibold mt-1.5',
                      m.trend === 'up'   ? 'text-green-500' :
                      m.trend === 'down' ? 'text-red-500'   : 'text-gray-400',
                    ].join(' ')}>
                      {m.trend === 'up'   ? <ArrowUp size={11} /> :
                       m.trend === 'down' ? <ArrowDown size={11} /> : <Minus size={11} />}
                      {m.changePct}
                      {m.change && <span className="font-normal text-gray-400 dark:text-gray-500">（{m.change}）</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* パフォーマンス評価カード */}
          {result.performanceVerdict && (
            <div className={[
              `${CARD} p-5 border-l-4`,
              result.performanceVerdict.rating === 'good' ? 'border-l-green-400' :
              result.performanceVerdict.rating === 'poor' ? 'border-l-red-400'   : 'border-l-amber-400',
            ].join(' ')}>
              <div className="flex items-center gap-2 mb-3">
                <span className={[
                  'text-lg font-black',
                  result.performanceVerdict.rating === 'good' ? 'text-green-500' :
                  result.performanceVerdict.rating === 'poor' ? 'text-red-500'   : 'text-amber-500',
                ].join(' ')}>
                  {result.performanceVerdict.rating === 'good' ? '✅ 好調' :
                   result.performanceVerdict.rating === 'poor' ? '⚠️ 要改善' : '📊 普通'}
                </span>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">パフォーマンス評価</h4>
              </div>
              {result.performanceVerdict.keyFactor && (
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                  🔑 {result.performanceVerdict.keyFactor}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.performanceVerdict.goodReasons?.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-2">👍 よかった点</p>
                    <ul className="space-y-1.5">
                      {result.performanceVerdict.goodReasons.map((r, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex gap-2 leading-relaxed">
                          <span className="text-green-400 shrink-0">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.performanceVerdict.badReasons?.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-500 dark:text-red-400 mb-2">📌 改善すべき点</p>
                    <ul className="space-y-1.5">
                      {result.performanceVerdict.badReasons.map((r, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex gap-2 leading-relaxed">
                          <span className="text-red-400 shrink-0">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 動画パフォーマンス指標 */}
          {result.videoMetrics?.hasVideoData && (
            <div className={`${CARD} p-5`}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <span className="text-base">🎬</span> 動画パフォーマンス詳細
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'playCount',          label: '再生数',            icon: '▶️' },
                  { key: 'nonFollowerViewRate', label: 'おすすめ流入率',   icon: '🔥' },
                  { key: 'followerViewRate',    label: 'フォロワー視聴率', icon: '👥' },
                  { key: 'dropOffRate2s',       label: '2秒以内の離脱率',  icon: '⚡' },
                  { key: 'completionRate',      label: '完視聴率',          icon: '✅' },
                  { key: 'avgWatchTime',        label: '平均視聴時間',     icon: '⏱️' },
                  { key: 'likeRate',            label: 'いいね率',          icon: '❤️' },
                  { key: 'shareRate',           label: 'シェア率',          icon: '📤' },
                ].filter(({ key }) => result.videoMetrics[key]).map(({ key, label, icon }) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3">
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1">
                      <span>{icon}</span> {label}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      {result.videoMetrics[key]}
                    </div>
                  </div>
                ))}
              </div>
              {result.videoMetrics.reachSource && (
                <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
                  <p className="text-xs text-purple-500 dark:text-purple-400 font-medium mb-1">📍 リーチ元の内訳</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{result.videoMetrics.reachSource}</p>
                </div>
              )}
            </div>
          )}

          {/* バーチャート */}
          {result.chartData?.labels?.length > 0 && (
            <div className={`${CARD} p-5`}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <TrendingUp size={14} className="text-purple-500" />
                データチャート
              </h4>
              <SimpleBarChart data={result.chartData} />
            </div>
          )}

          {/* インサイト */}
          {result.insights?.length > 0 && (
            <div className={`${CARD} p-5`}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Lightbulb size={14} className="text-amber-500" />
                インサイト
              </h4>
              <ul className="space-y-2.5">
                {result.insights.map((ins, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="text-amber-400 mt-0.5 shrink-0 text-base leading-none">•</span>
                    {ins}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 改善アクション */}
          {result.recommendations?.length > 0 && (
            <div className={`${CARD} p-5`}>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Target size={14} className="text-blue-500" />
                改善アクション
              </h4>
              <ul className="space-y-2.5">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 初期状態の説明 */}
      {!image && !result && (
        <div className={`${CARD} p-6 flex flex-col items-center text-center gap-3`}>
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Camera size={28} className="text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">使い方</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 leading-relaxed max-w-xs">
              Instagram・X・TikTokなどのインサイト画面をスクリーンショットし、<br />
              Ctrl+V で貼り付けると AI が指標を読み取り分析します
            </p>
          </div>
          <div className="flex gap-3 text-xs text-gray-400 dark:text-gray-500 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
              <ImageIcon size={11} /> フォロワー数
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
              <TrendingUp size={11} /> リーチ・インプレッション
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-full">
              <BarChart2 size={11} /> エンゲージメント率
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function EditTemplateForm({ tpl, accounts, onSave, onClose }) {
  const [form, setForm] = useState({ ...tpl });
  const p = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const charCount = form.content.length;

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <Field label="アカウント">
        <select className={`${INPUT} appearance-none`} value={form.accountId} onChange={(e) => p('accountId', Number(e.target.value))}>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
        </select>
      </Field>
      <Field label="テンプレート名">
        <input className={INPUT} value={form.title} onChange={(e) => p('title', e.target.value)} />
      </Field>
      <Field label={`内容 — ${charCount} 文字`}>
        <textarea
          className={`${INPUT} resize-none font-normal leading-relaxed`}
          rows={9}
          value={form.content}
          onChange={(e) => p('content', e.target.value)}
        />
      </Field>
      <ModalActions onClose={onClose} saveLabel="更新する" />
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// メイン: SnsManagement
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'posts',       label: '投稿',           icon: Calendar     },
  { id: 'ideas',       label: 'ネタ帳',         icon: Lightbulb    },
  { id: 'hashtags',    label: 'ハッシュタグ',   icon: Hash         },
  { id: 'engagements', label: 'フォロワー記録', icon: TrendingUp   },
  { id: 'concept',     label: 'コンセプト',     icon: BookOpen     },
  { id: 'templates',   label: 'テンプレート',   icon: FileEdit     },
  { id: 'analysis',    label: 'AI分析',         icon: Camera       },
];

export default function SnsManagement({
  selectedAccount, accounts, currentUser,
  posts, ideas, hashtagSets, engagements, concepts, templates,
  onPostsChange, onIdeasChange, onHashtagSetsChange, onEngagementsChange,
  onConceptsChange, onTemplatesChange,
}) {
  const [activeTab, setActiveTab] = useState('posts');

  const renderTab = () => {
    const common = { selectedAccount, accounts, currentUser };
    switch (activeTab) {
      case 'posts':       return <PostsTab       {...common} posts={posts}             onPostsChange={onPostsChange} />;
      case 'ideas':       return <IdeasTab        {...common} ideas={ideas}             onIdeasChange={onIdeasChange} />;
      case 'hashtags':    return <HashtagsTab     {...common} hashtagSets={hashtagSets} onHashtagSetsChange={onHashtagSetsChange} />;
      case 'engagements': return <EngagementsTab  {...common} engagements={engagements} onEngagementsChange={onEngagementsChange} />;
      case 'concept':     return <ConceptTab      {...common} concepts={concepts}       onConceptsChange={onConceptsChange} />;
      case 'templates':   return <TemplatesTab    {...common} templates={templates}     onTemplatesChange={onTemplatesChange} />;
      case 'analysis':    return <ScreenshotAnalysisTab />;
      default:            return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SNS運用</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">投稿計画・ネタ帳・ハッシュタグ・フォロワー管理</p>
      </div>

      {/* タブバー */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            ].join(' ')}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {renderTab()}
    </div>
  );
}
