<template>
<view class="content">
  <view :style="{height:100,width:300}">
    <nb-form>
        <nb-item>
            <nb-input placeholder="Enter phone number" v-model="pNumber" keyboardType="number-pad"/>   
        </nb-item>
    </nb-form>
    <nb-button rounded primary :on-press="verifyMethod" class="button">
        <nb-text>Verify</nb-text>
    </nb-button>
  </view>
</view>
</template>

 <script>
import firebase from "react-native-firebase";

export default {
  mounted: function() {},
  data: function() {
    return {
      pNumber: "+91" + ""
    };
  },
  props: {
    navigation: {
      type: Object
    }
  },
  methods: {
    verifyMethod: function() {
      console.log(this.pNumber);
      firebase
        .auth()
        .signInWithPhoneNumber(this.pNumber)
        .then(confirmResult => {
          this.navigation.navigate("verify", {
            confirmResult: confirmResult,
            phoneNumber: this.pNumber
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.button {
  align-self: center;
  margin-top: 40;
}
.content {
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style>

 

