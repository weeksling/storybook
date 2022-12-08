import semver from 'semver';

import { JsPackageManager } from './JsPackageManager';
import type { PackageJson } from './PackageJson';

export class NPMProxy extends JsPackageManager {
  readonly type = 'npm';

  installArgs: string[] | undefined;

  uninstallArgs: string[] | undefined;

  initPackageJson() {
    return this.executeCommand('npm', ['init', '-y']);
  }

  getRunStorybookCommand(): string {
    return 'npm run storybook';
  }

  getRunCommand(command: string): string {
    return `npm run ${command}`;
  }

  getNpmVersion(): string {
    return this.executeCommand('npm', ['--version']);
  }

  hasLegacyPeerDeps() {
    const result = this.executeCommand('npm', [
      'config',
      'get',
      'legacy-peer-deps',
      '--location=project',
    ]);
    return result.trim() === 'true';
  }

  setLegacyPeerDeps() {
    this.executeCommand('npm', ['config', 'set', 'legacy-peer-deps=true', '--location=project']);
  }

  needsLegacyPeerDeps(version: string) {
    return semver.gte(version, '7.0.0') && !this.hasLegacyPeerDeps();
  }

  getInstallArgs(): string[] {
    if (!this.installArgs) {
      this.installArgs = this.needsLegacyPeerDeps(this.getNpmVersion())
        ? ['install', '--legacy-peer-deps']
        : ['install'];
    }
    return this.installArgs;
  }

  getUninstallArgs(): string[] {
    if (!this.uninstallArgs) {
      this.uninstallArgs = this.needsLegacyPeerDeps(this.getNpmVersion())
        ? ['uninstall', '--legacy-peer-deps']
        : ['uninstall'];
    }
    return this.uninstallArgs;
  }

  protected getResolutions(packageJson: PackageJson, versions: Record<string, string>) {
    return {
      overrides: {
        ...packageJson.overrides,
        ...versions,
      },
    };
  }

  protected runInstall(): void {
    this.executeCommand('npm', this.getInstallArgs(), 'inherit');
  }

  protected runAddDeps(dependencies: string[], installAsDevDependencies: boolean): void {
    let args = [...dependencies];

    if (installAsDevDependencies) {
      args = ['-D', ...args];
    }

    this.executeCommand('npm', [...this.getInstallArgs(), ...args], 'inherit');
  }

  protected runRemoveDeps(dependencies: string[]): void {
    const args = [...dependencies];

    this.executeCommand('npm', [...this.getUninstallArgs(), ...args], 'inherit');
  }

  protected runGetVersions<T extends boolean>(
    packageName: string,
    fetchAllVersions: T
  ): Promise<T extends true ? string[] : string> {
    const args = [fetchAllVersions ? 'versions' : 'version', '--json'];

    const commandResult = this.executeCommand('npm', ['info', packageName, ...args]);

    try {
      const parsedOutput = JSON.parse(commandResult);

      if (parsedOutput.error) {
        // FIXME: improve error handling
        throw new Error(parsedOutput.error.summary);
      } else {
        return parsedOutput;
      }
    } catch (e) {
      throw new Error(`Unable to find versions of ${packageName} using npm`);
    }
  }
}
