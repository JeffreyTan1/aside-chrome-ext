import React, { FC, useEffect, useState, useRef } from 'react';
import { HiX, HiCheck, HiTrash } from 'react-icons/hi';
import { getAllBookmarks, actionOnBookmarks, URL_PREFIX } from './utils';
interface Props {
  setShowModal: (showModal: boolean) => void;
  refreshBookmarks: () => void;
  handleBookmarkOpen: (url: string) => void;
}

const BookmarksModal: FC<Props> = (props) => {
  const { setShowModal, refreshBookmarks, handleBookmarkOpen } = props;

  const darkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const containerRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);

  const onBookmarkDelete = async (url: string) => {
    await actionOnBookmarks(url, 'remove');
    setBookmarks(bookmarks.filter((bookmark) => bookmark !== url));
    refreshBookmarks();
  };

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

  useEffect(() => {
    const getBookmarks = async () => {
      const bookmarks = await getAllBookmarks();
      setBookmarks(bookmarks);
    };
    getBookmarks();
  }, []);

  return (
    <div className="modal">
      <div
        ref={containerRef}
        className={`modal-panel ${darkMode ? 'glass-dark' : 'glass-light'}`}
      >
        <div className="modal-header">
          <h1>Bookmarks</h1>
          <button
            className={`btn bounce-active ${darkMode ? 'dark' : ''}`}
            onClick={() => setShowModal(false)}
          >
            <HiX size={20} />
          </button>
        </div>

        {bookmarks?.length > 0 ? (
          <ul className="bookmark-list">
            {bookmarks.map((bookmark) => (
              <li className="bookmark-item" key={bookmark}>
                <button
                  className={`grow-btn bounce-active bookmark-btn ${
                    darkMode ? 'dark' : ''
                  }`}
                  onClick={() => handleBookmarkOpen(bookmark)}
                >
                  {bookmark}
                </button>
                <SafeDeleteButton
                  url={bookmark}
                  darkMode={darkMode}
                  onBookmarkDelete={onBookmarkDelete}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-bookmarks">
            <p>No bookmarks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksModal;

interface SafeDeleteButtonProps {
  url: string;
  darkMode: boolean;
  onBookmarkDelete: (url: string) => void;
}

const SafeDeleteButton: FC<SafeDeleteButtonProps> = (props) => {
  const { url, darkMode, onBookmarkDelete } = props;
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const buttonStyle = `btn bounce-active ${darkMode ? 'dark' : ''}`;
  return (
    <div className="bookmark-actions">
      {isConfirming ? (
        <div className="confirmation-btn-group">
          <small>Delete?</small>
          <button className={buttonStyle} onClick={() => onBookmarkDelete(url)}>
            <HiCheck size={20} />
            <small>Confirm</small>
          </button>
          <button
            className={buttonStyle}
            onClick={() => setIsConfirming(false)}
          >
            <HiX size={20} />
            <small>Cancel</small>
          </button>
        </div>
      ) : (
        <button className={buttonStyle} onClick={() => setIsConfirming(true)}>
          <HiTrash size={20} />
        </button>
      )}
    </div>
  );
};
