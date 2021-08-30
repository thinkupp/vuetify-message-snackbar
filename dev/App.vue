<template>
  <v-app>
    <v-main>
      <v-subheader>基本应用</v-subheader>
      <v-btn @click="$message.success('命令执行成功')">success</v-btn>
      <v-btn @click="$message.info('来自一则电台消息: 文案变化了')">info</v-btn>
      <v-btn @click="$message.warning('这是一条警告消息')">warning</v-btn>
      <v-btn @click="$message.error('这是一条错误消息')">error</v-btn>
      <v-btn @click="$message.show('这是一条默认消息')">show</v-btn>
      <v-btn @click="$message.loading('这是一条Loading消息')">loading</v-btn>
      <v-btn @click="$message.timeout(1000).loading('这是一条Loading消息')">链式调用loading</v-btn>

      <v-subheader>在JS/TS文件中使用</v-subheader>
      <v-btn @click="useInJs">在JS/TS文件中使用</v-btn>

      <v-subheader>自定义方向</v-subheader>
      <v-btn @click="$message.topLeft().info('topLeft')">上左</v-btn>
      <v-btn @click="$message.top().info('top')">上中</v-btn>
      <v-btn @click="$message.topRight().info('topRight')">上右</v-btn>
      <v-btn @click="$message.bottomLeft().info('bottomLeft')">下左</v-btn>
      <v-btn @click="$message.bottom().info('bottom')">下中</v-btn>
      <v-btn @click="$message.bottomRight().info('bottomRight')">下右</v-btn>

      <v-subheader>消息条ICON</v-subheader>
      <v-btn @click="$message.messageIcon('mdi-domain').success('自定义ICON')">自定义ICON</v-btn>
      <v-btn @click="$message.messageIcon().success('隐藏预设的ICON')">隐藏预设的ICON</v-btn>

      <v-subheader>过渡效果</v-subheader>
      <v-btn @click="$message.transition().success('随机过渡效果')">随机过渡效果</v-btn>

      <v-subheader>函数式配置</v-subheader>
      <v-btn @click="$message.topLeft().color('#12d6cd').show('函数式配置背景色')">自定义背景色</v-btn>
      <v-btn @click="$message.offsetTop(Math.random() * 200).success('随机间距')">随机间距</v-btn>

      <v-subheader>通过传参配置</v-subheader>
      <v-btn @click="$message({color: '#12d6cd', message: '传参配置背景'})">自定义背景色</v-btn>
      <v-btn @click="$message({offsetTop: Math.random() * 200, message: '随机间距'})">随机间距</v-btn>

      <v-subheader>关闭按钮相关</v-subheader>
      <v-btn @click="$message.bottomRight().closeButtonContent('A_A').timeout(-1).info('设置关闭按钮文案')">设置关闭按钮文本</v-btn>

      <v-subheader>VNode</v-subheader>
      <v-btn @click="handleVNodeMessage">Message使用VNode</v-btn>
      <v-btn @click="handleVNodeCloaseButton">关闭按钮使用VNode</v-btn>

      <v-subheader>参数缓存</v-subheader>
      <v-btn @click="handleCustom">参数缓存</v-btn>

      <v-subheader>控制</v-subheader>
      <v-btn @click="handleClose">关闭创建的消息条</v-btn>
      <v-btn @click="handleAgain">创建一个相同的消息条</v-btn>
      <v-btn @click="$message.closeAll()">关闭全部</v-btn>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Notify } from "../src/main";

@Component
export default class App extends Vue {
  private handleVNodeMessage() {
    this.$message.success(this.$createElement('div', 'Message使用VNode'));
  }

  private handleVNodeCloaseButton() {
    this.$message.closeButtonContent(this.$createElement('div', 'VNode Close')).success('关闭按钮使用VNode');
  }

  private handleCustom() {
    this.$message.topRight().height('1000px').centered().save('custom_bar');
    this.$message.read('custom_bar').success('abc');
    this.$nextTick(() => {
      this.$message.read('custom_bar').info('cde');
    })
  }

  private handleClose() {
    const bar = this.$message.top().success('这个消息条将在1秒钟后通过close方法关闭');

    setTimeout(() => {
      bar.close()
    }, 1000);
  }

  private handleAgain() {
    const bar = this.$message.top().timeout(-1).closeButtonContent('^-^').info('消息条关闭1秒后将会通过again方法创建一个相同的消息条');

    setTimeout(() => {
      bar.close();

      setTimeout(() => {
        bar.again();
      }, 1000)
    }, 2000);
  }

  private created() {
    this.$message.success("Start~");
  }

  private useInJs() {
    Notify.success(" 通过import { Notify } from 'vuetify-message-snackbar' 即可调用");
  }
}
</script>
