// @ts-nocheck
const RULE_ID = 1;

export const addRulesets = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: RULE_ID,
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
    removeRuleIds: [RULE_ID],
  });
};

export const removeRulesets = () => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
  });
};
