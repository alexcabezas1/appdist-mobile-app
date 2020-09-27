import React, { useState, useEffect, useCallback } from "react";
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

import {
  Ingreso,
  Cuenta,
  CuentaMovimiento,
  BANCOS_OPCIONES,
  INGRESOS_FRECUENCIA_OPCIONES,
  INGRESOS_ORIGEN_OPCIONES,
} from "../services/models";
import { timestamp } from "../services/common";
import moment from "moment";

export default function RegistrarIngreso({ navigation, props }) {
  const ingresos_frecuencia_opciones = Object.entries(
    INGRESOS_FRECUENCIA_OPCIONES
  );
  const ingresos_origen_opciones = Object.entries(INGRESOS_ORIGEN_OPCIONES);

  const [version, setVersion] = useState(timestamp());
  const [cuentas, setCuentas] = useState([]);

  const fetchData = async () => {
    const objs = await Cuenta.cuentasActivas();
    setCuentas(objs);
  };

  useEffect(() => {
    fetchData();
  }, [version]);

  const initialValues = {
    cantidad: "0.0",
    recurrencia: "0",
    fecha_operacion: undefined,
    frecuencia: ingresos_frecuencia_opciones[0][0],
    origen: ingresos_origen_opciones[0][0],
    cuenta_destino_id: 1,
  };

  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
    recurrencia: Yup.number()
      .typeError("debe ser un número")
      .min(0, "debe ser mayor o igual a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerida"),
    fecha_operacion: Yup.date().when("frecuencia", {
      is: "una_vez",
      then: Yup.date().required("es requerido"),
      otherwise: Yup.date().notRequired(),
    }),
  });

  const submitHandler = useCallback(async (form, { resetForm }) => {
    await Ingreso.registrar(form);
    resetForm();
    navigation.navigate("Ingresos", { version: timestamp() });
  }, []);

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
                <Label>Cantidad</Label>
                <Input
                  name="cantidad"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cantidad")}
                  onBlur={handleBlur("cantidad")}
                  value={values.cantidad}
                />
              </Item>
              <Item style={styles.noBorder}>
                <ErrorMessage
                  component={Label}
                  name="cantidad"
                  style={styles.errorInput}
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
                  {ingresos_frecuencia_opciones.map((e) => (
                    <Picker.Item label={e[1]} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Recurrencia</Label>
                <Input
                  name="recurrencia"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("recurrencia")}
                  onBlur={handleBlur("recurrencia")}
                  value={values.recurrencia}
                />
              </Item>
              <Item style={styles.noBorder}>
                <ErrorMessage
                  component={Label}
                  name="recurrencia"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>Recibido el</Label>
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
                <ErrorMessage
                  component={Label}
                  name="fecha_operacion"
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
                  {ingresos_origen_opciones.map((e) => (
                    <Picker.Item label={e[1]} value={e[0]} key={e[0]} />
                  ))}
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
                  selectedValue={values.cuenta_destino_id}
                  onValueChange={(v) => setFieldValue("cuenta_destino_id", v)}
                >
                  {cuentas.map((e) => (
                    <Picker.Item
                      label={
                        BANCOS_OPCIONES[e.banco_asociado].name + " #" + e.numero
                      }
                      value={e.id}
                      key={e.id}
                    />
                  ))}
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
