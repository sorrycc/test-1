import numeral from 'numeral';
import ChartCard from './ChartCard';
import Bar from './Bar';
import Pie from './Pie';
import Radar from './Radar';
import Gauge from './Gauge';
import MiniArea from './MiniArea';
import MiniBar from './MiniBar';
import MiniProgress from './MiniProgress';
import Trend from './Trend';
import Field from './Field';
import NumberInfo from './NumberInfo';
import WaterWave from './WaterWave';
import { IconUp, IconDown } from './Icon';

numeral.yuan = val => `&yen; ${numeral(val).format('0,0')}`;

export default {
  IconUp,
  IconDown,
  numeral,
  Bar,
  Pie,
  Gauge,
  Radar,
  MiniBar,
  MiniArea,
  MiniProgress,
  ChartCard,
  Trend,
  Field,
  NumberInfo,
  WaterWave,
};
