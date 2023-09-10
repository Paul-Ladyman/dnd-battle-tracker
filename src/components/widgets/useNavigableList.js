import { useState, useEffect } from 'react';

function isHotkeyForward(e) {
  return e.keyCode === 39;
}

function isHotkeyBackward(e) {
  return e.keyCode === 37;
}

function isHotkeyHome(e) {
  return e.keyCode === 36;
}

function isHotkeyEnd(e) {
  return e.keyCode === 35;
}

export default function useNavigableList(items, parentRef) {
  const [focusedItem, setFocusedItem] = useState(null);

  const getNextItemForward = (prev) => {
    const next = prev + 1;
    if (next === items.length) return 0;
    return next;
  };

  const getNextItemBackward = (prev) => {
    const next = prev - 1;
    if (next === -1) return items.length - 1;
    return next;
  };

  const hotKeyHandler = (e) => {
    if (isHotkeyHome(e)) {
      e.preventDefault();
      setFocusedItem(0);
    }
    if (isHotkeyEnd(e)) {
      e.preventDefault();
      setFocusedItem(items.length - 1);
    }
    if (isHotkeyForward(e)) setFocusedItem(getNextItemForward);
    if (isHotkeyBackward(e)) setFocusedItem(getNextItemBackward);
  };

  useEffect(() => {
    if (parentRef.current) {
      const parent = parentRef.current;
      parent.addEventListener('keydown', hotKeyHandler);
      return () => parent.removeEventListener('keydown', hotKeyHandler);
    }
    return null;
  }, []);

  return [focusedItem, setFocusedItem];
}
