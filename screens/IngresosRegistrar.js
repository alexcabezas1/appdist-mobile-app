import React, { useState } from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
import * as Yup from "yup";
import { Formik, ErrorMessage, yupToFormErrors } from "formik";
import { Block, theme } from "galio-framework";
import { materialTheme } from "../constants";

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
} from "native-base";

const { width } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function RegistrarIngreso({ navigation, props }) {
  const initialValues = {
    cantidad: "0.00",
    recibido_en: undefined,
    frecuencia: "mensual",
    origen: "alquiler_propiedad",
    destino: "banco_ciudad_920398498343",
  };
  const [chosenDate, setDate] = useState(new Date());

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
      <Header />
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
              <Button
                block
                bordered
                light
                onPress={() => navigation.navigate("Ingresos")}
              >
                <Text>Cancelar</Text>
              </Button>
            </Form>
          )}
        </Formik>
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
  errorInput: {
    color: "#D84444",
    textAlign: "left",
    marginBottom: 0,
    marginTop: 0,
  },
});
