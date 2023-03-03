# Setup admin-frontend
echo "Installing packages"
yarn install

echo "pushing to github"

git add .
git commit -m "changes"
git push origin main

echo "vercel deployment"
vercel
vercel --prod

echo "done"