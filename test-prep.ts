import * as shell from 'shelljs';

//shell.mkdir('test-dist');
shell.mkdir('-p', 'test-dist/test/e2e/adminuiCustom/', 'test-dist/test/e2e/frontend/');
shell.cp('package.json',                'test-dist/');
shell.cp('test/e2e/adminuiCustom/*',    'test-dist/test/e2e/adminuiCustom/');
shell.cp('test/e2e/frontend/*',         'test-dist/test/e2e/frontend/');

shell.mkdir('-p', 'test-dist/src/admin/public/', 'test-dist/src/admin/server/templates/', 'test-dist/src/fields/types/markdown/');

shell.cp('-R', 'src/admin/public/js',           'test-dist/src/admin/public/');
shell.cp('-R', 'src/admin/public/fonts',        'test-dist/src/admin/public/');
shell.cp('-R', 'src/admin/public/images',       'test-dist/src/admin/public/');
shell.cp('-R', 'src/admin/public/styles',       'test-dist/src/admin/public/');
shell.cp('-R', 'src/admin/server/templates',    'test-dist/src/admin/server/');
shell.cp('-R', 'src/fields/types/markdown/less', 'test-dist/src/fields/types/markdown/');
