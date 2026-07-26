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

      // 先加载 content.js（定义 extractResume 函数）
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      // 再调用该函数并取返回值
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => (typeof extractResume === "function" ? extractResume() : "未加载抓取函数")
      });

      resumeBox.value = results?.[0]?.result || "抓取失败：无返回内容";
    } catch (e) {
      resumeBox.value = "抓取异常：" + e.message +
        "\n\n提示：请确认当前页面是候选人详情页，且不是 chrome:// 等受限页面。";
    }
  });

  copyBtn.addEventListener("click", () => {
    resumeBox.select();
    document.execCommand("copy");
    copyBtn.textContent = "已复制！";
    setTimeout(() => { copyBtn.textContent = "复制内容"; }, 1500);
  });
});
