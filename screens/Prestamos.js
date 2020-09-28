import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Dimensions,
} from "react-native";
import { Container, Header, Content, Footer, Button } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeListView } from "react-native-swipe-list-view";
import RegistrarPrestamosScreen from "./PrestamosRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";
import {
  Prestamo,
  BANCOS_OPCIONES,
  PRESTAMOS_PLAZO_OPCIONES,
  PRESTAMOS_ROL_OPCIONES,
} from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  timestamp,
} from "../services/common";

const { width } = Dimensions.get("screen");

const PrestamosScreen = ({ route, navigation, props }) => {
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
        <ListaPrestamos {...route.params} />
      </Content>
    </Container>
  );
};

const ListaPrestamos = (props) => {
  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Prestamo.todosActivos();
    const objsWithKey = objs.map((e) => ({ ...e, key: e.id.toString() }));
    setData(objsWithKey);
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
    await Prestamo.remover(rowKey);
    setVersion(timestamp());
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: parseInt(width) * 0.4 }}>
          <Text style={{ paddingBottom: 5, color: "#5073F3" }}>
            <Text>ARS </Text>
            <B>{data.item.capital_principal}</B>
          </Text>
          {data.item.interes > 1 && (
            <View>
              <Text>
                <B>Interés: </B>
                <Text>{data.item.interes}%</Text>
              </Text>
            </View>
          )}
          <Text style={{ paddingBottom: 5 }}>
            {formatDate(data.item.fecha_operacion)}
          </Text>
          <Text>
            <B>Plazo: </B>
            <Text>{PRESTAMOS_PLAZO_OPCIONES[data.item.plazo].name}</Text>
          </Text>
        </View>
        <View style={{ width: parseInt(width) * 0.5 }}>
          <Text>
            <B>Como: </B>
            {PRESTAMOS_ROL_OPCIONES[data.item.rol]}
          </Text>
          <Text>
            <B>Descripción: </B>
            {data.item.descripcion}
          </Text>
          <Text>
            <B>Cuota vence en el día: </B>
            {data.item.dia_vencimiento_cuota}
          </Text>
          {data.item.debito_automatico == true && (
            <View>
              <B>Se débita de:</B>
              <Text>
                {BANCOS_OPCIONES[data.item.cuenta_banco_asociado].name} #
                {data.item.cuenta_numero}
              </Text>
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
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        minHeight={120}
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
    height: 140,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default PrestamosScreen;
export { RegistrarPrestamosScreen };
