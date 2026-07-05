import { _decorator, Component, Node } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH, TileMapManager } from '../Tile/TileMapManager';
import levels, { ILevel } from '../../Levels/Level1';
import { creatUINode } from '../../Utils';
import { DateManagerInstance } from '../../Runtime/DateManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node
    start() {
        this.generateStage();
        this.initLevel();
    }

    // 初始化关卡
    initLevel(){
        const level = levels[`Level${1}`];
        if(level){
            this.level = level;

            DateManagerInstance.mapInfo = this.level.mapInfo;
            DateManagerInstance.mapRowCount = this.level.mapInfo.length || 0;
            DateManagerInstance.mapColCount = this.level.mapInfo[0].length || 0;

            this.generateTileMap();
        }
    }

    // 生成舞台
    generateStage() {
        this.stage = creatUINode();
        this.stage.setParent(this.node);
    }

    // 生成瓦片地图
    generateTileMap() {
        const stage = creatUINode();
        stage.setParent(this.stage);

        const tileMap = creatUINode();
        tileMap.setParent(stage);
        const tileMapManager = tileMap.addComponent(TileMapManager);
        tileMapManager.init();

        this.adaptPos();
    }

    // 舞台适配位置
    adaptPos() {
        const { mapRowCount, mapColCount } = DateManagerInstance;
        const disX = TILE_WIDTH * mapColCount / 2;
        const disY = TILE_HEIGHT * mapRowCount / 2 + 80;

        this.stage.setPosition(-disX, disY);
    }
}


