<template>
  <app-navigation></app-navigation>
  <!-- <view></view> -->
</template>
 
<script>
import homeScreen from "./screens/homeScreen/index";
import chatScreen from "./screens/chatScreen/index";
import logInScreen from "./screens/logInScreen/index";
import verifyScreen from "./screens/verifyScreen/index";

// import firebase from "react-native-firebase";

import { StackNavigator } from "vue-native-router";

const AppNavigation = StackNavigator(
  {
    home: homeScreen,
    chat: chatScreen,
    login: logInScreen,
    verify: verifyScreen
  },

  {
    initialRouteName: "login",
    headerMode: "none"
  }
);

export default {
  mounted: function() {
    // this.authSubscription =  firebase.auth().onAuthStateChanged((user) => {
    //     this.loading= false;
    //     this.user=user;
    // });
  },
  data: function() {
    return {
      loading: true,
      // authSubscription:function(){},
      user: ""
    };
  },
  destroyed() {
    // this.authSubscription();
  },

  components: { AppNavigation }
};
</script>
 

