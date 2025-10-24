export function remarkClassNames() {
   // Loosely based on gatsby-remark-classes
   // https://github.com/chrisg86/gatsby-remark-classes/tree/main

   const PREFIX = 'doc';

   const CLASS_MAP = {
      heading: `${PREFIX}-heading`, // Handled separately to add depth
      paragraph: `${PREFIX}-p`,
      blockquote: `${PREFIX}-blockquote`,
      emphasis: `${PREFIX}-em`,
      strong: `${PREFIX}-strong`,
      inlineCode: `${PREFIX}-code`,
      link: `${PREFIX}-link`,
      list: `${PREFIX}-list`,
      listItem: `${PREFIX}-list__item`,
      image: `${PREFIX}-image`,
      table: `${PREFIX}-table`,
   };

   const applyClassesToNode = (node, classes) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.className = node.data.hProperties.className || [];
      node.data.hProperties.className.push(classes);
      return node;
   };

   const applyClasses = (node) => {
      if (node.children && node.children.length) {
         node.children.forEach(applyClasses);
      }
      if (node.type === 'heading') {
         applyClassesToNode(node, `${CLASS_MAP.heading}-${node.depth}`);
      } else {
         if (Object.hasOwnProperty.call(CLASS_MAP, node.type)) {
            applyClassesToNode(node, CLASS_MAP[node.type]);
         }
      }
      return node;
   };

   return function (tree) {
      tree.children.forEach(applyClasses);
   };
}
