## 🔄 Git Workflow

### Initial Setup

```bash
# Check current branch
git branch

# Ensure you're on main
git checkout main

# Pull latest changes
git pull origin main
```

### Creating a New Feature Branch

Use the naming convention: `[initials]-[ticket-number]`

```bash
# Example: Andre Victoria working on ticket 001
git checkout -b av-001

# Example: Juan Dela Cruz working on ticket 002
git checkout -b jdc-002
```

### Working on Your Branch

```bash
# Check status
git status

# Add files
git add .

# Commit changes
git commit -m "feat: add user authentication"

# Push to remote
git push origin av-001
```

### Keeping Your Branch Updated

```bash
# Switch to main
git checkout main

# Pull latest changes
git pull origin main

# Switch back to your branch
git checkout av-001

# Merge main into your branch
git merge main
```

### Creating a Pull Request

1. Push your branch: `git push origin av-001`
2. Go to GitHub repository
3. Click **"Compare & pull request"**
4. Add description of changes
5. Request review from team members
6. Wait for approval and merge

### Common Git Commands

```bash
# View all branches
git branch -a

# Delete local branch (after merge)
git branch -d av-001

# Discard local changes
git checkout -- .

# View commit history
git log --oneline

# Stash changes temporarily
git stash
git stash pop

# Pull latest from current branch
git pull
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start Expo & every display development server

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

### Firebase Permissions Error

- Check Firestore rules are set correctly
- Verify `.env.local` has correct credentials
- Ensure Firebase project is active

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
```

---

## 🔒 Security Notes

- **Never commit** `.env.local` to git
- **Never commit** `node_modules/` to git
- Keep Firebase rules restrictive in production
- Use environment-specific configurations
- Review security rules before deployment

---

## 🤝 Contributing

1. Create a new branch from `main`
2. Make your changes
3. Test thoroughly (both web and desktop)
4. Commit with clear messages
5. Push and create Pull Request
6. Request code review
7. Address feedback
8. Merge after approval

---

## 📝 Commit Message Convention

Follow conventional commits:

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: updating build tasks, package manager configs, etc.
```

Examples:
```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve Firestore connection issue"
git commit -m "docs: update README with setup instructions"
```

## 👥 Team

**BSCS Development Team**
- IMS ng Pinas!

---

**Happy Coding! 🚀**
