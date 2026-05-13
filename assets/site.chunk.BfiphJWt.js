import { c as createComponent, e as createAstro, r as renderHead, g as addAttribute, f as renderSlot, a as renderTemplate } from './site.chunk.CtnFoe_2.js';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                    */

const $$Astro = createAstro();
const $$Master = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Master;
  const { frontmatter, indexing, title, heading, bodyClass } = Astro2.props;
  const _title = frontmatter?.title || title || "";
  const _indexing = frontmatter?.indexing || indexing || false;
  const _bodyClass = frontmatter?.bodyClass || bodyClass || "";
  const showHeading = heading !== false;
  return renderTemplate`<html lang="en">
   <head>
      <meta charset="utf-8">
      ${_indexing === false && renderTemplate`<meta name="robots" content="noindex">`}
      <title>
         ${`${_title ? _title : ""}${_title ? " \xB7 " : ""}ekelof.net`}
      </title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${frontmatter?.description && renderTemplate`<meta name="description"${addAttribute(frontmatter?.description, "content")}>`}
      <link rel="icon" href="/favicon.ico" sizes="48x48">
      <!-- Additional head elements -->
   ${renderHead()}</head>
   <body${addAttribute(_bodyClass ? `${_bodyClass}` : "", "class")}>
      ${renderSlot($$result, $$slots["body-content"], renderTemplate`
         <div class="doc-layout">
            <div class="doc-container">
               <main class="doc-content doc-dynamic-font">
                  ${showHeading && _title && renderTemplate`<h1 class="doc-main-heading">${_title}</h1>`}
                  ${renderSlot($$result, $$slots["default"])}
               </main>
            </div>
         </div>
      `)}
   </body></html>`;
}, "/home/runner/work/htdocs/htdocs/src/templates/master/Master.astro", void 0);

export { $$Master as $ };
