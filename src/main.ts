import * as types from "./message";
import { VueConstructor } from "vue";
import getNotify, { setGlobalOptions } from "./notify";

export const Notify = getNotify();

function init(Vue: VueConstructor, globalOptions?: types.InitOption): void {
  setGlobalOptions(globalOptions || {});
  Vue.prototype.$message = Notify;
}

export default {
  install: init
};
