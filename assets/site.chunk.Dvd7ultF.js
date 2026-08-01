import { c as createComponent, e as createAstro, b as renderComponent, a as renderTemplate, m as maybeRenderHead, f as renderSlot } from './site.chunk.CxLaPaND.js';
import 'kleur/colors';
import { $ as $$Master } from './site.chunk.C3kegn27.js';
/* empty css                    */

const $$Astro = createAstro();
const $$Golf = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Golf;
  const { frontmatter, indexing, title, url } = Astro2.props;
  const _title = frontmatter?.title || title || "";
  return renderTemplate`${renderComponent($$result, "Master", $$Master, { "frontmatter": frontmatter, "indexing": indexing, "title": title, "heading": frontmatter.showHeading, "bodyClass": "golf" }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}
`, "pre-main-heading": ($$result2) => renderTemplate`${url !== "/golf/" && renderTemplate`${maybeRenderHead()}<nav aria-label="breadcrumb">
            <ol class="breadcrumb m-0 mb-4 fs-6 border-bottom">
               <li class="breadcrumb-item">
                  <a href="/golf/">
                     <svg class="doc-icon">
                        <use href="/icons/site-icons.svg#bi-house"></use>
                     </svg>
                     Golf
                  </a>
               </li>
               <li class="breadcrumb-item active" aria-current="page">
                  ${_title}
               </li>
            </ol>
         </nav>`}` })}`;
}, "/home/runner/work/htdocs/htdocs/src/templates/Golf.astro", void 0);

export { $$Golf as $ };
