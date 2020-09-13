import React, { useState } from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { Block, theme } from "galio-framework";
import { materialTheme } from "../constants";

import {
  Container,
  Header,
  Content,
  Footer,
  Form,
  Item,
  Input,
  Label,
  Picker,
  Icon,
  DatePicker,
  Button,
  Text,
} from "native-base";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function RegistrarIngreso({ navigation, props }) {
  const [chosenDate, setDate] = useState(new Date());

  return (
    <Container>
      <Header />
      <Content>
        <Form>
          <Text style={styles.space}></Text>
          <Item>
            <Label>Recibido el</Label>
            <DatePicker
              defaultDate={new Date(2018, 4, 4)}
              minimumDate={new Date(2000, 1, 1)}
              maximumDate={new Date(2100, 12, 31)}
              locale={"es"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              placeHolderText="Elegir fecha"
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={setDate}
              disabled={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Cantidad</Label>
            <Input />
          </Item>
          <Item>
            <Label>Frecuencia del Ingreso</Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Frecuencia del Ingreso"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
            >
              <Picker.Item label="Mensual" value="mensual" />
              <Picker.Item label="Semanal" value="semanal" />
              <Picker.Item label="Diario" value="diario" />
              <Picker.Item label="Una sola vez" value="onetime" />
            </Picker>
          </Item>
          <Item>
            <Label>Origen</Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Origen del Ingreso"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
            >
              <Picker.Item
                label="Sueldo en Relación de Dependencia"
                value="sueldo_relacion_dependencia"
              />
              <Picker.Item
                label="Alquiler de Propiedad"
                value="alquiler_propiedad"
              />
              <Picker.Item
                label="Facturación como Autónomo"
                value="facturacion_autonomo"
              />
              <Picker.Item label="Extraordinario" value="extraordinario" />
              <Picker.Item label="Otros" value="otros" />
            </Picker>
          </Item>
          <Item>
            <Label>Destino</Label>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ width: undefined }}
              placeholder="Origen del Ingreso"
              placeholderStyle={{ color: "#bfc6ea" }}
              placeholderIconColor="#007aff"
            >
              <Picker.Item
                label="Cuenta Bancaria #1"
                value="cuenta_bancaria_1"
              />
              <Picker.Item
                label="Cuenta Bancaria #2"
                value="cuenta_bancaria_2"
              />
              <Picker.Item
                label="Cuenta Bancaria #3"
                value="cuenta_bancaria_3"
              />
              <Picker.Item label="Efectivo" value="efectivo" />
            </Picker>
          </Item>
          <Text style={styles.space}></Text>
          <Button block primary onPress={() => Alert.alert("Guardar clicked")}>
            <Text>Guardar</Text>
          </Button>
          <Button
            block
            bordered
            light
            onPress={() => navigation.navigate("Ingresos")}
          >
            <Text>Cancelar</Text>
          </Button>
        </Form>
      </Content>
      <Footer />
    </Container>
  );
}

const styles = StyleSheet.create({
  components: {},
  title: {
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: theme.SIZES.BASE * 2,
    color: theme.COLORS.WHITE,
    fontWeight: "bold",
  },
  group: {
    paddingTop: theme.SIZES.BASE * 3.75,
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
  },
  optionsText: {
    fontSize: theme.SIZES.BASE * 0.75,
    color: "#4A4A4A",
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: -0.29,
  },
  optionsButton: {
    width: "auto",
    height: 34,
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
  },
  inputDefault: {
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER,
  },
  inputTheme: {
    borderBottomColor: materialTheme.COLORS.PRIMARY,
  },
  inputTheme: {
    borderBottomColor: materialTheme.COLORS.PRIMARY,
  },
  inputInfo: {
    borderBottomColor: materialTheme.COLORS.INFO,
  },
  inputSuccess: {
    borderBottomColor: materialTheme.COLORS.SUCCESS,
  },
  inputWarning: {
    borderBottomColor: materialTheme.COLORS.WARNING,
  },
  inputDanger: {
    borderBottomColor: materialTheme.COLORS.ERROR,
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4,
  },
  rows: {
    height: theme.SIZES.BASE * 2,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: "center",
  },
  category: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE / 2,
    borderWidth: 0,
  },
  categoryTitle: {
    height: "100%",
    paddingHorizontal: theme.SIZES.BASE,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  albumThumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  space: {
    color: "#C0C0C0",
    fontSize: 15,
    textAlign: "justify",
  },
});
