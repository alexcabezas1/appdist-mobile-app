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

export default function CuentasRegistrar({ navigation, props }) {
  const initialValues = {
    banco: undefined,
    numero_cuenta: undefined,
    tipo: "CBU",
    cc: undefined,
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
  //Banco, NC, CBU/CVU.
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
              <Item>
                <Label>Banco: </Label>
                <Picker
                  name="frecuencia"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Frecuencia del cuenta"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.frecuencia}
                  onValueChange={(v) => setFieldValue("frecuencia", v)}
                >
                  <Picker.Item label="Nación" value="nacion" />
                  <Picker.Item label="Santander Río" value="santander" />
                  <Picker.Item label="Galicia" value="galicia" />
                  <Picker.Item label="Provincia" value="provincia" />
                  <Picker.Item label="HSBC" value="hsbc" />
                  <Picker.Item label="CitiBank" value="citibank" />
                  <Picker.Item label="Comafi" value="comafi" />
                  <Picker.Item label="MercadoPago" value="mercadopago" />

                </Picker>
              </Item>
              <Item>
                <Label>Numero de cuenta</Label>
                <Input
                  name="nroCuenta"
                  keyboardType="numeric"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("nroCuenta")}
                  onBlur={handleBlur("nroCuenta")}
                  value={values.numero_cuenta}
                />
              </Item>

              <Item>
                <Label>CBU/CVU:</Label>
                <Input
                  name="cc"
                  keyboardType="numeric"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cc")}
                  onBlur={handleBlur("cc")}
                  value={values.cc}
                />
              </Item>
              <Text style={styles.space}></Text>
              <Button block primary onPress={handleSubmit} title="Submit">
                <Text>Guardar</Text>
              </Button>
              <Button
                block
                bordered
                light
                onPress={() => navigation.navigate("CuentasBancarias")}
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
