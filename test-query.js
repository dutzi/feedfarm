const { tsquery } = require('@phenomnomnominal/tsquery');

const files = tsquery.project('./functions/tsconfig.json');
const sourceFiles = files.filter(file =>
  file.fileName.startsWith('/Users/eldad/projects/feedfarm/functions/src/'),
);

sourceFiles.forEach(ast => {
  if (
    ast.fileName !==
    '/Users/eldad/projects/feedfarm/functions/src/functions/create-feed.ts'
  ) {
    return;
  }

  let newSource;

  const functions = tsquery(ast, 'ExportAssignment FunctionExpression');
  const arrowFunctions = tsquery(ast, 'ExportAssignment ArrowFunction');

  const functionDeclaration = functions[0] || arrowFunctions[0];

  if (functionDeclaration) {
    newSource = tsquery.replace(
      ast.getText(),
      'ExportAssignment > CallExpression',
      node => {
        const children = node.getChildren().map(child => child.getText());

        if (children[0] === 'functions.https.onCall') {
          children[0] = '';

          if (children[2].slice(-1) === ',') {
            children[2] = children[2].slice(0, -1);
          }

          return children.join('');
        } else {
          throw new Error(
            `[firebase-functions-declarations] Could not parse file "${ast.fileName}"`,
          );
        }
      },
    );
  } else {
    const defaultExports = tsquery(
      ast,
      'ExportAssignment CallExpression Identifier',
    );

    if (
      defaultExports
        .map(call => call.getText())
        .join('.')
        .startsWith('functions.https.onCall')
    ) {
      newSource = tsquery.replace(
        ast.getText(),
        'ExportAssignment CallExpression',
        node => {
          const children = node.getChildren();
          if (
            children
              .map(child => child.getText())
              .slice(0)
              .join('')
              .match(/^functions\.https\.onCall\(.*?\)/)
          ) {
            return node.getChildren()[2].getText();
          }
        },
      );
    }
  }

  console.log(newSource);
});
