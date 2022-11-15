import React, { useEffect } from 'react';
import SearchIcon from './../../assets/img/search-icon.svg';
import CloseIcon from './../../assets/img/close-icon.svg';
import StarIcon from './../../assets/img/star-icon.svg';
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
  const [inputURL, setInputURL] = React.useState<string>('');
  const [validURL, setValidURL] = React.useState<string>('');
  const [showIframe, setShowIframe] = React.useState<boolean>(false);
  const [iframeLoadCount, setIframeLoadCount] = React.useState<number>(0);
  const [prefix, setPrefix] = React.useState<URL_PREFIX>(URL_PREFIX.HTTPS);
  const [showInvalidURLError, setShowInvalidURLError] =
    React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // unfocus input field with id "url"
    document.getElementById('url')?.blur();

    const fullURL = `${prefix}${inputURL}`;
    if (isValidUrl(fullURL)) {
      setValidURL(fullURL);
      setShowInvalidURLError(false);
      setIframeLoadCount((val) => val + 1);

      chrome.storage.sync.set({
        [CONSTANTS.LOCALSTORAGE_KEY]: fullURL,
      });
    } else {
      setShowInvalidURLError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputURL(e.target.value);
  };

  const handleClear = () => {
    setInputURL('');
    document.getElementById('url')?.focus();
  };

  const handlePrefixChange = () => {
    setPrefix(prefix === URL_PREFIX.HTTP ? URL_PREFIX.HTTPS : URL_PREFIX.HTTP);
  };

  useEffect(() => {
    // TODO: fix performance issue
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
      setValidURL(persistentValidURL);
      setInputURL(URLWithoutPrefix);
    };

    // Delay iframe rendering to prevent performance issues
    setTimeout(() => {
      setShowIframe(true);
    }, 10);

    getURL();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Browser Buddy</h1>
        <div className="controls">
          <form onSubmit={handleSubmit}>
            <div className="formControl glass">
              <button
                type="button"
                className={`no-border prefix-selector  ${
                  prefix === URL_PREFIX.HTTP
                    ? 'red-orange-gradient-text'
                    : 'blue-green-gradient-text'
                }`}
                onClick={handlePrefixChange}
              >
                {prefix}
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
            <img width={16} height={16} src={StarIcon} alt="save" />
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
