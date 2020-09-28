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
import RegistrarTarjetaScreen from "./TarjetasRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";
import {
  Tarjeta,
  BANCOS_OPCIONES,
  TARJETAS_TIPO_OPCIONES,
  TARJETAS_ENTIDAD_OPCIONES,
} from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  timestamp,
} from "../services/common";

const { width } = Dimensions.get("screen");

const TarjetasScreen = ({ route, navigation, props }) => {
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
        <ListaTarjetas {...route.params} />
      </Content>
    </Container>
  );
};

const ListaTarjetas = (props) => {
  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Tarjeta.tarjetasActivas();
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
    await Tarjeta.destroy(rowKey);
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
            <B>{TARJETAS_ENTIDAD_OPCIONES[data.item.entidad_emisor]}</B>
          </Text>
          <Text>
            <B>{TARJETAS_TIPO_OPCIONES[data.item.tipo]}</B> #
            {data.item.ultimos_numeros}
          </Text>
          <Text>{formatDateMonthAndYear(data.item.fecha_vencimiento)}</Text>
          {data.item.debito_automatico == true && (
            <Text>Débito Automático</Text>
          )}
        </View>
        <View style={{ width: parseInt(width) * 0.5 }}>
          {data.item.tipo === "credito" && (
            <View>
              <B>Cierre Resumen:</B>
              <Text>{formatDate(data.item.fecha_cierre_resumen)}</Text>
              <B>Vencimiento Resumen:</B>
              <Text>{formatDate(data.item.fecha_vencimiento_resumen)}</Text>
            </View>
          )}
          {(data.item.debito_automatico || data.item.tipo === "debito") && (
            <View>
              <B>Cuenta Bancaria:</B>
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
        <Text>Registrada el:</Text>
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
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={110}
        rightOpenValue={-150}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
        minHeight={130}
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
    height: 150,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default TarjetasScreen;
export { RegistrarTarjetaScreen };
