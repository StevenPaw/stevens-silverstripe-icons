#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfade
const scssPath = path.join(__dirname, '../client/src/styles/icons.scss');
const readmePath = path.join(__dirname, '../README.md');
const iconsBasePath = 'https://github.com/StevenPaw/stevens-silverstripe-icons/blob/main/client/src/icons';

// SCSS-Datei lesen und Icons extrahieren
function extractIcons() {
    const scssContent = fs.readFileSync(scssPath, 'utf8');

    // Regex um die Icon-Liste zu extrahieren
    const iconsMatch = scssContent.match(/\$icons:\s*\(([\s\S]*?)\);/);

    if (!iconsMatch) {
        throw new Error('Konnte Icon-Liste nicht in SCSS-Datei finden');
    }

    // Icons extrahieren und säubern
    const iconsString = iconsMatch[1];
    const icons = iconsString
        .split(',')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/['"]/g, ''))
        .filter(icon => icon !== 'empty'); // 'empty' Icon ausschließen

    return icons;
}

// Markdown-Tabelle generieren
function generateTable(icons) {
    const variants = ['element', 'admin', 'page'];

    let table = '| Element | Admin | Page |\n';
    table += '| ------- | ----- | ---- |\n';

    icons.forEach(icon => {
        const cells = variants.map(variant => {
            const iconName = `${icon}-${variant}`;
            const svgUrl = `${iconsBasePath}/${iconName}.svg?sanitize=true`;
            return `<img src="${svgUrl}" alt="${iconName}" width="32" height="32"> \`sp-icon-${iconName}\``;
        });

        table += `| ${cells.join(' | ')} |\n`;
    });

    return table;
}

// README aktualisieren
function updateReadme(table, iconCount) {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Suche nach dem Marker für die Tabelle
    const tableStart = '## Available icons';
    const tableStartIndex = readmeContent.indexOf(tableStart);

    if (tableStartIndex === -1) {
        throw new Error('Konnte "## Available icons" Sektion in README nicht finden');
    }

    // Schneide alles nach "## Available icons" ab
    const beforeTable = readmeContent.substring(0, tableStartIndex + tableStart.length);

    // Neue README zusammensetzen
    const newReadme = `${beforeTable}\n\n${table}\n`;

    fs.writeFileSync(readmePath, newReadme, 'utf8');
    console.log('✅ README.md erfolgreich aktualisiert!');
    console.log(`📝 ${iconCount} Icons in der Tabelle`);
}

// Main
try {
    console.log('🔄 Generiere Icon-Tabelle für README...');
    const icons = extractIcons();
    const table = generateTable(icons);
    updateReadme(table, icons.length);
} catch (error) {
    console.error('❌ Fehler:', error.message);
    process.exit(1);
}
