import React, { PureComponent } from 'react';
import styles from './index.less';

/* eslint no-return-assign: 0 */
// riddle: https://riddle.alibaba-inc.com/riddles/2d9a4b90

class WaterWave extends PureComponent {
  static defaultProps = {
    height: 160,
  }

  componentDidMount() {
    this.renderChart();
  }

  renderChart() {
    const { percent, color = '#19AFFA' } = this.props;
    const data = percent / 100;

    if (!this.node || !data) {
      return;
    }

    const canvas = this.node;
    const ctx = canvas.getContext('2d');

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const radius = canvasWidth / 2;
    const lineWidth = 2;
    const cR = radius - (lineWidth);

    ctx.beginPath();
    ctx.lineWidth = lineWidth;

    const axisLength = canvasWidth - (lineWidth);
    const unit = axisLength / 8;
    const range = 0.2; // 振幅
    let currRange = range;
    const xOffset = lineWidth;
    let sp = 0; // 周期偏移量
    let currData = 0;
    const waveupsp = 0.005; // 水波上涨速度

    let arcStack = [];
    const bR = radius - (lineWidth);
    const circleOffset = -(Math.PI / 2);
    let circleLock = true;

    for (let i = circleOffset; i < circleOffset + (2 * Math.PI); i += 1 / (8 * Math.PI)) {
      arcStack.push([
        radius + (bR * Math.cos(i)),
        radius + (bR * Math.sin(i)),
      ]);
    }

    const cStartPoint = arcStack.shift();
    ctx.strokeStyle = color;
    ctx.moveTo(cStartPoint[0], cStartPoint[1]);

    function drawSin() {
      ctx.beginPath();
      ctx.save();

      const sinStack = [];
      for (let i = xOffset; i <= xOffset + axisLength; i += 20 / axisLength) {
        const x = sp + ((xOffset + i) / unit);
        const y = Math.sin(x) * currRange;
        const dx = i;
        const dy = ((2 * cR * (1 - currData)) + (radius - cR)) - (unit * y);

        ctx.lineTo(dx, dy);
        sinStack.push([dx, dy]);
      }

      const startPoint = sinStack.shift();

      ctx.lineTo(xOffset + axisLength, canvasHeight);
      ctx.lineTo(xOffset, canvasHeight);
      ctx.lineTo(startPoint[0], startPoint[1]);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      if (circleLock) {
        if (arcStack.length) {
          const temp = arcStack.shift();
          ctx.lineTo(temp[0], temp[1]);
          ctx.stroke();
        } else {
          circleLock = false;
          ctx.lineTo(cStartPoint[0], cStartPoint[1]);
          ctx.stroke();
          arcStack = null;

          ctx.globalCompositeOperation = 'destination-over';
          ctx.beginPath();
          ctx.lineWidth = lineWidth;
          ctx.arc(radius, radius, bR, 0, 2 * Math.PI, 1);

          ctx.beginPath();
          ctx.save();
          ctx.arc(radius, radius, radius - (3 * lineWidth), 0, 2 * Math.PI, 1);

          ctx.restore();
          ctx.clip();
          ctx.fillStyle = '#108ee9';
        }
      } else {
        if (data >= 0.85) {
          if (currRange > range / 4) {
            const t = range * 0.01;
            currRange -= t;
          }
        } else if (data <= 0.1) {
          if (currRange < range * 1.5) {
            const t = range * 0.01;
            currRange += t;
          }
        } else {
          if (currRange <= range) {
            const t = range * 0.01;
            currRange += t;
          }
          if (currRange >= range) {
            const t = range * 0.01;
            currRange -= t;
          }
        }
        if ((data - currData) > 0) {
          currData += waveupsp;
        }
        if ((data - currData) < 0) {
          currData -= waveupsp;
        }

        sp += 0.07;
        drawSin();
      }
      requestAnimationFrame(render);
    }

    render();
  }

  render() {
    const { percent, title, height } = this.props;
    return (
      <div className={styles.waterWave} ref={n => (this.root = n)}>
        <canvas ref={n => (this.node = n)} width={height} height={height} />
        <div className={styles.text} style={{ width: height }}>
          {
            title && <span>{title}</span>
          }
          <h4>{percent}%</h4>
        </div>
      </div>
    );
  }
}

export default WaterWave;
