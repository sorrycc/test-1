import React, { Component } from 'react';
import G2 from 'g2';
import styles from './index.less';

/* eslint react/no-danger:0 */
class Pie extends Component {
  state = {
    legendData: [],
    left: undefined,
  }

  componentDidMount() {
    this.renderChart(this.props.data);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.renderChart(nextProps.data);
    }
  }

  handleRef = (n) => {
    this.node = n;
  }
  handleTotalRef = (n) => {
    this.totalNode = n;
  }


  handleLegendClick = (item, i) => {
    const newItem = item;
    newItem.checked = !newItem.checked;

    const legendData = this.state.legendData;
    legendData[i] = newItem;

    if (this.chart) {
      const filterItem = legendData.filter(l => l.checked).map(l => l.x);
      this.chart.filter('x', filterItem);
      this.chart.repaint();
    }

    this.setState({
      legendData,
    });
  }

  renderChart(data) {
    const {
      title, height = 0,
      hasLegend, fit = true,
      margin, percent, color,
      inner = 0.75,
      animate = true,
      } = this.props;

    let selected = this.props.selected || true;
    let tooltip = this.props.tooltips || true;

    let formatColor;
    if (percent) {
      selected = false;
      tooltip = false;
      formatColor = (value) => {
        if (value === '占比') {
          return color || '#0096fa';
        } else {
          return '#e9e9e9';
        }
      };

      /* eslint no-param-reassign: */
      data = [
        {
          x: '占比',
          y: parseFloat(percent),
        },
        {
          x: '反比',
          y: 100 - parseFloat(percent),
        },
      ];
    }

    if (!data || (data && data.length < 1)) {
      return;
    }

    let m = margin;
    if (!margin) {
      if (hasLegend) {
        m = [24, 240, 24, 0];
      } else if (percent) {
        m = [0, 0, 0, 0];
      } else {
        m = [24, 0, 24, 0];
      }
    }

    const h = title ? (height + m[0] + m[2] + (-46)) : (height + m[0] + m[2]);

    // clean
    this.node.innerHTML = '';

    const Stat = G2.Stat;

    const chart = new G2.Chart({
      container: this.node,
      forceFit: fit,
      height: h,
      plotCfg: {
        margin: m,
      },
      animate,
    });

    if (!tooltip) {
      chart.tooltip(false);
    } else {
      chart.tooltip({
        title: null,
      });
    }

    chart.axis(false);
    chart.legend(false);

    chart.source(data, {
      x: {
        type: 'cat',
        range: [0, 1],
      },
      y: {
        min: 0,
      },
    });

    chart.coord('theta', {
      inner,
    });

    chart.intervalStack().position(Stat.summary.percent('y')).color('x', formatColor).selected(selected);
    chart.render();

    let left = 0;
    if (this.totalNode) {
      left = -((this.totalNode.offsetWidth / 2) + ((margin || m)[1] / 2));
    }

    this.chart = chart;

    let legendData = [];
    if (hasLegend) {
      const geom = chart.getGeoms()[0]; // 获取所有的图形
      const items = geom.getData(); // 获取图形对应的数据
      legendData = items.map((item) => {
        /* eslint no-underscore-dangle:0 */
        const origin = item._origin;
        origin.color = item.color;
        origin.checked = true;
        return origin;
      });
    }

    this.setState({
      left,
      legendData,
    });
  }

  render() {
    const { height, title, valueFormat, subTitle, total, hasLegend } = this.props;
    const { legendData, left } = this.state;
    const mt = -(((legendData.length * 38) - 16) / 2);

    return (
      <div className={styles.pie} style={{ height }}>
        <div>
          { title && <h4 className={styles.title}>{title}</h4>}
          <div className={styles.content}>
            <div ref={this.handleRef} />
            {
              (subTitle || total) && <div
                className={styles.total}
                ref={this.handleTotalRef}
                style={{ marginLeft: left, opacity: left ? 1 : 0 }}
              >
                {
                  subTitle && <h4>{subTitle}</h4>
                }
                {
                  // eslint-disable-next-line
                  total && <p dangerouslySetInnerHTML={{ __html: total }} />
                }
              </div>
            }
            {
              hasLegend && <ul className={styles.legend} style={{ marginTop: mt }}>
                {
                  legendData.map((item, i) => (
                    <li key={item.x} onClick={() => this.handleLegendClick(item, i)}>
                      <span className={styles.dot} style={{ backgroundColor: !item.checked ? '#aaa' : item.color }} />
                      <span className={styles.legendTitle}>{item.x}</span>
                      <span className={styles.line} />
                      <span className={styles.percent}>{`${(item['..percent'] * 100).toFixed(2)}%`}</span>
                      <span
                        className={styles.value}
                        dangerouslySetInnerHTML={{
                          __html: valueFormat ? valueFormat(item.y) : item.y,
                        }}
                      />
                    </li>
                  ))
                }
              </ul>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default Pie;
