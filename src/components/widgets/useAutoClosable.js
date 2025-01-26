import { useEffect } from 'react';

export default function useAutoClosable({
  closable = true,
  wrapperId,
  onClickToClose,
  onTabToClose,
  onEscapeToClose,
  onEscapeDeps,
}) {
  useEffect(() => {
    if (closable) {
      const wrapper = document.getElementById(wrapperId);
      const clickToCloseHandler = (e) => {
        const clickOutsideWrapper = wrapper && !wrapper.contains(e.target);
        if (clickOutsideWrapper) {
          onClickToClose(e);
        }
      };
      document.addEventListener('click', clickToCloseHandler);

      return () => document.removeEventListener('click', clickToCloseHandler);
    }
    return undefined;
  }, [closable]);

  useEffect(() => {
    if (closable) {
      const wrapper = document.getElementById(wrapperId);
      const tabToCloseHandler = (e) => {
        if (e.keyCode === 9) {
          const focusOutsideComboBox = wrapper && !wrapper.contains(e.target);
          if (focusOutsideComboBox) {
            onTabToClose(e);
          }
        }
      };
      document.addEventListener('keyup', tabToCloseHandler);

      return () => document.removeEventListener('keyup', tabToCloseHandler);
    }
    return undefined;
  }, [closable]);

  useEffect(() => {
    if (closable) {
      const wrapper = document.getElementById(wrapperId);
      const escapeToCloseHandler = (e) => {
        if (e.keyCode === 27 && !e.target?.id?.includes('alertdialog')) {
          onEscapeToClose(e);
        }
      };
      wrapper.addEventListener('keydown', escapeToCloseHandler);

      return () => wrapper.removeEventListener('keydown', escapeToCloseHandler);
    }
    return undefined;
  }, [closable, ...onEscapeDeps]);
}
