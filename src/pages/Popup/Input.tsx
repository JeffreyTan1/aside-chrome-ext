import React, { useRef, useEffect, useState, FC, ChangeEvent } from 'react';
import CloseIcon from './../../assets/img/close-icon.svg';

interface Props {
  value: string;
  setValue: (value: string) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  blurToggleCount: number;
  placeholder?: string;
}

const Input: FC<Props> = (props) => {
  const { value, setValue, onChange, blurToggleCount, placeholder } = props;

  // listen to focus changes and focus the input
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showClear, setShowClear] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.blur();
      setShowClear(false);
    }
  }, [blurToggleCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowClear(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  const handleClear = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setShowClear(true);
  };

  return (
    <div ref={containerRef}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={handleFocus}
        ref={inputRef}
      />
      {value && showClear && (
        <button
          className="clear-btn transparent no-border"
          onClick={handleClear}
          type="button"
        >
          <img width={13} height={13} src={CloseIcon} alt="Clear" />
        </button>
      )}
    </div>
  );
};

export default Input;
