import { useState } from 'react';

/**
 * localStorageと同期するuseStateフック。
 * 初回はlocalStorageから値を読み込み、なければinitialValueを使用。
 * setValueを呼ぶと同時にlocalStorageにも書き込む。
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (newValue) => {
    try {
      // 関数形式の更新（prev => ...）にも対応
      const valueToStore =
        typeof newValue === 'function' ? newValue(storedValue) : newValue;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error('[useLocalStorage] 保存エラー:', e);
    }
  };

  return [storedValue, setValue];
}
