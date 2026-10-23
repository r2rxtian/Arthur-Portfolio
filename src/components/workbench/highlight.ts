/** A small, dependency-free highlighter for the PHP/JS/TS excerpts the workbench displays. */
export type TokenType = 'plain' | 'comment' | 'string' | 'variable' | 'number' | 'keyword' | 'function' | 'type';
export interface Token { text: string; type: TokenType }

const keywords = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'elseif', 'for', 'foreach', 'while', 'await', 'async', 'import', 'from',
  'export', 'new', 'class', 'extends', 'implements', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'null',
  'true', 'false', 'undefined', 'declare', 'require', 'require_once', 'include', 'use', 'namespace', 'public', 'private', 'protected',
  'static', 'fn', 'echo', 'array', 'match', 'default', 'switch', 'case', 'break', 'continue', 'this', 'self', 'interface', 'type',
  'as', 'readonly', 'void', 'string', 'number', 'boolean', 'int', 'bool', 'float', 'mixed', 'php', 'module', 'yield',
]);

export function highlight(code: string, language: string): Token[][] {
  const hashComments = language === 'php' || language === 'python';
  const pattern = new RegExp(
    [
      `(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*${hashComments ? '|#[^\\n]*' : ''})`, // 1 comment
      '(\'(?:\\\\.|[^\'\\\\])*\'|"(?:\\\\.|[^"\\\\])*"|`(?:\\\\.|[^`\\\\])*`)', // 2 string
      '(\\$[A-Za-z_]\\w*)', // 3 variable
      '(\\b\\d+(?:\\.\\d+)?\\b)', // 4 number
      '([A-Za-z_]\\w*)(?=\\s*\\()', // 5 function call
      '(\\b[A-Z][A-Za-z0-9_]*\\b)', // 6 type / constant
      '(\\b[A-Za-z_]\\w*\\b)', // 7 word
    ].join('|'),
    'g',
  );

  const tokens: Token[] = [];
  let cursor = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ text: code.slice(cursor, index), type: 'plain' });
    const [text, comment, string, variable, number, call, typeName, word] = match;
    const type: TokenType = comment ? 'comment' : string ? 'string' : variable ? 'variable' : number ? 'number'
      : call ? (keywords.has(call) ? 'keyword' : 'function') : typeName ? 'type'
      : word && keywords.has(word) ? 'keyword' : 'plain';
    tokens.push({ text, type });
    cursor = index + text.length;
  }
  if (cursor < code.length) tokens.push({ text: code.slice(cursor), type: 'plain' });

  // Split into lines while keeping each fragment's token type (comments and strings can span lines).
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    token.text.split('\n').forEach((part, index) => {
      if (index > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, type: token.type });
    });
  }
  return lines;
}
