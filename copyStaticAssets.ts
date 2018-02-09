const shell = require('shelljs');

shell.mkdir('-p', 'dist/src/admin/public/', 'dist/src/admin/server/templates/', 'dist/src/fields/types/markdown/');
shell.cp('-R', 'src/admin/public/js',           'dist/admin/public/');
shell.cp('-R', 'src/admin/public/fonts',        'dist/admin/public/');
shell.cp('-R', 'src/admin/public/images',       'dist/admin/public/');
shell.cp('-R', 'src/admin/public/styles',       'dist/admin/public/');
shell.cp('-R', 'src/admin/server/templates',    'dist/admin/server/');
shell.cp('-R', 'src/fields/types/markdown/less', 'dist/fields/types/markdown/');
