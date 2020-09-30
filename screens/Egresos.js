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
import RegistrarEgresoScreen from "./EgresosRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { listStyles } from "./shared/styles";
import { B } from "./shared/common";
import {
  Egreso,
  EGRESOS_MEDIO_PAGO_OPCIONES,
  EGRESOS_RUBROS_OPCIONES,
  BANCOS_OPCIONES,
  TARJETAS_ENTIDAD_OPCIONES,
  TARJETAS_TIPO_OPCIONES,
} from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  formatNumber,
  timestamp,
} from "../services/common";
import _ from "lodash";

const { width } = Dimensions.get("screen");

const EgresosScreen = ({ route, navigation, props }) => {
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
        <ListaEgresos {...route.params} />
      </Content>
    </Container>
  );
};

const ListaEgresos = (props) => {
  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Egreso.todosActivos();
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
    await Egreso.remover(rowKey);
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
            <B>{data.item.cantidad}</B>
          </Text>
          <Text style={{ paddingBottom: 5 }}>
            {formatDate(data.item.fecha_operacion)}
          </Text>
          {data.item.numero_cuotas > 1 && (
            <View>
              <Text>
                <B>Cuotas: </B>
                {data.item.numero_cuotas}
              </Text>
            </View>
          )}
        </View>
        <View style={{ width: parseInt(width) * 0.5 }}>
          <B>{EGRESOS_RUBROS_OPCIONES[data.item.motivo].desc}</B>
          <Text>{EGRESOS_MEDIO_PAGO_OPCIONES[data.item.medio_pago]}</Text>
          {data.item.prestamo_cuota_id && (
            <View>
              <Text>
                {_.capitalize(data.item.prestamo_descripcion)} #
                {parseInt(data.item.prestamo_cuota_numero_cuota)} (
                {formatNumber(data.item.prestamo_cuota_cantidad)})
              </Text>
            </View>
          )}
          {data.item.tarjeta_id && (
            <View>
              <Text>
                {TARJETAS_ENTIDAD_OPCIONES[
                  data.item.tarjeta_entidad_emisor
                ].toUpperCase()}{" "}
                {data.item.tarjeta_ultimos_numeros}
              </Text>
            </View>
          )}
          {data.item.cuenta_id && (
            <View>
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
        data={data}
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
