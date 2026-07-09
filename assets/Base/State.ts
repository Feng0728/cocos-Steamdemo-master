import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import { PlayerStateMachine } from "../Scripts/Player/PlayerStateMachine";
import ResourceManager from "../Runtime/ResourceManager";

const ANIMATION_SPEED = 1/8;

/****
 * 1.需要知道自己的aimationClip
 * 2.需要播放动画的能力animation
 */
export default class State{
  private animationClip:AnimationClip;

  constructor(private fsm:PlayerStateMachine,
    private path:string,
    private wrapMode:AnimationClip.WrapMode = AnimationClip.WrapMode.Normal){
      this.init();
  }

  async init(){
    const promise = ResourceManager.Instance.loadDir(this.path);
    this.fsm.waitingList.push(promise);
    const spriteFrames = await promise;

    this.animationClip = new AnimationClip();

    const track  = new animation.ObjectTrack(); // 创建一个对象轨道

    // 指定轨道路径，即指定目标对象为 sprite 组件的 "spriteFrame" 属性
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    // 关键帧数组
    const frames :Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
    // 为轨道添加关键帧
    track.channel.curve.assignSorted(frames);

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track);
     // 整个动画剪辑的周期
    this.animationClip.duration = ANIMATION_SPEED * spriteFrames.length;
    // 循环播放
    this.animationClip.wrapMode = this.wrapMode;
  }

  // 运行状态
  run(){
    this.fsm.animationComponent.defaultClip = this.animationClip;
    this.fsm.animationComponent.play();
  }
}
