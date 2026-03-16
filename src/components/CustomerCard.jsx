import { useState } from 'react';
import { Tag, Calendar, MessageCircle, Trash2, GripVertical, UserCircle2 } from 'lucide-react';

/**
 * CustomerCard – カンバンボードの各顧客カード
 * ホバー時に削除ボタンが出現する。
 */
export default function CustomerCard({ customer, accountColor, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative bg-white dark:bg-gray-800 rounded-xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ドラッグハンドル（ホバー時に表示） */}
      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
        <GripVertical size={13} className="text-gray-400" />
      </div>

      {/* 削除ボタン（ホバー時に右上に表示） */}
      {hovered && onDelete && (
        <button
          onMouseDown={(e) => {
            e.stopPropagation();  // ドラッグを抑制
            onDelete();
          }}
          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors z-10 animate-slide-in"
          title="削除"
        >
          <Trash2 size={10} />
        </button>
      )}

      {/* 顧客名 */}
      <div className="flex items-center gap-2 mb-2 pl-3">
        <div
          className={`w-7 h-7 rounded-full bg-gradient-to-br ${accountColor} flex items-center justify-center text-xs text-white font-bold shrink-0`}
        >
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
          @{customer.name}
        </span>
      </div>

      {/* 商品 */}
      <div className="flex items-start gap-1.5 mb-2 pl-3">
        <Tag size={12} className="text-gray-400 mt-0.5 shrink-0" />
        <span className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
          {customer.product}
        </span>
      </div>

      {/* 金額・日付 */}
      <div className="flex items-center justify-between pl-3">
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          ¥{customer.amount.toLocaleString()}
        </span>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Calendar size={11} />
          <span>{customer.date.slice(5)}</span>
        </div>
      </div>

      {/* メモ */}
      {customer.note && (
        <div className="mt-2 flex items-start gap-1.5 border-t border-gray-50 dark:border-gray-700 pt-2 pl-3">
          <MessageCircle size={11} className="text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
          <span className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {customer.note}
          </span>
        </div>
      )}

      {/* 追加者 */}
      {customer.createdBy && (
        <div className="mt-1.5 flex items-center gap-1 pl-3">
          <UserCircle2 size={10} className="text-gray-300 dark:text-gray-600 shrink-0" />
          <span className="text-[10px] text-gray-300 dark:text-gray-600">{customer.createdBy}</span>
        </div>
      )}
    </div>
  );
}
