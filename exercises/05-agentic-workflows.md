# 🤖 5. Agentic Workflow Exercises

In these exercises, you will:

- Create an agentic workflow file
- Compose it into a runnable GitHub Actions workflow
- Push it to a GitHub repository and run the GitHub Actions workflow

**Prerequisites:** You must have the [GitHub CLI tool](https://cli.github.com/) and the [GitHub Agentic Workflow Extension](https://github.com/github/gh-aw/blob/main/docs/src/content/docs/setup/quick-start.mdx#step-1---install-the-extension) installed. For the latter part of the exercises, you must be able to create a GitHub repository and open issues in it.

## 🛠️ Exercise 5.1: Creating a new agentic workflow

1. Initialize a new git repository
2. Create the required directory structure:

    ```bash
    mkdir -p .github/workflows
    ```

3. Create a new file inside the workflows directory called `issue-triage.md`.
4. Write the contents of the agentic workflow file. The purpose of this workflow is to automatically triage GitHub issues in this repository by categorizing each issue with the correct issue type, labels, etc. [Check out this example](https://github.com/githubnext/agentics/blob/main/workflows/issue-triage.md) for inspiration. Make sure the workflow is triggered when a new issue is opened.
5. Compile the agentic workflow with the following command and inspect the files it generates.

    ```bash
    gh aw compile
    ```

## 🚀 Exercise 5.2: Running the agentic workflow

Note: For this exercise, you must be able to create a GitHub repository, run GitHub Actions workflows, and open issues in it.

1. Commit all new files, including the generated ones.
2. Create a new remote GitHub repository and push your changes to it.
3. Create a new GitHub issue in the repository. If the triggers are configured correctly, this should launch the workflow run under the Actions tab of the repository.
4. Check that the results of the workflow run are as expected.
