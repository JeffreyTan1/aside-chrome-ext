import { removeRulesets } from '../Popup/rulesetUtils';

export const PORT_NAME = 'popup';

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === PORT_NAME) {
    port.onDisconnect.addListener(function () {
      removeRulesets();
    });
  }
});
