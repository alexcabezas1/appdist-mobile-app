import React, { useState, useEffect } from "react";
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
import {
  Ingreso,
  BANCOS_OPCIONES,
  INGRESOS_FRECUENCIA_OPCIONES,
  INGRESOS_ORIGEN_OPCIONES,
} from "../services/models";
import { formatDate, formatDateTime, timestamp } from "../services/common";

const IngresosScreen = ({ route, navigation, props }) => {
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
        <ListaIngresos {...route.params} />
      </Content>
    </Container>
  );
};

const ListaIngresos = (props) => {
  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Ingreso.todos();
    const aux = {
      diario: [],
      mensual: [],
      semanal: [],
      una_vez: [],
    };
    objs.forEach((e) => aux[e.frecuencia].push(e));
    const auxData = Object.keys(aux).map((key, _) => ({
      title: INGRESOS_FRECUENCIA_OPCIONES[key],
      data: aux[key],
    }));
    setData(auxData);
  };

  useEffect(() => {
    fetchData();
  }, [version, props.version]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async ({ rowMap, rowKey }) => {
    setConfirmDialogVisible(false);
    closeRow(rowMap, rowKey);
    await Ingreso.remover(rowKey);
    setVersion(timestamp());
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: 140 }}>
          <Text style={{ color: "#5073F3" }}>ARS </Text>
          <B style={{ paddingBottom: 5, color: "#5073F3" }}>
            {data.item.cantidad}
          </B>
          <Text style={{ paddingBottom: 5 }}>
            {formatDate(data.item.fecha_operacion)}
          </Text>
          <Text>
            <B>
              {data.item.recurrencia > 0
                ? "x " + data.item.recurrencia + " veces"
                : "Indefinido"}{" "}
            </B>
          </Text>
        </View>
        <View style={{ width: 250 }}>
          <B>Origen:</B>
          <Text>{INGRESOS_ORIGEN_OPCIONES[data.item.origen]}</Text>
          <B>Destino:</B>
          <Text>
            {BANCOS_OPCIONES[data.item.cuenta_banco_asociado].name} #
            {data.item.cuenta_numero}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Registrado el:</Text>
        <Text>{formatDateTime(data.item.fecha_creacion)}</Text>
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
        sections={data}
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
