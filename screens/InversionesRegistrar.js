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
import {
  Inversion,
  Cuenta,
  BANCOS_OPCIONES,
  INVERSIONES_TIPO_INVERSION_OPCIONES,
} from "../services/models";
import { timestamp, formatNumber, formatDate } from "../services/common";
import moment from "moment";
import _ from "lodash";

export default function RegistrarInversion({ navigation, props }) {
  const inversiones_con_cantidad_adquirida = [
    "compra_de_titulo",
    "accion",
    "bono",
    "otro",
  ];
  const inversiones_con_interes = ["plazo_fijo", "bono"];
  const inversiones_tipo_inversion_opciones = Object.entries(
    INVERSIONES_TIPO_INVERSION_OPCIONES
  );
  const initialValues = {
    tipo_inversion: inversiones_tipo_inversion_opciones[0][0],
    descripcion: "",
    capital_invertido: "0.0",
    interes: "0.0",
    cantidad_adquirida: "1",
    intermediario: "", // requerido para accion, bono, titulo
    cuenta_origen_id: 1,
    cuenta_destino_id: 1,
    fecha_operacion: undefined,
    fecha_vencimiento: undefined, // requerido para plazo fijo, bono
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
    interes: Yup.mixed().when("tipo_inversion", {
      is: (v) => inversiones_con_interes.includes(v),
      then: Yup.number()
        .typeError("debe ser un número")
        .min(1, "debe ser mayor a 0")
        .max(999999999, "cifra no permitada")
        .required("es requerido"),
      otherwise: Yup.number().notRequired(),
    }),
    fecha_vencimiento: Yup.date().when("tipo_inversion", {
      is: (v) => inversiones_con_interes.includes(v),
      then: Yup.date().required("*"),
      otherwise: Yup.date().notRequired(),
    }),
    fecha_operacion: Yup.date().required("*"),
    descripcion: Yup.string().required("*"),
    intermediario: Yup.string().when("tipo_inversion", {
      is: (v) => inversiones_con_cantidad_adquirida.includes(v),
      then: Yup.string().required("*"),
      otherwise: Yup.string().notRequired(),
    }),
  });

  const [version, setVersion] = useState(timestamp());
  const [cuentas, setCuentas] = useState([]);

  const fetchData = async () => {
    const cuentas = await Cuenta.cuentasActivas();
    setCuentas(cuentas);
  };

  useEffect(() => {
    fetchData();
  }, [version]);

  const submitHandler = useCallback(async (form, { resetForm }) => {
    await Inversion.registrar(form);
    resetForm();
    navigation.navigate("Inversiones", { version: timestamp() });
  }, []);

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
                  {inversiones_tipo_inversion_opciones.map((e) => (
                    <Picker.Item label={e[1]} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              <Item>
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
              <Item style={styles.noBorder}>
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
                    name="interes"
                    keyboardType="number-pad"
                    style={{ color: "#5073F3" }}
                    onChangeText={handleChange("interes")}
                    onBlur={handleBlur("interes")}
                    value={values.interes}
                  />
                </Item>
              )}
              <Item style={styles.noBorder}>
                <ErrorMessage
                  component={Label}
                  name="interes"
                  style={styles.errorInput}
                />
              </Item>
              {inversiones_con_cantidad_adquirida.includes(
                values.tipo_inversion
              ) && (
                <Item style={styles.noBorder}>
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
              {inversiones_con_interes.includes(values.tipo_inversion) && (
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
                    placeHolderTextStyle={{ color: "#5073F3" }}
                    onDateChange={(v) =>
                      setFieldValue(
                        "fecha_vencimiento",
                        moment(v).format("YYYY-MM-DD")
                      )
                    }
                    disabled={false}
                  />
                </Item>
              )}
              <Item>
                <Label>Debitar de</Label>
                <ErrorMessage
                  component={Label}
                  name="cuenta_origen_id"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Los fondos provienen de"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.cuenta_origen_id}
                  onValueChange={(v) => setFieldValue("cuenta_origen_id", v)}
                >
                  {cuentas.map((e) => (
                    <Picker.Item
                      label={
                        BANCOS_OPCIONES[e.banco_asociado].name + " #" + e.numero
                      }
                      value={e.id}
                      key={"cuenta-origen-id" + e.id}
                    />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Acreditar en</Label>
                <ErrorMessage
                  component={Label}
                  name="cuenta_destino_id"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Depositar los fondos en"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.cuenta_destino_id}
                  onValueChange={(v) => setFieldValue("cuenta_destino_id", v)}
                >
                  {cuentas.map((e) => (
                    <Picker.Item
                      label={
                        BANCOS_OPCIONES[e.banco_asociado].name + " #" + e.numero
                      }
                      value={e.id}
                      key={"cuenta-destino-" + e.id}
                    />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Operación realizada el</Label>
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
              {inversiones_con_cantidad_adquirida.includes(
                values.tipo_inversion
              ) && (
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
              )}
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
