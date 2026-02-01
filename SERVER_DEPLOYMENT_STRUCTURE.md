# 🌐 服务器部署目录结构指南

## 📁 当前构建产物分析

### ✅ **你的 dist 文件夹结构**
```
dist/
├── index.html              # 主页面文件
├── assets/
│   ├── index-B8faLqnS.css  # 样式文件 (已压缩优化)
│   └── index-DzwktWJU.js   # JavaScript文件 (已压缩优化)
├── favicon.ico             # 网站图标
├── placeholder.svg         # 占位图片
└── robots.txt             # 搜索引擎爬虫配置
```

### 📊 **文件分析**
- **index.html**: 入口文件，包含完整的HTML结构和meta标签
- **assets/**: 包含所有打包后的CSS和JS文件
- **静态资源**: favicon.ico, placeholder.svg, robots.txt

## 🌐 服务器端目录结构

### 🎯 **推荐结构 (Nginx/Apache)**

```
/var/www/html/                    # 网站根目录
├── index.html                    # 主页面
├── assets/
│   ├── index-B8faLqnS.css       # 样式文件
│   └── index-DzwktWJU.js        # JavaScript文件
├── favicon.ico                   # 网站图标
├── placeholder.svg               # 占位图片
└── robots.txt                   # SEO配置
```

### 🔧 **不同服务器的部署路径**

#### 1. **Nginx (Ubuntu/CentOS)**
```bash
# 默认网站根目录
/var/www/html/

# 或自定义目录
/var/www/your-domain.com/
```

#### 2. **Apache (Ubuntu/CentOS)**
```bash
# 默认网站根目录
/var/www/html/

# 或虚拟主机目录
/var/www/vhosts/your-domain.com/
```

#### 3. **Windows IIS**
```
C:\inetpub\wwwroot\
```

#### 4. **宝塔面板**
```
/www/wwwroot/your-domain.com/
```

## 📤 上传方法

### 方法1: FTP/SFTP 上传
```bash
# 使用 FileZilla 或其他 FTP 工具
# 将 dist 文件夹内的所有文件上传到服务器根目录
```

### 方法2: SCP 命令上传
```bash
# 上传整个 dist 文件夹内容
scp -r dist/* user@your-server:/var/www/html/

# 或者分别上传
scp dist/index.html user@your-server:/var/www/html/
scp -r dist/assets user@your-server:/var/www/html/
scp dist/*.ico dist/*.svg dist/*.txt user@your-server:/var/www/html/
```

### 方法3: rsync 同步
```bash
# 同步 dist 文件夹到服务器
rsync -avz dist/ user@your-server:/var/www/html/
```

## ⚙️ 服务器配置

### 🔧 **Nginx 配置示例**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/html;
    index index.html;

    # 处理 React Router (SPA 路由)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 压缩配置
    gzip on;
    gzip_types text/css application/javascript text/javascript;
}
```

### 🔧 **Apache 配置示例**

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html
    
    # 处理 SPA 路由
    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router 支持
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

## 🚀 部署步骤详解

### 步骤1: 准备服务器环境
```bash
# Ubuntu/CentOS 安装 Nginx
sudo apt update
sudo apt install nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 步骤2: 上传文件
```bash
# 方式1: 直接复制 dist 内容
cp -r dist/* /var/www/html/

# 方式2: 通过 SCP 上传
scp -r dist/* user@server:/var/www/html/
```

### 步骤3: 设置权限
```bash
# 设置文件权限
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/
```

### 步骤4: 配置域名 (可选)
```bash
# 编辑 Nginx 配置
sudo nano /etc/nginx/sites-available/your-domain

# 启用站点
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/

# 重启 Nginx
sudo systemctl reload nginx
```

## 🌍 不同云服务商部署

### 1. **阿里云 ECS**
```bash
# 目录: /var/www/html/
# 配置: 安全组开放 80/443 端口
# 域名: 在控制台绑定域名
```

### 2. **腾讯云 CVM**
```bash
# 目录: /var/www/html/
# 配置: 防火墙开放 80/443 端口
# 域名: 在 DNS 解析中配置
```

### 3. **AWS EC2**
```bash
# 目录: /var/www/html/
# 配置: Security Group 开放端口
# 域名: Route 53 配置
```

### 4. **静态网站托管**
```bash
# Vercel: 直接拖拽 dist 文件夹
# Netlify: 上传 dist 文件夹
# GitHub Pages: 推送到 gh-pages 分支
```

## 📋 部署检查清单

### ✅ **文件完整性检查**
- [ ] index.html 存在且可访问
- [ ] assets/index-B8faLqnS.css 存在
- [ ] assets/index-DzwktWJU.js 存在
- [ ] favicon.ico 显示正常
- [ ] 所有路径引用正确

### ✅ **功能测试**
- [ ] 主页面正常加载
- [ ] CSS 样式正确显示
- [ ] JavaScript 功能正常
- [ ] 路由跳转正常 (如 /api-setup, /ai-test)
- [ ] API 调用正常 (需配置 API 密钥)

### ✅ **性能优化**
- [ ] 启用 Gzip 压缩
- [ ] 设置静态资源缓存
- [ ] 配置 CDN (可选)

## 🔍 常见问题解决

### 问题1: 页面空白
```bash
# 检查文件路径
ls -la /var/www/html/
# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 问题2: 资源加载失败
```bash
# 检查文件权限
ls -la /var/www/html/assets/
# 确保 assets 文件夹权限正确
```

### 问题3: 路由 404 错误
```nginx
# 确保 Nginx 配置了 try_files
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🎉 部署完成验证

### 访问测试
```bash
# 本地测试
curl http://your-server-ip/

# 浏览器测试
http://your-domain.com/
http://your-domain.com/api-setup
http://your-domain.com/ai-test
```

### 预期结果
- ✅ 主页面正常显示
- ✅ AI 配置页面可访问
- ✅ 所有功能正常工作
- ✅ 移动端适配良好

---

**总结**: 你的构建产物已经完美，只需要将 `dist/` 文件夹内的所有文件上传到服务器的网站根目录即可！🚀
