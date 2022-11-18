import React, { FC, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
interface Props {
  setShowModal: (showModal: boolean) => void;
}

const BookmarksModal: FC<Props> = (props) => {
  const { setShowModal } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const darkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, setShowModal]);

  return (
    <div className="modal">
      <div
        ref={containerRef}
        className={`modal-panel ${darkMode ? 'glass-dark' : 'glass-light'}`}
      >
        <div className="modal-header">
          <h1>Bookmarks</h1>
          <button
            className="btn dark bounce-active"
            onClick={() => setShowModal(false)}
          >
            <HiX size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarksModal;
