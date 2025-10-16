import { c as createComponent, b as createAstro, r as renderHead, g as addAttribute, e as renderSlot, a as renderTemplate } from './docs.chunk.CQus0mYN.js';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                    */

const $$Astro = createAstro();
const $$Master = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Master;
  const { frontmatter, indexing } = Astro2.props;
  const title = frontmatter?.title || "";
  return renderTemplate`<html lang="en">
   <head>
      <meta charset="utf-8">
      ${frontmatter?.indexing === false || indexing === false && renderTemplate`<meta name="robots" content="noindex">`}
      <title>
         ${`${title ? title : ""}${title ? " \xB7 " : ""}ekelof.net`}
      </title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${frontmatter?.description && renderTemplate`<meta name="description"${addAttribute(frontmatter?.description, "content")}>`}
      <!-- Additional head elements -->
   ${renderHead()}</head>
   <body${addAttribute(frontmatter?.template ? `tmpl-${frontmatter?.template}` : "", "class")}>
      ${renderSlot($$result, $$slots["body-content"], renderTemplate`
         <div class="body">
            <main id="content">
               <div class="content-wrapper">
                  ${title && renderTemplate`<h1 class="doc-main-heading">${title}</h1>`}
                  ${renderSlot($$result, $$slots["default"])}
               </div>
            </main>
         </div>
      `)}
   </body></html>`;
}, "/home/runner/work/htdocs/htdocs/src/templates/master/Master.astro", void 0);

export { $$Master as $ };
