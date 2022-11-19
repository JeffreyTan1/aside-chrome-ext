import React, { useEffect, useState, FC, ChangeEvent, FormEvent } from 'react';
import { HiSearch, HiOutlineBookmark, HiOutlineBookOpen } from 'react-icons/hi';
import { TbBrowserPlus } from 'react-icons/tb';
import Input from './Input';
import LogoImage from './../../assets/img/logo.png';
import LogoText from './../../assets/img/logo-text.svg';
import BookmarksModal from './BookmarksModal';
import ReactTooltip from 'react-tooltip';
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
  // Input states
  const [inputURL, setInputURL] = useState<string>('');
  const [prefix, setPrefix] = useState<URL_PREFIX>(URL_PREFIX.HTTPS);
  const [blurInputToggleCount, setBlurInputToggleCount] = useState<number>(0);

  // Iframe states
  const [validURL, setValidURL] = useState<string>('');
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [iframeLoadCount, setIframeLoadCount] = useState<number>(0);

  // Show states
  const [showInvalidURLError, setShowInvalidURLError] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentURLBookmarked, setCurrentURLBookmarked] =
    useState<boolean>(false);

  const checkIfURLBookmarked = async (url?: string) => {
    const isBookmarked = await isURLBookmarked(url ? url : validURL);
    setCurrentURLBookmarked(isBookmarked);
  };

  const updateURLStates = (url: string) => {
    if (isValidURL(url)) {
      const { prefix, dePrefixedURL } = getURLPrefixAndDeprefixed(url);
      setPrefix(prefix);
      setInputURL(dePrefixedURL);
      setValidURL(url);
      setShowInvalidURLError(false);
    } else {
      setShowInvalidURLError(true);
    }
    checkIfURLBookmarked(url);
  };

  const handleURLPrefixChange = (prefix: URL_PREFIX) => {
    const newPrefix =
      prefix === URL_PREFIX.HTTP ? URL_PREFIX.HTTPS : URL_PREFIX.HTTP;
    setPrefix(newPrefix);
    updateURLStates(`${newPrefix}${inputURL}`);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newURL = e.target.value;

    // Check if input has http or https prefix and remove it
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
    updateURLStates(`${prefix}${inputURL}`);
    setBlurInputToggleCount(blurInputToggleCount + 1);
  };

  const handleBookmarkFromUnderlyingPage = async () => {
    const activeTab = await getActiveTab();
    const url = activeTab.url;
    if (url && isValidURL(url)) {
      updateURLStates(url);
    }
  };

  const handleToggleBookmark = async () => {
    if (currentURLBookmarked) {
      await actionOnBookmarks(validURL, 'remove');
    } else {
      await actionOnBookmarks(validURL, 'add');
    }
    checkIfURLBookmarked(validURL);
  };

  const handleBookmarkOpen = (url: string) => {
    updateURLStates(url);
    setShowModal(false);
  };

  // Get last valid URL from storage on load
  useEffect(() => {
    const getURL = async () => {
      const persistentValidURL = await getLastValidURL();
      if (!persistentValidURL) return;
      updateURLStates(persistentValidURL);
      setTimeout(() => {
        setShowIframe(true);
      }, 300);
    };

    getURL();
  }, []);

  // Check if valid URL is bookmarked
  useEffect(() => {
    if (validURL) {
      setLastValidURL(validURL);
      setIframeLoadCount((val) => val + 1);
    }
  }, [validURL]);

  // If input changes set url bookmarked to false
  useEffect(() => {
    checkIfURLBookmarked(`${prefix}${inputURL}`);
  }, [inputURL]);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <img src={LogoImage} alt="logo" className="logo-image" />
          <img src={LogoText} alt="logo text" className="logo-text" />
        </div>
        <div className="controls">
          <button
            className="glass bounce-active"
            data-tip="Load URL from current page"
            onClick={handleBookmarkFromUnderlyingPage}
          >
            <TbBrowserPlus size={20} />
          </button>

          <button
            className="glass bounce-active"
            data-tip="Open bookmarks"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <HiOutlineBookOpen size={20} />
          </button>
          <button
            className="glass bounce-active"
            data-tip="Toogle bookmark"
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
                  className={`no-border bounce-active prefix-selector-text ${
                    prefix === URL_PREFIX.HTTP
                      ? 'red-orange-gradient-text'
                      : 'purple-red-gradient-text'
                  }`}
                  data-tip="Toggle URL prefix"
                  onClick={() => handleURLPrefixChange(prefix)}
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
              title={`Aside - ${validURL}`}
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
      <ReactTooltip
        delayShow={300}
        padding={'5px 5px'}
        place="bottom"
        border
        borderColor="#5c5c5c"
      />
    </div>
  );
};

export default Popup;
