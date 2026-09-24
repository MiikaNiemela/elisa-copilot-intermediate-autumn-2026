# 🤖 3. Custom Agents Exercises

In these exercises, you will:

- Explore existing agent definitions and configurations
- Create a custom agent specialized for a specific task
- Define default models and tool restrictions
- Test your custom agent on real code

## 💬 Exercise 3.1: Inspect an existing agent

Read through a working agent definition from start to finish so you become familiar with the required structure before authoring your own.

1. Open [.github/agents/compliance-officer.agent.md](.github/agents/compliance-officer.agent.md).
2. Identify the YAML frontmatter fields (`name`, `description`, `tools`, `user-invocable`, `disable-model-invocation`). Hover over each one to see an explanation of its purpose.
3. Confirm that the agent appears in the agent picker in the VS Code Copilot chat panel under the name `Compliance Officer`.
4. Select the Compliance Officer agent and run the following prompt:

    ```text
    Perform a compliance analysis on #file:backend
    ```

## 🧪 Exercise 3.2: Create a backend test author agent

Scaffold a custom agent that specializes in writing Vitest tests for the [backend/](backend/) workspace.

1. Scaffold the custom agent using the `/create-agent` skill with the following prompt:

    ```text
    /create-agent a custom agent definition at .github/agents/backend-test-author.agent.md. The agent:
      - is named "Backend Test Author"
      - only writes Vitest tests for files under backend/src/, output goes under backend/test/
      - must follow the conventions in .github/instructions/backend.instructions.md
      - runs `npm test -w backend` after writing tests and reports failures
      - is user-invocable
    ```

2. Verify that the agent has been created in the agents folder and review its contents.
3. Select the custom agent and use it to generate tests for a file such as [backend/src/routes/skills.ts](backend/src/routes/skills.ts).

## 🎯 Exercise 3.3: Define the default model for the agent

1. Open the Backend Test Author agent definition
2. To define the model that is used when running this agent, make the following addition to the agent frontmatter. Note: choose a model that is available for your GitHub organization.

    ```yaml
    ---
    name: Backend Test Author
    description: ...
    tools: ...
    model: Claude Haiku 4.5
    ---
    ```

3. Activate the agent in the agent menu. Observe that the default model is automatically selected in the model selector.

## 🔧 Exercise 3.4: Configure custom agent tools

1. Open the Backend Test Author agent definition
2. If there are no tools defined, add the following tools section to the front matter:

    ```yaml
    ---
    name: Backend Test Author
    description: ...
    tools:
        - read
        - search
        - edit/createFile
        - execute/runInTerminal
    ---
    ```

3. Click on the "Configure tools" link above the tools section. Add additional tools if you think something useful is missing.
4. Activate the agent in the agents mennu. Click on the tools button in the chat panel to see enabled tools. Only the tools listed in the agent definition should be enabled.
