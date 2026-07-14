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
    }else if(inputDirection == CONTROLLER_ENUM.TURNRIGHT){
      if(this.direction == DIRECTION_ENUM.TOP){
        this.direction = DIRECTION_ENUM.RIGHT;
      }else if(this.direction == DIRECTION_ENUM.RIGHT){
        this.direction = DIRECTION_ENUM.BOTTOM;
      }else if(this.direction == DIRECTION_ENUM.BOTTOM){
        this.direction = DIRECTION_ENUM.LEFT;
      }else if(this.direction == DIRECTION_ENUM.LEFT){
        this.direction = DIRECTION_ENUM.TOP;
      }
      this.state = ENTITY_STATE_ENUM.TURNRIGHT;
    }
  }

  // 检查是否被阻塞
  willBlock(inputDirection:CONTROLLER_ENUM){
    const {targetX:x,targetY:y,direction} = this;
    const {tileInfo, mapRowCount, mapColCount} = DateManager.Instance;

    const isTileBlocked = (tx: number, ty: number): boolean => {
      if(tx < 0 || tx >= mapColCount || ty < 0 || ty >= mapRowCount){
        return true;
      }
      const tile = tileInfo[tx]?.[ty];
      return !tile || !tile.turnable;
    };

    const isMoveBlocked = (px: number, py: number, wx: number, wy: number): boolean => {
      if(px < 0 || px >= mapColCount || py < 0 || py >= mapRowCount){
        return true;
      }
      const playerTile = tileInfo[px]?.[py];
      const weaponTile = tileInfo[wx]?.[wy];
      return !playerTile || !playerTile.moveable || (weaponTile && !weaponTile.turnable);
    };

    // 根据玩家朝向计算武器移动后的位置（武器永远在玩家前方一格）
    const getWeaponNext = (pnX: number, pnY: number): [number, number] => {
      switch(direction){
        case DIRECTION_ENUM.TOP: return [pnX, pnY - 1];
        case DIRECTION_ENUM.BOTTOM: return [pnX, pnY + 1];
        case DIRECTION_ENUM.LEFT: return [pnX - 1, pnY];
        default: return [pnX + 1, pnY]; // RIGHT
      }
    };

    // 根据移动方向和玩家朝向，计算相对的格挡状态
    const getBlockState = (button: CONTROLLER_ENUM): ENTITY_STATE_ENUM => {
      if(button === CONTROLLER_ENUM.TOP){
        if(direction === DIRECTION_ENUM.TOP) return ENTITY_STATE_ENUM.BLOCKFRONT;
        if(direction === DIRECTION_ENUM.BOTTOM) return ENTITY_STATE_ENUM.BLOCKBACK;
        if(direction === DIRECTION_ENUM.LEFT) return ENTITY_STATE_ENUM.BLOCKRIGHT;
        return ENTITY_STATE_ENUM.BLOCKLEFT;
      }
      if(button === CONTROLLER_ENUM.BOTTOM){
        if(direction === DIRECTION_ENUM.TOP) return ENTITY_STATE_ENUM.BLOCKBACK;
        if(direction === DIRECTION_ENUM.BOTTOM) return ENTITY_STATE_ENUM.BLOCKFRONT;
        if(direction === DIRECTION_ENUM.LEFT) return ENTITY_STATE_ENUM.BLOCKLEFT;
        return ENTITY_STATE_ENUM.BLOCKRIGHT;
      }
      if(button === CONTROLLER_ENUM.LEFT){
        if(direction === DIRECTION_ENUM.TOP) return ENTITY_STATE_ENUM.BLOCKLEFT;
        if(direction === DIRECTION_ENUM.BOTTOM) return ENTITY_STATE_ENUM.BLOCKRIGHT;
        if(direction === DIRECTION_ENUM.LEFT) return ENTITY_STATE_ENUM.BLOCKFRONT;
        return ENTITY_STATE_ENUM.BLOCKBACK;
      }
      // button === RIGHT
      if(direction === DIRECTION_ENUM.TOP) return ENTITY_STATE_ENUM.BLOCKRIGHT;
      if(direction === DIRECTION_ENUM.BOTTOM) return ENTITY_STATE_ENUM.BLOCKLEFT;
      if(direction === DIRECTION_ENUM.LEFT) return ENTITY_STATE_ENUM.BLOCKBACK;
      return ENTITY_STATE_ENUM.BLOCKFRONT;
    };

    if(inputDirection == CONTROLLER_ENUM.TOP){
      const playerNextY = y - 1;
      const [wx, wy] = getWeaponNext(x, playerNextY);
      if(isMoveBlocked(x, playerNextY, wx, wy)){
        this.state = getBlockState(CONTROLLER_ENUM.TOP);
        return true;
      }
    }else if(inputDirection == CONTROLLER_ENUM.BOTTOM){
      const playerNextY = y + 1;
      const [wx, wy] = getWeaponNext(x, playerNextY);
      if(isMoveBlocked(x, playerNextY, wx, wy)){
        this.state = getBlockState(CONTROLLER_ENUM.BOTTOM);
        return true;
      }
    }else if(inputDirection == CONTROLLER_ENUM.LEFT){
      const playerNextX = x - 1;
      const [wx, wy] = getWeaponNext(playerNextX, y);
      if(isMoveBlocked(playerNextX, y, wx, wy)){
        this.state = getBlockState(CONTROLLER_ENUM.LEFT);
        return true;
      }
    }else if(inputDirection == CONTROLLER_ENUM.RIGHT){
      const playerNextX = x + 1;
      const [wx, wy] = getWeaponNext(playerNextX, y);
      if(isMoveBlocked(playerNextX, y, wx, wy)){
        this.state = getBlockState(CONTROLLER_ENUM.RIGHT);
        return true;
      }
    }else if(inputDirection == CONTROLLER_ENUM.TURNLEFT){
      let nextX: number, nextY: number;
      if(direction == DIRECTION_ENUM.TOP){
        nextX = x - 1;
        nextY = y - 1;
      }else if(direction == DIRECTION_ENUM.LEFT){
        nextX = x - 1;
        nextY = y + 1;
      }else if(direction == DIRECTION_ENUM.BOTTOM){
        nextX = x + 1;
        nextY = y + 1;
      }else{
        nextX = x + 1;
        nextY = y - 1;
      }
      if(isTileBlocked(x, nextY) || isTileBlocked(nextX, y) || isTileBlocked(nextX, nextY)){
        this.state = ENTITY_STATE_ENUM.BLOCKTURNLEFT;
        return true;
      }
    }else if(inputDirection == CONTROLLER_ENUM.TURNRIGHT){
      let nextX: number, nextY: number;
      if(direction == DIRECTION_ENUM.TOP){
        nextX = x + 1;
        nextY = y - 1;
      }else if(direction == DIRECTION_ENUM.RIGHT){
        nextX = x + 1;
        nextY = y + 1;
      }else if(direction == DIRECTION_ENUM.BOTTOM){
        nextX = x - 1;
        nextY = y + 1;
      }else{
        nextX = x - 1;
        nextY = y - 1;
      }
      if(isTileBlocked(x, nextY) || isTileBlocked(nextX, y) || isTileBlocked(nextX, nextY)){
        this.state = ENTITY_STATE_ENUM.BLOCKTURNRIGHT;
        return true;
      }
    }
    return false;
  }

}

