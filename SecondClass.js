import React, { Component } from "react";
import { View, Text } from "react-native";

export default class SecondClass extends Component {
  viewName = "";
  inputValue = "";

  constructor(prop) {
    super(prop);
    this.viewName = prop.title;
    // this.comp.inputValue.subscribe((res) => {
    //   console.log(res);
    //   console.log("here i am");
    // });
  }
  onInit() {
    console.log("hbnjk");
  }
  render() {
    return (
      <View>
        <input type="text" placeholder="input 2" />
        <Text>{this.inputValue}</Text>
      </View>
    );
  }
}
