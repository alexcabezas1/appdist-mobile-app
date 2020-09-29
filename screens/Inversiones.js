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
import RegistrarInversionScreen from "./InversionesRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";
import {
  Inversion,
  INVERSIONES_TIPO_INVERSION_OPCIONES,
  BANCOS_OPCIONES,
} from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  formatNumber,
  fotmatNumber,
  timestamp,
} from "../services/common";
import _ from "lodash";

const { width } = Dimensions.get("screen");

const InversionesScreen = ({ route, navigation, props }) => {
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
        <ListaInversiones {...route.params} />
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

  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Inversion.todos();
    const objsWithKey = objs.map((e) => ({ ...e, key: e.id.toString() }));
    setData(objsWithKey);
  };

  useEffect(() => {
    fetchData();
  }, [version, props.version]);

  const obtenerPrecioUnitario = ({ capital_invertido, cantidad_adquirida }) => {
    const cambio_dolar = 80;
    const precio = capital_invertido / cambio_dolar / cantidad_adquirida;
    return formatNumber(precio);
  };

  const esInversionConInteres = ({ tipo_inversion }) =>
    inversiones_con_interes.includes(tipo_inversion);

  const esInversionConCantidadAdquirida = ({ tipo_inversion }) =>
    inversiones_con_cantidad_adquirida.includes(tipo_inversion);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async ({ rowMap, rowKey }) => {
    setConfirmDialogVisible(false);
    closeRow(rowMap, rowKey);
    await Inversion.remover(rowKey);
    setVersion(timestamp());
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: parseInt(width) * 0.35 }}>
          <Text style={{ paddingBottom: 5, color: "#5073F3" }}>
            <Text>ARS </Text>
            <B>{data.item.capital_invertido}</B>
          </Text>
          <B>{INVERSIONES_TIPO_INVERSION_OPCIONES[data.item.tipo_inversion]}</B>
          <Text>{data.item.descripcion}</Text>
          {inversiones_con_cantidad_adquirida.includes(
            data.item.tipo_inversion
          ) && (
            <View>
              <Text>{data.item.cantidad_adquirida} unid.</Text>
              <B>Precio</B>
              <Text>{obtenerPrecioUnitario(data.item)} USD</Text>
            </View>
          )}
          {esInversionConInteres(data.item) && (
            <View>
              <Text>{formatNumber(data.item.interes)} %</Text>
            </View>
          )}
        </View>
        <View style={{ width: parseInt(width) * 0.55 }}>
          <Text>
            <B>Realizada en </B>
            {formatDate(data.item.fecha_operacion)}
          </Text>
          {esInversionConInteres(data.item) && (
            <View>
              <Text>
                <B>Vence en</B>
                {formatDate(data.item.fecha_vencimiento)}
              </Text>
            </View>
          )}
          {esInversionConCantidadAdquirida(data.item) && (
            <View>
              <B>Intermediario</B>
              <Text>{data.item.intermediario}</Text>
            </View>
          )}
          <B>Acreditar en</B>
          <Text>
            {BANCOS_OPCIONES[data.item.cuenta_origen_banco_asociado].name} #
            {data.item.cuenta_origen_numero}
          </Text>
          <B>Debitar de</B>
          <Text>
            {BANCOS_OPCIONES[data.item.cuenta_destino_banco_asociado].name} #
            {data.item.cuenta_destino_numero}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View>
        <Text>Registrado el:</Text>
        <Text>{formatDate(data.item.fecha_creacion)}</Text>
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
        data={data}
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
    height: 180,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default InversionesScreen;
export { RegistrarInversionScreen };
