import * as fs from 'fs';

import { getBowerJson } from './helpers';
import { detect, detectFrameworkPreset, detectLanguage, isStorybookInstalled } from './detect';
import { ProjectType, SUPPORTED_RENDERERS, SupportedLanguage } from './project_types';
import type { PackageJsonWithMaybeDeps } from './js-package-manager';

jest.mock('./helpers', () => ({
  getBowerJson: jest.fn(),
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  stat: jest.fn(),
  lstat: jest.fn(),
  access: jest.fn(),
}));

jest.mock('path', () => ({
  // make it return just the second path, for easier testing
  join: jest.fn((_, p) => p),
}));

const MOCK_FRAMEWORK_FILES: {
  name: string;
  files: Record<'package.json', PackageJsonWithMaybeDeps> | Record<string, string>;
}[] = [
  {
    name: ProjectType.SFC_VUE,
    files: {
      'package.json': {
        dependencies: {
          vuetify: '1.0.0',
        },
        devDependencies: {
          'vue-loader': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.VUE,
    files: {
      'package.json': {
        dependencies: {
          vue: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.VUE3,
    files: {
      'package.json': {
        dependencies: {
          vue: '^3.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.VUE3,
    files: {
      'package.json': {
        dependencies: {
          // Testing the `next` tag too
          vue: 'next',
        },
      },
    },
  },
  {
    name: ProjectType.EMBER,
    files: {
      'package.json': {
        devDependencies: {
          'ember-cli': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.REACT_PROJECT,
    files: {
      'package.json': {
        peerDependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.REACT_NATIVE,
    files: {
      'package.json': {
        dependencies: {
          'react-native': '1.0.0',
        },
        devDependencies: {
          'react-native-scripts': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.REACT_SCRIPTS,
    files: {
      'package.json': {
        devDependencies: {
          'react-scripts': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.WEBPACK_REACT,
    files: {
      'package.json': {
        dependencies: {
          react: '1.0.0',
        },
        devDependencies: {
          webpack: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.REACT,
    files: {
      'package.json': {
        dependencies: {
          react: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.NEXTJS,
    files: {
      'package.json': {
        dependencies: {
          next: '^9.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.ANGULAR,
    files: {
      'package.json': {
        dependencies: {
          '@angular/core': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          'lit-element': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          'lit-html': '1.4.1',
        },
      },
    },
  },
  {
    name: ProjectType.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          'lit-html': '2.0.0-rc.3',
        },
      },
    },
  },
  {
    name: ProjectType.WEB_COMPONENTS,
    files: {
      'package.json': {
        dependencies: {
          lit: '2.0.0-rc.2',
        },
      },
    },
  },
  {
    name: ProjectType.MITHRIL,
    files: {
      'package.json': {
        dependencies: {
          mithril: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.MARIONETTE,
    files: {
      'package.json': {
        dependencies: {
          'backbone.marionette': '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.MARKO,
    files: {
      'package.json': {
        dependencies: {
          marko: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.RIOT,
    files: {
      'package.json': {
        dependencies: {
          riot: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.PREACT,
    files: {
      'package.json': {
        dependencies: {
          preact: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.SVELTE,
    files: {
      'package.json': {
        dependencies: {
          svelte: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.RAX,
    files: {
      '.rax': 'file content',
      'package.json': {
        dependencies: {
          rax: '1.0.0',
        },
      },
    },
  },
  {
    name: ProjectType.AURELIA,
    files: {
      'package.json': {
        dependencies: {
          'aurelia-bootstrapper': '1.0.0',
        },
      },
    },
  },
];

describe('Detect', () => {
  it(`should return type HTML if html option is passed`, () => {
    expect(detect({ dependencies: {} }, { html: true })).toBe(ProjectType.HTML);
  });

  it(`should return type UNDETECTED if neither packageJson or bowerJson exist`, () => {
    (getBowerJson as jest.Mock).mockImplementation(() => false);
    expect(detect(undefined)).toBe(ProjectType.UNDETECTED);
  });

  it(`should return language legacy typescript if the dependency is present`, () => {
    expect(detectLanguage({ dependencies: { typescript: '1.0.0' } })).toBe(
      SupportedLanguage.TYPESCRIPT_LEGACY
    );
  });

  it(`should return language typescript if the dependency is >TS4.9`, () => {
    expect(detectLanguage({ dependencies: { typescript: '4.9.1' } })).toBe(
      // TODO: switch to TYPESCRIPT once csf-tools and eslint-plugin-storybook support `satisfies` operator
      SupportedLanguage.TYPESCRIPT_LEGACY
    );
  });

  it(`should return language typescript if the dependency is =TS4.9`, () => {
    expect(detectLanguage({ dependencies: { typescript: '4.9.0' } })).toBe(
      // TODO: switch to TYPESCRIPT once csf-tools and eslint-plugin-storybook support `satisfies` operator
      SupportedLanguage.TYPESCRIPT_LEGACY
    );
  });

  it(`should return language typescript if the dependency is =TS4.9beta`, () => {
    expect(detectLanguage({ dependencies: { typescript: '^4.9.0-beta' } })).toBe(
      // TODO: switch to TYPESCRIPT once csf-tools and eslint-plugin-storybook support `satisfies` operator
      SupportedLanguage.TYPESCRIPT_LEGACY
    );
  });

  it(`should return language javascript by default`, () => {
    expect(detectLanguage()).toBe(SupportedLanguage.JAVASCRIPT);
  });

  describe('isStorybookInstalled should return', () => {
    it('false if empty devDependency', () => {
      expect(isStorybookInstalled({ devDependencies: {} }, false)).toBe(false);
    });

    it('false if no devDependency', () => {
      expect(isStorybookInstalled({}, false)).toBe(false);
    });

    SUPPORTED_RENDERERS.forEach((framework) => {
      it(`true if devDependencies has ${framework} Storybook version`, () => {
        const devDependencies = {
          [`@storybook/${framework}`]: '4.0.0-alpha.21',
        };
        expect(isStorybookInstalled({ devDependencies }, false)).toBeTruthy();
      });
    });

    it('false if forced flag', () => {
      expect(
        isStorybookInstalled(
          {
            devDependencies: { '@storybook/react': '4.0.0-alpha.21' },
          },
          true
        )
      ).toBe(false);
    });

    it('ALREADY_HAS_STORYBOOK if lib is present', () => {
      expect(
        isStorybookInstalled({
          devDependencies: { '@storybook/react': '4.0.0-alpha.21' },
        })
      ).toBe(ProjectType.ALREADY_HAS_STORYBOOK);
    });
  });

  describe('detectFrameworkPreset should return', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    MOCK_FRAMEWORK_FILES.forEach((structure) => {
      it(`${structure.name}`, () => {
        (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
          return Object.keys(structure.files).includes(filePath);
        });

        const result = detectFrameworkPreset(
          structure.files['package.json'] as PackageJsonWithMaybeDeps
        );

        expect(result).toBe(structure.name);
      });
    });

    it(`UNDETECTED for unknown frameworks`, () => {
      const result = detectFrameworkPreset();
      expect(result).toBe(ProjectType.UNDETECTED);
    });

    // TODO(blaine): Remove once Nuxt3 is supported
    it(`UNSUPPORTED for Nuxt framework above version 3.0.0`, () => {
      const result = detectFrameworkPreset({
        dependencies: {
          nuxt: '3.0.0',
        },
      });
      expect(result).toBe(ProjectType.UNSUPPORTED);
    });

    // TODO: The mocking in this test causes tests after it to fail
    it('REACT_SCRIPTS for custom react scripts config', () => {
      const forkedReactScriptsConfig = {
        '/node_modules/.bin/react-scripts': 'file content',
      };

      (fs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return Object.keys(forkedReactScriptsConfig).includes(filePath);
      });

      const result = detectFrameworkPreset();
      expect(result).toBe(ProjectType.REACT_SCRIPTS);
    });
  });
});
