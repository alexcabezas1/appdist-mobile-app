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
import RegistrarIngreso from "./IngresosRegistrar";

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
          key: 1,
          cantidad: 145000000.5,
          origen: "Facturación como Autónomo",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: 2,
          cantidad: 32000.0,
          origen: "Alquiler de Propiedad",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: 3,
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
          key: 4,
          cantidad: 145000000.5,
          origen: "Sueldo en Relacion de Dependencia",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: 5,
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
          key: 4,
          cantidad: 5000,
          origen: "Extraordinario",
          destino: "HSBC 85945849584989",
          recibido_en: "03/04/2020",
          creado_en: "03/04/2020",
        },
        {
          key: 5,
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

  const B = (props) => (
    <Text style={{ fontWeight: "bold" }}>{props.children}</Text>
  );

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
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
        <View style={{ width: 150 }}>
          <Text style={{ paddingBottom: 5 }}>
            <Text>ARS </Text>
            <B>{data.item.cantidad}</B>
          </Text>
          <Text>Recibido el: {data.item.recibido_en}</Text>
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
        <Text style={{ paddingBottom: 5 }}>
          <Text>ARS </Text>
          <B>{data.item.cantidad}</B>
        </Text>
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
        onPress={() => deleteRow(rowMap, data.item.key)}
      >
        <Icon color="white" size={30} name="trash-can-outline" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <Text style={styles.sectionTitle}>{section.title}</Text>
  );

  return (
    <View style={styles.container}>
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

export default IngresosScreen;
export { RegistrarIngreso };
