# Zafis — zkušební web

**Soukromý živý náhled:** https://zafis-garden-lab.zafis-420.chatgpt.site

Větev `zafis-web-test` obsahuje český zkušební web Zafis. Vychází ze šablony tohoto repozitáře a z `mara420/SlideshowAnimations` — varianta 26, Columns.

## Co je součástí

- Typografie a CSS scrollové animace z 8B design-studio-website-template.
- Přepínatelné fotografie v úvodním kruhu, bez automatického přehrávání.
- Animovaná galerie na počítači, galerie s posunem a tlačítky na telefonu.
- Služby, sezónní péče, průběh spolupráce, informace o firmě a FAQ.
- Zvětšení fotografií v dialogu a podpora klávesnice.
- Poptávka s náhledem textu, kopírováním a odkazem do vlastního e-mailu.

## Spuštění a úpravy

Soubory pro statický hosting jsou přímo v kořeni této větve. Není potřeba instalovat balíčky ani provádět build. Pro místní náhled spusťte v této složce například `python3 -m http.server 8000` a otevřete `http://localhost:8000`.

- `index.html`: české texty a původní CSS scrollovací engine.
- `css/zafis.css`: vzhled Zafis a responzivní rozvržení.
- `css/slideshow.css`, `js/slideshow.js`, `js/zafis-slider.js`: animace úvodních fotografií.
- `js/zafis.js`: galerie, výběr služby a příprava poptávky.
- `assets/`: fotografie, logo a místní fonty.
- `CREDITS.md`, `LICENSE`, `licenses/`: původ zdrojů a licence.

Původní alternativní soubor `index.gsap.html` a náhledy `previews/` zůstávají součástí historie šablony; web Zafis používá `index.html`.

## Poptávka a fotografie

Formulář zobrazí připravenou zprávu. Návštěvník ji může zkopírovat nebo otevřít ve vlastním e-mailu. Stránka sama e-mail neposílá a údaje neukládá.

Fotografie z webu Zafis ilustrují služby; nejsou přiřazeny vymyšleným zákazníkům ani projektům.

## Ověření

Ověřeno v prohlížeči v rozvržení pro počítač, mobil a tablet: úvodní slider, mobilní menu, galerie, dialog fotografií, klávesnicové ovládání a příprava poptávky. Kontrola JavaScriptové syntaxe a lokálních souborů prošla. Animace respektují systémové omezení pohybu a šablona má statickou záložní podobu.
