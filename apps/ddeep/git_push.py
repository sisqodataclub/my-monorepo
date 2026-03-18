import os
import subprocess
import sys

def run_command(command, capture=False):
    try:
        result = subprocess.run(command, check=True, shell=True,
                                capture_output=capture, text=True)
        return result.stdout.strip() if capture else None
    except subprocess.CalledProcessError as e:
        print(f"❌ Error while running command: {command}")
        print(e)
        sys.exit(1)

def check_case_mismatches(repo_url):
    print("🔍 Checking for case mismatches between local and GitHub...")

    # Get local tracked files
    local_files = run_command("git ls-files", capture=True).splitlines()
    local_map = {f.lower(): f for f in local_files}

    # Get remote tracked files
    remote_files_raw = run_command(f"git ls-remote {repo_url} HEAD", capture=True)
    if not remote_files_raw:
        print("⚠️ No remote HEAD found, skipping case check.")
        return

    # Fetch the remote tree
    run_command("git fetch origin main --depth=1")
    remote_files = run_command("git ls-tree -r origin/main --name-only", capture=True).splitlines()
    remote_map = {f.lower(): f for f in remote_files}

    mismatches = []
    for key in set(local_map.keys()).intersection(remote_map.keys()):
        if local_map[key] != remote_map[key]:
            mismatches.append((local_map[key], remote_map[key]))

    if mismatches:
        print("❌ Case mismatches detected between local and GitHub:")
        for local, remote in mismatches:
            print(f"   Local: {local}   <>   Remote: {remote}")
        print("\n👉 Please rename the file locally to match GitHub exactly, e.g.:")
        print("   git mv login.jsx Login.jsx")
        sys.exit(1)

    print("✅ No case mismatches between local and GitHub.\n")

def main():
    folder_path = input("📁 Enter the full path to your project folder: ").strip()
    if not os.path.isdir(folder_path):
        print("❌ That path does not exist or is not a folder.")
        return

    repo_url = input("🔗 Enter your GitHub repository URL (HTTPS): ").strip()
    if not repo_url.startswith("https://github.com/"):
        print("❌ Please enter a valid GitHub HTTPS URL.")
        return

    os.chdir(folder_path)
    print(f"📂 Changed directory to: {folder_path}\n")

    commands = [
        "git init",
        "git remote remove origin || echo 'No existing origin to remove'",
        f"git remote add origin {repo_url}",
        "git add ."
    ]
    for command in commands:
        run_command(command)

    # Check case mismatches before commit
    check_case_mismatches(repo_url)

    status_result = run_command("git status --porcelain", capture=True)
    if status_result.strip():
        run_command('git commit -m "Initial commit"')
    else:
        print("⚠️ No changes to commit.")

    push_commands = [
        "git branch -M main",
        "git push -u origin main --force"
    ]
    for command in push_commands:
        run_command(command)

    print("\n✅ Project folder successfully pushed to GitHub!")

if __name__ == "__main__":
    main()
