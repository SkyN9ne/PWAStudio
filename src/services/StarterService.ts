import * as vscode from 'vscode';
const shell = require("shelljs");

const repositoryInputPrompt: string = "Test prompt test prompt";
const repositoryInputPlaceholder: string = "Enter your repository name here.";

const noNameSelectedWarning: string = "No repository name provided. New PWA Starter process cancelled.";
const noGitWarning: string = "This command requires git. Install git at https://git-scm.com/";
const noNpmWarning: string = "This command requires npm. Install git at https://www.npmjs.com/";

const starterRepositoryURI: string = "https://github.com/pwa-builder/pwa-starter.git";

var repositoryName: string | undefined = undefined;

const vsTerminal = vscode.window.createTerminal();

export async function setUpLocalPwaStarterRepository(): Promise<void> 
{
    await getRepositoryNameFromInputBox();

    if(repositoryName !== undefined)
    {
        vsTerminal.show();
        tryCloneFromGithub();
        tryNpmInstall();
        openRepositoryWithCode();
    }
    
}

function changeDirectory(pathToDirectory: string | undefined): void
{
    vsTerminal.sendText(`cd ${pathToDirectory}`);
}

function tryNpmInstall(): void 
{
    if(isNpmInstalled())
    {
        changeDirectory(repositoryName);
        npmInstall();
        changeDirectory("..");
    }
    else
    {
        noNpmInstalledWarning();
    }
}

function npmInstall(): void
{
    vsTerminal.sendText("npm install");
}

function isNpmInstalled(): boolean
{
    var isNpmInstalled: boolean = true;

    if(!shell.which("npm"))
    {
        isNpmInstalled = false;
    }

    return isNpmInstalled;
}

function tryCloneFromGithub(): void
{
    if(isGitInstalled())
    {
        cloneFromGithub();
    }
    else
    {
        noGitInstalledWarning();
    }
}

function cloneFromGithub(): void
{
    vsTerminal.sendText(cloneCommand());
}

function isGitInstalled(): boolean
{
    var isGitInstalled: boolean = true;

    if(!shell.which("git"))
    {
        isGitInstalled = false;
    }

    return isGitInstalled;
}

async function isRepoCloned(): Promise<boolean>
{
    return (await vscode.workspace.findFiles(`${repositoryName}/package.json`)).length > 0;
}

async function getRepositoryNameFromInputBox(): Promise<void> 
{
    repositoryName = await vscode.window.showInputBox({
        prompt: repositoryInputPrompt,
        placeHolder: repositoryInputPlaceholder
    });

    if(repositoryName === undefined)
    {
        inputCanelledWarning();
    }
}

function cloneCommand(): string
{
    return `git clone ${starterRepositoryURI} ${repositoryName}`;
}

function openRepositoryWithCode(): void
{
    vsTerminal.sendText(`code ${repositoryName}`);
}

function inputCanelledWarning(): void 
{
    vscode.window.showWarningMessage(noNameSelectedWarning);
}

function noGitInstalledWarning(): void
{
    vscode.window.showWarningMessage(noGitWarning);
}

function noNpmInstalledWarning(): void
{
    vscode.window.showWarningMessage(noNpmWarning);
}