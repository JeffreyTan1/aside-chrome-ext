export enum URL_PREFIX {
  HTTP = 'http://',
  HTTPS = 'https://',
}

export enum CONSTANTS {
  LAST_VALID_URL_KEY = 'persistent-valid-url',
  VALID_URL_BOOKMARKS_KEY = 'valid-url-bookmarks',
  IFRAME_ID = 'browser-buddy-iframe',
}

export const isValidURL = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const setLastValidURL = (url: string) => {
  chrome.storage.sync.set({
    [CONSTANTS.LAST_VALID_URL_KEY]: url,
  });
};
export const isURLBookmarked = async (url: string) => {
  const data = await chrome.storage.sync.get(CONSTANTS.VALID_URL_BOOKMARKS_KEY);
  const bookmarks = data[CONSTANTS.VALID_URL_BOOKMARKS_KEY];
  return bookmarks && bookmarks.includes(url);
};

export const actionOnBookmarks = async (
  validURL: string,
  action: 'add' | 'remove',
  callback: Function = () => {}
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

  callback();
};

export const getAllBookmarks = async () => {
  const data = await chrome.storage.sync.get(CONSTANTS.VALID_URL_BOOKMARKS_KEY);
  return data[CONSTANTS.VALID_URL_BOOKMARKS_KEY];
};
