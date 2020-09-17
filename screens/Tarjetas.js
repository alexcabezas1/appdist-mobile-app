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
import RegistrarTarjetaScreen from "./TarjetasRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const TarjetasScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("NuevaTarjeta")}
        >
          <Text style={styles.homeButton}>+ Nueva Tarjeta</Text>
        </Button>
        <ListaTarjetas />
      </Content>
    </Container>
  );
};

const ListaTarjetas = (props) => {
  const data = [
    {
      key: "1",
      banco: "Santander",
      entidad: "AMEX",
      numero: 4752,
      vencimiento: "11/20",
      fechaCreacion: "03/01/2020",
    },
    {
      key: "2",
      banco: "Santander",
      entidad: "VISA",
      numero: 4762,
      vencimiento: "11/22",
      fechaCreacion: "03/01/2020",
    },
    {
      key: "3",
      banco: "HSBC",
      entidad: "VISA",
      numero: 6375,
      vencimiento: "11/20",
      fechaCreacion: "03/01/2020",
    },
  ];

  const [listData, setListData] = useState(data);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = ({ rowMap, rowKey }) => {
    setConfirmDialogVisible(false);
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: 170 }}>
          <Text style={{ paddingBottom: 5 }}>
            <Text>Entidad: </Text>
            <B>{data.item.entidad}</B>
          </Text>
          <Text style={{ paddingBottom: 5 }}>
            <Text>Banco: </Text>
            <B>{data.item.banco}</B>
          </Text>
        </View>
        <View style={{ width: 220 }}>
          <Text style={{ paddingBottom: 5 }}>
            <Text>Tarjeta: </Text>
            <B>{data.item.numero}</B>
          </Text>

          <Text style={{ paddingBottom: 5 }}>
            <Text>Vencimiento: </Text>
            <B>{data.item.vencimiento}</B>
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Registrada el:</Text>
        <Text>{data.item.fechaCreacion}</Text>
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

  const confirmDelete = (props) => (
    <ConfirmDialog
      title="Confirmación de la Operación"
      message="¿Está seguro que quieres borrar la tarjeta?"
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
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={110}
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

const styles = {
  ...listStyles,
};

export default TarjetasScreen;
export { RegistrarTarjetaScreen };
