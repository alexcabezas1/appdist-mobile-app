import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from "react-native";
import { Container, Header, Content, Footer, Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import RegistrarInversionScreen from "./InversionesRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const InversionesScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("NuevaInversion")}
        >
          <Text style={styles.homeButton}>+ Nueva Inversion</Text>
        </Button>
        <ListaInversiones />
      </Content>
    </Container>
  );
};

const ListaInversiones = (props) => {
  return <View></View>;
};

const styles = {
  ...listStyles,
  rowFront: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 110,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default InversionesScreen;
export { RegistrarInversionScreen };
