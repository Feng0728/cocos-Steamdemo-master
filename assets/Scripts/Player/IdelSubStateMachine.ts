import { AnimationClip } from "cc";
import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { SubStateMachine } from "../../Base/SubStateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from "../../Enums";

const BASE_URL = "texture/player/idle/";

export class IdelSubStateMachine extends SubStateMachine {
  constructor(fsm:StateMachine){
    super(fsm);
    this.stateMachine.set(DIRECTION_ENUM.TOP,new State(fsm,BASE_URL+"top",AnimationClip.WrapMode.Loop));
    this.stateMachine.set(DIRECTION_ENUM.BOTTOM,new State(fsm,BASE_URL+"bottom",AnimationClip.WrapMode.Loop));
    this.stateMachine.set(DIRECTION_ENUM.LEFT,new State(fsm,BASE_URL+"left",AnimationClip.WrapMode.Loop));
    this.stateMachine.set(DIRECTION_ENUM.RIGHT,new State(fsm,BASE_URL+"right",AnimationClip.WrapMode.Loop));
  }

  run() {
    const value = this.fsm.getParams(PARAMS_NAME_ENUM.DIRECTION);
    this.currentState = this.stateMachine.get(DIRECTION_ORDER_ENUM[value as number]);
  }
}
