# WSL2 — canonical dev setup (AskMaps)

Goal: **never mix** Windows `npm install` and WSL `npm install` on the same directory. That mismatch is what triggers errors like missing `@rollup/rollup-linux-x64-gnu`.

## 1) Put the repo on the Linux filesystem (not `/mnt/c`)

**Do not** use `/mnt/c/Users/.../askmaps` as your daily working copy if you run Node from WSL.

### Option A — clone fresh (recommended)

```bash
mkdir -p ~/projects
cd ~/projects
git clone <your-repo-url> askmaps
cd askmaps
./scripts/wsl-bootstrap.sh
```

### Option B — one-time copy from Windows drive, then use only the copy

```bash
mkdir -p ~/projects
rsync -a --delete --exclude node_modules --exclude dist \
  /mnt/c/Users/bhuva/Documents/projects/askmaps/ \
  ~/projects/askmaps/
cd ~/projects/askmaps
./scripts/wsl-bootstrap.sh
```

After this, open **`~/projects/askmaps`** in your editor (Cursor: **Remote WSL** or open the WSL path). Treat the Windows folder as a backup or delete it from your workflow so you are not tempted to run `npm` there.

## 2) Node version

Use **Node 20 or 22 LTS** in WSL (`nvm`, `fnm`, or distro packages). Avoid mixing Node 24+ unless you intend to.

## 3) Bootstrap installs (Linux-native `node_modules`)

From the repo root:

```bash
chmod +x scripts/wsl-bootstrap.sh   # once
./scripts/wsl-bootstrap.sh
```

## 4) Run the app

```bash
# terminal 1
cd ~/projects/askmaps/backend && npm run dev

# terminal 2
cd ~/projects/askmaps/frontend && npm run dev
```

Browse: **http://localhost:3000/**

## 5) When something still breaks

From repo root in WSL:

```bash
./scripts/wsl-bootstrap.sh
```

If you recently ran `npm install` **in PowerShell** on the same folder, run bootstrap again **only** in WSL after removing `node_modules` (the script does that).

### `bash\r: No such file or directory`

The script was saved with **Windows (CRLF)** line endings. Fix once in WSL:

```bash
sed -i 's/\r$//' scripts/wsl-bootstrap.sh
chmod +x scripts/wsl-bootstrap.sh
./scripts/wsl-bootstrap.sh
```

To normalize all shell scripts:

```bash
find . -name '*.sh' -not -path './node_modules/*' -exec sed -i 's/\r$//' {} \;
```

## 6) Git on WSL

Use Git inside WSL from `~/projects/askmaps`. Your credentials and SSH keys should be configured in WSL (e.g. `~/.ssh`).
