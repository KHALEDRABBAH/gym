const fs = require('fs'); 
const pages = ['daily-tasks', 'habits', 'analytics', 'study-work', 'exercise-library', 'roadmap', 'lifestyle', 'weekly-review', 'achievements']; 
pages.forEach(p => { 
  fs.mkdirSync('src/app/' + p, {recursive: true}); 
  fs.writeFileSync('src/app/' + p + '/page.tsx', 'export default function Page() { return <div className="p-8 text-white"><h2>Page ' + p + '</h2><p>Coming Soon</p></div>; }'); 
});
