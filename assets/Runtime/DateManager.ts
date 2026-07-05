import { ITile } from "../Levels/Level1";

// 数据单例
class DateManager {
  mapInfo: Array<Array<ITile>>;
  mapRowCount: number;
  mapColCount: number;
}

export const DateManagerInstance = new DateManager();
