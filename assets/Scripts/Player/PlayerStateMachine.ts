import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAME_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
const { ccclass} = _decorator;

type ParamsValueType = boolean | number;

export interface IParamsValue{
  type:FSM_PARAMS_TYPE_ENUM;
  value:ParamsValueType;
}

export const getInitParamsTrigger = ()=>{
  return{
    type:FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value:false,
  }
}

// 玩家状态机
@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {
  // 当前状态
  private _currentState:State = null;
  // 参数列表
  parm:Map<string,IParamsValue> = new Map();
  // 状态机列表
  stateMachine:Map<string,State> = new Map();
  // 动画组件
  animationComponent:Animation = null;
  // 等待列表
  waitingList:Array<Promise<SpriteFrame[]>> = [];

  // 获取参数
  getParams(paramsName:string){
    if(this.parm.has(paramsName)){
      return this.parm.get(paramsName).value;
    }
  }

  // 设置参数
  setParams(paramsName:string,value:ParamsValueType){
    if(this.parm.has(paramsName)){
      this.parm.get(paramsName).value = value;
      this.run();
    }
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

  async init(){
    this.animationComponent = this.addComponent(Animation);
    this.initParams();
    this.initStateState();

    await Promise.all(this.waitingList);
  }

  // 初始化参数
  // 1. 空闲状态
  // 2. 左转状态
  initParams(){
    this.parm.set(PARAME_NAME_ENUM.IDLE,getInitParamsTrigger());
    this.parm.set(PARAME_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
  }

  // 初始化状态机
  // 1. 空闲状态
  // 2. 左转状态
  initStateState(){
    this.stateMachine.set(PARAME_NAME_ENUM.IDLE,new State(this,"texture/player/idle/top",AnimationClip.WrapMode.Loop));
    this.stateMachine.set(PARAME_NAME_ENUM.TURNLEFT,new State(this,"texture/player/turnleft/top"));
  }

  // 运行状态机
  run(){
    switch(this.currentState){
      case this.stateMachine.get(PARAME_NAME_ENUM.IDLE):
      case this.stateMachine.get(PARAME_NAME_ENUM.TURNLEFT):
        if(this.parm.get(PARAME_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachine.get(PARAME_NAME_ENUM.TURNLEFT);
        }else if(this.parm.get(PARAME_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAME_NAME_ENUM.IDLE);
        }
        break;
      default:
        this.currentState = this.stateMachine.get(PARAME_NAME_ENUM.IDLE);
        break;
    }
  }
}
