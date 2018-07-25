<template>
 <nb-container >
    <nb-header>
      <nb-left>
        <nb-button transparent :on-press="navigatePop">
          <nb-icon name="arrow-back" />
        </nb-button>
      </nb-left>
      <nb-right>
        <nb-button transparent :on-press="sendMesssageFromDifferentUser">
          <nb-text >Send me a message</nb-text>
        </nb-button>
      </nb-right>
    </nb-header>
    <nb-content v-if="loading">
      <activity-indicator size="large" color="#0000ff" />
    </nb-content>
    <gifted-chat
      v-if="!loading"
      :messages="messages"
      :on-send="onSend"
      :user="user"
    />
  </nb-container>
</template>
 
 <script>
import Vue from "vue-native-core";
import { VueNativeBase } from "native-base";
import { GiftedChat } from "react-native-gifted-chat";
import React from "react";
import * as firebase from "firebase";
require("firebase/firestore");
import firestore from "./../../config/config.js";
import moment from "moment";

Vue.use(VueNativeBase);

var senderLocal;

export default {
  mounted: async function() {
    var b = await this.navigation.state.params.item.conversationRef.get();
    console.log(
      "this.navigation.state.params.item.conversationRef",
      b.get("members").initUser
    );
    var initUserRef = b.get("members").initUser;
    var otherUserRef = b.get("members").otherUser;
    var initUserData = await initUserRef.get();
    var initUserObject = {
      _id: initUserData.id,
      name: initUserData.get("name")
    };
    var otherUserData = await otherUserRef.get();
    var otherUserObject = {
      _id: otherUserData.id,
      name: otherUserData.get("name")
    };
    console.log("initUserObject: ", initUserObject);
    console.log("otherUserObject: ", otherUserObject);
    var matchedMessages = await firestore
      .collection("messages")
      .where(
        "conversationRef",
        "==",
        this.navigation.state.params.item.conversationRef
      )
      .get();

    // var data = await matchedMessageRef.get();
    var matchedMessageRef = await this.getMessageRef(matchedMessages.docs[0]);
    matchedMessageRef
      .collection("convMessages")
      .orderBy("createdAt")
      .onSnapshot(snap => {
        this.onCollectionUpdate(
          snap,
          initUserRef,
          initUserObject,
          otherUserObject
        );
      });
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      messages: [],
      user: { _id: this.navigation.state.params.loggedInUserId, name: "mr_a" },
      // firstoreMessages:[] ,
      lastestMessageId: "",
      loading: true
    };
  },
  methods: {
    getMessageRef: async function(matchedDoc) {
      // var matchedMessageRef;
      if (!matchedDoc) {
        await firestore
          .collection("messages")
          .add({
            conversationRef: this.navigation.state.params.item.conversationRef
          })
          .then(docRef => {
            return docRef;
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });
        console.log("here");
      } else {
        return matchedDoc.ref;
        console.log("matchedMessagesRef:", matchedMessagesRef);
      }
      console.log("matchedMessagesRef1:", matchedMessagesRef);
      // return matchedMessageRef;
    },
    navigatePop: function() {
      this.navigation.pop();
    },
    sendMesssageFromDifferentUser: async function() {
      var userDocumentRef = firestore
        .collection("users")
        .doc("pTgOOwsi6qHhT9BnGkP1");
      var conMessage = await firestore
        .collection("messages")
        .where(
          "conversationRef",
          "==",
          this.navigation.state.params.item.conversationRef
        )
        .get();
      console.log("conMessage", conMessage);

      // conMessage.forEach(conMessageId => {
      //   conMessageId.ref.collection("convMessages").add({
      //     text: "hello",
      //     createdAt: moment().format(),
      //     user: userDocumentRef
      //   });
      // });
    },
    getSenderInfo: async function(sender) {
      var senderLocal;
      var senderRef = sender;
      // console.log(senderRef,"gjgkjhgkj");
      var sender1 = await senderRef.get();

      senderLocal = {
        _id: sender1.id,
        name: sender1.get("name")
      };
      console.log(senderLocal);
      return senderLocal;
    },
    onCollectionUpdate: async function(
      snap,
      initUserRef,
      initUserObject,
      otherUserObject
    ) {
      // var snapRef=snap.orderBy("text").limit(3);
      var latestMessages = [];
      console.log(new Date());
      var firstoreMessages = [];

      snap.docs.forEach(async messageDocument => {
        firstoreMessages.push({
          _id: messageDocument.id,
          text: messageDocument.data().text,
          createdAt: messageDocument.data().createdAt,
          user:
            messageDocument.data().user.id == initUserRef.id
              ? initUserObject
              : otherUserObject
        });

        // }
      });

      this.messages = firstoreMessages.reverse();
      this.loading = false;
      console.log(firstoreMessages);
    },

    onSend: async function(messages) {
      this.messages = GiftedChat.append(this.messages, messages);
      var userDocumentRef = firestore
        .collection("users")
        .doc(this.navigation.state.params.loggedInUserId.toString());
      var conMessage = await firestore
        .collection("messages")
        .where(
          "conversationRef",
          "==",
          this.navigation.state.params.item.conversationRef
        )
        .get();

      // allConversationMessages.forEach(conMessageId => {
      conMessage.docs[0].ref.collection("convMessages").add({
        text: messages[0].text,
        createdAt: moment().format(),
        user: userDocumentRef
      });
      // });
    }
  },
  components: {
    GiftedChat
  }
};
</script>
 
<style>
.container {
  background-color: red;
}
.gifted {
  height: 500;
  background-color: black;
}
.text-color-primary {
  color: blue;
}
</style>
