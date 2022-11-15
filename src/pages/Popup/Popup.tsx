import React, { useEffect } from 'react';
import SearchIcon from './../../assets/img/search-icon.svg';
import StarIcon from './../../assets/img/star-icon.svg';
import AddStarIcon from './../../assets/img/add-star-icon.svg';
// import { getActiveTabURL } from '../../utils';
// import { ACTIONS } from '../modules/actions';
import './Popup.scss';

enum URL_PREFIX {
  HTTP = 'http://',
  HTTPS = 'https://',
}

const LOCALSTORAGE_KEY = 'persistent-valid-url';
const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

const Popup: React.FC<{}> = (props) => {
  const [currentURL, setCurrentURL] = React.useState<string>('');
  const [validURL, setValidURL] = React.useState<string>('');
  const [prefix, setPrefix] = React.useState<URL_PREFIX>(URL_PREFIX.HTTPS);

  const handleSearch = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const fullURL = `${prefix}${currentURL}`;
    if (isValidUrl(fullURL)) {
      setValidURL(fullURL);
      localStorage.setItem(LOCALSTORAGE_KEY, fullURL);
    } else {
      alert(`Invalid URL ${fullURL}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentURL(e.target.value);
  };

  useEffect(() => {
    // TODO: fix performance issue
    const persistentValidURL = localStorage.getItem(LOCALSTORAGE_KEY);
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

    if (persistentValidURL) {
      setValidURL(persistentValidURL);
      setCurrentURL(URLWithoutPrefix);
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Browser Buddy</h1>
        <div className="controls">
          <button className="glass">
            <img src={StarIcon} alt="save" />
          </button>
          <button className="glass">
            <img src={AddStarIcon} alt="add save" />
          </button>
          <div className="formControl glass">
            <span
              className={`prefix-selector ${
                prefix === URL_PREFIX.HTTP
                  ? 'red-orange-gradient-text'
                  : 'blue-green-gradient-text'
              }`}
            >
              {prefix}
            </span>
            <input
              id="url"
              type="text"
              placeholder="Enter URL"
              value={currentURL}
              onChange={handleInputChange}
            />
          </div>
          <button className="glass" onClick={handleSearch}>
            <img src={SearchIcon} alt="search" />
          </button>
        </div>
      </div>

      <div className="content">
        {validURL ? (
          <iframe title={`Browser Buddy - ${validURL}`} src={validURL} />
        ) : null}
      </div>
    </div>
  );
};

export default Popup;
