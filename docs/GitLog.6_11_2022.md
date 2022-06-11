# GitLog (6/11/2022)

## Feat
* support new CMS build process ([c336c8e](https://github.com/Everything-Explained/web-client/commit/c336c8e)) `5-16-2022`
* add new Disqus component to all literature pages ([abbc70c](https://github.com/Everything-Explained/web-client/commit/abbc70c)) `6-1-2022`

**App**
* save library literature scroll position ([477cdae](https://github.com/Everything-Explained/web-client/commit/477cdae)) `5-19-2022`

**staticPager**
* `goto()` now scrolls to top of page ([5e94519](https://github.com/Everything-Explained/web-client/commit/5e94519)) `5-19-2022`

**home**
* retrieve page data using API ([abdbc12](https://github.com/Everything-Explained/web-client/commit/abdbc12)) `5-23-2022`
* add cache support ([638b9ff](https://github.com/Everything-Explained/web-client/commit/638b9ff)) `6-9-2022`

**EmbeddedVideo**
* add custom Embedded Video Component ([e40262f](https://github.com/Everything-Explained/web-client/commit/e40262f)) `5-29-2022`
* add image preloader ([798edc2](https://github.com/Everything-Explained/web-client/commit/798edc2)) `6-2-2022`

**preloader**
* add image placeholder animation ([ac86ba2](https://github.com/Everything-Explained/web-client/commit/ac86ba2)) `6-2-2022`

**LitCards**
* hide 12 hour time on small devices ([8aea371](https://github.com/Everything-Explained/web-client/commit/8aea371)) `6-11-2022`

---

## Fix
* router is no longer accessible via app instance ([d1a6dca](https://github.com/Everything-Explained/web-client/commit/d1a6dca)) `5-19-2022`
* align pages with new versioning scheme ([80727a6](https://github.com/Everything-Explained/web-client/commit/80727a6)) `5-26-2022`
* wonky scroll behavior after overflow change ([344ff96](https://github.com/Everything-Explained/web-client/commit/344ff96)) `6-1-2022`
* do not access `localStorage` before cookie check ([1679df7](https://github.com/Everything-Explained/web-client/commit/1679df7)) `6-2-2022`

**eslint**
* prevent vue3 global macro lint errors ([442ab8b](https://github.com/Everything-Explained/web-client/commit/442ab8b)) `4-26-2022`
* add `max-attributes-per-line` with proper syntax ([dc9dc8a](https://github.com/Everything-Explained/web-client/commit/dc9dc8a)) `4-26-2022`

**staticPager**
* utilize cached page content ([a17abfa](https://github.com/Everything-Explained/web-client/commit/a17abfa)) `5-16-2022`

**AppLiterature**
* transition animation broken between same-url-links ([122996b](https://github.com/Everything-Explained/web-client/commit/122996b)) `5-18-2022`
* active content not initialized properly ([f9dfbf6](https://github.com/Everything-Explained/web-client/commit/f9dfbf6)) `6-2-2022`

**api_internal**
* update version structure to reflect build changes ([6a90edf](https://github.com/Everything-Explained/web-client/commit/6a90edf)) `5-23-2022`
* `init()` should initialize all required data ([4e1d1b5](https://github.com/Everything-Explained/web-client/commit/4e1d1b5)) `6-2-2022`
* init state was incorrectly implemented ([1bf026c](https://github.com/Everything-Explained/web-client/commit/1bf026c)) `6-11-2022`

**home**
* request page using `static` option ([7d1175b](https://github.com/Everything-Explained/web-client/commit/7d1175b)) `5-26-2022`
* use custom renderer for home page ([4de2a1c](https://github.com/Everything-Explained/web-client/commit/4de2a1c)) `5-29-2022`
* remove Disqus component ([2394428](https://github.com/Everything-Explained/web-client/commit/2394428)) `6-1-2022`
* use ref value (whoops) ([0428dd3](https://github.com/Everything-Explained/web-client/commit/0428dd3)) `6-9-2022`

**LitCards**
* trim spaces from author names ([9988330](https://github.com/Everything-Explained/web-client/commit/9988330)) `5-26-2022`
* padding missing between bullet and author name ([0759286](https://github.com/Everything-Explained/web-client/commit/0759286)) `5-26-2022`
* align author icon with author name ([34c661f](https://github.com/Everything-Explained/web-client/commit/34c661f)) `6-4-2022`
* `expanded` style not auto-centered ([f6e8d7c](https://github.com/Everything-Explained/web-client/commit/f6e8d7c)) `6-8-2022`
* forgot to apply default style ([da4603d](https://github.com/Everything-Explained/web-client/commit/da4603d)) `6-8-2022`
* prevent header text selection ([d530b6b](https://github.com/Everything-Explained/web-client/commit/d530b6b)) `6-8-2022`
* overlooked `expanded` style margin overwrite ([207933d](https://github.com/Everything-Explained/web-client/commit/207933d)) `6-8-2022`
* header bottom margin too large on mobile ([7735557](https://github.com/Everything-Explained/web-client/commit/7735557)) `6-11-2022`
* prevent summary text from overlapping border ([7966fbd](https://github.com/Everything-Explained/web-client/commit/7966fbd)) `6-11-2022`

**videos**
* "content" should be "summary" ([654f347](https://github.com/Everything-Explained/web-client/commit/654f347)) `5-26-2022`

**qnaform**
* use separate ID for each form ([badb610](https://github.com/Everything-Explained/web-client/commit/badb610)) `5-29-2022`
* using incorrect error interface ([a79cfd8](https://github.com/Everything-Explained/web-client/commit/a79cfd8)) `5-30-2022`
* required field count not aligned properly ([72a686e](https://github.com/Everything-Explained/web-client/commit/72a686e)) `5-30-2022`

**PageFooter**
* remove positioning logic and rely solely on CSS ([2f8e004](https://github.com/Everything-Explained/web-client/commit/2f8e004)) `5-30-2022`

**md**
* embedded video height scaling infinitely ([be38f00](https://github.com/Everything-Explained/web-client/commit/be38f00)) `6-1-2022`

**UxDisqus**
* remove `uid` and `count` code ([c64b4c9](https://github.com/Everything-Explained/web-client/commit/c64b4c9)) `6-1-2022`

**videoPagination**
* use `window` as scroll anchor ([91b3920](https://github.com/Everything-Explained/web-client/commit/91b3920)) `6-2-2022`

**index**
* move font face to default css ([c8957e4](https://github.com/Everything-Explained/web-client/commit/c8957e4)) `6-2-2022`
* edge icon 404 and background color missing ([e9d99c3](https://github.com/Everything-Explained/web-client/commit/e9d99c3)) `6-2-2022`

**router**
* update support page name ([591d57e](https://github.com/Everything-Explained/web-client/commit/591d57e)) `6-2-2022`
* update routes to reflect build path update ([97dfc35](https://github.com/Everything-Explained/web-client/commit/97dfc35)) `6-9-2022`

**changelog**
* wonky blockquote underlays ([356617e](https://github.com/Everything-Explained/web-client/commit/356617e)) `6-2-2022`

**qnaForm**
* button using incorrect attribute ([8030515](https://github.com/Everything-Explained/web-client/commit/8030515)) `6-4-2022`
* don't bind theme attribute on button ([a4b72ed](https://github.com/Everything-Explained/web-client/commit/a4b72ed)) `6-4-2022`
* add `undefined` to interface ([8855cd6](https://github.com/Everything-Explained/web-client/commit/8855cd6)) `6-4-2022`

**support**
* use window object for scroll reset ([90af371](https://github.com/Everything-Explained/web-client/commit/90af371)) `6-6-2022`

**header**
* off-center by 2 pixels ([4584845](https://github.com/Everything-Explained/web-client/commit/4584845)) `6-6-2022`

**toast**
* apply box shadow and new offset ([ded7844](https://github.com/Everything-Explained/web-client/commit/ded7844)) `6-6-2022`

**app**
* version toast using old scroll functionality ([48723e9](https://github.com/Everything-Explained/web-client/commit/48723e9)) `6-6-2022`
* saved scroll positions not always persisting ([0886301](https://github.com/Everything-Explained/web-client/commit/0886301)) `6-7-2022`
* scroll position edge case with managed pages ([63867e4](https://github.com/Everything-Explained/web-client/commit/63867e4)) `6-8-2022`

**titlebar**
* truncate long titles on mobile ([54d79e4](https://github.com/Everything-Explained/web-client/commit/54d79e4)) `6-6-2022`

**filter**
* filter state incorrect if toggled multiple times ([52717ff](https://github.com/Everything-Explained/web-client/commit/52717ff)) `6-8-2022`

**PublicVideos**
* use new URI ([8379f3a](https://github.com/Everything-Explained/web-client/commit/8379f3a)) `6-9-2022`

**markdown**
* blockquote needed relative position ([2e836a8](https://github.com/Everything-Explained/web-client/commit/2e836a8)) `6-9-2022`

**disqus**
* production env does not reset element ([b672b0b](https://github.com/Everything-Explained/web-client/commit/b672b0b)) `6-10-2022`

**Red33mAccessForm**
* don't use `document` to scroll ([260e44c](https://github.com/Everything-Explained/web-client/commit/260e44c)) `6-10-2022`

**cache**
* missing `home-page` (whoops) ([efb9d1b](https://github.com/Everything-Explained/web-client/commit/efb9d1b)) `6-10-2022`

---

## Docs
* add commit syntax docs ([4ce20d0](https://github.com/Everything-Explained/web-client/commit/4ce20d0)) `6-10-2022`
* create latest Git log from Gilmer compilation ([7245e2f](https://github.com/Everything-Explained/web-client/commit/7245e2f)) `6-10-2022`

---

## Clean
* remove all vue3 global macro imports ([250cb2c](https://github.com/Everything-Explained/web-client/commit/250cb2c)) `4-26-2022`
* re-order Vue component `template` and `script` directives ([f5a51f7](https://github.com/Everything-Explained/web-client/commit/f5a51f7)) `5-29-2022`
* simplify AppMarkdown logic ([acdea1b](https://github.com/Everything-Explained/web-client/commit/acdea1b)) `5-30-2022`

**checkbox**
* align CSS with BEM paradigm ([08e7201](https://github.com/Everything-Explained/web-client/commit/08e7201)) `5-29-2022`

**support**
* simplify question code and fix HTML lint errors ([f60e41a](https://github.com/Everything-Explained/web-client/commit/f60e41a)) `5-29-2022`

**AppMenu**
* refactor element declarations to reduce type-hacks ([8e89255](https://github.com/Everything-Explained/web-client/commit/8e89255)) `5-30-2022`

**qnaform**
* remove unused import ([62ea991](https://github.com/Everything-Explained/web-client/commit/62ea991)) `5-30-2022`

**titlebar**
* remove redundant defaults ([821ec63](https://github.com/Everything-Explained/web-client/commit/821ec63)) `5-30-2022`

**htmlNodeParser**
* inline imageHTML node mapping logic ([2859c78](https://github.com/Everything-Explained/web-client/commit/2859c78)) `5-30-2022`

**button**
* use proper Type for `theme` prop ([c56a5d9](https://github.com/Everything-Explained/web-client/commit/c56a5d9)) `5-30-2022`

**imageObserver**
* apply code maintenance ([b4bee2f](https://github.com/Everything-Explained/web-client/commit/b4bee2f)) `5-30-2022`

**filter**
* remove unused import ([321f49f](https://github.com/Everything-Explained/web-client/commit/321f49f)) `5-30-2022`

**changelog**
* clean CSS property order ([c59ff08](https://github.com/Everything-Explained/web-client/commit/c59ff08)) `6-7-2022`

---

## Upd

**staticPager**
* `isRunning` should include `isGettingPageContent` ([bcd9e52](https://github.com/Everything-Explained/web-client/commit/bcd9e52)) `5-19-2022`

**api_internal**
* use `v` for version query ([2f762ee](https://github.com/Everything-Explained/web-client/commit/2f762ee)) `5-26-2022`

**htmlNodeParser**
* use faster for loop ([6dad4ae](https://github.com/Everything-Explained/web-client/commit/6dad4ae)) `5-30-2022`

**qnaForm**
* uppercase "fatal error" ([56271b2](https://github.com/Everything-Explained/web-client/commit/56271b2)) `6-4-2022`

**footer**
* use new version ([0285370](https://github.com/Everything-Explained/web-client/commit/0285370)) `6-6-2022`

**main**
* remove eslint comment ([e46d76f](https://github.com/Everything-Explained/web-client/commit/e46d76f)) `6-10-2022`

**build**
* remove deprecated methods ([d479eba](https://github.com/Everything-Explained/web-client/commit/d479eba)) `6-10-2022`

---

## Css
* remove global "relative" position ([97070cb](https://github.com/Everything-Explained/web-client/commit/97070cb)) `5-26-2022`
* fix position `relative` bugs ([bcf27fd](https://github.com/Everything-Explained/web-client/commit/bcf27fd)) `5-29-2022`
* increase default body and markdown color brightness ([7f70397](https://github.com/Everything-Explained/web-client/commit/7f70397)) `6-6-2022`
* remove empty media queries ([91a876d](https://github.com/Everything-Explained/web-client/commit/91a876d)) `6-10-2022`
* add custom style for `sup` & `sub` elements ([6e10385](https://github.com/Everything-Explained/web-client/commit/6e10385)) `6-10-2022`

**qnaform**
* use Grid layout for form errors ([56f84bf](https://github.com/Everything-Explained/web-client/commit/56f84bf)) `5-30-2022`
* delay form error fade-out further ([cc622b0](https://github.com/Everything-Explained/web-client/commit/cc622b0)) `5-30-2022`

**defaults**
* use default overflow for html document ([f4df2f4](https://github.com/Everything-Explained/web-client/commit/f4df2f4)) `6-1-2022`

**red33mForm**
* clamp embedded video width to `480px` ([ef6166c](https://github.com/Everything-Explained/web-client/commit/ef6166c)) `6-1-2022`

**markdown**
* outline code block text ([5c14fa4](https://github.com/Everything-Explained/web-client/commit/5c14fa4)) `6-4-2022`

**changelog**
* reduce text shadow effect on flavor text ([8228eba](https://github.com/Everything-Explained/web-client/commit/8228eba)) `6-4-2022`
* emphasize and compact text blocks ([369fd83](https://github.com/Everything-Explained/web-client/commit/369fd83)) `6-6-2022`
* increase text block distance on desktop ([e6c2b2d](https://github.com/Everything-Explained/web-client/commit/e6c2b2d)) `6-7-2022`
* add better bevel border ([656f879](https://github.com/Everything-Explained/web-client/commit/656f879)) `6-10-2022`

**Red33mVideos**
* increase space around videos on mobile ([f11f7d3](https://github.com/Everything-Explained/web-client/commit/f11f7d3)) `6-4-2022`

**LitCards**
* use grid positioning instead of flex ([051d487](https://github.com/Everything-Explained/web-client/commit/051d487)) `6-6-2022`
* reduce whitespace for `expanded` cards ([03ba26d](https://github.com/Everything-Explained/web-client/commit/03ba26d)) `6-7-2022`

**variables**
* reduce `bold` color brightness ([938387e](https://github.com/Everything-Explained/web-client/commit/938387e)) `6-10-2022`

---

## Build

**deps**
* bump nth-check from 2.0.0 to 2.0.1 (#72) ([1859ec7](https://github.com/Everything-Explained/web-client/commit/1859ec7)) `6-2-2022`

---

## Chore
* remove deprecated property test ([e4ac7f9](https://github.com/Everything-Explained/web-client/commit/e4ac7f9)) `4-15-2022`
* deprecate and remove version manager ([187b4cc](https://github.com/Everything-Explained/web-client/commit/187b4cc)) `4-26-2022`
* rename change log page ([9c20fe1](https://github.com/Everything-Explained/web-client/commit/9c20fe1)) `5-18-2022`
* add & update all Vue & Vite dependencies ([f5490ab](https://github.com/Everything-Explained/web-client/commit/f5490ab)) `5-19-2022`
* rename support page ([0d29435](https://github.com/Everything-Explained/web-client/commit/0d29435)) `5-29-2022`
* update deps ([9ecfd21](https://github.com/Everything-Explained/web-client/commit/9ecfd21)) `5-29-2022`
* add interface for custom HTML element attribs ([c5e7663](https://github.com/Everything-Explained/web-client/commit/c5e7663)) `6-4-2022`
* update data URIs to match build server ([f9012db](https://github.com/Everything-Explained/web-client/commit/f9012db)) `6-9-2022`
* ignore generated `.js` source files in build folder ([e39f307](https://github.com/Everything-Explained/web-client/commit/e39f307)) `6-10-2022`

**vite**
* update ecma compilation options ([d49c80c](https://github.com/Everything-Explained/web-client/commit/d49c80c)) `5-19-2022`
* use `terser` minification method ([f8e83ee](https://github.com/Everything-Explained/web-client/commit/f8e83ee)) `6-10-2022`

**npm**
* add `--host` flag to dev script ([83c2a1b](https://github.com/Everything-Explained/web-client/commit/83c2a1b)) `6-2-2022`
* update postcss deps ([beb2bdf](https://github.com/Everything-Explained/web-client/commit/beb2bdf)) `6-2-2022`

**staticPager**
* remove testing code ([af93b46](https://github.com/Everything-Explained/web-client/commit/af93b46)) `6-4-2022`

**build**
* remove source files from versioning ([53792aa](https://github.com/Everything-Explained/web-client/commit/53792aa)) `6-10-2022`

---
