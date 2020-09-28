import React, { useState, useEffect, useCallback } from "react";
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
import {
  Egreso,
  PrestamoCuota,
  Cuenta,
  Tarjeta,
  EGRESOS_MEDIO_PAGO_OPCIONES,
  EGRESOS_RUBROS_OPCIONES,
  BANCOS_OPCIONES,
} from "../services/models";
import { timestamp, formatNumber } from "../services/common";
import moment from "moment";
import _ from "lodash";

export default function RegistrarEgreso({ navigation, props }) {
  const medio_pago_tarjeta = ["tarjeta_de_debito", "tarjeta_de_credito"];
  const medio_pago_cuenta_bancaria = [
    "debito_automatico",
    "transferencia",
    "mercadopago",
  ];
  const egresos_rubros_opciones = Object.entries(EGRESOS_RUBROS_OPCIONES);
  const egresos_medio_pago_opciones = Object.entries(
    EGRESOS_MEDIO_PAGO_OPCIONES
  );

  const initialValues = {
    cantidad: "0.0",
    motivo: egresos_rubros_opciones[0][0],
    medio_pago: egresos_medio_pago_opciones[0][0],
    prestamo_cuota_id: undefined,
    numero_cuotas: "1",
    fecha_operacion: undefined,
    tarjeta_id: undefined,
    cuenta_id: undefined,
  };

  const requiereCuentaBancaria = (form) => {
    return (
      medio_pago_cuenta_bancaria.includes(form.medio_pago) ||
      form.motivo === "resumen_tarjeta_crédito"
    );
  };

  const requiereTarjetaCredito = (form) => {
    return (
      medio_pago_tarjeta.includes(form.medio_pago) ||
      form.motivo === "resumen_tarjeta_crédito"
    );
  };

  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
    prestamo_cuota_id: Yup.string().when("motivo", {
      is: "cuota_de_prestamo",
      then: Yup.string().test("required", "*", (v) => v != undefined),
      otherwise: Yup.string().notRequired(),
    }),
    numero_cuotas: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(36, "cifra no permitida"),
    fecha_operacion: Yup.date().required("*"),
    tarjeta_id: Yup.string().when("medio_pago", {
      is: (v) => medio_pago_tarjeta.includes(v),
      then: Yup.string().test("required", "*", (v) => v != undefined),
      otherwise: Yup.string().notRequired(),
    }),
    cuenta_id: Yup.string().when("medio_pago", {
      is: (v) => medio_pago_cuenta_bancaria.includes(v),
      then: Yup.string().test("required", "*", (v) => v != undefined),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);
  };

  const [version, setVersion] = useState(timestamp());
  const [cuentas, setCuentas] = useState([]);
  const [tarjetas, setTarjetas] = useState([]);
  const [prestamosCuotas, setPrestamosCuotas] = useState([]);

  const fetchData = async () => {
    const cuentas = await Cuenta.cuentasActivas();
    const tarjetas = await Tarjeta.tarjetasActivas();
    const prestamosCuotas = await PrestamoCuota.todosActivosNoPagadosRolPrestatario();
    setCuentas(cuentas);
    setTarjetas(tarjetas);
    setPrestamosCuotas(prestamosCuotas);
  };

  useEffect(() => {
    fetchData();
  }, [version]);

  const submitHandler = useCallback(async (form, { resetForm }) => {
    await Egreso.registrar(form);
    resetForm();
    navigation.navigate("Egresos", { version: timestamp() });
  }, []);

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Egresos")}>
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Egresos")}>
            <Text>Cancelar</Text>
          </Button>
        </Right>
      </Header>
      <Content>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
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
                <Label>Motivo del Gasto</Label>
                <Picker
                  name="motivo"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Motivo del Egreso"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.motivo}
                  onValueChange={(v) => setFieldValue("motivo", v)}
                >
                  {egresos_rubros_opciones.map((e) => (
                    <Picker.Item label={e[1].desc} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              {values.motivo === "cuota_de_prestamo" && (
                <Item>
                  <Label>Cuotas Prestamos</Label>
                  <ErrorMessage
                    component={Label}
                    name="prestamo_cuota_id"
                    style={styles.errorInput}
                  />
                  <Picker
                    name="prestamo_cuota_id"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Cuotas de Prestamos por vencer"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.prestamo_cuota_id}
                    onValueChange={(v) => setFieldValue("prestamo_cuota_id", v)}
                  >
                    <Picker.Item
                      label="Elegir Cuota de Préstamo"
                      value={undefined}
                    />
                    {prestamosCuotas.map((e) => (
                      <Picker.Item
                        label={
                          _.capitalize(e.descripcion) +
                          " #" +
                          parseInt(e.numero_cuota) +
                          " (" +
                          formatNumber(e.cantidad) +
                          ")"
                        }
                        value={e.id}
                        key={e.id}
                      />
                    ))}
                  </Picker>
                </Item>
              )}
              <Item>
                <Label>Pagado mediante</Label>
                <Picker
                  name="medio_pago"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Medio de Pago"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.medio_pago}
                  onValueChange={(v) => setFieldValue("medio_pago", v)}
                >
                  {egresos_medio_pago_opciones.map((e) => (
                    <Picker.Item label={e[1]} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              {requiereTarjetaCredito(values) && (
                <Item>
                  <Label>Tarjeta</Label>
                  <ErrorMessage
                    component={Label}
                    name="tarjeta_id"
                    style={styles.errorInput}
                  />
                  <Picker
                    name="tarjeta_id"
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Tarjeta utilizada"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.tarjeta_id}
                    onValueChange={(v) => setFieldValue("tarjeta_id", v)}
                  >
                    <Picker.Item label="Elegir una tarjeta" value={undefined} />
                    {tarjetas.map((e) => (
                      <Picker.Item
                        label={
                          e.entidad_emisor.toUpperCase() +
                          " " +
                          e.tipo.toUpperCase() +
                          " " +
                          e.ultimos_numeros
                        }
                        value={e.id}
                        key={e.id}
                      />
                    ))}
                  </Picker>
                </Item>
              )}
              {requiereCuentaBancaria(values) && (
                <Item>
                  <Label>Cuenta Bancaria</Label>
                  <ErrorMessage
                    component={Label}
                    name="cuenta_id"
                    style={styles.errorInput}
                  />
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    placeholder="Debitar de"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={values.cuenta_id}
                    onValueChange={(v) => setFieldValue("cuenta_id", v)}
                  >
                    <Picker.Item label="Elegir cuenta" value={undefined} />
                    {cuentas.map((e) => (
                      <Picker.Item
                        label={
                          BANCOS_OPCIONES[e.banco_asociado].name +
                          " #" +
                          e.numero
                        }
                        value={e.id}
                        key={e.id}
                      />
                    ))}
                  </Picker>
                </Item>
              )}
              <Item>
                <Label>Número de Cuotas</Label>
                <ErrorMessage
                  component={Label}
                  name="numero_cuotas"
                  style={styles.errorInput}
                />
                <Input
                  name="numero_cuotas"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("numero_cuotas")}
                  onBlur={handleBlur("numero_cuotas")}
                  value={values.numero_cuotas}
                />
              </Item>
              <Item>
                <Label>Gasto realizado el</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_operacion"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_operacion"
                  defaultDate={values.fecha_operacion}
                  minimumDate={new Date(2000, 1, 1)}
                  maximumDate={new Date(2100, 12, 31)}
                  locale={"es"}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={"fade"}
                  androidMode={"default"}
                  placeHolderText="Elegir fecha"
                  textStyle={{ color: "#5073F3" }}
                  placeHolderTextStyle={{ color: "#5073F3" }}
                  onDateChange={(v) =>
                    setFieldValue(
                      "fecha_operacion",
                      moment(v).format("YYYY-MM-DD")
                    )
                  }
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
