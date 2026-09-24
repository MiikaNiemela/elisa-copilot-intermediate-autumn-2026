# 🧩 4. MCP Exercises

In these exercises, you will:

- Set up the Playwright MCP server in VS Code
- Use browser automation tools in Copilot chat
- Install and configure additional MCP servers
- Explore the GitHub MCP registry

**❗ Security Note:** Local MCP servers can execute arbitrary commands, read local files, and leak code or secrets from your machine. Only install servers from trusted vendors.

## 🎭 Exercise 4.1: Playwright MCP Setup in VS Code

Playwright is a testing framework that enables browser automation. With the Playwright MCP and the tools it exposes, Copilot can open a browser, navigate to any website, and interact with it just like a human user.

Let's start by setting up the MCP server.

1. Open the command palette (`shift + command/ctrl + P`).
2. Type "MCP add" and select **MCP: Add Server...**.
3. Select the **Command (stdio)** option from the list.
4. When prompted for the command, enter `npx -y @playwright/mcp@latest`.
5. Press enter when prompted for the server ID.
6. Verify that the file `.vscode/mcp.json` was created and open it. Its contents should look like this:

    ```json
    {
        "servers": {
            "my-mcp-server-ee630b18": {
                "type": "stdio",
                "command": "npx",
                "args": [
                    "-y",
                    "@playwright/mcp@latest"
                ]
            }
        },
        "inputs": []
    }
    ```

7. Notice the inline controls above the server definition in the JSON file. Use them to start, stop, and restart the server.
8. Check the tools menu in Copilot Chat. Can you see Playwright and all of its tools?

## 💬 Exercise 4.2: Playwright MCP Server Prompting

Now let's try some prompts that use the browser tools provided by the MCP server.

1. Make sure both the Playwright MCP and the exercise application are up and running.
2. In either Copilot CLI or VS Code (Agent mode), send the following prompt:

    ```text
    Browse to http://localhost:51734/. Browse to the skills inventory and add the following skill:
        - Name: Calendar Tetris
        - Category: Productivity
        - Description: Makes chaos fit neatly
        - Target level: 4
    ```

3. Verify that a browser window opens and that Copilot is able to navigate the user interface and make the requested additions.

## 🧰 Exercise 4.3: Installing MCP Servers From the Extensions View

1. In VS Code, open the Extensions view and search for `@mcp` to list MCP servers available for one-click install.
2. Install one of the servers, for example Microsoft Learn.
3. Select **Install in workspace** to install it in this project.
4. Open `.vscode/mcp.json` and confirm the server configuration is present. Then check whether the server is running and whether its tools appear in the tools menu.

## 🐙 Exercise 4.4: GitHub MCP Registry

The [GitHub MCP Registry](https://github.com/mcp) is a GitHub-maintained, curated list of MCP servers. It makes it easy to discover and install MCP servers directly in VS Code with one-click installation.

Browse to the [GitHub MCP Registry](https://github.com/mcp) and explore some of the available servers. A few interesting ones:

- Azure DevOps MCP
- Azure MCP
- Context7
- GitHub MCP
