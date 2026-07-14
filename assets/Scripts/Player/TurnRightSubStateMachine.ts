import State from "../../Base/State";
import { StateMachine } from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";
import { DirectionSubStateMachine } from "../../Base/DirectionSubStateMachine";

const BASE_URL = "texture/player/turnright/";

// 子状态机：右转
export class TurnRightSubStateMachine extends DirectionSubStateMachine {

  constructor(fsm:StateMachine){
    super(fsm);
    this.stateMachine.set(DIRECTION_ENUM.TOP,new State(fsm,BASE_URL+"top"));
    this.stateMachine.set(DIRECTION_ENUM.BOTTOM,new State(fsm,BASE_URL+"bottom"));
    this.stateMachine.set(DIRECTION_ENUM.LEFT,new State(fsm,BASE_URL+"left"));
    this.stateMachine.set(DIRECTION_ENUM.RIGHT,new State(fsm,BASE_URL+"right"));
  }
}
