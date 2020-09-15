import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";

import {
  Container,
  Header,
  Content,
  Footer,
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
import { formStyles } from "./shared/styles";

export default function RegistrarIngreso({ navigation, props }) {
  const initialValues = {
    cantidad: "0.0",
    recibido_en: undefined,
    frecuencia: "mensual",
    origen: "alquiler_propiedad",
    destino: "banco_ciudad_920398498343",
  };

  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
    recibido_en: Yup.date().when("frecuencia", {
      is: "una_vez",
      then: Yup.date().required("es requerido"),
      otherwise: Yup.date().notRequired(),
    }),
  });

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Ingresos")}>
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Ingresos")}>
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
              <Item stackedLabel>
                <Label>Cantidad</Label>
                <ErrorMessage
                  component={Label}
                  name="cantidad"
                  style={styles.errorInput}
                />
                <Input
                  name="cantidad"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cantidad")}
                  onBlur={handleBlur("cantidad")}
                  value={values.cantidad}
                />
              </Item>
              <Item>
                <Label>Frecuencia del Ingreso</Label>
                <Picker
                  name="frecuencia"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Frecuencia del Ingreso"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.frecuencia}
                  onValueChange={(v) => setFieldValue("frecuencia", v)}
                >
                  <Picker.Item label="Mensual" value="mensual" />
                  <Picker.Item label="Semanal" value="semanal" />
                  <Picker.Item label="Diario" value="diario" />
                  <Picker.Item label="Una sola vez" value="una_vez" />
                </Picker>
              </Item>
              <Item>
                <Label>Recibido el</Label>
                <DatePicker
                  name="recibido_en"
                  defaultDate={values.recibido_en}
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
                  onDateChange={(v) => setFieldValue("recibido_en", v)}
                  disabled={false}
                />
                <ErrorMessage
                  component={Label}
                  name="recibido_en"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>Origen</Label>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Origen del Ingreso"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.origen}
                  onValueChange={(v) => setFieldValue("origen", v)}
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
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Destino del Ingreso"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.destino}
                  onValueChange={(v) => setFieldValue("destino", v)}
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
                  <Picker.Item label="Efectivo" value="efectivo" />
                </Picker>
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
