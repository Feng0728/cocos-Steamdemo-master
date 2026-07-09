import { _decorator, Component, Node } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH, TileMapManager } from '../Tile/TileMapManager';
import levels, { ILevel } from '../../Levels';
import { creatUINode } from '../../Utils';
import DateManager from '../../Runtime/DateManager';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM } from '../../Enums';
import { PlayerManager } from '../Player/PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    // 绑定事件
    onLoad(){
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL,this.nextLevel,this);
    }

    // 解绑事件
    onDestroy(){
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL,this.nextLevel);
    }

    start() {
        this.generateStage();
        this.initLevel();
    }

    // 初始化关卡
    initLevel(){
        const level = levels[`Level${DateManager.Instance.levelIndex}`];
        if(level){

            this.clearLevel();

            this.level = level;

            DateManager.Instance.mapInfo = this.level.mapInfo;
            DateManager.Instance.mapRowCount = this.level.mapInfo.length || 0;
            DateManager.Instance.mapColCount = this.level.mapInfo[0].length || 0;

            this.generateTileMap();
            this.generatePlayer();
        }
    }

    // 下一关
    nextLevel(){
        DateManager.Instance.levelIndex++;
        this.initLevel();
    }

    // 清除关卡
    clearLevel(){
        this.stage.destroyAllChildren();
        DateManager.Instance.reset();
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

    // 生成玩家
    async generatePlayer(){
        const player = creatUINode();
        player.setParent(this.stage);
        const playerManager = player.addComponent(PlayerManager);
        await playerManager.init();
    }

    // 舞台适配位置
    adaptPos() {
        const { mapRowCount, mapColCount } = DateManager.Instance;
        const disX = TILE_WIDTH * mapColCount / 2;
        const disY = TILE_HEIGHT * mapRowCount / 2 + 80;

        this.stage.setPosition(-disX, disY);
    }
}


