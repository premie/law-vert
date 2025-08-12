# GitHub Repository Setup Instructions

Follow these steps to create the GitHub repository for LawVert:

## 1. Create Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - Repository name: `law-vert`
   - Description: "LawVert - Convert with LawVert, Go Vertical. Transform your legal practice with cutting-edge conversion optimization."
   - Choose: Public
   - DO NOT initialize with README (we already have one)
   - DO NOT add .gitignore (we already have one)
   - DO NOT add license

5. Click "Create repository"

## 2. Connect Local Repository to GitHub

After creating the repository on GitHub, run these commands in your terminal:

```bash
# Add the remote origin (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/law-vert.git

# Push the code to GitHub
git branch -M main
git push -u origin main
```

## 3. Verify

Your repository should now be live at:
`https://github.com/yourusername/law-vert`

## 4. Next Steps for Vercel Deployment

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the `law-vert` repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables if needed
6. Click "Deploy"

## 5. Custom Domain Setup (for lawvert.com)

After deployment to Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `lawvert.com` and `www.lawvert.com`
4. Follow Vercel's instructions to update your DNS records:
   - Add an A record pointing to Vercel's IP
   - Add a CNAME record for www subdomain
5. Wait for DNS propagation (can take up to 48 hours)

## Repository Structure

```
law-vert/
├── app/              # Next.js app directory
├── public/           # Static assets
├── .gitignore        # Git ignore file
├── README.md         # Project documentation
├── package.json      # Node dependencies
└── next.config.ts    # Next.js configuration
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

**Convert with LawVert, Go Vertical™**