// ENUMS and constants
export enum URL_PREFIX {
  HTTP = 'http://',
  HTTPS = 'https://',
}

export enum CONSTANTS {
  LAST_VALID_URL_KEY = 'persistent-valid-url',
  VALID_URL_BOOKMARKS_KEY = 'valid-url-bookmarks',
  IFRAME_ID = 'browser-buddy-iframe',
}

// Helper functions
export const isValidURL = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const getURLPrefixAndDeprefixed = (url: string) => {
  const prefix = url.startsWith(URL_PREFIX.HTTP)
    ? URL_PREFIX.HTTP
    : URL_PREFIX.HTTPS;
  const dePrefixedURL = url.replace(prefix, '');
  return { prefix, dePrefixedURL };
};

// Chrome storage functions
export const setLastValidURL = async (url: string) => {
  await chrome.storage.sync.set({ [CONSTANTS.LAST_VALID_URL_KEY]: url });
};

export const getLastValidURL = async () => {
  const url = await chrome.storage.sync.get(CONSTANTS.LAST_VALID_URL_KEY);
  return url[CONSTANTS.LAST_VALID_URL_KEY];
};

export const isURLBookmarked = async (url: string) => {
  const data = await chrome.storage.sync.get(CONSTANTS.VALID_URL_BOOKMARKS_KEY);
  const bookmarks = data[CONSTANTS.VALID_URL_BOOKMARKS_KEY];
  return bookmarks && bookmarks.includes(url);
};

export const actionOnBookmarks = async (
  validURL: string,
  action: 'add' | 'remove'
) => {
  if (!validURL) {
    return;
  }
  // get the current bookmarks

  const data = await chrome.storage.sync.get(CONSTANTS.VALID_URL_BOOKMARKS_KEY);
  // check if the current url is already bookmarked
  const bookmarks = data[CONSTANTS.VALID_URL_BOOKMARKS_KEY] || [];

  if (action === 'add') {
    const isAlreadyBookmarked = bookmarks.some(
      (bookmark: string) => bookmark === validURL
    );
    if (isAlreadyBookmarked) return;

    // add the current url to the bookmarks
    bookmarks.push(validURL);
  } else {
    // remove the current url from the bookmarks
    const index = bookmarks.indexOf(validURL);
    if (index > -1) {
      bookmarks.splice(index, 1);
    }
  }
  // save the bookmarks
  await chrome.storage.sync.set({
    [CONSTANTS.VALID_URL_BOOKMARKS_KEY]: bookmarks,
  });
};

export const getAllBookmarks = async () => {
  const data = await chrome.storage.sync.get(CONSTANTS.VALID_URL_BOOKMARKS_KEY);
  return data[CONSTANTS.VALID_URL_BOOKMARKS_KEY];
};

// Chrome tabs functions
export const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
};
