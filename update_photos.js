/**
 * Regenerate photos.json from files in kida101/.
 * Run: node update_photos.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PHOTO_DIR = path.join(ROOT, 'kida101');
const OUTPUT = path.join(ROOT, 'photos.json');
const WEB_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const MONTHS = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December'
};

function getCategory(name) {
    if (name.startsWith('AWSUCU')) return 'AWS Events';
    if (name.startsWith('Epicshots') || name.startsWith('_DSC') || name.startsWith('_MG_')) return 'Professional Shots';
    if (name.startsWith('IMG-')) return 'Community Moments';
    const dateMatch = name.match(/^(\d{8})_/);
    if (dateMatch) {
        const d = dateMatch[1];
        return `${MONTHS[d.slice(4, 6)]} ${d.slice(0, 4)} Events`;
    }
    if (name.startsWith('IMG_')) return 'Event Highlights';
    return 'Gallery';
}

function getTitle(name) {
    if (name.startsWith('AWSUCU')) return 'AWS Community Day';
    if (name.startsWith('Epicshots')) return 'Epic Event Capture';
    const dateMatch = name.match(/^(\d{8})_/);
    if (dateMatch) {
        const d = dateMatch[1];
        return `Event · ${d.slice(6, 8)}/${d.slice(4, 6)}/${d.slice(0, 4)}`;
    }
    if (name.startsWith('_DSC') || name.startsWith('_MG_')) return 'Professional Event Photo';
    if (name.startsWith('IMG-')) return 'Community Moment';
    if (name.startsWith('IMG_')) return 'Event Highlight';
    return 'Gallery Moment';
}

const photos = fs.readdirSync(PHOTO_DIR)
    .filter((file) => WEB_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
        file,
        category: getCategory(file),
        title: getTitle(file),
        photographer: 'Benjamin Wakida Eldon'
    }));

const manifest = {
    version: 1,
    folder: 'kida101/',
    count: photos.length,
    photos
};

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 4));
console.log(`Updated photos.json with ${photos.length} photos.`);
