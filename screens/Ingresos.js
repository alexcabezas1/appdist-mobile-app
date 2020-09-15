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
import RegistrarIngresoScreen from "./IngresosRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";

const IngresosScreen = ({ navigation, props }) => {
  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("NuevoIngreso")}
        >
          <Text style={styles.homeButton}>+ Nuevo Ingreso</Text>
        </Button>
        <ListaIngresos />
      </Content>
    </Container>
  );
};

const ListaIngresos = (props) => {
  const data = [
    {
      title: "Mensual",
      data: [
        {
          key: "mensual.1",
          cantidad: 145000000.5,
          origen: "Facturación como Autónomo",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: "mensual.2",
          cantidad: 32000.0,
          origen: "Alquiler de Propiedad",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: "mensual.3",
          cantidad: 900000,
          origen: "Sueldo en Relacion de Dependencia",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
      ],
    },
    {
      title: "Semanal",
      data: [
        {
          key: "semanal.4",
          cantidad: 145000000.5,
          origen: "Sueldo en Relacion de Dependencia",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: "semanal.5",
          cantidad: 32000.0,
          origen: "Sueldo en Relacion de Dependencia",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
      ],
    },
    {
      title: "Diario",
      data: [
        {
          key: "diario.6",
          cantidad: 5000,
          origen: "Extraordinario",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: "diario.7",
          cantidad: 4000.0,
          origen: "Otros",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
      ],
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
        <View style={{ width: 140 }}>
          <Text>ARS </Text>
          <B style={{ paddingBottom: 5 }}>{data.item.cantidad}</B>
          <Text style={{ paddingBottom: 5 }}>{data.item.recibido_en}</Text>
        </View>
        <View style={{ width: 250 }}>
          <B>Origen:</B>
          <Text>{data.item.origen}</Text>
          <B>Destino:</B>
          <Text>{data.item.destino}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Registrado el:</Text>
        <Text>{data.item.creado_en}</Text>
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
      title="Confirmación de la Operación"
      message="¿Está seguro que quieres borrar el ingreso?"
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
        minHeight={110}
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
    height: 110,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default IngresosScreen;
export { RegistrarIngresoScreen };
