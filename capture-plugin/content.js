// 该文件通过 popup.js 以 func 方式注入执行，返回简历文本
function extractResume() {
  function getVisibleText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
          return NodeFilter.FILTER_REJECT;
        }
        const style = window.getComputedStyle(p);
        if (style.display === "none" || style.visibility === "hidden") {
          return NodeFilter.FILTER_REJECT;
        }
        const t = node.textContent.trim();
        return t ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const lines = [];
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.replace(/\s+/g, " ").trim();
      if (t) lines.push(t);
    }
    return lines;
  }

  function findByKeywords(lines, keywords) {
    for (const line of lines) {
      for (const kw of keywords) {
        if (line.includes(kw)) return line;
      }
    }
    return "";
  }

  const data = {
    name: "", phone: "", email: "", basic: "",
    expect: "", education: "", workExp: "", fullText: ""
  };

  try {
    const lines = getVisibleText(document.body);
    const allText = lines.join("\n");
    data.fullText = allText;

    const phoneMatch = allText.match(/1[3-9]\d{9}/);
    data.phone = phoneMatch ? phoneMatch[0] : "未展示";

    const emailMatch = allText.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    data.email = emailMatch ? emailMatch[0] : "未填写";

    const nameMatch = allText.match(/([\u4e00-\u9fa5]{1,4}(先生|女士))/);
    data.name = nameMatch ? nameMatch[1] : (lines[0] || "");

    data.basic = findByKeywords(lines, ["岁"]) ||
      findByKeywords(lines, ["硕士", "本科", "博士", "大专"]);

    data.expect = findByKeywords(lines, ["期望"]) ||
      findByKeywords(lines, ["K"]);

    const eduLines = lines.filter(l => /大学|学院|学校|专业/.test(l));
    data.education = eduLines.slice(0, 6).join("\n");

    const workLines = lines.filter(l =>
      /\d{4}[.\-年]\d{1,2}|公司|有限公司|股份|工程师|经理|主管/.test(l)
    );
    data.workExp = workLines.slice(0, 20).join("\n");
  } catch (e) {
    return "解析异常：" + e.message;
  }

  return `==================== 候选人简历 ====================
【姓名】：${data.name || "未识别"}
【联系电话】：${data.phone}
【邮箱】：${data.email}

【基础信息】
${data.basic || "无"}

【期望】
${data.expect || "无"}

【教育经历】
${data.education || "无"}

【工作经历】
${data.workExp || "无"}

==================== 完整页面文本（备用） ====================
${data.fullText || "无"}
`;
}
