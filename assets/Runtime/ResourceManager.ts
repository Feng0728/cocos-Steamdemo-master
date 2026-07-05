import { resources, SpriteFrame } from "cc";
import Singleton from "../Base/Singleton";

// 数据单例
export default class ResourceManager extends Singleton{

  static get Instance() {
    return super.getInstance<ResourceManager>();
  }

  // 加载资源
  loadDir(path: string , type : typeof SpriteFrame = SpriteFrame){
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, type, function(err, assets) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(assets);
        }
      });
    });
  }
}
