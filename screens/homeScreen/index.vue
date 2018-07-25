<template>
  <nb-container>
    <nb-header />
    <nb-content v-if="loading">
      <activity-indicator size="large" color="#0000ff" />
    </nb-content>
    <nb-content v-if="!loading">
        <flat-list :data="conversations"
        :render-item="({item}) => renderList(item)"
        :navigation='navigation'
        >
      </flat-list>
    </nb-content>
  </nb-container>
</template>

 <script>
import React from "react";

import firestore from "./../../config/config.js";

import {
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  View,
  Icon
} from "native-base";

export default {
  mounted: async function() {
    this.getAllConversations(
      this.navigation.state.params.loggedInUserId.toString()
    );
  },
  data: function() {
    return {
      loading: true,
      conversations: [],
      conversation: {}
    };
  },
  props: {
    navigation: {
      type: Object
    }
  },
  methods: {
    renderList: function(item) {
      return (
        <ListItem
          avatar
          onPress={() => {
            this.handleTap(item);
          }}
        >
          <Left>
            <Thumbnail
              source={{
                uri:
                  "https://i.pinimg.com/564x/39/e9/b3/39e9b39628e745a39f900dc14ee4d9a7.jpg"
              }}
              small
            />
          </Left>
          <Body>
            <Text>{item.name}</Text>
          </Body>
        </ListItem>
      );
    },
    handleTap: function(item) {
      this.navigation.navigate("chat", {
        item: item,
        loggedInUserId: this.navigation.state.params.loggedInUserId.toString()
      });
      console.log("tapped!");
    },
    getAllConversations: async function(userId) {
      var userDoc = await firestore
        .collection("users")
        .doc(userId)
        .get();
      console.log(userDoc.data().inConversations);
      var convers = [];
      var i = 0;
      userDoc.data().inConversations.forEach(async conversationRef => {
        // i++;
        var conversationData = await conversationRef.get();
        if (conversationData.data().members.initUser.id == userId) {
          var otherUser = await conversationData.data().members.otherUser.get();
          console.log("i:", i);
          convers.push({
            name: otherUser.data().name,
            key: (i++).toString(),
            conversationRef: conversationRef
            // phoneNumber:otherUser.data().name
          });
        } else {
          var initUser = await conversationData.data().members.initUser.get();
          console.log("i1:", i);

          convers.push({
            name: initUser.data().name,
            key: (i++).toString(),
            conversationRef: conversationRef

            // phoneNumber:otherUser.data().name
          });
        }

        // console.log(initUser.data().name);
      });

      this.loading = false;
      this.conversations = convers;
    }
  },
  components: {}
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
