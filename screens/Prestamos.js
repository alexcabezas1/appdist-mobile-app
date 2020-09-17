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
import RegistrarPrestamosScreen from "./PrestamosRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const PrestamosScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("NuevoPrestamo")}
        >
          <Text style={styles.homeButton}>+ Nuevo Préstamo</Text>
        </Button>
        <ListaPrestamos />
      </Content>
    </Container>
  );
};

const ListaPrestamos = (props) => {
  const data = [
    {
      key: "1",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTAMISTA",
      plazo: "6 meses",
      cantidad_de_cuotas: 6,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "2",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTATARIO",
      plazo: "3 meses",
      cantidad_de_cuotas: 12,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "3",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTATARIO",
      plazo: "1 año",
      cantidad_de_cuotas: 18,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "4",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTAMISTA",
      plazo: "6 meses",
      cantidad_de_cuotas: 3,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "5",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTAMISTA",
      plazo: "5 años",
      cantidad_de_cuotas: 12,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "6",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTATARIO",
      plazo: "3 meses",
      cantidad_de_cuotas: 24,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "7",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTAMISTA",
      plazo: "5 años",
      cantidad_de_cuotas: 6,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
    },
    {
      key: "8",
      capitalprincipal: 20500.5,
      interes: 21,
      rol: "PRESTATARIO",
      plazo: "6 meses",
      cantidad_de_cuotas: 12,
      fecha_vencimiento_en: "03/06/2020",
      fecha_transaccion_en: "03/01/2020",
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
        <View style={{ width: 140 }}>
          <Text style={{ paddingBottom: 5 }}>
            <Text>ARS </Text>
            <B>{data.item.capitalprincipal}</B>
          </Text>
          {data.item.interes > 1 && (
            <View>
              <Text>
                <B>Interés: </B>
                <Text>{data.item.interes}%</Text>
              </Text>
            </View>
          )}
          <Text style={{ paddingBottom: 5 }}>{data.item.fecha_transaccion_en}</Text>
          {data.item.cantidad_de_cuotas > 1 && (
            <View>
              <Text>
                <B>Cuotas: </B>
                {data.item.cantidad_de_cuotas}
              </Text>
            </View>
          )}
        </View>
        <View style={{ width: 220 }}>
          <B>{data.item.rol}</B>
          <Text><B>Plazo: </B>{data.item.plazo}</Text>
          <Text style={{ paddingBottom: 5 }}>
            <B>Fecha de vencimiento: </B>
            {data.item.fecha_transaccion_en}
            </Text>
        </View>
        
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Nada por aquí</Text>
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
      message="¿Está seguro que quieres borrar el préstamo?"
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
        minHeight={100}
      />
    </View>
  );
};

const styles = {
  ...listStyles,
};

export default PrestamosScreen;
export { RegistrarPrestamosScreen };
