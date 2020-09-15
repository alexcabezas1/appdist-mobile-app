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
import RegistrarEgresoScreen from "./EgresosRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const EgresosScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("NuevoEgreso")}
        >
          <Text style={styles.homeButton}>+ Nuevo Egreso</Text>
        </Button>
        <ListaEgresos />
      </Content>
    </Container>
  );
};

const ListaEgresos = (props) => {
  const data = [
    {
      key: "1",
      cantidad: 20500.5,
      motivo_del_gasto: "Alquiler",
      medio_de_pago: "Transferencia",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "03/01/2020",
      tarjeta: undefined,
      cuenta_bancaria: "HSBC Bank #9085978549584",
      fecha_creado_en: "03/01/2020",
    },
    {
      key: "2",
      cantidad: 100000.5,
      motivo_del_gasto: "Reparación en el Hogar",
      medio_de_pago: "Transferencia",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "03/0/2020",
      tarjeta: undefined,
      cuenta_bancaria: "HSBC Bank #9085978549584",
      fecha_creado_en: "03/0/2020",
    },
    {
      key: "3",
      cantidad: 4500.7,
      motivo_del_gasto: "Expensas",
      medio_de_pago: "Transferencia",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "10/01/2020",
      tarjeta: undefined,
      cuenta_bancaria: "Banco Ciudad #920398498343",
      fecha_creado_en: "10/01/2020",
    },
    {
      key: "4",
      cantidad: 12000,
      motivo_del_gasto: "Educación",
      medio_de_pago: "Tarjeta de Crédito",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "14/01/2020",
      tarjeta: "VISA 3243 4343 0988 1339",
      cuenta_bancaria: undefined,
      fecha_creado_en: "14/01/2020",
    },
    {
      key: "5",
      cantidad: 12000,
      motivo_del_gasto: "Compra de Criptomonedas",
      medio_de_pago: "Transferencia",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "14/01/2020",
      tarjeta: undefined,
      cuenta_bancaria: "Banco Ciudad #920398498343",
      fecha_creado_en: "14/01/2020",
    },
    {
      key: "6",
      cantidad: 9500.23,
      motivo_del_gasto: "Impuestos Nacionales",
      medio_de_pago: "Tarjeta de Débito",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 1,
      fecha_gastado_en: "31/03/2020",
      tarjeta: "VISA Débito 4435 7676 3233 2134",
      cuenta_bancaria: undefined,
      fecha_creado_en: "31/03/2020",
    },
    {
      key: "7",
      cantidad: 1500,
      motivo_del_gasto: "Compra de Ropa",
      medio_de_pago: "Tarjeta de Crédito",
      cuotas_prestamo_por_vencer: undefined,
      numero_de_cuotas: 6,
      fecha_gastado_en: "04/04/2020",
      tarjeta: "VISA 3243 4343 0988 1339",
      cuenta_bancaria: undefined,
      fecha_creado_en: "04/04/2020",
    },
    {
      key: "8",
      cantidad: 2500,
      motivo_del_gasto: "Cuota de Préstamo",
      medio_de_pago: "Débito de Automático",
      cuotas_prestamo_por_vencer: "Prestamo 2 - Cuota #9",
      numero_de_cuotas: 1,
      fecha_gastado_en: "04/05/2020",
      tarjeta: undefined,
      cuenta_bancaria: "HSBC Bank #9085978549584",
      fecha_creado_en: "04/05/2020",
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
            <B>{data.item.cantidad}</B>
          </Text>
          <Text style={{ paddingBottom: 5 }}>{data.item.fecha_gastado_en}</Text>
          {data.item.numero_de_cuotas > 1 && (
            <View>
              <Text>
                <B>Cuotas: </B>
                {data.item.numero_de_cuotas}
              </Text>
            </View>
          )}
        </View>
        <View style={{ width: 220 }}>
          <B>{data.item.motivo_del_gasto}</B>
          <Text>{data.item.medio_de_pago}</Text>
          {data.item.cuotas_prestamo_por_vencer && (
            <View>
              <Text>{data.item.cuotas_prestamo_por_vencer}</Text>
            </View>
          )}
          {data.item.tarjeta && (
            <View>
              <Text>{data.item.tarjeta}</Text>
            </View>
          )}
          {data.item.cuenta_bancaria && (
            <View>
              <Text>{data.item.cuenta_bancaria}</Text>
            </View>
          )}
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
      message="¿Está seguro que quieres borrar el egreso?"
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

export default EgresosScreen;
export { RegistrarEgresoScreen };
