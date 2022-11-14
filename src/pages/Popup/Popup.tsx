import React, { useEffect } from 'react';
import SearchIcon from './../../assets/img/search-icon.svg';
// import { getActiveTabURL } from '../../utils';
// import { ACTIONS } from '../modules/actions';
import './Popup.css';

enum URL_PREFIX {
  HTTP = 'http://',
  HTTPS = 'https://',
}

const LOCALSTORAGE_KEY = 'persistent-valid-url';
const isValidUrl = (urlString: string) => {
  console.log('urlString', urlString);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullURL = `${prefix}${currentURL}`;
    if (isValidUrl(fullURL)) {
      console.log('valid url');
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
    const persistentValidURL = localStorage.getItem(LOCALSTORAGE_KEY);
    if (persistentValidURL) {
      setValidURL(persistentValidURL);
      setCurrentURL(persistentValidURL);
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Browser Buddy</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="formControl">
            <span className="prefix-selector">{prefix}</span>
            <input
              id="url"
              type="text"
              placeholder="youtube.com"
              value={currentURL}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">
            <img src={SearchIcon} alt="search" />
          </button>
        </form>
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
