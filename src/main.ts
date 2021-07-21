import * as types from "./message";
import { VueConstructor } from "vue";
import getNotify, { setGlobalOptions } from "./core";

export const notify = getNotify();

function init(Vue: VueConstructor, globalOptions?: types.InitOption): void {
  setGlobalOptions(globalOptions || {});
  Vue.prototype.$message = notify;
}

export default {
  install: init
};
