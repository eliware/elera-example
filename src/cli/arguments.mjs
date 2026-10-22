const supportedArguments = new Set(["--help", "-h", "--version"]);

export function parseCliArguments(argumentsList) {
  const unsupportedArguments = argumentsList.filter(
    (argument) => !supportedArguments.has(argument),
  );
  if (unsupportedArguments.length > 0) return { action: "invalid", unsupportedArguments };
  if (argumentsList.includes("--version")) return { action: "version" };
  if (argumentsList.includes("--help") || argumentsList.includes("-h")) return { action: "help" };
  return { action: "start" };
}
