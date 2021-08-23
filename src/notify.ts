import * as types from "./message";
import createInstance from "./instance";

import { getOption, DefaultMessageOption, appendCss, getVuetifyInstance } from "./util";
import MessageQueueManager from "./manager";
import OptionHandle from "./attach";

let cssAppendFlag: boolean;
let message: types.message;
let globalOptions: types.InitOption = {};

const messageTypes: types.methodType[] = [
  "success",
  "info",
  "warning",
  "error",
  "show",
];

export default () => {
  if (message) return message;

  message = function(
    option: types.MessageOption | string,
    type?: types.methodType
  ): any {
    if (!cssAppendFlag) {
      appendCss();
      cssAppendFlag = true;
    }

    if (type) {
      if (!messageTypes.includes(type) || type === "show") {
        type = void 0;
      }
    }

    const messageConfig = getMessageConfig();
    const instance = createInstance(
      messageConfig,
      globalOptions!.appendTo,
      globalOptions?.presetIcon
    );

    return {
      close: instance.close,
      again: () => {
        return {
          close: createInstance(
            messageConfig,
            globalOptions!.appendTo,
            globalOptions?.presetIcon
          ).close,
        };
      },
    };

    function getMessageConfig() {
      return {
        ...new DefaultMessageOption(), // Default
        ...globalOptions, // Vue.use
        ...message.getOption(), // Functional
        ...getOption(option, type), // Argument
      };
    }
  } as types.message;

  setMessagePrototype();

  messageTypes.forEach((type: types.methodType) => {
    message[type] = (option: types.MessageOption | types.MessageType) =>
      message(option, type);
  });

  message.closeAll = MessageQueueManager.closeAll;

  return message;
};

export const setGlobalOptions = (options: types.InitOption) => {
  globalOptions = options;
  getVuetifyInstance(options.vuetifyInstance, options.vuetifyPreset);
  console.log("UseOptions", options);
  setMessagePrototype();
};

function setMessagePrototype() {
  Object.setPrototypeOf(
    message,
    new OptionHandle(globalOptions.autoTransitionSetting)
  );
}
