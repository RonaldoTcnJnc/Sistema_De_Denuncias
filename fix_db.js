const fs = require('fs');
const files = [
    'c:\\Users\\USER\\Documents\\SistemaDeDenuncias\\SD\\database\\init.sql',
    'c:\\Users\\USER\\Documents\\SistemaDeDenuncias\\SD\\database\\README.md'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    console.log(`Processing ${f}...`);
    let content = fs.readFileSync(f, 'utf8');

    // Regular replacements
    content = content.split('Ã¡').join('á');
    content = content.split('Ã©').join('é');
    content = content.split('Ã³').join('ó');
    content = content.split('Ãº').join('ú'); // For "pÃºblico" -> "público"
    content = content.split('Ã±').join('ñ'); // For "SeÃ±al" -> "Señal"
    content = content.split('Ã‘').join('Ñ');
    content = content.split('Ã“').join('Ó');
    content = content.split('Ã‰').join('É');
    content = content.split('Ã ').join('à');

    // Special handling for í (often Ã + SoftHyphen 0xAD)
    // We check for the explicit sequence \u00C3\u00AD first (literal Ã­)
    content = content.split('Ã­').join('í');
    // Also check for \u00C3\u00AD (hex bytes C3 AD in Latin1 is Ã + SHY)
    // In UTF8, Ã is \u00C3. So we look for \u00C3\u00AD ?
    // If the file has "Ã" (C3 83) and "­" (C2 AD) -> C3 83 C2 AD.
    // If double encoded: C3 AD -> C3 83 C2 AD.

    // Let's rely on the copy-pasted 'Ã­' from the view_file causing the match.

    fs.writeFileSync(f, content, 'utf8');
});
console.log('Fix complete.');
