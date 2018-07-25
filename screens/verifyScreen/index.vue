<template>
<view class="content">
    <view :style="{height:100,width:300}">
        <nb-form>
            <nb-item>
                <nb-input placeholder="Enter Verification code" v-model="vCode" keyboardType="number-pad" />
            </nb-item>
        </nb-form>
        <nb-button rounded primary :on-press="confirmCode" class="button">
            <nb-text>Confirm</nb-text>
        </nb-button>
    </view>
</view>
</template>
 
<script>
import firestore from "./../../config/config.js";

export default {
  mounted: function() {},
  data: function() {
    return {
      vCode: ""
    };
  },
  props: {
    navigation: {
      type: Object
    }
  },
  methods: {
    confirmCode: function() {
      this.navigation.state.params.confirmResult
        .confirm(this.vCode)
        .then(async user => {
          var loggedInUser = await firestore
            .collection("users")
            .where(
              "phone-number",
              "==",
              this.navigation.state.params.phoneNumber
            )
            .get();
          console.log("loggedInUser", loggedInUser.docs[0]);
          this.navigation.navigate("home", {
            loggedInUserId: loggedInUser.docs[0].id
          });
        })
        .catch(error => {
          const { code, message } = error;
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
