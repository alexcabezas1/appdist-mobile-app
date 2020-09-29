import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import { formStyles, listStyles } from "./shared/styles";

import {
  Container,
  Header,
  Content,
  Footer,
  Item,
  Input,
  Label,
  Picker,
  Button,
  Text,
  Form,
  Left,
  Right,
  Icon as InconNative,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeListView } from "react-native-swipe-list-view";

import { Presupuesto, EGRESOS_RUBROS_OPCIONES } from "../services/models";
import { B } from "./shared/common";
import _ from "lodash";

const { width } = Dimensions.get("screen");
console.log(parseInt(width / 2));

export default function PresupuestoScreen({ navigation, props }) {
  const egresos_rubros_opciones = Object.entries(EGRESOS_RUBROS_OPCIONES);
  const initialValues = { cantidad_estimada: "0.0", rubro: "alquiler" };
  const validationSchema = Yup.object({
    cantidad_estimada: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
  });

  const [version, setVersion] = useState(null);
  const [presupuesto, setPresupuesto] = useState([]);

  const fetchData = async () => {
    const objs = await Presupuesto.masReciente();
    const objsWithKey = objs.map((e) => ({ ...e, key: e.id.toString() }));
    console.log(objsWithKey);
    setPresupuesto(objsWithKey);
  };

  useEffect(() => {
    fetchData();
  }, [version]);

  const agregarItem = (line, { resetForm }) => {
    console.log(line);
    const result = presupuesto.filter((item) => item.rubro == line.rubro);
    if (result.length == 0) {
      setPresupuesto((lines) => [line, ...lines]);
    }
    resetForm();
  };

  const guardarPresupuesto = useCallback(async () => {
    await Presupuesto.gestionar(presupuesto);
  }, [presupuesto]);

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = ({ rowMap, rowKey }) => {
    closeRow(rowMap, rowKey);
    const newData = [...presupuesto];
    const prevIndex = presupuesto.findIndex((item) => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setPresupuesto(newData);
  };

  const onRowDidOpen = (rowKey) => {
    console.log("This row opened", rowKey);
  };

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: parseInt(width) * 0.7 }}>
          <Text>{EGRESOS_RUBROS_OPCIONES[data.item.rubro].desc}</Text>
        </View>
        <View style={{ width: parseInt(width) * 0.2, alignItems: "flex-end" }}>
          <Text>{data.item.cantidad_estimada}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <View></View>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item.key)}
      >
        <Icon color="white" size={30} name="keyboard-backspace" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          deleteRow({ rowMap, rowKey: data.item.key });
        }}
      >
        <Icon color="white" size={30} name="trash-can-outline" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={agregarItem}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
        }) => (
          <React.Fragment>
            <Header>
              <Left>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                  <InconNative name="arrow-back" />
                  <Text>Volver</Text>
                </Button>
              </Left>
              <Right>
                <Button transparent onPress={() => navigation.navigate("Home")}>
                  <Text>Cancelar</Text>
                </Button>
              </Right>
            </Header>
            <Content>
              <Form>
                <Text style={styles.space}></Text>
                <Item>
                  <Label>Rubro</Label>
                  <Picker
                    name="rubro"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Rubro"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.rubro}
                    onValueChange={(v) => {
                      setFieldValue("rubro", v);
                      setFieldValue(
                        "cantidad_estimada",
                        initialValues.cantidad_estimada
                      );
                    }}
                  >
                    {egresos_rubros_opciones.map((e) => (
                      <Picker.Item label={e[1].desc} value={e[0]} key={e[0]} />
                    ))}
                  </Picker>
                  <Label>Cant.</Label>
                  <Input
                    name="cantidad_estimada"
                    keyboardType="number-pad"
                    style={{ color: "#5073F3" }}
                    onChangeText={handleChange("cantidad_estimada")}
                    onBlur={handleBlur("cantidad_estimada")}
                    value={values.cantidad_estimada}
                  />
                  <Button block info onPress={handleSubmit} title="Submit">
                    <Text style={{ fontSize: 25 }}>+</Text>
                  </Button>
                </Item>
                <Item>
                  <ErrorMessage
                    component={Label}
                    name="cantidad_estimada"
                    style={styles.errorInput}
                  />
                </Item>
              </Form>
              <View style={styles.container}>
                <SwipeListView
                  data={presupuesto}
                  renderItem={renderItem}
                  renderHiddenItem={renderHiddenItem}
                  onRowDidOpen={onRowDidOpen}
                  leftOpenValue={75}
                  rightOpenValue={-150}
                  previewRowKey={"0"}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  minHeight={60}
                />
              </View>
            </Content>
            <Footer>
              <Button
                bordered
                onPress={guardarPresupuesto}
                style={{
                  width: width,
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "white" }}>Guardar</Text>
              </Button>
            </Footer>
          </React.Fragment>
        )}
      </Formik>
    </Container>
  );
}

const styles = {
  ...formStyles,
  ...listStyles,
  rowFront: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderBottomColor: "#4f73f2",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
  },
};
