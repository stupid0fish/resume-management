document.addEventListener("DOMContentLoaded", () => {
  const resumeBox = document.getElementById("resumeBox");
  const captureBtn = document.getElementById("captureBtn");
  const copyBtn = document.getElementById("copyBtn");

  captureBtn.addEventListener("click", async () => {
    resumeBox.value = "正在抓取...";
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        resumeBox.value = "未找到当前标签页";
        return;
      }
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      resumeBox.value = results[0]?.result || "抓取失败";
    } catch (e) {
      resumeBox.value = "抓取异常：" + e.message;
    }
  });

  copyBtn.addEventListener("click", () => {
    resumeBox.select();
    document.execCommand("copy");
    copyBtn.textContent = "已复制！";
    setTimeout(() => { copyBtn.textContent = "复制内容"; }, 1500);
  });
});
