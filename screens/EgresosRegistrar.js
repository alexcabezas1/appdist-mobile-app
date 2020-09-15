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

import * as DocumentPicker from "expo-document-picker";

export default function RegistrarEgreso({ navigation, props }) {
  const medio_de_pago_tarjeta = ["tarjeta_de_debito", "tarjeta_de_credito"];
  const medio_de_pago_cuenta_bancaria = [
    "debito_automatico",
    "transferencia",
    "mercadopago",
  ];
  const initialValues = {
    cantidad: "0.0",
    motivo_del_pago: "alquiler",
    medio_de_pago: "de_contado",
    cuotas_prestamo_por_vencer: "no_aplica",
    numero_de_cuotas: "1",
    fecha_gastado_en: undefined,
    tarjeta: "no_aplica",
    cuenta_bancaria: "no_aplica",
  };
  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
    cuotas_prestamo_por_vencer: Yup.string().when("motivo_del_pago", {
      is: "cuota_de_prestamo",
      then: Yup.string().test("required", "*", (v) => v != "no_aplica"),
      otherwise: Yup.string().notRequired(),
    }),
    numero_de_cuotas: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(36, "cifra no permitida"),
    fecha_gastado_en: Yup.date().required("*"),
    tarjeta: Yup.string().when("medio_de_pago", {
      is: (v) => medio_de_pago_tarjeta.includes(v),
      then: Yup.string().test("required", "*", (v) => v != "no_aplica"),
      otherwise: Yup.string().notRequired(),
    }),
    cuenta_bancaria: Yup.string().when("medio_de_pago", {
      is: (v) => medio_de_pago_cuenta_bancaria.includes(v),
      then: Yup.string().test("required", "*", (v) => v != "no_aplica"),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);
  };

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
                <Label>Motivo del Pago</Label>
                <Picker
                  name="motivo_del_pago"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Motivo del Egreso"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.motivo_del_pago}
                  onValueChange={(v) => setFieldValue("motivo_del_pago", v)}
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
                  <Picker.Item label="Extraordinario" value="Extraordinario" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>
              </Item>
              {values.motivo_del_pago === "cuota_de_prestamo" && (
                <Item>
                  <Label>Cuotas de Prestamos</Label>
                  <ErrorMessage
                    component={Label}
                    name="cuotas_prestamo_por_vencer"
                    style={styles.errorInput}
                  />
                  <Picker
                    name="cuotas_prestamo_por_vencer"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Cuotas de Prestamos por vencer"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.cuotas_prestamo_por_vencer}
                    onValueChange={(v) =>
                      setFieldValue("cuotas_prestamo_por_vencer", v)
                    }
                  >
                    <Picker.Item
                      label="Elegir cuota por vencer"
                      value="no_aplica"
                    />
                    <Picker.Item
                      label="Prestamo 1 - Cuota #2"
                      value="prestamo1_cuota2"
                    />
                    <Picker.Item
                      label="Prestamo 2 - Cuota #10"
                      value="prestamo2_cuota10"
                    />
                    <Picker.Item
                      label="Prestamo 3 - Cuota #5"
                      value="prestamo3_cuota5"
                    />
                  </Picker>
                </Item>
              )}
              <Item>
                <Label>Pagado mediante</Label>
                <Picker
                  name="medio_de_pago"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Medio de Pago"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.medio_de_pago}
                  onValueChange={(v) => setFieldValue("medio_de_pago", v)}
                >
                  <Picker.Item label="De Contado" value="de_contado" />
                  <Picker.Item
                    label="Tarjeta de Crédito"
                    value="tarjeta_de_credito"
                  />
                  <Picker.Item
                    label="Tarjeta de Débito"
                    value="tarjeta_de_debito"
                  />
                  <Picker.Item
                    label="Débito Automático en Cuenta"
                    value="debito_automatico"
                  />
                  <Picker.Item label="Transferencia" value="transferencia" />
                  <Picker.Item label="MercadoPago" value="mercadopago" />
                </Picker>
              </Item>
              {medio_de_pago_tarjeta.includes(values.medio_de_pago) && (
                <Item>
                  <Label>Tarjeta utilizada</Label>
                  <ErrorMessage
                    component={Label}
                    name="tarjeta"
                    style={styles.errorInput}
                  />
                  <Picker
                    name="tarjeta"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Tarjeta utilizada"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.tarjeta}
                    onValueChange={(v) => setFieldValue("tarjeta", v)}
                  >
                    <Picker.Item label="Elegir una tarjeta" value="no_aplica" />
                    <Picker.Item
                      label="VISA Débito 4435 7676 3233 2134"
                      value="visa_debito_4435_7676_3233_2134"
                    />
                    <Picker.Item
                      label="VISA 3243 4343 0988 1339"
                      value="visa_3243_4343_0988_1339"
                    />
                    <Picker.Item
                      label="MASTERCARD 4453 5893 4390 2121"
                      value="mastercard_4453_5893_4390_2121"
                    />
                  </Picker>
                </Item>
              )}
              {medio_de_pago_cuenta_bancaria.includes(values.medio_de_pago) && (
                <Item>
                  <Label>Debitar de la Cuenta</Label>
                  <ErrorMessage
                    component={Label}
                    name="cuenta_bancaria"
                    style={styles.errorInput}
                  />
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Debitar de"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.cuenta_bancaria}
                    onValueChange={(v) => setFieldValue("cuenta_bancaria", v)}
                  >
                    <Picker.Item label="Elegir cuenta" value="no_aplica" />
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
              )}
              <Item>
                <Label>Número de Cuotas</Label>
                <ErrorMessage
                  component={Label}
                  name="numero_de_cuotas"
                  style={styles.errorInput}
                />
                <Input
                  name="numero_de_cuotas"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("numero_de_cuotas")}
                  onBlur={handleBlur("numero_de_cuotas")}
                  value={values.numero_de_cuotas}
                />
              </Item>
              <Item>
                <Label>Gasto realizado el</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_gastado_en"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_gastado_en"
                  defaultDate={values.fecha_gastado_en}
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
                  onDateChange={(v) => setFieldValue("fecha_gastado_en", v)}
                  disabled={false}
                />
              </Item>
              <Item>
                <Label>Comprobante de la Transacción</Label>
                <Right>
                  <Button info onPress={pickDocument}>
                    <Text>Adjuntar</Text>
                  </Button>
                </Right>
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
