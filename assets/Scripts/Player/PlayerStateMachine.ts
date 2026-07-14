import { _decorator, AnimationClip, Component, Node, Animation, SpriteFrame } from 'cc';
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../Base/StateMachine';
import { IdelSubStateMachine } from './IdelSubStateMachine';
import { TurnLeftSubStateMachine } from './TurnLeftSubStateMachine';
import { TurnRightSubStateMachine } from './TurnRightSubStateMachine';
import { BlockFrontSubStateMachine } from './BlockFrontSubStateMachine';
import { BlockBackSubStateMachine } from './BlockBackSubStateMachine';
import { BlockLeftSubStateMachine } from './BlockLeftSubStateMachine';
import { BlockRightSubStateMachine } from './BlockRightSubStateMachine';
import { BlockTurnLeftSubStateMachine } from './BlockTurnLeftSubStateMachine';
import { BlockTurnRightSubStateMachine } from './BlockTurnRightSubStateMachine';
import { EntityManager } from '../../Base/EntityManager';
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
  // 3. 右转状态
  // 4. 阻塞状态（前/后/左/右/左转/右转）
  initParams(){
    this.params.set(PARAMS_NAME_ENUM.IDLE,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,getInitParamsTrigger());
    this.params.set(PARAMS_NAME_ENUM.DIRECTION,getInitParamsNumber());
  }

  // 初始化状态机
  // 1. 空闲状态
  // 2. 左转状态
  // 3. 右转状态
  // 4. 阻塞状态（前/后/左/右/左转/右转）
  initStateState(){
    this.stateMachine.set(PARAMS_NAME_ENUM.IDLE,new IdelSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNLEFT,new TurnLeftSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.TURNRIGHT,new TurnRightSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKFRONT,new BlockFrontSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKBACK,new BlockBackSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKLEFT,new BlockLeftSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKRIGHT,new BlockRightSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT,new BlockTurnLeftSubStateMachine(this));
    this.stateMachine.set(PARAMS_NAME_ENUM.BLOCKTURNRIGHT,new BlockTurnRightSubStateMachine(this));
  }

  // 运行状态机
  run(){
    switch(this.currentState){
      case this.stateMachine.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
      case this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT):
        if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT);
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKTURNRIGHT);
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKFRONT);
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKBACK);
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKLEFT);
        }else if(this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.BLOCKRIGHT);
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNLEFT);
        }else if(this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value){
          this.currentState = this.stateMachine.get(PARAMS_NAME_ENUM.TURNRIGHT);
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
  // 当动画名包含以下关键字时，动画结束后回到空闲状态
  initAnimationEvent(){
    this.animationComponent.on(Animation.EventType.FINISHED, ()=>{
      const name = this.animationComponent.defaultClip.name;
      const whileList = ['turn','block']
      if(whileList.some(V=>name.includes(V))){
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE;
      }
    });
  }
}
