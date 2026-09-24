# 🎯 2. Agentic Skills Exercises

In these exercises, you will:

- Inspect existing skill definitions and their YAML frontmatter
- Create a custom skill with model invocation
- Test your skill in the Copilot chat
- Configure skill visibility and accessibility

## 🔍 Exercise 2.1: Inspect the existing skill

Learn the structure of a working skill definition before creating your own.

1. Open [.github/skills/conventional-commits/SKILL.md](.github/skills/conventional-commits/SKILL.md).
2. Identify the YAML frontmatter fields (`name`, `description`, `user-invocable`, `disable-model-invocation`). Hover over each one to see an explanation of its purpose.
3. Make a small change to any file in the repository (e.g., update a comment or add a line to a test).
4. Open the Copilot chat and ask Copilot to commit all files:

    ```text
    Commit the change in file <file>.
    ```

5. Observe that the skill was invoked by the model without explicitly asking it to use it.
6. Check git log. Was the commit was made using conventional commit styles (type, scope, description)?

## 🛠️ Exercise 2.2: Scaffold a new skill for test coverage analysis

Create a custom skill that runs test coverage, analyzes which parts of the codebase need more tests, and provides prioritized recommendations.

1. Use the `/create-skill` slash command with the following prompt:

    ```text
    /create-skill called test-coverage that:
    - runs `npm test -w backend -- --coverage` to generate coverage data
    - uses a bash script to parse the coverage report at backend/coverage/coverage-summary.json
    - analyzes which files have incomplete coverage
    - returns a prioritized report of files that most need unit tests
    ```

2. Verify that the skill has been created in the [.github/skills/](.github/skills/) folder and review its contents. Take a note of the scripts directory.
3. Test the skill by running `/test-coverage` in the Copilot chat.
4. Verify that the skill generates a coverage analysis report and recommends files to test.

## ⚙️ Exercise 2.3: Configure skill visibility

Control when a skill is available by adjusting its frontmatter settings.

1. Open the test-coverage skill definition you created.
2. Locate the `user-invocable` and `disable-model-invocation` fields in the frontmatter.
3. Change `user-invocable` from `true` to `false`.
4. Try to run `/test-coverage` in the Copilot chat.
5. Observe that the skill no longer appears as a slash command since it is no longer user-invocable.
6. Change `user-invocable` back to `true` to restore the slash command.
