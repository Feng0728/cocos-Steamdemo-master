import Singleton from "../Base/Singleton";
import { ITile } from "../Levels/Level1";

// 数据单例
export default class DateManager extends Singleton{

  static get Instance() {
    return super.getInstance<DateManager>();
  }

  mapInfo: Array<Array<ITile>>;
  mapRowCount: number;
  mapColCount: number;
}
