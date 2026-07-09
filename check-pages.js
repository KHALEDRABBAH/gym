const fs = require('fs');
const content = fs.readFileSync('old_version/index.html', 'utf8');
const pages = ['daily-tasks', 'habits', 'analytics', 'study-work', 'exercise-library', 'roadmap', 'lifestyle', 'weekly-review', 'achievements'];

for (const p of pages) {
  const rx = new RegExp(`id="${p}"`, 'i');
  if (rx.test(content)) {
    console.log(`FOUND: ${p}`);
  } else {
    console.log(`NOT FOUND: ${p}`);
  }
}
