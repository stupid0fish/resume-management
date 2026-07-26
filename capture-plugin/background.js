// 监听标签页地址更新
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // 页面加载完成才执行
    if (changeInfo.status !== "complete" || !tab.url) return;
  
    // 读取保存的匹配规则
    const { captureRule } = await chrome.storage.local.get("captureRule");
    if (!captureRule) return;
  
    // 匹配逻辑：正则 / 普通包含
    let match = false;
    try {
      const reg = new RegExp(captureRule);
      match = reg.test(tab.url);
    } catch {
      match = tab.url.includes(captureRule);
    }
  
    if (!match) return;
  
    // 命中规则，自动抓取页面源码下载
    const ret = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.documentElement.outerHTML
    });
    const html = ret[0].result;
    download(html, `auto_${new Date().getTime()}_page.html`);
  });
  
  function download(content, filename) {
    const blob = new Blob([content], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    chrome.downloads.download({ url: blobUrl, filename });
    URL.revokeObjectURL(blobUrl);
  }