/**
 * Applies the stored theme before first paint.
 *
 * This has to run as a blocking inline script: if we waited for React to
 * hydrate, a dark-mode visitor would get a white flash on every load.
 */
const script = `(function(){try{
var stored=localStorage.getItem('fanero-theme')||'system';
var dark=stored==='dark'||(stored==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',dark);
localStorage.setItem('fanero-dark',dark?'1':'0');
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
