/**
 * Applies the stored theme before first paint, and flags that scripting is
 * available so the motion layer can pre-hide anything it's about to reveal.
 *
 * This has to run as a blocking inline script: if we waited for React to
 * hydrate, a dark-mode visitor would get a white flash on every load, and
 * reveal targets would paint once at full opacity before animating in.
 *
 * It only touches <html>, which carries suppressHydrationWarning — mutating
 * anything React owns at this point would break hydration.
 */
const script = `(function(){try{
var stored=localStorage.getItem('fanero-theme')||'system';
var dark=stored==='dark'||(stored==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
document.documentElement.classList.toggle('dark',dark);
document.documentElement.classList.add('motion');
localStorage.setItem('fanero-dark',dark?'1':'0');
}catch(e){document.documentElement.classList.add('motion');}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
