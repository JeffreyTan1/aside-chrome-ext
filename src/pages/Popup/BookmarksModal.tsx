import React, { FC, useEffect, useRef } from 'react';
import { HiX, HiTrash } from 'react-icons/hi';
import { getAllBookmarks, actionOnBookmarks } from './utils';
interface Props {
  setShowModal: (showModal: boolean) => void;
  refreshBookmarks: () => void;
}

const BookmarksModal: FC<Props> = (props) => {
  const { setShowModal, refreshBookmarks } = props;

  const darkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const containerRef = useRef<HTMLDivElement>(null);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);

  const onBookmarkDelete = (url: string) => {
    actionOnBookmarks(url, 'remove');
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

        <ul className="bookmark-list">
          {bookmarks.map((bookmark) => (
            <li className="bookmark-item" key={bookmark}>
              {bookmark}
              <button
                className={`btn bounce-active ${darkMode ? 'dark' : ''}`}
                onClick={() => onBookmarkDelete(bookmark)}
              >
                <HiTrash size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookmarksModal;
