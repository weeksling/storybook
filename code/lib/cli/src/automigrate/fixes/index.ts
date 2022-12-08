import type { Fix } from '../types';

import { cra5 } from './cra5';
import { webpack5 } from './webpack5';
import { angular12 } from './angular12';
import { vue3 } from './vue3';
import { mainjsFramework } from './mainjsFramework';
import { eslintPlugin } from './eslint-plugin';
import { builderVite } from './builder-vite';
import { sbScripts } from './sb-scripts';
import { nextjsFramework } from './nextjs-framework';
import { newFrameworks } from './new-frameworks';
import { removedGlobalClientAPIs } from './remove-global-client-apis';
import { mdx1to2 } from './mdx-1-to-2';
import { docsPageAutomatic } from './docsPage-automatic';
import { addReact } from './add-react';

export * from '../types';

export const fixes: Fix[] = [
  cra5,
  webpack5,
  angular12,
  vue3,
  mainjsFramework,
  eslintPlugin,
  builderVite,
  sbScripts,
  newFrameworks,
  removedGlobalClientAPIs,
  nextjsFramework,
  mdx1to2,
  docsPageAutomatic,
  addReact,
];
