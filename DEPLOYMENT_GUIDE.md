# 🚀 DEPLOYMENT GUIDE - Netlify

## Step-by-Step Instructions to Deploy Your Portfolio Live

### **Method 1: Drag & Drop (EASIEST - 30 seconds)**

1. **Go to Netlify**
   - Open [netlify.com](https://netlify.com)

2. **Sign Up (if not already)**
   - Click "Sign up" button
   - Use Google or GitHub account (recommended)
   - Verify email if needed

3. **Deploy Your Site**
   - Look for "Drag and drop your site folder here" area
   - Or click "Sites" → "Create new site from files"
   - Select all 3 files from your WebTask1 folder:
     - index.html
     - styles.css
     - script.js
   - **Drag them into Netlify** or select them

4. **Wait for Deployment**
   - Netlify will automatically deploy
   - Your site will get a random URL like: `https://brave-falcon-abc123.netlify.app`

5. **View Your Live Site**
   - Click the URL to see your portfolio live!

---

### **Method 2: Using GitHub (RECOMMENDED for updates)**

#### Step A: Push to GitHub
```bash
# If you don't have Git installed, download from git-scm.com

# Navigate to your project folder in terminal
cd "C:\Users\admin\Downloads\WebTask1"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial portfolio website"

# Create new repository on GitHub
# Go to github.com → New Repository
# Name it: portfolio-website
# Copy the repository URL

# Link local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/portfolio-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step B: Connect GitHub to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Sites" → "Create new site from Git"
3. Choose "GitHub"
4. Authorize Netlify to access GitHub
5. Select your "portfolio-website" repository
6. Click "Deploy site"
7. **Done!** Your site is live and auto-deploys on every GitHub push

---

### **Method 3: Using Netlify CLI (For developers)**

```bash
# Install Node.js first (if needed)
# Download from nodejs.org

# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd "C:\Users\admin\Downloads\WebTask1"

# Login to Netlify
netlify login

# Deploy your site
netlify deploy --prod

# You'll get your live URL!
```

---

## ✅ After Deployment - Important Steps

### **1. Custom Domain (Optional)**
- In Netlify Dashboard → Domain settings
- Add your custom domain (e.g., bhumisingh.com)
- Follow DNS instructions

### **2. Enable HTTPS** (Already enabled by default)
- Netlify provides free SSL certificate
- Your site is secure automatically

### **3. Setup Redirects (if needed)**
- Create a `_redirects` file (optional)
- Keep it simple if you only have one page

### **4. Environment Setup (if needed)**
- Netlify has built-in environment variables
- Not needed for this static portfolio

---

## 📋 Your Site After Deployment

Your portfolio will be live at:
- **URL Format**: `https://your-site-name.netlify.app`
- **Example**: `https://bhumi-singh-portfolio.netlify.app`

---

## 🎯 What to Do Next

1. **Test Your Site**
   - Open the live URL on mobile and desktop
   - Click all links and buttons
   - Verify all sections load correctly

2. **Share Your Portfolio**
   - Add link to LinkedIn profile
   - Share on Twitter/Instagram
   - Include in email signature
   - Send to recruiters/companies

3. **Keep It Updated**
   - Add new projects as you build them
   - Update skills as you learn new ones
   - Keep GitHub linked for auto-deployment

---

## 🔧 Troubleshooting

**Issue**: My styles aren't loading
- **Fix**: Make sure all three files (HTML, CSS, JS) are in the same folder
- Check file names are correct (exact case-sensitive)

**Issue**: Links are broken
- **Fix**: Verify all links in HTML use correct URLs
- Test locally first before deployment

**Issue**: Site is slow
- **Fix**: Netlify is fast by default
- Check images aren't too large (though we don't have images)

---

## 💡 Pro Tips

1. **Easy Updates**: Edit files → Commit to GitHub → Auto-deploys to Netlify
2. **Custom Domain**: Add your own domain for $12/year
3. **Analytics**: Netlify shows visitor statistics in dashboard
4. **Team Collaboration**: Invite others to manage the site

---

## 📞 Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Netlify Support**: [support.netlify.com](https://support.netlify.com)

---

**Your portfolio is ready to go live! 🎉**

Choose any method above and your site will be live in minutes!
