import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import State from './State';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums';
import { SubStateMachine } from './SubStateMachine';
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

export const getInitParamsNumber = ()=>{
  return{
    type:FSM_PARAMS_TYPE_ENUM.NUMBER,
    value:0,
  }
}

// 玩家状态机
@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  // 当前状态
  private _currentState:State|SubStateMachine = null;
  // 参数列表
  params:Map<string,IParamsValue> = new Map();
  // 状态机列表
  stateMachine:Map<string,State|SubStateMachine> = new Map();
  // 动画组件
  animationComponent:Animation = null;
  // 等待列表
  waitingList:Array<Promise<SpriteFrame[]>> = [];

  // 获取参数
  getParams(paramsName:string){
    if(this.params.has(paramsName)){
      return this.params.get(paramsName).value;
    }
  }

  // 设置参数
  setParams(paramsName:string,value:ParamsValueType){
    if(this.params.has(paramsName)){
      this.params.get(paramsName).value = value;
      this.run();
      this.resetTrigger();
    }
  }

  // 获取当前状态
  get currentState(){
    return this._currentState;
  }

  // 设置当前状态
  set currentState(newState:State|SubStateMachine){
    this._currentState = newState;
    this._currentState.run();
  }

  // 重置触发参数
  resetTrigger(){
    for(const [_,value] of this.params){
      if(value.type == FSM_PARAMS_TYPE_ENUM.TRIGGER){
        value.value = false;
      }
    }
  }

  // 初始化状态机
  abstract init():void;
  // 运行状态机
  abstract run():void;
}
