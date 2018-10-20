pushd %~dp0\..
call node_modules\.bin\babel-node --extensions ".ts,.tsx,.js,.jsx" sugar-docs-generator\CommandLineEntryPoint.ts -- %*
popd
