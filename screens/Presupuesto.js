import React, { useState } from "react";
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

const { width } = Dimensions.get("screen");
console.log(parseInt(width / 2));

const rubros = {
  alquiler: { desc: "Alquiler", key: "alquiler" },
  expensas: { desc: "Expensas", key: "expensas" },
  luz: { desc: "Luz", key: "luz" },
  gas: { desc: "Gas", key: "gas" },
  cable: { desc: "Cable", key: "cable" },
  internet: { desc: "Internet", key: "internet" },
  telefono: { desc: "Teléfono", key: "telefono" },
  servicio_limpieza: { desc: "Servicio de Limpieza", key: "servicio_limpieza" },
  servicio_lavado: { desc: "Servicio de Lavado", key: "servicio_lavado" },
  reparacion_hogar: { desc: "Reparación en el Hogar", key: "reparacion_hogar" },
  gasolina: { desc: "Gasolina", key: "gasolina" },
  reparacion_auto: { desc: "Reparación del Auto", key: "reparacion_auto" },
  mudanza: { desc: "Mudanza", key: "mudanza" },
  cuota_de_prestamo: { desc: "Cuota de Préstamo", key: "cuota_de_prestamo" },
  impuestos_nacionales: {
    desc: "Impuestos Nacionales",
    key: "impuestos_nacionales",
  },
  educación: { desc: "Educación", key: "educación" },
  salud: { desc: "Salud", key: "salud" },
  comida: { desc: "Comida", key: "comida" },
  gimnasio: { desc: "Gimnasio", key: "gimnasio" },
  transporte: { desc: "Transporte", key: "transporte" },
  hospedaje: { desc: "Hospedaje", key: "hospedaje" },
  viáticos: { desc: "Viáticos", key: "viáticos" },
  transporte_en_viajes: {
    desc: "Transporte al Viajar",
    key: "transporte_en_viajes",
  },
  entretenimiento: { desc: "Entretenimiento", key: "entretenimiento" },
  comer_afuera: { desc: "Comer afuera", key: "comer_afuera" },
  cine: { desc: "Cine", key: "cine" },
  compra_ropa: { desc: "Compra de Ropa", key: "compra_ropa" },
  compra_para_hogar: { desc: "Compra para el Hogar", key: "compra_para_hogar" },
  regalo: { desc: "Regalo", key: "regalo" },
  donacion: { desc: "Donación", key: "donacion" },
  compra_dolares: { desc: "Compra de Dólares", key: "compra_dolares" },
  compra_criptomonedas: {
    desc: "Compra de Criptomonedas",
    key: "compra_criptomonedas",
  },
  extraordinario: { desc: "Extraordinario", key: "extraordinario" },
  otro: { desc: "Otro", key: "otro" },
};

export default function PresupuestoScreen({ navigation, props }) {
  const initialValues = { cantidad: "0.0", rubro: "alquiler" };
  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
  });

  const [presupuesto, setPresupuesto] = useState([
    { rubro: "Alquiler", cantidad: 23000 },
    { rubro: "Expensas", cantidad: 5000 },
  ]);
  const agregarItem = (line) => {
    const result = presupuesto.filter((item) => item.rubro == line.rubro);
    if (result.length == 0) {
      setPresupuesto((lines) => [line, ...lines]);
    }
  };

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

  const renderItem = (data) => (
    <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
      <View style={styles.item}>
        <View style={{ width: parseInt(width / 2) * 0.9 }}>
          <Text>{rubros[data.item.rubro].desc}</Text>
        </View>
        <View style={{ width: parseInt(width / 2) * 0.9 }}>
          <Text>{data.item.cantidad}</Text>
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values, presupuesto.length);
            agregarItem(values);
            console.log(presupuesto.length);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            setFieldValue,
          }) => (
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
                    setFieldValue("cantidad", initialValues.cantidad);
                  }}
                >
                  <Picker.Item label="Alquiler" value="alquiler" />
                  <Picker.Item label="Expensas" value="expensas" />
                  <Picker.Item label="Luz" value="luz" />
                  <Picker.Item label="Gas" value="gas" />
                  <Picker.Item label="Cable" value="cable" />
                  <Picker.Item label="Internet" value="internet" />
                  <Picker.Item label="Teléfono" value="telefono" />
                  <Picker.Item
                    label="Servicio de Limpieza"
                    value="servicio_limpieza"
                  />
                  <Picker.Item
                    label="Servicio de Lavado"
                    value="servicio_lavado"
                  />
                  <Picker.Item
                    label="Reparación en el Hogar"
                    value="reparacion_hogar"
                  />
                  <Picker.Item label="Gasolina" value="gasolina" />
                  <Picker.Item
                    label="Reparación del Auto"
                    value="reparacion_auto"
                  />
                  <Picker.Item label="Mudanza" value="mudanza" />
                  <Picker.Item
                    label="Cuota de Préstamo"
                    value="cuota_de_prestamo"
                  />
                  <Picker.Item
                    label="Impuestos Nacionales"
                    value="impuestos_nacionales"
                  />
                  <Picker.Item label="Educación" value="educación" />
                  <Picker.Item label="Salud" value="salud" />
                  <Picker.Item label="Comida" value="comida" />
                  <Picker.Item label="Gimnasio" value="gimnasio" />
                  <Picker.Item label="Transporte" value="transporte" />
                  <Picker.Item label="Hospedaje" value="hospedaje" />
                  <Picker.Item label="Viáticos" value="viáticos" />
                  <Picker.Item
                    label="Transporte al Viajar"
                    value="transporte_en_viajes"
                  />
                  <Picker.Item
                    label="Entretenimiento"
                    value="entretenimiento"
                  />
                  <Picker.Item label="Comer afuera" value="comer_afuera" />
                  <Picker.Item label="Cine" value="cine" />
                  <Picker.Item label="Compra de Ropa" value="compra_ropa" />
                  <Picker.Item
                    label="Compra para el Hogar"
                    value="compra_para_hogar"
                  />
                  <Picker.Item label="Regalo" value="regalo" />
                  <Picker.Item label="Donación" value="donacion" />
                  <Picker.Item
                    label="Compra de Dólares"
                    value="compra_dolares"
                  />
                  <Picker.Item
                    label="Compra de Criptomonedas"
                    value="compra_criptomonedas"
                  />
                  <Picker.Item label="Extraordinario" value="extraordinario" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>
                <Label>Cant.</Label>
                <Input
                  name="cantidad"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cantidad")}
                  onBlur={handleBlur("cantidad")}
                  value={values.cantidad}
                />
                <Button block info onPress={handleSubmit} title="Submit">
                  <Text style={{ fontSize: 25 }}>+</Text>
                </Button>
              </Item>
              <Item>
                <ErrorMessage
                  component={Label}
                  name="cantidad"
                  style={styles.errorInput}
                />
              </Item>
            </Form>
          )}
        </Formik>
        <View style={styles.container}>
          <SwipeListView
            data={presupuesto}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewRowKey={"0"}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            minHeight={60}
          />
        </View>
      </Content>
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
