import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { TILE_TYPE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55; // 瓦片宽度
export const TILE_HEIGHT = 55; // 瓦片高度

// 瓦片管理器
@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM;
  moveable: boolean = true;
  turnable: boolean = true;
  init(spriteFrames: SpriteFrame, i: number, j: number, type: TILE_TYPE_ENUM) {
    this.type = type;
    // 初始化可移动性和可旋转性
    if(type == TILE_TYPE_ENUM.WALL_ROW ||
      type == TILE_TYPE_ENUM.WALL_COLUMN ||
      type == TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      type == TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      type == TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      type == TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
    ){
      // 墙
      this.moveable = false;
      this.turnable = false;
    }else if(type == TILE_TYPE_ENUM.CLIFF_CENTER || // 沙坡
      type == TILE_TYPE_ENUM.CLIFF_LEFT ||
      type == TILE_TYPE_ENUM.CLIFF_RIGHT
    ){
      // 沙坡
      this.moveable = false;
      this.turnable = true;
    }else if(type == TILE_TYPE_ENUM.FLOOR){
      // 地板
      this.moveable = true;
      this.turnable = true;
    }
    const sprite = this.addComponent(Sprite);
    sprite.spriteFrame = spriteFrames;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
  }
}
