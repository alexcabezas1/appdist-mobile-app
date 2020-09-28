import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage } from "formik";
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
  ListItem,
  Body,
  CheckBox,
} from "native-base";

import { formStyles } from "./shared/styles";
import {
  Cuenta,
  Prestamo,
  BANCOS_OPCIONES,
  PRESTAMOS_PLAZO_OPCIONES,
  PRESTAMOS_ROL_OPCIONES,
} from "../services/models";
import { timestamp } from "../services/common";
import moment from "moment";

export default function RegistrarPrestamo({ navigation, props }) {
  const prestamos_plazo_opciones = Object.entries(PRESTAMOS_PLAZO_OPCIONES);
  const prestamos_rol_opciones = Object.entries(PRESTAMOS_ROL_OPCIONES);

  const initialValues = {
    capital_principal: "0.0",
    interes: "0.0",
    dia_vencimiento_cuota: "1",
    plazo: prestamos_plazo_opciones[0][0],
    rol: prestamos_rol_opciones[0][0],
    descripcion: "",
    debito_automatico: false,
    cuenta_id: 0,
    fecha_operacion: undefined,
  };

  const validationSchema = Yup.object({
    capital_principal: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("es requerido"),
    interes: Yup.number()
      .typeError("el interés debe ser un número")
      .min(0, "el interés debe ser mayor o igual a 0")
      .max(100, "cifra no permitida en el interés")
      .required("es requerido"),
    cuenta_id: Yup.number().when(["debito_automatico", "rol"], {
      is: (debito_automatico, rol) =>
        debito_automatico && rol === "prestatario",
      then: Yup.number().test("required", "*", (v) => v != 0),
      otherwise: Yup.number().notRequired(),
    }),
    descripcion: Yup.string().required("*"),
    fecha_operacion: Yup.date().required("*"),
  });

  let dias_del_mes = [];
  for (let i = 1; i < 31; i++) {
    dias_del_mes.push(i.toString());
  }

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
    await Prestamo.registrar(form);
    resetForm();
    navigation.navigate("Prestamos", { version: timestamp() });
  }, []);

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Prestamos")}>
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Prestamos")}>
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
              <Item style={styles.noBorder}>
                <Label>Capital Principal:</Label>
                <Input
                  name="capital_principal"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("capital_principal")}
                  onBlur={handleBlur("capital_principal")}
                  value={values.capital_principal}
                />
              </Item>
              <Item>
                <ErrorMessage
                  component={Label}
                  name="capital_principal"
                  style={styles.errorInput}
                />
              </Item>
              <Item style={styles.noBorder}>
                <Label>Interés %</Label>
                <Input
                  name="interes"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("interes")}
                  onBlur={handleBlur("interes")}
                  value={values.interes}
                />
                <Label>Plazo:</Label>
                <Picker
                  name="plazo"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="plazo"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.plazo}
                  onValueChange={(v) => setFieldValue("plazo", v)}
                >
                  {prestamos_plazo_opciones.map((e) => (
                    <Picker.Item label={e[1].name} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              <Item style={styles.noBorder}>
                <ErrorMessage
                  component={Label}
                  name="interes"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>La cuota vence el día:</Label>
                <ErrorMessage
                  component={Label}
                  name="dia_vencimiento_cuota"
                  style={styles.errorInput}
                />
                <Picker
                  name="dia_vencimiento_cuota"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="dia_vencimiento_cuota"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.dia_vencimiento_cuota}
                  onValueChange={(v) =>
                    setFieldValue("dia_vencimiento_cuota", v)
                  }
                >
                  {dias_del_mes.map((e) => (
                    <Picker.Item label={e} value={e} key={e} />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Rol:</Label>
                <Picker
                  name="rol"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Rol"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.rol}
                  onValueChange={(v) => setFieldValue("rol", v)}
                >
                  {prestamos_rol_opciones.map((e) => (
                    <Picker.Item label={e[1]} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Descripcion:</Label>
                <ErrorMessage
                  component={Label}
                  name="descripcion"
                  style={styles.errorInput}
                />
                <Input
                  name="descripcion"
                  placeholder="Prestamista/Prestatario"
                  placeholderTextColor="#5073F3"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("descripcion")}
                  onBlur={handleBlur("descripcion")}
                  value={values.descripcion}
                />
              </Item>
              {values.rol === "prestatario" && (
                <ListItem
                  onPress={(v) =>
                    setFieldValue(
                      "debito_automatico",
                      !values.debito_automatico
                    )
                  }
                >
                  <CheckBox
                    checked={values.debito_automatico}
                    color="#5073F3"
                  />
                  <Body>
                    <Text style={{ color: "#5073F3" }}>
                      Se paga mediante Débito Automático
                    </Text>
                  </Body>
                </ListItem>
              )}
              {values.debito_automatico == true &&
                values.rol === "prestatario" && (
                  <Item>
                    <Label>Cuenta Bancaria: </Label>
                    <ErrorMessage
                      component={Label}
                      name="cuenta_id"
                      style={styles.errorInput}
                    />
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined, color: "#5073F3" }}
                      selectedValue={values.cuenta_id}
                      onValueChange={(v) => setFieldValue("cuenta_id", v)}
                    >
                      <Picker.Item label="Elegir cuenta" value={0} />
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
                <Label>Fecha de Transacción:</Label>
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
