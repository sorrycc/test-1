import React, { Component } from 'react';

import styles from './index.less';

/* eslint no-return-assign: 0 */
class MapChart extends Component {
  componentDidMount() {
    this.renderChart();
  }
  getRect() {
    // 0.4657 = 708 / 1520 (img origin size)
    const width = this.root.offsetWidth;
    const height = width * 0.4657;
    return {
      width,
      height,
    };
  }
  renderChart() {
    console.log(this.props.data);
  }
  render() {
    return (
      <div className={styles.mapChart} ref={n => (this.root = n)}>
        <div className={styles.canvas} ref={n => (this.root = n)}>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/rjzMUIkBLueJsRYFzfKh.png" alt="map" />
          <div ref={n => (this.node = n)} />
        </div>
      </div>
    );
  }
}

export default MapChart;
