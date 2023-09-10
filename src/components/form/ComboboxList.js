import React, { useState, useRef } from 'react';
import isHotkey from 'is-hotkey';
import Input from './Input';
import DropdownOption from './DropdownOption';
import ComboboxLabel from './ComboboxLabel';
import { hotkeys } from '../../hotkeys/hotkeys';
import useNavigableList from '../widgets/useNavigableList';
import useAutoClosable from '../widgets/useAutoClosable';

export default function ComboboxList({
  value,
  setValue,
  list,
  id,
  dropdownId,
  dropdownLabel,
  label,
  inputAriaLabel,
  inputAriaLabelItemSelected,
  listAriaLabel,
  rightControls,
  rightControlsItemSelected,
  leftControls,
  leftControlsItemSelected,
  handleSubmit,
  onItemSubmit,
  formHandler,
  handleRemoveItem,
  inputRef,
  error,
  customClasses,
  spellCheck,
  resetOnSubmit = true,
}) {
  const internalInputRef = inputRef || useRef();
  const [expanded, setExpanded] = useState(false);
  const [focusedItem, setFocusedItem] = useNavigableList({
    items: list,
    parentRef: internalInputRef,
    onNavigate: () => !expanded && setExpanded(true),
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const hasList = list.length > 0;
  const activeNoteId = focusedItem !== null ? `${dropdownId}-${focusedItem}` : '';
  const showList = hasList && expanded;
  const className = 'combobox';
  const classModifier = 'combobox__open';
  const inputCustomClasses = showList ? `${className} ${classModifier}` : className;
  const dropdownClassName = 'combobox-dropdown';
  const display = showList ? 'block' : 'none';

  const rControls = selectedItem ? rightControlsItemSelected : rightControls;
  const lControls = selectedItem ? leftControlsItemSelected : leftControls;
  const ariaLabel = selectedItem ? inputAriaLabelItemSelected : inputAriaLabel;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const close = () => {
    setExpanded(false);
  };

  const handleChange = (event) => {
    if (!expanded) setExpanded(true);
    if (focusedItem !== null) setFocusedItem(null);
    setValue(event.target.value);
  };

  const resetForm = () => {
    setValue('');
    setExpanded(false);
    setFocusedItem(null);
    setSelectedItem(null);
  };

  const submitHandler = (leftSubmit) => {
    if (resetOnSubmit) resetForm();
    handleSubmit(leftSubmit, selectedItem);
  };

  const handleEscape = () => {
    if (showList) {
      setExpanded(false);
      setFocusedItem(null);
    } else {
      resetForm();
    }
  };

  const handleItemSubmit = (item) => {
    setSelectedItem(item);
    setFocusedItem(null);
    setExpanded(false);
    setValue(item.text);
    if (onItemSubmit) {
      onItemSubmit(item);
    }
    internalInputRef.current.focus();
  };

  const handleKeyboardSubmit = () => {
    if (focusedItem !== null) {
      handleItemSubmit(list[focusedItem]);
    } else if (formHandler) {
      if (resetOnSubmit) resetForm();
      formHandler(null, selectedItem);
    } else {
      submitHandler();
    }
  };

  const handleRemoveItemHotkey = (e) => {
    if (handleRemoveItem && focusedItem !== null) {
      e.preventDefault();
      handleRemoveItem(list[focusedItem]);
      const newLength = list.length - 1;
      if (focusedItem === newLength) setFocusedItem(newLength - 1);
      if (newLength === 0) resetForm();
    }
  };

  const comboBoxFormHandler = (e) => {
    if (list.length > 0) {
      if (isHotkey(hotkeys.dropdownNavOpen, e)) setExpanded(true);
    }

    if (isHotkey('enter', e)) {
      e.preventDefault();
      handleKeyboardSubmit();
    }

    if (isHotkey(hotkeys.removeNote, e) || isHotkey(hotkeys.removeNoteAlt, e)) {
      handleRemoveItemHotkey(e);
    }
  };

  useAutoClosable({
    wrapperId: id,
    onClickToClose: close,
    onTabToClose: close,
    onEscapeToClose: handleEscape,
    onEscapeDeps: [showList],
  });

  return (
    <div
      className={`input--form combobox-wrapper ${customClasses}`}
      id={id}
    >
      <Input
        ariaLabel={ariaLabel}
        ariaAutoComplete="list"
        ariaExpanded={expanded}
        ariaControls={dropdownId}
        ariaActiveDescendant={activeNoteId}
        role="combobox"
        label={ComboboxLabel(showList, label, listAriaLabel, dropdownId, toggleExpanded)}
        rightControls={rControls}
        leftControls={lControls}
        inputId={`combobox-${id}`}
        customClasses={inputCustomClasses}
        onClick={toggleExpanded}
        inputRef={internalInputRef}
        value={value}
        handleChange={handleChange}
        submitHandler={submitHandler}
        formHandler={comboBoxFormHandler}
        error={error}
        spellCheck={spellCheck}
      />
      <ul className={dropdownClassName} style={{ display }} id={dropdownId} role="listbox" aria-label={listAriaLabel}>
        {
          list.map((item, i) => {
            const selected = focusedItem === i;
            const itemClass = 'combobox-dropdown-item';
            const itemModifier = selected ? ` ${itemClass}__focused` : '';
            const itemClassName = `${itemClass}${itemModifier}`;
            const { id: itemId, text, title } = item;
            const htmlId = `combobox-dropdown-${id}-${itemId}`;
            const itemLabel = title || dropdownLabel;
            return (
              <div className="combobox-dropdown-group" key={htmlId}>
                <DropdownOption
                  className={itemClassName}
                  onClick={() => handleItemSubmit(item)}
                  selected={selected}
                  id={htmlId}
                  ariaLabel={itemLabel}
                  title={itemLabel}
                  text={text}
                />
              </div>
            );
          })
        }
      </ul>
    </div>
  );
}
