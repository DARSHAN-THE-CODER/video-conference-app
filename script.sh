# Setup admin-frontend
echo "Installing packages"
yarn install

echo "pushing to github"

git add .
git commit -m "fix"
git push origin main

echo "vercel deployment"
vercel
vercel --prod

echo "done"