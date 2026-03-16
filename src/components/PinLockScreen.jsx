import { useState, useEffect, useCallback } from 'react';
import { Delete, Lock, Users, Eye, EyeOff } from 'lucide-react';

const PIN_LENGTH = 4;

// ロックが必要な画面の日本語名
const VIEW_LABELS = {
  dashboard: 'ダッシュボード',
  analytics:  'アナリティクス',
  settings:   '設定',
};

/**
 * PinLockScreen
 *
 * マネージャーロックが有効な画面に遷移しようとした際に
 * フルスクリーンでオーバーレイ表示されるPIN入力UI。
 *
 * Props:
 *   targetView  – アクセスしようとした画面のID
 *   onUnlock    – (pin: string) => boolean  正解なら true を返す
 *   onStaffMode – スタッフとして続けるボタンのコールバック
 */
export default function PinLockScreen({ targetView, onUnlock, onStaffMode }) {
  const [pin,       setPin]       = useState('');
  const [error,     setError]     = useState('');
  const [shake,     setShake]     = useState(false);
  const [showPin,   setShowPin]   = useState(false);
  // 各ドットのポップアニメーション用
  const [popIndex,  setPopIndex]  = useState(-1);

  // ── 送信 ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback((currentPin = pin) => {
    if (currentPin.length < PIN_LENGTH) return;
    const ok = onUnlock(currentPin);
    if (!ok) {
      setError('PINが違います。もう一度お試しください。');
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
    // 正解時は App.jsx 側で画面遷移するため、ここでは何もしない
  }, [pin, onUnlock]);

  // ── 数字キー入力 ──────────────────────────────────────────────────
  const handleKey = useCallback((key) => {
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + key;
      setPopIndex(prev.length);          // 入力したドットをポップ
      setTimeout(() => setPopIndex(-1), 150);
      setError('');
      // 4桁揃ったら自動送信
      if (next.length === PIN_LENGTH) {
        setTimeout(() => handleSubmit(next), 80);
      }
      return next;
    });
  }, [handleSubmit]);

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  }, []);

  // ── 物理キーボード対応 ───────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key);
      else if (e.key === 'Backspace')    handleDelete();
      else if (e.key === 'Enter')        handleSubmit();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, handleDelete, handleSubmit]);

  // ── ヌメリックパッドのキー配列 ───────────────────────────────────
  const PAD = [
    '1','2','3',
    '4','5','6',
    '7','8','9',
    'del','0','ok',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/95 backdrop-blur-md animate-fade-in">
      <div className="flex flex-col items-center gap-7 w-full max-w-[280px] px-4">

        {/* ─── アイコン ─────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-900/60">
            <Lock size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-white text-lg font-bold tracking-tight">
              マネージャー認証
            </h2>
            {targetView && VIEW_LABELS[targetView] && (
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                「{VIEW_LABELS[targetView]}」は<br />マネージャー専用です
              </p>
            )}
          </div>
        </div>

        {/* ─── PINドット表示 ────────────────────────────────────── */}
        <div className={`flex gap-5 ${shake ? 'animate-shake' : ''}`}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => {
            const filled = pin.length > i;
            return (
              <div
                key={i}
                className={[
                  'w-4 h-4 rounded-full border-2 transition-all duration-150',
                  filled
                    ? 'bg-indigo-400 border-indigo-400 scale-110'
                    : 'border-gray-600',
                  popIndex === i ? 'animate-pin-pop' : '',
                ].join(' ')}
              />
            );
          })}
        </div>

        {/* ─── PIN表示（デバッグ的だが入力確認用） ──────────────── */}
        {showPin && pin && (
          <p className="text-gray-500 text-xs -mt-3 font-mono tracking-widest">
            {'●'.repeat(pin.length)}
          </p>
        )}

        {/* ─── エラーメッセージ ─────────────────────────────────── */}
        <div className="h-4 -mt-3">
          {error && (
            <p className="text-red-400 text-xs text-center animate-slide-in">
              {error}
            </p>
          )}
        </div>

        {/* ─── ヌメリックパッド ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2.5 w-full">
          {PAD.map((k) => {
            if (k === 'del') {
              return (
                <button
                  key="del"
                  onClick={handleDelete}
                  className="h-14 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-90 text-gray-300 transition-all flex items-center justify-center"
                  aria-label="削除"
                >
                  <Delete size={18} />
                </button>
              );
            }
            if (k === 'ok') {
              return (
                <button
                  key="ok"
                  onClick={() => handleSubmit()}
                  disabled={pin.length < PIN_LENGTH}
                  className="h-14 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-90 disabled:opacity-25 disabled:cursor-not-allowed text-white font-bold text-sm transition-all"
                  aria-label="確認"
                >
                  OK
                </button>
              );
            }
            return (
              <button
                key={k}
                onClick={() => handleKey(k)}
                className="h-14 rounded-xl bg-gray-800 hover:bg-gray-700 active:scale-90 active:bg-gray-600 text-white text-xl font-semibold transition-all select-none"
              >
                {k}
              </button>
            );
          })}
        </div>

        {/* ─── スタッフモード ───────────────────────────────────── */}
        <button
          onClick={onStaffMode}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs transition-colors py-1"
        >
          <Users size={13} />
          スタッフとして続ける
        </button>

      </div>
    </div>
  );
}
