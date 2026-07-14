import { _decorator, Component,  SpriteFrame } from 'cc';
import { TileManager } from './TileManager';
import { creatUINode, randomByRange } from '../../Utils';
import DateManager from '../../Runtime/DateManager';
import ResourceManager from '../../Runtime/ResourceManager';
const { ccclass } = _decorator;

export const TILE_WIDTH = 55; // 瓦片宽度
export const TILE_HEIGHT = 55; // 瓦片高度

// 地块地图管理器
@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    // 加载地图资源
    const spriteFrames = await ResourceManager.Instance.loadDir('texture/tile');
    const { mapInfo } = DateManager.Instance;
    // 初始化瓦片信息
    DateManager.Instance.tileInfo = [];
    for (let i = 0; i < mapInfo.length; i++) {
      const row = mapInfo[i];
      // 初始化当前行的瓦片信息
      DateManager.Instance.tileInfo[i] = [];
      for (let j = 0; j < row.length; j++) {
        const tileType = row[j];
        if (tileType.src === null || tileType.type === null) {
          continue;
        }

        let number = tileType.src;
        if((number == 1|| number == 5 || number == 9) && i%2 == 0 && j%2 == 0){
          number += randomByRange(0,4);
        }

        const imgSrc = `tile (${number})`;
        // 创建节点
        const node = creatUINode();
        const spriteFrame = spriteFrames.find((frame: SpriteFrame) => frame.name === imgSrc) || null;
        const tileManager = node.addComponent(TileManager);
        const type = tileType.type
        tileManager.init(spriteFrame,i,j,type);
        DateManager.Instance.tileInfo[i][j] = tileManager;

        node.setParent(this.node);
      }
    }
  }
}
