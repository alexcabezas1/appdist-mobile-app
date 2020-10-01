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
import CuentasRegistrar from "./CuentasRegistrar";
import { ConfirmDialog } from "react-native-simple-dialogs";
import { B } from "./shared/common";
import { listStyles } from "./shared/styles";
import { Cuenta, BANCOS_OPCIONES } from "../services/models";
import {
  formatDate,
  formatDateMonthAndYear,
  formatDateTime,
  formatNumber,
  timestamp,
} from "../services/common";

const { width } = Dimensions.get("screen");

const CuentasScreen = ({ route, navigation, props }) => {
  const [version, setVersion] = useState();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setVersion(timestamp());
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Container>
      <Content>
        <Button
          block
          primary
          onPress={() => navigation.navigate("RegistrarCuenta")}
        >
          <Text style={styles.homeButton}>+ Nueva Cuenta Bancaria</Text>
        </Button>
        <ListaCuentas {...route.params} version={version} />
      </Content>
    </Container>
  );
};

const ListaCuentas = (props) => {
  const [version, setVersion] = useState(props.version);
  const [data, setData] = useState([]);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [itemToBeDelete, setItemToBeDelete] = useState({});

  const fetchData = async () => {
    const objs = await Cuenta.cuentasActivas();
    const objsWithKey = objs.map((e) => ({ ...e, key: e.id.toString() }));
    setData(objsWithKey);
  };

  useEffect(() => {
    fetchData();
  }, [props.version, version]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = async ({ rowMap, rowKey }) => {
    setConfirmDialogVisible(false);
    closeRow(rowMap, rowKey);
    await Cuenta.destroy(rowKey);
    setVersion(timestamp());
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight
      style={styles.rowFront}
      underlayColor={"#AAA"}
      key={data.item.id}
    >
      <View style={styles.item}>
        <View style={{ width: parseInt(width) * 0.35 }}>
          <Text style={{ paddingBottom: 0 }}>
            <B>{BANCOS_OPCIONES[data.item.banco_asociado].name}</B>
          </Text>
          <Text>
            {"#"}
            {data.item.numero}
          </Text>
        </View>
        <View style={{ width: parseInt(width) * 0.25 }}>
          <B>{BANCOS_OPCIONES[data.item.banco_asociado].tipo.toUpperCase()}</B>
          <Text>{data.item.cbu}</Text>
        </View>
        <View style={{ width: parseInt(width) * 0.3 }}>
          <B>Saldo</B>
          <Text>{formatNumber(data.item.saldo)}</Text>
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
        onPress={() => {
          closeRow(rowMap, data.item.id);
        }}
      >
        <Icon color="white" size={30} name="keyboard-backspace" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          setItemToBeDelete({ rowMap, rowKey: data.item.id });
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
      message="¿Está seguro que quieres borrar la cuenta?"
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
        minHeight={70}
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
    height: 70,
    paddingLeft: 15,
    paddingRight: 15,
  },
};

export default CuentasScreen;
export { CuentasRegistrar };
