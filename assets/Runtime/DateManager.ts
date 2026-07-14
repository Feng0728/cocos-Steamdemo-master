import Singleton from "../Base/Singleton";
import { ITile } from "../Levels/index";
import { TileManager } from "../Scripts/Tile/TileManager";

// 数据单例
export default class DateManager extends Singleton{

  static get Instance() {
    return super.getInstance<DateManager>();
  }

  // 地图信息
  mapInfo: Array<Array<ITile>>;
  // 瓦片信息
  tileInfo: Array<Array<TileManager>> = [];
  // 地图行数
  mapRowCount: number = 0;
  // 地图列数
  mapColCount: number = 0;
  // 当前关卡索引
  levelIndex: number = 1;


  // 重置数据
  reset(){
    this.mapInfo = [];
    this.tileInfo = [];
    this.mapRowCount = 0;
    this.mapColCount = 0;
  }
}
