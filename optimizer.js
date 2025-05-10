const fs = require('fs');

// --- Remove comments and trim lines ---
function removeCommentsAndWhitespace(code, lang) {
    let singleLineComments = 0;
    let multiLineComments = 0;

    if (['c', 'cpp', 'java'].includes(lang)) {
        singleLineComments = (code.match(/\/\/.*/g) || []).length;
        code = code.replace(/\/\/.*/g, '');

        multiLineComments = (code.match(/\/\*[\s\S]*?\*\//g) || []).length;
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    } else if (lang === 'python') {
        singleLineComments = (code.match(/#.*/g) || []).length;
        code = code.replace(/#.*/g, '');

        multiLineComments = ((code.match(/'''[\s\S]*?'''/g) || []).length +
                             (code.match(/"""[\s\S]*?"""/g) || []).length);
        code = code.replace(/'''[\s\S]*?'''/g, '');
        code = code.replace(/"""[\s\S]*?"""/g, '');
    }

    const cleanedLines = code
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    return {
        cleanedLines,
        singleLineComments,
        multiLineComments
    };
}

// --- Split statements by semicolon ---
function splitSemicolonStatements(lines) {
    const result = [];

    for (const line of lines) {
        if (line.includes(';')) {
            const parts = line.split(';');
            for (let i = 0; i < parts.length; i++) {
                const stmt = parts[i].trim();
                if (stmt) result.push(stmt + (i < parts.length - 1 ? ';' : ''));
            }
        } else {
            result.push(line);
        }
    }

    return result;
}

// --- Format code with indentation ---
function formatCode(lines, lang) {
    if (lang === 'python') return lines.join('\n');

    let formatted = '';
    let indentLevel = 0;
    const indent = '    ';

    lines.forEach(line => {
        if (line.startsWith('}')) indentLevel--;
        formatted += indent.repeat(indentLevel) + line + '\n';
        if (line.endsWith('{')) indentLevel++;
    });

    return formatted.trim();
}

// --- Suggest and apply simplifications ---
function suggestSimplifications(code) {
    const suggestions = [];

    const checks = [
        {
            pattern: /\bif\s*\(\s*(\w+)\s*==\s*true\s*\)/g,
            replacement: 'if ($1)',
            desc: 'Simplify `if (x == true)` to `if (x)`'
        },
        {
            pattern: /\bif\s*\(\s*(\w+)\s*==\s*false\s*\)/g,
            replacement: 'if (!$1)',
            desc: 'Simplify `if (x == false)` to `if (!x)`'
        },
        {
            pattern: /\bwhile\s*\(\s*(\w+)\s*==\s*true\s*\)/g,
            replacement: 'while ($1)',
            desc: 'Simplify `while (x == true)` to `while (x)`'
        },
        {
            pattern: /\bwhile\s*\(\s*(\w+)\s*==\s*false\s*\)/g,
            replacement: 'while (!$1)',
            desc: 'Simplify `while (x == false)` to `while (!x)`'
        },
    ];

    checks.forEach(({ pattern, replacement, desc }) => {
        code = code.replace(pattern, (match, p1) => {
            suggestions.push(`${desc} at: "${match}"`);
            return replacement.replace('$1', p1);
        });
    });

    return {
        simplifiedCode: code,
        suggestions
    };
}

// --- Detect unused variables ---
function detectUnusedVariables(code) {
    const variablePattern = /\b(int|float|double|char|bool)\s+(\w+)\s*(=[^;]*)?;/g;
    const declaredVars = [];
    let match;

    while ((match = variablePattern.exec(code)) !== null) {
        declaredVars.push(match[2]);
    }

    const unused = declaredVars.filter(v =>
        !new RegExp(`\\b${v}\\b`, 'g').test(code.replace(new RegExp(`\\b${v}\\b\\s*=.*?;`, 'g'), ''))
    );

    return unused;
}

// --- Detect unused includes ---
function detectUnusedIncludes(code) {
    const includes = [...code.matchAll(/#include\s*<([^>]+)>/g)].map(m => m[1]);
    const usedHeaders = {
        stdio: /printf|scanf/,
        stdlib: /malloc|free|exit/,
        string: /strlen|strcpy|strcmp/,
        math: /sqrt|pow|sin|cos/
    };

    return includes.filter(header => {
        const key = header.replace('.h', '');
        const usageRegex = usedHeaders[key];
        return usageRegex ? !usageRegex.test(code) : true;
    });
}

// --- Identify language by file extension ---

function getFileLanguage(fileName) {
    if (fileName.endsWith('.c')) return 'c';
    if (fileName.endsWith('.cpp')) return 'cpp';
    if (fileName.endsWith('.java')) return 'java';
    if (fileName.endsWith('.py')) return 'python';
    return null;
}

// --- Main process ---
function main() {
    const inputFile = 'input.c';
    const outputFile = 'optimized_output.c';

    const lang = getFileLanguage(inputFile);
    if (!lang) {
        console.log('Unsupported file format. Use .c, .cpp, .java, or .py files.');
        return;
    }

    const rawCode = fs.readFileSync(inputFile, 'utf-8');
    const originalLines = rawCode.split('\n').length;

    const {
        cleanedLines,
        singleLineComments,
        multiLineComments
    } = removeCommentsAndWhitespace(rawCode, lang);

    const separatedStatements = splitSemicolonStatements(cleanedLines);
    const formattedCode = formatCode(separatedStatements, lang);

    const {
        simplifiedCode,
        suggestions: simplificationSuggestions
    } = suggestSimplifications(formattedCode);

    const optimizedLines = simplifiedCode.split('\n').length;
    const unusedVars = detectUnusedVariables(simplifiedCode);
    const unusedIncludes = detectUnusedIncludes(simplifiedCode);

    fs.writeFileSync(outputFile, simplifiedCode);

    // --- Output summary ---
    console.log('\n✅ Code optimization & formatting complete!');
    console.log(`Original Lines: ${originalLines}`);
    console.log(`Optimized Lines: ${optimizedLines}`);
    console.log(`Lines Saved: ${originalLines - optimizedLines}`);
    console.log('\n🧹 Comment Removal Stats:');
    console.log(`- Single-line comments removed: ${singleLineComments}`);
    console.log(`- Multi-line comments removed: ${multiLineComments}`);

    if (unusedVars.length > 0) {
        console.log('\n⚠️ Unused Variables:');
        unusedVars.forEach(v => console.log(`- ${v}`));
    }

    if (unusedIncludes.length > 0) {
        console.log('\n⚠️ Unused Includes:');
        unusedIncludes.forEach(h => console.log(`- #include <${h}>`));
    }

    if (simplificationSuggestions.length > 0) {
        console.log('\n✨ Simplifications Applied:');
        simplificationSuggestions.forEach(s => console.log(`- ${s}`));
    }

    console.log(`\n🔄 Output saved to: ${outputFile}`);
    console.log('\n🖥️ Preview:\n');
    console.log(simplifiedCode.slice(0, 300));
}

main();
