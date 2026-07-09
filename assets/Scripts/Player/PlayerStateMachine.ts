import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { IdelSubStateMachine } from './IdelSubStateMachine';
import { TurnLeftSubStateMachine } from './TurnLeftSubStateMachine';
const { ccclass} = _decorator;


// 玩家状态机
@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init(){
    this.animationComponent = this.addComponent(Animation);

    this.initParams();
    this.initStateState();
    this.initAnimationEvent();

    await Promise.all(this.waitingList);
  }

  // 初始化参数
  // 1. 空闲状态
  // 2. 左转状态
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber());
  }

  // 初始化状态机
  // 1. 空闲状态
  // 2. 左转状态
  initStateState(){
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE,new IdelSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this));
  }

  // 运行状态机
  run(){
    switch(this.currentState){
      case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
        if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT);
        }else if(this.params.get(PARAMS_NAME_ENUM.IDLE).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE);
        }else{
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.IDLE);
    }
  }

  // 动画完成事件
  // 1. 空闲状态
  // 2. 左转状态
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED, ()=>{
      const name = this.animationComponent.defaultClip.name;
      const whileList = ['turn']
      if(whileList.some(V=>name.includes(V))){
        this.setParams(PARAMS_NAME_ENUM.IDLE,true);
      }
    });
  }
}
