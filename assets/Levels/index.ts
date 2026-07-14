import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from "../Enums";
import Level1 from "./Level1";
import Level2 from "./Level2";

// 定义实体接口
export interface IEntity {
  x:number;
  y:number;
  direction:DIRECTION_ENUM;
  type:ENTITY_TYPE_ENUM;
  state:ENTITY_STATE_ENUM;
}

// 定义瓦片接口
export interface ITile {
  src: number | null;
  type: TILE_TYPE_ENUM | null;
}

// 定义关卡接口
export interface ILevel {
  mapInfo: Array<Array<ITile>>;
  // 其他关卡属性...
}

// 定义关卡数据
const levels :Record<string, ILevel>= {
  Level1,
  Level2,
};

export default levels;
