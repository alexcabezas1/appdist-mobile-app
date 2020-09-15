import React, { useState } from "react";
import { Text } from "react-native";

const B = (props) => (
  <Text style={{ fontWeight: "bold" }}>{props.children}</Text>
);

export { B };
