import { _decorator, Component, Layers, Node, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { TileManager } from './TileManager';
import { creatUINode } from '../../Utils';
import { DateManagerInstance } from '../../Runtime/DateManager';
const { ccclass, property } = _decorator;

export const TILE_WIDTH = 55; // 瓦片宽度
export const TILE_HEIGHT = 55; // 瓦片高度

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const spriteFrames = await this.loadRes();
    const { mapInfo } = DateManagerInstance;
    console.log(spriteFrames);
    for (let i = 0; i < mapInfo.length; i++) {
      const row = mapInfo[i];
      for (let j = 0; j < row.length; j++) {
        const tileType = row[j];
        if (tileType.src === null || tileType.type === null) {
          continue;
        }

        const node = creatUINode();
        const imgSrc = `tile (${tileType.src})`;
        const spriteFrame = spriteFrames.find((frame: SpriteFrame) => frame.name === imgSrc) || null;
        const tileManager = node.addComponent(TileManager);
        tileManager.init(spriteFrame,i,j);

        node.setParent(this.node);
      }
    }
  }

  // 加载资源
  loadRes(){
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir('texture/tile', SpriteFrame, (err, assets) => {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(assets);
        }
      });
    });
  }
}
