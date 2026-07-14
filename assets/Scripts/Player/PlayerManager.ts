import { _decorator } from 'cc';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM} from '../../Enums';
import EventManager from '../../Runtime/EventManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { EntityManager } from '../../Base/EntityManager';
import DateManager from '../../Runtime/DateManager';
const { ccclass} = _decorator;

// 玩家管理器
@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {

  targetX:number = 0;
  targetY:number = 0;
  private readonly speed = 1/10;

  // 初始化玩家
  async init(){
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init();

    super.init({
      x:2,
      y:8,
      type:ENTITY_TYPE_ENUM.PLAYER,
      direction:DIRECTION_ENUM.TOP,
      state:ENTITY_STATE_ENUM.IDLE,
    });
    this.targetX = this.x;
    this.targetY = this.y;

    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL,this.inputHandle,this);
  }

  update(dt){
    this.updateXY();
    super.update(dt);
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


  inputHandle(inputDirection:CONTROLLER_ENUM){
    if(this.willBlock(inputDirection)){
      console.log("玩家被阻塞");
      return;
    }
    this.move(inputDirection);
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
      if(this.direction == DIRECTION_ENUM.TOP){
        this.direction = DIRECTION_ENUM.LEFT;
      }else if(this.direction == DIRECTION_ENUM.LEFT){
        this.direction = DIRECTION_ENUM.BOTTOM;
      }else if(this.direction == DIRECTION_ENUM.BOTTOM){
        this.direction = DIRECTION_ENUM.RIGHT;
      }else if(this.direction == DIRECTION_ENUM.RIGHT){
        this.direction = DIRECTION_ENUM.TOP;
      }
      this.state = ENTITY_STATE_ENUM.TURNLEFT;
    }
  }

  // 检查是否被阻塞
  willBlock(inputDirection:CONTROLLER_ENUM){
    const {targetX:x,targetY:y,direction} = this;
    const {tileInfo} = DateManager.Instance;
    // 前进检查
    if(inputDirection == CONTROLLER_ENUM.TOP){
      if(direction == DIRECTION_ENUM.TOP){
        const playerNextY = y-1;
        const weaponNextY = y-2;
        if(playerNextY < 0){
          return true;
        }

        const playerTile = tileInfo[x][playerNextY];
        const weaponTile = tileInfo[x][weaponNextY];

        if(playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)
        ){
          //empty
        }else{
          return true;
        }

      }
    }else if(inputDirection == CONTROLLER_ENUM.TURNLEFT){ // 左转检查
      let nextX;
      let nextY;
      if(direction == DIRECTION_ENUM.TOP){
        nextX = x-1;
        nextY = y-1;
      }else if(direction == DIRECTION_ENUM.LEFT){
        nextX = x-1;
        nextY = y+1;
      }else if(direction == DIRECTION_ENUM.BOTTOM){
        nextX = x+1;
        nextY = y+1;
      }else if(direction == DIRECTION_ENUM.RIGHT){
        nextX = x+1;
        nextY = y-1;
      }

      if((!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
        (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
        (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
      ){
        //empty
      }else{
        return true;
      }

    }else if(inputDirection == CONTROLLER_ENUM.BOTTOM){ // 后退检查
      if(direction == DIRECTION_ENUM.BOTTOM){
        const playerNextY = y+1;
        const weaponNextY = y+2;
        if(playerNextY >= DateManager.Instance.mapRowCount){
          return true;
        }

        const playerTile = tileInfo[x][playerNextY];
        const weaponTile = tileInfo[x][weaponNextY];

        if(playerTile && playerTile.moveable && (!weaponTile || weaponTile.turnable)
        ){
          //empty
        }else{
          return true;
        }
      }
    }else if(inputDirection == CONTROLLER_ENUM.TURNRIGHT){ // 右转检查
      let nextX;
      let nextY;
      if(direction == DIRECTION_ENUM.TOP){
        nextX = x+1;
        nextY = y-1;
      }else if(direction == DIRECTION_ENUM.RIGHT){
        nextX = x+1;
        nextY = y+1;
      }else if(direction == DIRECTION_ENUM.BOTTOM){
        nextX = x-1;
        nextY = y+1;
      }else if(direction == DIRECTION_ENUM.LEFT){
        nextX = x-1;
        nextY = y-1;
      }

      if((!tileInfo[x][nextY] || tileInfo[x][nextY].turnable) &&
        (!tileInfo[nextX][y] || tileInfo[nextX][y].turnable) &&
        (!tileInfo[nextX][nextY] || tileInfo[nextX][nextY].turnable)
      ){
        //empty
      }else{
        return true;
      }
    }
    return false;
  }

}

