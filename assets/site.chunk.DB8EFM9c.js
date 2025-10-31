import { c as createComponent, e as createAstro, b as renderComponent, a as renderTemplate, f as renderSlot } from './site.chunk.CtnFoe_2.js';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Master } from './site.chunk.BXypl-bG.js';

const $$Astro = createAstro();
const $$Default = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Default;
  const { frontmatter, indexing, title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Master", $$Master, { "frontmatter": frontmatter, "indexing": indexing, "title": title }, { "default": ($$result2) => renderTemplate`
   ${renderSlot($$result2, $$slots["default"])}
` })}`;
}, "/home/runner/work/htdocs/htdocs/src/templates/Default.astro", void 0);

export { $$Default as $ };
