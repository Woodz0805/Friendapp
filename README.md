# 美PHONE有ㄩ - 熟齡社交 App

## 如何在 GitHub Pages 上部署

1. **準備環境**
   - 確保已安裝 Node.js。

2. **安裝套件**
   在專案根目錄執行：
   ```bash
   npm install
   ```

3. **設定 API Key**
   - 在根目錄建立 `.env` 檔案。
   - 加入內容：`VITE_API_KEY=你的_GOOGLE_GENAI_API_KEY`
   - 注意：若部署到 GitHub Pages，請在 GitHub Repo 的 Settings > Secrets and variables > Actions 中設定環境變數，或在 build 過程中注入。但前端靜態網頁暴露 Key 有風險，建議僅供 Demo 或限制 Key 的使用網域。

4. **本地開發**
   ```bash
   npm run dev
   ```

5. **打包**
   ```bash
   npm run build
   ```
   打包完成後會產生 `dist` 資料夾。

6. **部署**
   - 將專案推送到 GitHub。
   - 設定 GitHub Actions 自動部署，或手動將 `dist` 資料夾內容推送到 `gh-pages` 分支。
