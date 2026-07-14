import { _decorator, Component,Sprite, UITransform } from 'cc';
import { IEntity } from '../Levels';
import { PlayerStateMachine } from '../Scripts/Player/PlayerStateMachine';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager';
const { ccclass} = _decorator;

// 玩家管理器
@ccclass('EntityManager')
export class EntityManager extends Component {

  x:number = 0;
  y:number = 0;
  fsm:PlayerStateMachine = null;

  private _direction:DIRECTION_ENUM;
  private _state:ENTITY_STATE_ENUM;
  private _type:ENTITY_TYPE_ENUM;

  // 获取玩家方向
  get direction():DIRECTION_ENUM{
    return this._direction;
  }
  // 设置玩家方向
  set direction(newDirection:DIRECTION_ENUM){
    this._direction = newDirection;
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION,DIRECTION_ORDER_ENUM[this._direction]);
  }

  // 获取玩家状态
  get state():ENTITY_STATE_ENUM{
    return this._state;
  }
  // 设置玩家状态
  set state(newState:ENTITY_STATE_ENUM){
    this._state = newState;
    this.fsm.setParams(this._state,true);
  }

  // 初始化玩家
  async init(params: IEntity){
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

    this.x = params.x;
    this.y = params.y;
    this._type = params.type;
    this.direction = params.direction;
    this.state = params.state;
  }

  update(dt){
    // 更新玩家位置
    this.node.setPosition(this.x * TILE_WIDTH-1.5*TILE_WIDTH, - this.y * TILE_HEIGHT+1.5*TILE_HEIGHT);
  }

}

