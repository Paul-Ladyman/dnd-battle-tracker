import React, { useState, useRef, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import Input from './Input';
import DropdownOption from './DropdownOption';
import ComboboxLabel from './ComboboxLabel';
import { hotkeys } from '../../hotkeys/hotkeys';

export default function ComboboxList({
  value,
  setValue,
  list,
  id,
  dropdownId,
  dropdownLabel,
  inputAriaLabel,
  inputAriaLabelItemSelected,
  listAriaLabel,
  rightControls,
  rightControlsItemSelected,
  leftControls,
  leftControlsItemSelected,
  handleSubmit,
  handleRemoveItem,
}) {
  const [expanded, setExpanded] = useState(false);
  const [focusedItem, setFocusedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const inputRef = useRef();

  const hasList = list.length > 0;
  const activeNoteId = focusedItem !== null ? `${dropdownId}-${focusedItem}` : '';
  const showList = hasList && expanded;
  const className = 'creature-toolbar--notes';
  const classModifier = 'creature-toolbar--notes__open';
  const customClasses = showList ? `${className} ${classModifier}` : className;
  const dropdownClassName = 'creature-toolbar--notes-dropdown';
  const display = showList ? 'block' : 'none';

  const rControls = selectedItem ? rightControlsItemSelected : rightControls;
  const lControls = selectedItem ? leftControlsItemSelected : leftControls;
  const ariaLabel = selectedItem ? inputAriaLabelItemSelected : inputAriaLabel;

  const moveFocus = (e, down = true) => {
    if (value !== '' && !expanded) return null;

    e.preventDefault();

    const noItemFocused = focusedItem === null;
    const start = 0;
    const end = list.length - 1;
    const endBound = down ? end : start;
    const startBound = down ? start : end;
    const endItemFocused = focusedItem === endBound;

    if (!expanded) setExpanded(true);

    if (noItemFocused || endItemFocused) return setFocusedItem(startBound);

    const focusIncrement = down ? 1 : -1;
    return setFocusedItem((currentlyFocusedItem) => currentlyFocusedItem + focusIncrement);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
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
    resetForm();
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
    inputRef.current.focus();
  };

  const handleKeyboardSubmit = () => {
    if (focusedItem !== null) {
      handleItemSubmit(list[focusedItem]);
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

  const formHandler = (e) => {
    if (list.length > 0) {
      if (isHotkey(hotkeys.dropdownNavDown, e)) moveFocus(e);
      if (isHotkey(hotkeys.dropdownNavUp, e)) moveFocus(e, false);
      if (isHotkey(hotkeys.dropdownNavOpen, e)) setExpanded(true);
    }

    if (isHotkey(hotkeys.dropdownEscape, e)) handleEscape();

    if (isHotkey('enter', e)) {
      e.preventDefault();
      handleKeyboardSubmit();
    }

    if (isHotkey(hotkeys.removeNote, e) || isHotkey(hotkeys.removeNoteAlt, e)) {
      handleRemoveItemHotkey(e);
    }
  };

  useEffect(() => {
    if (expanded) {
      const clickHandler = (e) => {
        const comboBox = document.getElementById(id);
        const clickInComboBox = comboBox && comboBox.contains(e.target);
        if (expanded && !clickInComboBox) {
          setExpanded(false);
        }
      };
      document.addEventListener('click', clickHandler);

      return () => document.removeEventListener('click', clickHandler);
    }
    return undefined;
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      const comboBox = document.getElementById(id);
      const focusHandler = (e) => {
        const focusOutsideComboBox = e.relatedTarget !== null
          && comboBox
          && !comboBox.contains(e.relatedTarget);
        if (expanded && focusOutsideComboBox) {
          setExpanded(false);
        }
      };
      comboBox.addEventListener('focusout', focusHandler);

      return () => comboBox.removeEventListener('focusout', focusHandler);
    }
    return undefined;
  }, [expanded]);

  return (
    <div
      className="input--form creature-toolbar--notes-wrapper"
      id={id}
    >
      <Input
        ariaLabel={ariaLabel}
        ariaAutoComplete="list"
        ariaExpanded={expanded}
        ariaControls={dropdownId}
        ariaActiveDescendant={activeNoteId}
        role="combobox"
        label={ComboboxLabel(showList, listAriaLabel, dropdownId, toggleExpanded)}
        rightControls={rControls}
        leftControls={lControls}
        inputId={`combobox-${id}`}
        customClasses={customClasses}
        onClick={toggleExpanded}
        inputRef={inputRef}
        value={value}
        handleChange={handleChange}
        submitHandler={submitHandler}
        formHandler={formHandler}
      />
      <ul className={dropdownClassName} style={{ display }} id={dropdownId} role="listbox" aria-label={listAriaLabel}>
        {
          list.map((item, i) => {
            const selected = focusedItem === i;
            const itemClass = 'creature-toolbar--notes-dropdown-item';
            const itemModifier = selected ? ` ${itemClass}__focused` : '';
            const itemClassName = `${itemClass}${itemModifier}`;
            const htmlId = `combobox-dropdown-${id}-${item.id}`;
            return (
              <div className="creature-toolbar--notes-dropdown-group" key={htmlId}>
                <DropdownOption
                  className={itemClassName}
                  onClick={() => handleItemSubmit(item)}
                  selected={selected}
                  id={htmlId}
                  ariaLabel={`${dropdownLabel} ${item.text}`}
                  title={dropdownLabel}
                  text={item.text}
                />
              </div>
            );
          })
        }
      </ul>
    </div>
  );
}
