import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
import { formStyles } from "./shared/styles";

import {
  Container,
  Header,
  Content,
  Item,
  Input,
  Label,
  Picker,
  Icon,
  DatePicker,
  Button,
  Text,
  Form,
  Left,
  Right,
} from "native-base";

export default function RegistrarInversion({ navigation, props }) {
  const inversiones_con_cantidad_adquirida = [
    "compra_de_titulo",
    "accion",
    "bono",
    "otro",
  ];
  const inversiones_con_interes = ["plazo_fijo"];
  const initialValues = {
    tipo_inversion: "accion",
    capital_invertido: "0.0",
    tasa_interes: "0.0",
    cantidad_adquirida: "1",
    fecha_vencimiento: undefined,
    acreditar_en: "hsbc_bank_9085978549584",
    debitar_de: "hsbc_bank_9085978549584",
    fecha_transaccion: undefined,
    descripcion: "",
    intermediario: "",
  };

  const validationSchema = Yup.object({
    capital_invertido: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitada")
      .required("es requerido"),
    cantidad_adquirida: Yup.mixed().when("tipo_inversion", {
      is: (v) => inversiones_con_cantidad_adquirida.includes(v),
      then: Yup.number()
        .typeError("debe ser un número")
        .min(1, "debe ser mayor a 0")
        .max(999999999, "cifra no permitada")
        .required("es requerido"),
      otherwise: Yup.number().notRequired(),
    }),
    tasa_interes: Yup.mixed().when("tipo_inversion", {
      is: (v) => inversiones_con_interes.includes(v),
      then: Yup.number()
        .typeError("debe ser un número")
        .min(1, "debe ser mayor a 0")
        .max(999999999, "cifra no permitada")
        .required("es requerido"),
      otherwise: Yup.number().notRequired(),
    }),
    fecha_vencimiento: Yup.date().required("*"),
    fecha_transaccion: Yup.date().required("*"),
    descripcion: Yup.string().required("*"),
    intermediario: Yup.string().required("*"),
  });

  return (
    <Container>
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => navigation.navigate("Inversiones")}
          >
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            onPress={() => navigation.navigate("Inversiones")}
          >
            <Text>Cancelar</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => console.log(values)}
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
                <Label>Tipo de Inversion</Label>
                <ErrorMessage
                  component={Label}
                  name="tipo_inversion"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Debitar de"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.tipo_inversion}
                  onValueChange={(v) => setFieldValue("tipo_inversion", v)}
                >
                  <Picker.Item label="Plazo Fijo" value="plazo_fijo" />
                  <Picker.Item
                    label="Compra de Título"
                    value="compra_de_titulo"
                  />
                  <Picker.Item label="Acción" value="accion" />
                  <Picker.Item label="Bono" value="bono" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>
              </Item>
              <Item>
                <Label>Capital Invertido</Label>
                <Input
                  name="capital_invertido"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("capital_invertido")}
                  onBlur={handleBlur("capital_invertido")}
                  value={values.capital_invertido}
                />
              </Item>
              <Item>
                <ErrorMessage
                  component={Label}
                  name="capital_invertido"
                  style={styles.errorInput}
                />
              </Item>
              {inversiones_con_interes.includes(values.tipo_inversion) && (
                <Item>
                  <Label>Tasa de Interes</Label>
                  <Input
                    name="tasa_interes"
                    keyboardType="number-pad"
                    style={{ color: "#5073F3" }}
                    onChangeText={handleChange("tasa_interes")}
                    onBlur={handleBlur("tasa_interes")}
                    value={values.tasa_interes}
                  />
                </Item>
              )}
              <Item>
                <ErrorMessage
                  component={Label}
                  name="tasa_interes"
                  style={styles.errorInput}
                />
              </Item>
              {inversiones_con_cantidad_adquirida.includes(
                values.tipo_inversion
              ) && (
                <Item>
                  <Label>Cantidad Adquirida</Label>
                  <Input
                    name="cantidad_adquirida"
                    keyboardType="number-pad"
                    style={{ color: "#5073F3" }}
                    onChangeText={handleChange("cantidad_adquirida")}
                    onBlur={handleBlur("cantidad_adquirida")}
                    value={values.cantidad_adquirida}
                  />
                </Item>
              )}
              <Item>
                <ErrorMessage
                  component={Label}
                  name="cantidad_adquirida"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>Vence en</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_vencimiento"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_vencimiento"
                  defaultDate={values.fecha_vencimiento}
                  minimumDate={new Date(2000, 1, 1)}
                  maximumDate={new Date(2100, 12, 31)}
                  locale={"es"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Elegir fecha"
                  textStyle={{ color: "#5073F3" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={(v) => setFieldValue("fecha_vencimiento", v)}
                  disabled={false}
                />
              </Item>
              <Item>
                <Label>Debitar de</Label>
                <ErrorMessage
                  component={Label}
                  name="debitar_de"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Los fondos provienen de"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.debitar_de}
                  onValueChange={(v) => setFieldValue("debitar_de", v)}
                >
                  <Picker.Item
                    label="HSBC Bank #9085978549584"
                    value="hsbc_bank_9085978549584"
                  />
                  <Picker.Item
                    label="Banco Frances #584954859484"
                    value="banco_frances_584954859484"
                  />
                  <Picker.Item
                    label="Banco Ciudad #920398498343"
                    value="banco_ciudad_920398498343"
                  />
                  <Picker.Item
                    label="Mercadopago #548594689898"
                    value="mercadopago_548594689898"
                  />
                </Picker>
              </Item>
              <Item>
                <Label>Acreditar en</Label>
                <ErrorMessage
                  component={Label}
                  name="acreditar_en"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Los fondos provienen de"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.acreditar_en}
                  onValueChange={(v) => setFieldValue("acreditar_en", v)}
                >
                  <Picker.Item
                    label="HSBC Bank #9085978549584"
                    value="hsbc_bank_9085978549584"
                  />
                  <Picker.Item
                    label="Banco Frances #584954859484"
                    value="banco_frances_584954859484"
                  />
                  <Picker.Item
                    label="Banco Ciudad #920398498343"
                    value="banco_ciudad_920398498343"
                  />
                  <Picker.Item
                    label="Mercadopago #548594689898"
                    value="mercadopago_548594689898"
                  />
                </Picker>
              </Item>
              <Item>
                <Label>Operación realizada el</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_transaccion"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_transaccion"
                  defaultDate={values.fecha_transaccion}
                  minimumDate={new Date(2000, 1, 1)}
                  maximumDate={new Date(2100, 12, 31)}
                  locale={"es"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Elegir fecha"
                  textStyle={{ color: "#5073F3" }}
                  placeHolderTextStyle={{ color: "#d3d3d3" }}
                  onDateChange={(v) => setFieldValue("fecha_transaccion", v)}
                  disabled={false}
                />
              </Item>
              <Item stackedLabel>
                <Label>
                  Descripción{" "}
                  <ErrorMessage
                    component={Label}
                    name="descripcion"
                    style={styles.errorInput}
                  />
                </Label>
                <Input
                  name="descripcion"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("descripcion")}
                  onBlur={handleBlur("descripcion")}
                  value={values.descripcion}
                />
              </Item>
              <Item stackedLabel>
                <Label>
                  Intermediario{" "}
                  <ErrorMessage
                    component={Label}
                    name="intermediario"
                    style={styles.errorInput}
                  />
                </Label>
                <Input
                  name="intermediario"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("intermediario")}
                  onBlur={handleBlur("intermediario")}
                  value={values.intermediario}
                />
              </Item>
              <Text style={styles.space}></Text>
              <Button block primary onPress={handleSubmit} title="Submit">
                <Text>Guardar</Text>
              </Button>
            </Form>
          )}
        </Formik>
      </Content>
    </Container>
  );
}

const styles = { ...formStyles };
