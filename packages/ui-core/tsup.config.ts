import ui from '@commonalityco/config-tsup/ui.json' assert { type: 'json' };

export default { ...ui, banner: { js: '"use client";' } };
