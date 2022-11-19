import React, { useEffect, useState, FC, ChangeEvent, FormEvent } from 'react';
import { HiSearch, HiOutlineBookmark, HiOutlineBookOpen } from 'react-icons/hi';
import { TbBrowserPlus } from 'react-icons/tb';
import Input from './Input';
import Logo from './Logo';
import BookmarksModal from './BookmarksModal';
import {
  CONSTANTS,
  URL_PREFIX,
  isValidURL,
  getURLPrefixAndDeprefixed,
  setLastValidURL,
  getLastValidURL,
  isURLBookmarked,
  actionOnBookmarks,
  getActiveTab,
} from './utils';
// import { ACTIONS } from '../modules/actions';

const Popup: FC<{}> = (props) => {
  const [inputURL, setInputURL] = useState<string>('');
  const [validURL, setValidURL] = useState<string>('');
  const [prefix, setPrefix] = useState<URL_PREFIX>(URL_PREFIX.HTTPS);
  const [showInvalidURLError, setShowInvalidURLError] =
    useState<boolean>(false);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [iframeLoadCount, setIframeLoadCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentURLBookmarked, setCurrentURLBookmarked] =
    useState<boolean>(false);

  const [blurInputToggleCount, setBlurInputToggleCount] = useState<number>(0);

  const checkIfURLBookmarked = async () => {
    const isBookmarked = await isURLBookmarked(validURL);
    setCurrentURLBookmarked(isBookmarked);
  };

  const updateNewURL = (prefix: URL_PREFIX) => {
    setBlurInputToggleCount((prev) => prev + 1);
    const trimmedURL = inputURL.trim();
    const fullURL = `${prefix}${trimmedURL}`;
    if (isValidURL(fullURL)) {
      setValidURL(fullURL);
      setShowInvalidURLError(false);
      setIframeLoadCount((val) => val + 1);
      setInputURL(trimmedURL);
      setLastValidURL(fullURL);
    } else {
      setShowInvalidURLError(true);
    }
  };

  const handlePrefixChange = () => {
    const newPrefix =
      prefix === URL_PREFIX.HTTP ? URL_PREFIX.HTTPS : URL_PREFIX.HTTP;
    setPrefix(newPrefix);
    updateNewURL(newPrefix);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newURL = e.target.value;
    const startsWithHTTP = newURL.startsWith(URL_PREFIX.HTTP);
    const startsWithHTTPS = newURL.startsWith(URL_PREFIX.HTTPS);

    if (startsWithHTTP || startsWithHTTPS) {
      const newPrefix = startsWithHTTP ? URL_PREFIX.HTTP : URL_PREFIX.HTTPS;
      setPrefix(newPrefix);
      setInputURL(newURL.replace(newPrefix, ''));
    } else {
      setInputURL(newURL);
    }
  };

  const handleSearchSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateNewURL(prefix);
    checkIfURLBookmarked();
  };

  const handleBookmarkFromUnderlyingPage = async () => {
    const activeTab = await getActiveTab();
    const url = activeTab.url;
    if (url && isValidURL(url)) {
      const { prefix, dePrefixedURL } = getURLPrefixAndDeprefixed(url);
      setPrefix(prefix);
      setInputURL(dePrefixedURL);
      setValidURL(url);
      setLastValidURL(url);
      setIframeLoadCount((val) => val + 1);
    }
  };

  const handleToggleBookmark = async () => {
    if (currentURLBookmarked) {
      await actionOnBookmarks(validURL, 'remove');
    } else {
      await actionOnBookmarks(validURL, 'add');
    }
  };

  const handleBookmarkOpen = (url: string) => {
    const prefixUrlStartsWith = url.startsWith(URL_PREFIX.HTTP)
      ? URL_PREFIX.HTTP
      : URL_PREFIX.HTTPS;
    const dePrefixedURL = url.replace(prefixUrlStartsWith, '');
    setPrefix(prefixUrlStartsWith);
    setInputURL(dePrefixedURL);
    setValidURL(url);
    setLastValidURL(url);
    setShowModal(false);
    setIframeLoadCount((val) => val + 1);
    checkIfURLBookmarked();
  };

  // Get last valid URL from storage on load
  useEffect(() => {
    const getURL = async () => {
      const persistentValidURL = await getLastValidURL();
      if (!persistentValidURL) return;
      const { prefix, dePrefixedURL } =
        getURLPrefixAndDeprefixed(persistentValidURL);
      setValidURL(persistentValidURL);
      setPrefix(prefix);
      setInputURL(dePrefixedURL);
      setShowIframe(true);
    };

    getURL();
  }, []);

  // Check if valid URL is bookmarked
  useEffect(() => {
    if (validURL) {
      checkIfURLBookmarked();
    }
  }, [validURL]);

  // If input changes set url bookmarked to false
  useEffect(() => {
    setCurrentURLBookmarked(false);
  }, [inputURL]);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <Logo />
        </div>
        <div className="controls">
          <button
            className="glass bounce-active"
            onClick={handleBookmarkFromUnderlyingPage}
          >
            <TbBrowserPlus size={20} />
          </button>

          <button
            className="glass bounce-active"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <HiOutlineBookOpen size={20} />
          </button>
          <button
            className="glass bounce-active"
            onClick={handleToggleBookmark}
          >
            <HiOutlineBookmark
              size={20}
              fill={currentURLBookmarked ? '#ffaa00' : '#00000000'}
            />
          </button>

          <form onSubmit={handleSearchSubmit}>
            <div className="formControl glass">
              <div className="prefix-selector-container">
                <button
                  type="button"
                  onClick={handlePrefixChange}
                  className={`no-border bounce-active prefix-selector-text ${
                    prefix === URL_PREFIX.HTTP
                      ? 'red-orange-gradient-text'
                      : 'purple-red-gradient-text'
                  }`}
                >
                  {prefix}
                </button>
              </div>
              <Input
                blurToggleCount={blurInputToggleCount}
                value={inputURL}
                setValue={setInputURL}
                onChange={handleInputChange}
                placeholder="Enter URL"
              />
              <button className="search-btn btn" type="submit">
                <HiSearch size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="content">
        {showInvalidURLError ? (
          <div className="placeholder">
            <p>Invalid URL entered. Please enter a valid URL and try again.</p>
          </div>
        ) : (
          showIframe && (
            <iframe
              id={CONSTANTS.IFRAME_ID}
              key={iframeLoadCount}
              title={`Smol - ${validURL}`}
              src={validURL}
              loading="lazy"
            />
          )
        )}
        {showModal && (
          <BookmarksModal
            setShowModal={setShowModal}
            refreshBookmarks={checkIfURLBookmarked}
            handleBookmarkOpen={handleBookmarkOpen}
          />
        )}
      </div>
    </div>
  );
};

export default Popup;

// import StarIcon from './../../assets/img/star-icon.svg';
// import SettingsIcon from './../../assets/img/settings-icon.svg';
// <button className="glass">
//   <img src={SettingsIcon} alt="settings" />
// </button>
// <button className="glass">
//   <img src={StarIcon} alt="save" />
// </button>
