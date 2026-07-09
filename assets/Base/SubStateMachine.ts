import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import State from './State';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { StateMachine } from './StateMachine';
const { ccclass} = _decorator;

// 玩家状态机
export abstract class SubStateMachine extends Component {
  // 当前状态
  private _currentState:State = null;
  // 状态机列表
  stateMachine:Map<string,State> = new Map();

  // 构造函数
  constructor(public fsm:StateMachine){
    super();
  }

  // 获取当前状态
  get currentState(){
    return this._currentState;
  }

  // 设置当前状态
  set currentState(newState:State){
    this._currentState = newState;
    this._currentState.run();
  }

  // 运行状态机
  abstract run():void;
}
