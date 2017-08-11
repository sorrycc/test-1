import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    href: 'https://ant.design',
    avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
    no: `TradeCode ${i}`,
    title: `一个任务名称 ${i}`,
    owner: '曲丽丽',
    description: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 2,
    updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1} ${Math.floor(i / 2) + 1}:00:00`),
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1} ${Math.floor(i / 2) + 1}:00:00`),
    progress: Math.ceil(Math.random() * 100),
  });
}

export default {
  getRule: (req, res, u) => {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url;
    }

    const params = getUrlParams(url);

    let dataSource = [...tableListDataSource];

    if (params.sorter) {
      const s = params.sorter.split('_');
      dataSource = dataSource.sort((prev, next) => {
        if (s[1] === 'descend') {
          return next[s[0]] - prev[s[0]];
        }
        return prev[s[0]] - next[s[0]];
      });
    }

    if (params.status) {
      const s = params.status.split(',');
      if (s.length === 1) {
        dataSource = dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10));
      }
    }

    if (params.no) {
      dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
    }

    const result = {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize: 10,
        current: parseInt(params.currentPage, 10) || 1,
      },
    };

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },
  postRule: (req, res, u, b) => {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url;
    }

    const body = (b && b.body) || req.body;
    const method = body.method;

    switch (method) {
      /* eslint no-case-declarations:0 */
      case 'delete':
        const no = body.no;
        tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
        break;
      default:
        break;
    }

    const result = {
      list: tableListDataSource,
      pagination: {
        total: tableListDataSource.length,
      },
    };

    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
  },
};
