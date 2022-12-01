// @ts-nocheck

export const addRulesets = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            {
              header: 'content-security-policy',
              operation: 'remove',
            },
            {
              header: 'x-frame-options',
              operation: 'remove',
            },
          ],
        },
        condition: {
          urlFilter: '*',
          resourceTypes: ['sub_frame'],
        },
      },
    ],
  });
};

export const removeRulesets = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
  });
};
