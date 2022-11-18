import React, { FC } from 'react';
import { HiX } from 'react-icons/hi';
interface Props {
  setShowModal: (showModal: boolean) => void;
}

const BookmarksModal: FC<Props> = (props) => {
  const darkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div className="modal">
      <div className={`modal-panel ${darkMode ? 'glass-dark' : 'glass-light'}`}>
        <div className="modal-header">
          <h1>Bookmarks</h1>
          <HiX size={20} />
        </div>
      </div>
    </div>
  );
};

export default BookmarksModal;
