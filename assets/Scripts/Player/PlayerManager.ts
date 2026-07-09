import { _decorator, Component, Node, resources, Sprite, SpriteFrame, UITransform, Animation, AnimationClip, animation } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
import { CONTROLLER_ENUM, EVENT_ENUM, PARAME_NAME_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
const { ccclass, property } = _decorator;

// 玩家管理器
@ccclass('PlayerManager')
export class PlayerManager extends Component {

  x:number = 0;
  y:number = 0;
  targetX:number = 0;
  targetY:number = 0;
  private readonly speed:number = 1/10;
  fsm:PlayerStateMachine = null;

  // 初始化玩家
  async init(){
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init();
    this.fsm.setParams(PARAME_NAME_ENUM.IDLE,true);

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.move,this);
  }

  update(dt){
    this.updateXY();
    // 更新玩家位置
    this.node.setPosition(this.x * TILE_WIDTH-1.5*TILE_WIDTH, - this.y * TILE_HEIGHT+1.5*TILE_HEIGHT);
  }

  // 更新玩家位置
  updateXY(){
    if(this.targetX < this.x){
      this.x -= this.speed;
    }else if(this.targetX > this.x){
      this.x += this.speed;
    }
    if(this.targetY < this.y){
      this.y -= this.speed;
    }else if(this.targetY > this.y){
      this.y += this.speed;
    }
    // 检查是否到达目标位置
    if(Math.abs(this.targetX - this.x) < this.speed && Math.abs(this.targetY - this.y) < this.speed){
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  // 移动玩家
  move(inputDirection:CONTROLLER_ENUM){
    if(inputDirection == CONTROLLER_ENUM.TOP){
      this.targetY = this.y - 1;
    }else if(inputDirection == CONTROLLER_ENUM.BOTTOM){
      this.targetY = this.y + 1;
    }else if(inputDirection == CONTROLLER_ENUM.LEFT){
      this.targetX = this.x - 1;
    }else if(inputDirection == CONTROLLER_ENUM.RIGHT){
      this.targetX = this.x + 1;
    }else if(inputDirection == CONTROLLER_ENUM.TURNLEFT){
      this.fsm.setParams(PARAME_NAME_ENUM.TURNLEFT,true);
    }
  }

}

