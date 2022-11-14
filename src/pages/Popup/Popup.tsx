import React, { useEffect } from 'react';
import SearchIcon from './../../assets/img/search-icon.svg';
// import { getActiveTabURL } from '../../utils';
// import { ACTIONS } from '../modules/actions';
import './Popup.css';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidUrl(currentURL)) {
      setValidURL(currentURL);
      localStorage.setItem(LOCALSTORAGE_KEY, currentURL);
    } else {
      alert('Invalid URL');
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
            <label htmlFor="url">URL</label>
            <input
              id="url"
              type="text"
              placeholder="https://youtube.com"
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
