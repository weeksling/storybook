/* eslint-disable global-require */
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { workspaces } from '@angular-devkit/core';

/**
 * Returns the workspace definition
 *
 * - Either from NX if it is present
 * - Either from `@angular-devkit/core` -> https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/core
 */
export const readAngularWorkspaceConfig = async (
  dirToSearch: string
): Promise<workspaces.WorkspaceDefinition> => {
  const host = workspaces.createWorkspaceHost(new NodeJsSyncHost());

  try {
    /**
     * Apologies for the following line
     * If there's a better way to do it, let's do it
     */

    // catch if nx.json does not exist
    require('@nrwl/workspace').readNxJson();

    const nxWorkspace = require('@nrwl/workspace').readWorkspaceConfig({
      format: 'angularCli',
      path: dirToSearch,
    });

    // Use the workspace version of nx when angular looks for the angular.json file
    host.readFile = (path) => {
      if (typeof path === 'string' && path.endsWith('angular.json')) {
        return Promise.resolve(JSON.stringify(nxWorkspace));
      }
      return host.readFile(path);
    };
    host.isFile = (path) => {
      if (typeof path === 'string' && path.endsWith('angular.json')) {
        return Promise.resolve(true);
      }
      return host.isFile(path);
    };
  } catch (e) {
    // Ignore if the client does not use NX
  }

  return (await workspaces.readWorkspace(dirToSearch, host)).workspace;
};

export const getDefaultProjectName = (workspace: workspaces.WorkspaceDefinition): string => {
  const environmentProjectName = process.env.STORYBOOK_ANGULAR_PROJECT;
  if (environmentProjectName) {
    return environmentProjectName;
  }

  if (workspace.projects.has('storybook')) {
    return 'storybook';
  }
  if (workspace.extensions.defaultProject) {
    return workspace.extensions.defaultProject as string;
  }

  const firstProjectName = workspace.projects.keys().next().value;
  if (firstProjectName) {
    return firstProjectName;
  }
  throw new Error('No angular projects found');
};

export const findAngularProjectTarget = (
  workspace: workspaces.WorkspaceDefinition,
  projectName: string,
  targetName: string
): {
  project: workspaces.ProjectDefinition;
  target: workspaces.TargetDefinition;
} => {
  if (!workspace.projects || !Object.keys(workspace.projects).length) {
    throw new Error('No angular projects found');
  }

  const project = workspace.projects.get(projectName);

  if (!project) {
    throw new Error(`"${projectName}" project is not found in angular.json`);
  }

  if (!project.targets.has(targetName)) {
    throw new Error(`"${targetName}" target is not found in "${projectName}" project`);
  }
  const target = project.targets.get(targetName);

  return { project, target };
};
