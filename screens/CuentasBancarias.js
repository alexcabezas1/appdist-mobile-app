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
import CuentasRegistrar from "./CuentasRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";

const CuentasScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("CuentasRegistrar")}
        >
          <Text style={styles.homeButton}>+ Nueva Cuenta Bancaria</Text>
        </Button>
        <ListaCuentas />
      </Content>
    </Container>
  );
};

const ListaCuentas = (props) => {
  const data = [
    {
      title: "Cuentas bancarias",
      data: [
        {
          key: "cuenta.1",
          banco: "Banco Galicia",
          nroCuenta: "4-127155030-17",
          type: "CBU",
          cc: "00015761117522",
        },
        {
          key: "cuenta.2",
          banco: "American Express",
          nroCuenta: "4-127155030-17",
          type: "CBU",
          cc: "202365068906090",
        },
        {
          key: "cuenta.3",
          banco: "Banco Nación",
          nroCuenta: "4-127155030-17",
          type: "CVU",
          cc: "111574792125490",
        },
      ],
    },
  ];
  const [listData, setListData] = useState(data);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const B = (props) => (
    <Text style={{ fontWeight: "bold" }}>{props.children}</Text>
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = ({ rowMap, rowKey }) => {
    setConfirmDialogVisible(false);
    closeRow(rowMap, rowKey);
    const [section] = rowKey.split(".");
    const newData = [...listData];
    const sectionIndex = listData.findIndex(
      (item) => item.title.toLowerCase() == section
    );
    const prevIndex = listData[sectionIndex].data.findIndex(
      (item) => item.key === rowKey
    );
    newData[sectionIndex].data.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: 150 }}>
          <Text style={{ paddingBottom: 5 }}>
            <B>{data.item.banco}</B>
          </Text>
        </View>
        <View style={{ width: 250 }}>
          <B>Cuenta número:</B>
          <Text>{data.item.nroCuenta}</Text>
          <B>{data.item.type}</B>
          <Text>{data.item.cc}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text style={{ paddingBottom: 5 }}>
          <Text>Nada por aquí.</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Icon color="white" size={30} name="keyboard-backspace" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          setItemToBeDelete({ rowMap, rowKey: data.item.key });
          setConfirmDialogVisible(true);
        }}
      >
        <Icon color="white" size={30} name="trash-can-outline" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  const confirmDelete = (props) => (
    <ConfirmDialog
      title="Confirmación de la operación"
      message="¿Está seguro que quieres borrar esta cuenta?"
      visible={confirmDialogVisible}
      onTouchOutside={() => setConfirmDialogVisible(false)}
      positiveButton={{
        title: "Sí",
        onPress: () => {
          deleteRow(itemToBeDelete);
        },
      }}
      negativeButton={{
        title: "No",
        onPress: () => setConfirmDialogVisible(false),
      }}
    />
  );

  return (
    <View style={styles.container}>
      {confirmDelete()}
      <SwipeListView
        useSectionList
        sections={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        renderSectionHeader={renderSectionHeader}
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        minHeight={100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 100,
    paddingLeft: 15,
    paddingRight: 15,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "#4f73f2",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "#d84343",
    right: 0,
  },
  item: {
    flexDirection: "row",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
  },
  homeButton: {
    color: "white",
    fontSize: 18,
  },
});

export default CuentasScreen;
export { CuentasRegistrar };
