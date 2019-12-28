import { tsquery } from '@phenomnomnominal/tsquery';
import ts from 'typescript';

const project = (tsquery.project('./tsconfig.json') as unknown) as {
  files: ts.SourceFile[];
  program: ts.Program;
};

function getIndex() {
  return project.files.filter(file => {
    return (
      file.fileName === '/Users/eldad/projects/feedfarm/functions/src/index.ts'
    );
  })[0];
}

function getExportedFunctions(file: ts.SourceFile) {
  return tsquery.query(
    file,
    'ExportDeclaration > NamedExports > ExportSpecifier > Identifier',
  );
}

function getFunctionPath(functionName: ts.Node, file: ts.SourceFile) {
  const importStatement = tsquery.query(
    file,
    `ImportDeclaration:has(ImportClause > Identifier[escapedText="${functionName.getText()}"]) > StringLiteral`,
  )[0];
  return importStatement.getText().slice(2, -1);
}

function getFunctionModule(functionPath: string) {
  return project.files.find(file => {
    return file.fileName.endsWith(functionPath + '.ts');
  });
}

function getCallbackType(file: ts.SourceFile) {
  const functionsHttpsCall = tsquery.query(
    file,
    'ExportAssignment CallExpression:has(PropertyAccessExpression Identifier[name="functions"]):has(PropertyAccessExpression Identifier[name="https"])',
  )[0] as ts.CallExpression;

  return project.program
    .getTypeChecker()
    .getTypeAtLocation(functionsHttpsCall.arguments[0]);
}

function main() {
  const indexFile = getIndex();
  const exportedFunctionNames = getExportedFunctions(indexFile);

  exportedFunctionNames
    // .filter(
    //   name =>
    //     getFunctionPath(name, indexFile) === '/functions/update-current-user',
    // )
    .forEach(exportedFunctionName => {
      const functionPath = getFunctionPath(exportedFunctionName, indexFile);

      const functionModule = getFunctionModule(functionPath)!;

      const callbackType = getCallbackType(functionModule);

      const signatures = project.program
        .getTypeChecker()
        .getSignaturesOfType(callbackType, ts.SignatureKind.Call);

      const signature = project.program
        .getTypeChecker()
        .signatureToString(
          signatures[0],
          undefined,
          ts.TypeFormatFlags.NoTruncation,
        );

      const implDataParam = tsquery
        .query(signature, 'ArrowFunction > Parameter:first-child')[0]
        .getText();
      const implReturnType = tsquery
        .query(signature, 'ArrowFunction > TypeReference')[0]
        .getFullText();

      console.log(`(${implDataParam}): ${implReturnType}`);
    });
}

main();
