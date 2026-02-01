# 🚀 快速开始指南

## 📋 项目已成功运行！

你的AI单词卡片生成器现在已经在本地运行了：

- **本地地址**: http://localhost:8080/
- **API配置页面**: http://localhost:8080/api-setup
- **测试页面**: http://localhost:8080/ai-test

## 🔑 第一步：配置API密钥

### 方法1：通过界面配置（推荐）

1. **访问配置页面**：
   - 点击主页右上角的"API配置"按钮
   - 或直接访问：http://localhost:8080/api-setup

2. **选择AI提供商**：
   - **推荐：DeepSeek** - 国内可直接访问，性价比高
   - **备选：Google Gemini** - 功能强大，需科学上网

3. **获取API密钥**：
   
   **DeepSeek API（推荐）**：
   - 访问：https://platform.deepseek.com/
   - 注册账户并登录
   - 进入"API Keys"页面
   - 点击"Create API Key"
   - 复制生成的密钥（格式：sk-xxx）

   **Google Gemini API**：
   - 访问：https://makersuite.google.com/app/apikey
   - 登录Google账户
   - 点击"Create API Key"
   - 复制生成的密钥（格式：AIza-xxx）

4. **输入密钥**：
   - 在配置页面选择对应的提供商标签
   - 粘贴API密钥到输入框
   - 点击"保存配置"按钮
   - 确认刷新页面以应用配置

### 方法2：通过环境变量配置

编辑项目根目录的 `.env.local` 文件：

```bash
# 选择默认提供商
VITE_AI_PROVIDER=deepseek

# DeepSeek配置
VITE_DEEPSEEK_API_KEY=sk-your-actual-deepseek-key-here
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
VITE_DEEPSEEK_MODEL=deepseek-chat

# Gemini配置（可选）
VITE_GEMINI_API_KEY=AIza-your-actual-gemini-key-here
VITE_GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
VITE_GEMINI_MODEL=gemini-2.5-pro-latest
```

保存后重启开发服务器：
```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

## 🧪 第二步：测试配置

1. **访问测试页面**：http://localhost:8080/ai-test
2. **检查配置状态**：确认API密钥显示为"已配置"
3. **运行API测试**：点击"测试"按钮验证连通性
4. **查看测试结果**：确认API调用成功

## 🎯 第三步：开始使用

1. **返回主页**：http://localhost:8080/
2. **输入单词**：在输入框中输入要学习的英文单词
3. **选择AI提供商**：在下拉菜单中选择要使用的AI（Gemini或DeepSeek）
4. **选择AI模型**：根据需要选择具体的模型版本
5. **生成卡片**：点击"一键生成学习卡片"
6. **查看结果**：AI将生成包含音标、词根、例句等的学习卡片

## 🔧 功能特色

### 🤖 AI单词分析
- **音标发音**：准确的国际音标标注
- **词根词缀**：科学的词汇构成分析
- **同音词记忆**：相似发音单词对比 + 中文翻译
- **实用搭配**：常用词组和短语
- **例句翻译**：地道的使用示例

### 🎛️ 智能模型选择
- **Gemini模型**：
  - `Gemini 2.5 Pro`（推荐）：最新最强，顶级性能
  - `Gemini 2.0 Flash`：新一代快速，实验功能
  - `Gemini 1.5 Flash`：成熟快速，成本低
  - `Gemini 1.5 Pro`：成熟专业，质量高
  - `Gemini 1.0 Pro`：经典稳定，兼容性好
- **DeepSeek模型**：
  - `DeepSeek Chat`（推荐）：通用对话，中文优化
  - `DeepSeek Coder`：代码理解，技术文档

### 📱 多端支持
- **桌面端**：http://localhost:8080/
- **移动端**：http://192.168.51.108:8080/（局域网访问）
- **响应式设计**：自适应各种屏幕尺寸

### 🎨 其他功能
- **截图保存**：一键将卡片保存为图片
- **音标测试**：练习音标识别能力
- **提供商切换**：灵活选择AI服务

## 🆘 常见问题

### Q: API密钥无效怎么办？
A: 
1. 检查密钥格式是否正确（DeepSeek: sk-xxx, Gemini: AIza-xxx）
2. 确认密钥没有过期
3. 检查API配额是否用完
4. 尝试重新生成密钥

### Q: 网络连接失败？
A:
1. DeepSeek API可直接访问，无需科学上网
2. Gemini API需要科学上网
3. 检查防火墙设置
4. 尝试切换网络环境

### Q: 配置不生效？
A:
1. 确认点击了"保存配置"按钮
2. 刷新浏览器页面
3. 清除浏览器缓存
4. 重启开发服务器

### Q: 生成的内容不理想？
A:
1. 尝试切换不同的AI提供商
2. 检查输入的单词拼写
3. 确认网络连接稳定
4. 查看控制台错误信息

## 📞 获取帮助

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 访问测试页面检查配置状态
3. 参考 `AI_SETUP_GUIDE.md` 详细说明
4. 检查开发服务器终端输出

## 🎉 开始体验

现在你可以：
1. ✅ 配置API密钥
2. ✅ 测试API连通性  
3. ✅ 生成第一个单词卡片
4. ✅ 体验AI驱动的英语学习

祝你学习愉快！🚀📚
