import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55; // 瓦片宽度
export const TILE_HEIGHT = 55; // 瓦片高度

// 瓦片管理器
@ccclass('TileManager')
export class TileManager extends Component {
  init(spriteFrames: SpriteFrame, i: number, j: number) {
    const sprite = this.addComponent(Sprite);
    sprite.spriteFrame = spriteFrames;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT);
  }
}
