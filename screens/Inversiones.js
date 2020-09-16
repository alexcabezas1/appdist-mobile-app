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
  const inversiones_con_cantidad_adquirida = [
    "compra_de_titulo",
    "accion",
    "bono",
    "otro",
  ];

  const inversiones_con_interes = ["plazo_fijo", "bono"];

  const data = [
    {
      key: "1",
      tipo_inversion: "Acción",
      tipo_inversion_key: "accion",
      capital_invertido: "2131.5",
      precio_unitario: "42.63",
      tasa_interes: "0",
      cantidad_adquirida: "50",
      fecha_vencimiento: undefined,
      acreditar_en: "HSBC BANK 9085978549584",
      debitar_de: "BANCO FRANCES 584954859484",
      fecha_transaccion: "01/01/2020",
      descripcion: "CROX",
      intermediario: "invertironline.com",
      fecha_creado_en: "15/09/2020",
    },
    {
      key: "2",
      tipo_inversion: "Acción",
      tipo_inversion_key: "accion",
      capital_invertido: "31560",
      precio_unitario: "3156.13",
      tasa_interes: "0",
      cantidad_adquirida: "10",
      fecha_vencimiento: undefined,
      acreditar_en: "BANCO FRANCES 584954859484",
      debitar_de: "HSBC BANK 9085978549584",
      fecha_transaccion: "01/11/2019",
      descripcion: "AMZN",
      intermediario: "Invertironline.com",
      fecha_creado_en: "15/09/2020",
    },
    {
      key: "3",
      tipo_inversion: "Plazo Fijo",
      tipo_inversion_key: "plazo_fijo",
      capital_invertido: "67000",
      precio_unitario: undefined,
      tasa_interes: "15",
      cantidad_adquirida: "1",
      fecha_vencimiento: "01/10/2020",
      acreditar_en: "BANCO FRANCES 584954859484",
      debitar_de: "HSBC BANK 9085978549584",
      fecha_transaccion: "01/10/2019",
      descripcion: "Ahorros",
      intermediario: undefined,
      fecha_creado_en: "15/09/2020",
    },
    {
      key: "4",
      tipo_inversion: "Plazo Fijo",
      tipo_inversion_key: "plazo_fijo",
      capital_invertido: "33000",
      precio_unitario: undefined,
      tasa_interes: "12",
      cantidad_adquirida: "1",
      fecha_vencimiento: "01/12/2020",
      acreditar_en: "HSBC BANK 9085978549584",
      debitar_de: "BANCO FRANCES 584954859484",
      fecha_transaccion: "01/12/2019",
      descripcion: "Otros ahorros",
      intermediario: undefined,
      fecha_creado_en: "15/09/2020",
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
        <View style={{ width: 130 }}>
          <Text>{data.item.fecha_transaccion}</Text>
          <Text style={{ paddingBottom: 5 }}>
            <Text>ARS </Text>
            <B>{data.item.capital_invertido}</B>
          </Text>
          <B>{data.item.tipo_inversion}</B>
          <Text>{data.item.descripcion}</Text>
          {inversiones_con_cantidad_adquirida.includes(
            data.item.tipo_inversion_key
          ) && (
            <View>
              <Text>{data.item.cantidad_adquirida} unidades</Text>
              <B>Precio</B>
              <Text>{data.item.precio_unitario} USD</Text>
            </View>
          )}
          {inversiones_con_interes.includes(data.item.tipo_inversion_key) && (
            <View>
              <Text>{data.item.tasa_interes} %</Text>
              <B>Vence</B>
              <Text>{data.item.fecha_vencimiento}</Text>
            </View>
          )}
        </View>
        <View style={{ width: 230 }}>
          {inversiones_con_cantidad_adquirida.includes(
            data.item.tipo_inversion_key
          ) && (
            <View>
              <B>Intermediario</B>
              <Text>{data.item.intermediario}</Text>
            </View>
          )}
          <B>Acreditar en</B>
          <Text>{data.item.acreditar_en}</Text>
          <B>Debitar de</B>
          <Text>{data.item.debitar_de}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Registrado el:</Text>
        <Text>{data.item.fecha_creado_en}</Text>
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
      message="¿Está seguro que quieres borrar la inversión?"
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
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        minHeight={170}
      />
    </View>
  );
};

const styles = {
  ...listStyles,
  rowFront: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 170,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default InversionesScreen;
export { RegistrarInversionScreen };
