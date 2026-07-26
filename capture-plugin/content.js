function getCandidateInfo() {
    const data = {
      name: "",
      phone: "",
      email: "",
      basic: "", // 年龄、学历、工作年限、期望薪资
      education: "", // 教育经历
      workExp: "", // 工作履历
      skill: "", // 专业技能
      selfDesc: "" // 自我评价
    };
  
    // ========== BOSS直聘 选择器（BOSS候选人详情页专用）==========
    try {
      data.name = document.querySelector('.name')?.innerText?.trim() || "";
      data.phone = document.querySelector('.phone-text')?.innerText?.trim() || "未展示";
      data.email = document.querySelector('.email-item')?.innerText?.trim() || "未填写";
      data.basic = document.querySelector('.user-info-base')?.innerText?.trim() || "";
  
      // 教育经历
      const eduList = Array.from(document.querySelectorAll('.edu-item'))
        .map(el => el.innerText.trim()).join("\n");
      data.education = eduList;
  
      // 工作经历
      const workList = Array.from(document.querySelectorAll('.work-item'))
        .map(el => el.innerText.trim()).join("\n");
      data.workExp = workList;
  
      // 技能
      data.skill = document.querySelector('.skill-wrap')?.innerText?.trim() || "";
      // 自我评价
      data.selfDesc = document.querySelector('.self-evaluation')?.innerText?.trim() || "";
    } catch (e) {
      console.log("BOSS页面解析异常：", e);
    }
  
    // 拼接成标准简历文本格式
    const resume = `
  ==================== 候选人简历 ====================
  【姓名】：${data.name}
  【联系电话】：${data.phone}
  【邮箱】：${data.email}
  
  【基础信息】
  ${data.basic}
  
  【教育经历】
  ${data.education || "无"}
  
  【工作经历】
  ${data.workExp || "无"}
  
  【专业技能】
  ${data.skill || "无"}
  
  【自我评价】
  ${data.selfDesc || "无"}
  =====================================================
  `;
    return resume;
  }
  
  // 执行爬取并返回文本
  return getCandidateInfo();