const path = require('path');

const homeTmpl = './template/Home/index';
const contentTmpl = './template/Content/index';
const scaffoldTmpl = './template/ScaffoldIframe';

function pickerGenerator(module) {
  const tester = new RegExp(`^docs/${module}`);
  return (markdownData) => {
    const filename = markdownData.meta.filename;
    if (tester.test(filename) && !/\/demo$/.test(path.dirname(filename))) {
      return {
        meta: markdownData.meta,
      };
    }
  };
}

module.exports = {
  lazyLoad(nodePath, nodeValue) {
    if (typeof nodeValue === 'string') {
      return true;
    }
    return nodePath.endsWith('/demo');
  },
  pick: {
    components(markdownData) {
      const filename = markdownData.meta.filename;

      if (!/^scaffold\/src\/components/.test(filename) ||
        /[/\\]demo$/.test(path.dirname(filename))) return;

      return {
        meta: markdownData.meta,
      };
    },
    changelog(markdownData) {
      if (/CHANGELOG/.test(markdownData.meta.filename)) {
        return {
          meta: markdownData.meta,
        };
      }
    },
    'docs/spec': pickerGenerator('spec'),
  },
  plugins: [
    'bisheng-plugin-description',
    'bisheng-plugin-toc?maxDepth=2&keepElem',
    'bisheng-plugin-antd',
    'bisheng-plugin-react?lang=__react',
  ],
  routes: {
    path: '/',
    component: './template/Layout/index',
    indexRoute: { component: homeTmpl },
    childRoutes: [
      {
        path: '/',
        component: homeTmpl,
      },
      {
        path: '/components',
        component: contentTmpl,
      },
      {
        path: '/components/:children',
        component: contentTmpl,
      },
      {
        path: '/docs/spec/:children',
        component: contentTmpl,
      },
      {
        path: '/scaffold',
        component: scaffoldTmpl,
      },
    ],
  },
};
