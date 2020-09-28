import React, { useState, useEffect, useCallback } from "react";
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
  ListItem,
  CheckBox,
  Body,
  View,
} from "native-base";
import { UNSELECTED_VALUE } from "./shared/common";
import { Cuenta, Tarjeta, BANCOS_OPCIONES } from "../services/models";
import { getYears, timestamp } from "../services/common";
import moment from "moment";

export default function RegistrarTarjeta({ route, navigation, props }) {
  const years = getYears();
  const initialValues = {
    tipo: "debito",
    entidad_emisor: "visa",
    ultimos_numeros: "",
    cuenta_id: 0,
    mes_vencimiento: "01",
    anio_vencimiento: years[0],
    debito_automatico: false,
    fecha_cierre_resumen: undefined,
    fecha_vencimiento_resumen: undefined,
  };

  const validationSchema = Yup.object({
    ultimos_numeros: Yup.string()
      .matches(/^[0-9]{4}$/, "últimos 4 números de la tarjeta")
      .required("es requerido"),
    cuenta_id: Yup.number().when(["debito_automatico", "tipo"], {
      is: (debito_automatico, tipo) => debito_automatico || tipo === "debito",
      then: Yup.number().test("required", "*", (v) => v != 0),
      otherwise: Yup.number().notRequired(),
    }),
    fecha_cierre_resumen: Yup.date().when("tipo", {
      is: "credito",
      then: Yup.date().required("*"),
      otherwise: Yup.date().notRequired(),
    }),
    fecha_vencimiento_resumen: Yup.date().when("tipo", {
      is: "credito",
      then: Yup.date().required("*"),
      otherwise: Yup.date().notRequired(),
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
    const {
      tipo,
      entidad_emisor,
      cuenta_id,
      ultimos_numeros,
      fecha_cierre_resumen,
      fecha_vencimiento_resumen,
      debito_automatico,
      mes_vencimiento,
      anio_vencimiento,
    } = form;
    const fecha_vencimiento = moment(
      anio_vencimiento + "-" + mes_vencimiento + "-01"
    ).format("YYYY-MM-DD");
    const esDebitoAutomatico = tipo === "credito" && debito_automatico;

    const obj = new Tarjeta({
      tipo,
      entidad_emisor,
      cuenta_id,
      ultimos_numeros,
      fecha_vencimiento,
      fecha_cierre_resumen:
        tipo === "credito"
          ? moment(fecha_cierre_resumen).format("YYYY-MM-DD")
          : null,
      fecha_vencimiento_resumen:
        tipo === "credito"
          ? moment(fecha_vencimiento_resumen).format("YYYY-MM-DD")
          : null,
      debito_automatico: esDebitoAutomatico,
    });
    await obj.save();
    resetForm();
    navigation.navigate("Tarjetas", { version: timestamp() });
  }, []);

  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.navigate("Tarjetas")}>
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Tarjetas")}>
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
                <Label>Tipo/Emisor:</Label>
                <ErrorMessage
                  component={Label}
                  name="tipo"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Tipo"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.tipo}
                  onValueChange={(v) => setFieldValue("tipo", v)}
                >
                  <Picker.Item label="Crédito" value="credito" />
                  <Picker.Item label="Débito" value="debito" />
                </Picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  selectedValue={values.entidad_emisor}
                  onValueChange={(v) => setFieldValue("entidad_emisor", v)}
                >
                  <Picker.Item label="Visa" value="visa" />
                  <Picker.Item label="American Express" value="amex" />
                  <Picker.Item label="MasterCard" value="mastercard" />
                  <Picker.Item label="Otro" value="otro" />
                </Picker>
              </Item>
              <Item style={styles.noBorder}>
                <ErrorMessage
                  component={Label}
                  name="entidad_emisor"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>N° Tarjeta: </Label>
                <Input
                  name="ultimos_numeros"
                  placeholder=""
                  placeHolderStyle={{ color: "#d3d3d3" }}
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("ultimos_numeros")}
                  onBlur={handleBlur("ultimos_numeros")}
                  value={values.ultimos_numeros}
                />
              </Item>
              <Item>
                <ErrorMessage
                  component={Label}
                  name="ultimos_numeros"
                  style={styles.errorInput}
                />
              </Item>
              <Item>
                <Label>Vence en:</Label>
                <ErrorMessage
                  component={Label}
                  name="mes_vencimiento"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Mes"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.mes_vencimiento}
                  onValueChange={(v) => setFieldValue("mes_vencimiento", v)}
                >
                  <Picker.Item label="01" value="01" />
                  <Picker.Item label="02" value="02" />
                  <Picker.Item label="03" value="03" />
                  <Picker.Item label="04" value="04" />
                  <Picker.Item label="05" value="05" />
                  <Picker.Item label="06" value="06" />
                  <Picker.Item label="07" value="07" />
                  <Picker.Item label="08" value="08" />
                  <Picker.Item label="09" value="09" />
                  <Picker.Item label="10" value="10" />
                  <Picker.Item label="11" value="11" />
                  <Picker.Item label="12" value="12" />
                </Picker>
                <ErrorMessage
                  component={Label}
                  name="anio_vencimiento"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Año"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.anio_vencimiento}
                  onValueChange={(v) => setFieldValue("anio_vencimiento", v)}
                >
                  {years.map((e) => (
                    <Picker.Item label={e} value={e} key={e} />
                  ))}
                </Picker>
              </Item>
              {values.tipo === "credito" && (
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
                        BANCOS_OPCIONES[e.banco_asociado].name + " #" + e.numero
                      }
                      value={e.id}
                      key={e.id}
                    />
                  ))}
                </Picker>
              </Item>
              {values.tipo === "credito" && (
                <React.Fragment>
                  <Item>
                    <Label>Cierre de Resumen: </Label>
                    <ErrorMessage
                      component={Label}
                      name="fecha_cierre_resumen"
                      style={styles.errorInput}
                    />
                    <DatePicker
                      format
                      name="fecha_cierre_resumen"
                      defaultDate={values.fecha_cierre_resumen}
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
                        setFieldValue("fecha_cierre_resumen", v)
                      }
                      disabled={false}
                    />
                  </Item>
                  <Item>
                    <Label>Vencimiento del Resumen: </Label>
                    <ErrorMessage
                      component={Label}
                      name="fecha_vencimiento_resumen"
                      style={styles.errorInput}
                    />
                    <DatePicker
                      format
                      name="fecha_vencimiento_resumen"
                      defaultDate={values.fecha_vencimiento_resumen}
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
                        setFieldValue("fecha_vencimiento_resumen", v)
                      }
                      disabled={false}
                    />
                  </Item>
                </React.Fragment>
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
