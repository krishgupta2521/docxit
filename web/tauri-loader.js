// Tauri API Loader
// This script dynamically loads Tauri APIs when running in Tauri environment
(async function() {
  // Check if running in Tauri
  if (!window.__TAURI_INTERNALS__) {
    console.log('Running in browser/Electron mode');
    return;
  }

  console.log('Running in Tauri - loading APIs...');
  
  try {
    // Dynamically import Tauri APIs using ESM from unpkg CDN
    const { invoke } = await import('https://unpkg.com/@tauri-apps/api@2.1.1/core');
    const { open, save } = await import('https://unpkg.com/@tauri-apps/plugin-dialog@2.0.1');
    
    // Create a namespace for Tauri APIs to match our usage pattern
    window.__TAURI__ = {
      core: { invoke },
      dialog: { open, save }
    };
    
    console.log('Tauri APIs loaded successfully');
  } catch (error) {
    console.error('Failed to load Tauri APIs:', error);
    alert('Failed to initialize Tauri APIs. Please check your internet connection.');
  }
})();
