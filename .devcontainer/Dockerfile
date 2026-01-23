FROM mcr.microsoft.com/devcontainers/dotnet:dev-10.0

RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install --lts && nvm use --lts && npm install -g typescript" 2>&1

RUN npm install -g @go-task/cli