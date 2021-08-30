import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'

import Message from '../src/main';

Vue.use(Vuetify);
Vue.use(Message, {
  appendTo: '.v-application--wrap',
  presetIcon: {
    success: "mdi-close-circle"
  },
});

new Vue({
  el: '#app',
  render: (h) => h(App),
  vuetify: new Vuetify()
})
