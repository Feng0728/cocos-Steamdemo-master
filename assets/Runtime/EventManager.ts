import Singleton from "../Base/Singleton";

interface IEvent{
  func:Function;
  ctx?:unknown;
}

// 数据单例
export default class EventManager extends Singleton{

  static get Instance() {
    return super.getInstance<EventManager>();
  }

  private eventDic : Map<String,Array<IEvent>> = new Map();

  // 绑定方法
  on(eventName:string,func:Function,ctx?:unknown){
    if(this.eventDic.has(eventName)){
      this.eventDic.get(eventName).push({func,ctx});
    }else{
      this.eventDic.set(eventName,[{func,ctx}]);
    }
  }

  // 解绑方法
  off(eventName:string,func:Function){
    if(this.eventDic.has(eventName)){
      const index = this.eventDic.get(eventName).findIndex(i => i.func == func);
      index > -1 && this.eventDic.get(eventName).splice(index,1);
    }
  }

  // 触发事件
  emit(eventName:string,...params:unknown[]){
    if(this.eventDic.has(eventName)){
      this.eventDic.get(eventName).forEach(({func,ctx}) => {
        ctx ? func.apply(ctx,params) : func(...params);
      });
    }
  }

  // 清除所有事件
  clear(){
    this.eventDic.clear();
  }
}
