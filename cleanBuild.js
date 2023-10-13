const fs = require('fs');
const path = require('path');

const outputDirectory = path.resolve(__dirname, 'dist/problem/javascripts');
const manifestPath = path.join(__dirname, 'dist/problem/manifest.json');  // Adjust this to the location of your manifest.json.

let deletedFiles = [];
let manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Check if manifest exists
if (fs.existsSync(manifestPath)) {

  fs.readdir(outputDirectory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      if (path.extname(file) === '.js') {
        const filePath = path.join(outputDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8').trim();

        if (!fileContents) {
          fs.unlink(filePath, err => {
            if (err) throw err;
            console.log(`Removed empty file: ${file}`);


            Object.entries(manifest).forEach(([key, value]) => {
              if (value.endsWith(file)) {
                delete manifest[key];
              }
            });

            try {
              fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            } catch (err) {
              console.error("Error writing to manifest.js:", err);
            }
          });

        }

      }

    });

  });
}
