import React, { useEffect, useState } from 'react';
import SearchIcon from './../../assets/img/search-icon.svg';
import CloseIcon from './../../assets/img/close-icon.svg';
import HeartIcon from './../../assets/img/heart-icon.svg';
// import { getActiveTabURL } from '../../utils';
// import { ACTIONS } from '../modules/actions';
import './Popup.scss';

enum URL_PREFIX {
  HTTP = 'http://',
  HTTPS = 'https://',
}

enum CONSTANTS {
  LOCALSTORAGE_KEY = 'persistent-valid-url',
  IFRAME_ID = 'browser-buddy-iframe',
}

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

const Popup: React.FC<{}> = (props) => {
  const [inputURL, setInputURL] = useState<string>('');
  const [validURL, setValidURL] = useState<string>('');
  const [prefix, setPrefix] = useState<URL_PREFIX>(URL_PREFIX.HTTPS);
  const [showInvalidURLError, setShowInvalidURLError] =
    useState<boolean>(false);
  const [showIframe, setShowIframe] = useState<boolean>(false);
  const [iframeLoadCount, setIframeLoadCount] = useState<number>(0);

  const updateNewURL = (prefix: URL_PREFIX) => {
    // unfocus input field with id "url"
    document.getElementById('url')?.blur();
    const trimmedURL = inputURL.trim();
    const fullURL = `${prefix}${trimmedURL}`;
    if (isValidUrl(fullURL)) {
      setValidURL(fullURL);
      setShowInvalidURLError(false);
      setIframeLoadCount((val) => val + 1);
      setInputURL(trimmedURL);

      chrome.storage.sync.set({
        [CONSTANTS.LOCALSTORAGE_KEY]: fullURL,
      });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value);
  };

  const handleClear = () => {
    setInputURL('');
  };

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateNewURL(prefix);
  };

  useEffect(() => {
    const getURL = async () => {
      const persistentValidURL = await new Promise<string>((resolve) => {
        chrome.storage.sync.get([CONSTANTS.LOCALSTORAGE_KEY], (result) => {
          resolve(result[CONSTANTS.LOCALSTORAGE_KEY]);
        });
      });

      if (!persistentValidURL) return;

      // parse prefix booleans
      const HTTPPrefix = persistentValidURL.startsWith(URL_PREFIX.HTTP);
      const HTTPSPrefix = persistentValidURL.startsWith(URL_PREFIX.HTTPS);
      setPrefix(HTTPPrefix ? URL_PREFIX.HTTP : URL_PREFIX.HTTPS);

      if (!HTTPPrefix && !HTTPSPrefix) return;

      const URLWithoutPrefix = persistentValidURL.replace(
        HTTPPrefix ? URL_PREFIX.HTTP : URL_PREFIX.HTTPS,
        ''
      );
      setPrefix(HTTPPrefix ? URL_PREFIX.HTTP : URL_PREFIX.HTTPS);
      setValidURL(persistentValidURL);
      setInputURL(URLWithoutPrefix);
    };

    // Delay iframe rendering to prevent performance issues
    setTimeout(() => {
      setShowIframe(true);
    }, 100);

    getURL();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="logo-container">
          <h1>Browser Buddy</h1>
        </div>
        <div className="controls">
          <form onSubmit={handleSearchSubmit}>
            <div className="formControl glass">
              <button
                type="button"
                className="no-border prefix-selector-container"
                onClick={handlePrefixChange}
              >
                <span
                  className={`bounce-active prefix-selector-text ${
                    prefix === URL_PREFIX.HTTP
                      ? 'red-orange-gradient-text'
                      : 'blue-green-gradient-text'
                  }`}
                >
                  {prefix}
                </span>
              </button>
              <input
                id="url"
                type="text"
                placeholder="Enter URL"
                value={inputURL}
                onChange={handleInputChange}
              />
              {inputURL && (
                <button
                  className="clear-btn transparent no-border"
                  onClick={handleClear}
                  type="button"
                >
                  <img width={13} height={13} src={CloseIcon} alt="Clear" />
                </button>
              )}

              <button
                className="search-btn transparent no-border"
                type="submit"
              >
                <img width={20} height={20} src={SearchIcon} alt="search" />
              </button>
            </div>
          </form>
          <button className="glass">
            <img width={18} height={18} src={HeartIcon} alt="save" />
          </button>
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
              title={`Browser Buddy - ${validURL}`}
              src={validURL}
              loading="lazy"
            />
          )
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
