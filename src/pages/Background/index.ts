// @ts-nocheck

// remove the following headers from the request
// 'content-security-policy'
// 'x-frame-options'

// chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [
//     {
//       id: 1,
//       priority: 1,
//       action: {
//         type: 'modifyHeaders',
//         requestHeaders: [
//           {
//             header: 'Content-Security-Policy',
//             operation: 'remove',
//           },
//           {
//             header: 'X-Frame-Options',
//             operation: 'remove',
//           },
//         ],
//       },
//     },
//   ],
//   removeRuleIds: [1],
// });
console.log('BACKGROUND SCRIPT');
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (o) {
  console.log('rule matched:', o);
});
