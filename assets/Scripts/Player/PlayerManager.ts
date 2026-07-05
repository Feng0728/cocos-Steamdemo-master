import { _decorator, Component, Node, resources, Sprite, SpriteFrame, UITransform, Animation, AnimationClip, animation } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager';
import ResourceManager from '../../Runtime/ResourceManager';
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1/8;

// 玩家管理器
@ccclass('PlayerManager')
export class PlayerManager extends Component {
  async init(){
    const sprite = this.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;

    const uiTransform = this.getComponent(UITransform);
    uiTransform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

    const spriteFrames = await ResourceManager.Instance.loadDir("texture/player/idle/top");
    const animationComponent = this.addComponent(Animation);

    const animationClip = new AnimationClip();

    const track  = new animation.ObjectTrack(); // 创建一个对象轨道

    // 指定轨道路径，即指定目标对象为 sprite 组件的 "spriteFrame" 属性
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame');
    // 关键帧数组
    const frames :Array<[number, SpriteFrame]> = spriteFrames.map((item, index) => [ANIMATION_SPEED * index, item]);
    // 为轨道添加关键帧
    track.channel.curve.assignSorted(frames);

    // 最后将轨道添加到动画剪辑以应用
    animationClip.addTrack(track);
     // 整个动画剪辑的周期
    animationClip.duration = ANIMATION_SPEED * spriteFrames.length;
    // 循环播放
      animationClip.wrapMode = AnimationClip.WrapMode.Loop;
    // 设置默认动画剪辑
    animationComponent.defaultClip = animationClip;
    // 播放动画
    animationComponent.play();
  }

}

