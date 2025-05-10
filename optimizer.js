const fs = require('fs');
const path = require('path');

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

function formatCode(lines, lang) {
    if (lang === 'python') {
        return lines.join('\n');
    }

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

function getFileLanguage(fileName) {
    if (fileName.endsWith('.c')) return 'c';
    if (fileName.endsWith('.cpp')) return 'cpp';
    if (fileName.endsWith('.java')) return 'java';
    if (fileName.endsWith('.py')) return 'python';
    return null;
}

function main() {
    const inputFile = 'input.c';
    const outputFile = 'optimized_output.c';

    const lang = getFileLanguage(inputFile);
    if (!lang) {
        console.log('Unsupported file format. Please use .c, .cpp, .java, or .py files.');
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

    const optimizedLines = formattedCode.split('\n').length;

    fs.writeFileSync(outputFile, formattedCode);

    console.log('\n✅ Code optimization & formatting complete!');
    console.log(`Original Lines: ${originalLines}`);
    console.log(`Optimized Lines: ${optimizedLines}`);
    console.log(`Lines Saved: ${originalLines - optimizedLines}`);
    console.log('\nComment Removal Stats:');
    console.log(`Single-line comments removed: ${singleLineComments}`);
    console.log(`Multi-line comments removed: ${multiLineComments}`);
    console.log(`\n🔄 Output also saved to: ${outputFile}`);
    console.log('\nFormatted Code Preview:');
    console.log(formattedCode.slice(0, 300));
}

main();
