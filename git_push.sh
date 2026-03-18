#!/bin/bash

# Define colors for pretty terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Git Push Process...${NC}"

# 1. Check if we are in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository. Please run this from the root of your monorepo.${NC}"
    exit 1
fi

# 2. Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✅ Working directory is clean. Nothing to commit.${NC}"
    exit 0
fi

# 3. Determine the commit message
# If the user passed an argument (e.g., ./git_push.sh "fixed bug"), use it.
# Otherwise, default to a timestamped auto-commit message.
if [ -z "$1" ]; then
    COMMIT_MSG="Auto-commit: $(date +'%Y-%m-%d %H:%M:%S')"
    echo -e "${YELLOW}ℹ️  No commit message provided. Using default: '${COMMIT_MSG}'${NC}"
else
    COMMIT_MSG="$1"
fi

# 4. Stage all changes
echo -e "${YELLOW}📦 Staging changes...${NC}"
git add .

# 5. Commit changes
echo -e "${YELLOW}📝 Committing changes...${NC}"
git commit -m "$COMMIT_MSG"

# 6. Push to the default remote (origin)
echo -e "${YELLOW}☁️  Pushing to GitHub...${NC}"
if git push; then
    echo -e "${GREEN}✅ Successfully pushed to remote repository!${NC}"
else
    echo -e "${RED}❌ Push failed. Check your network, git credentials, or remote configuration.${NC}"
    # Try to provide a helpful hint if the branch has no upstream
    if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
        BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
        echo -e "${YELLOW}💡 Hint: You might need to set the upstream branch. Run:${NC}"
        echo -e "git push --set-upstream origin $BRANCH_NAME"
    fi
    exit 1
fi
