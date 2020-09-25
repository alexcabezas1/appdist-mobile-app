import React, { useCallback } from "react";
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
  Left,
  Right,
} from "native-base";
import { formStyles } from "./shared/styles";
import { Cuenta, BANCOS_OPCIONES, timestamp } from "../services/models";

export default function CuentasRegistrar({ navigation, props }) {
  const initialValues = {
    banco_asociado: "banco_hsbc",
    numero: undefined,
    cbu: undefined,
    descripcion: "desc del banco",
  };

  const validationSchema = Yup.object({
    numero: Yup.number()
      .typeError("debe ser un número")
      .required("es requerida"),
    cbu: Yup.number().typeError("debe ser un número").required("es requerida"),
  });

  const submitHandler = useCallback(async (form, { resetForm }) => {
    const obj = new Cuenta(form);
    await obj.save();
    resetForm();
    navigation.navigate("CuentasBancarias", { version: timestamp() });
  }, []);

  return (
    <Container>
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => navigation.navigate("CuentasBancarias")}
          >
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button
            transparent
            onPress={() => navigation.navigate("CuentasBancarias")}
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
                <Label>Banco: </Label>
                <Picker
                  name="banco_asociado"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Frecuencia del cuenta"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.banco_asociado}
                  onValueChange={(v) => setFieldValue("banco_asociado", v)}
                >
                  {Object.entries(BANCOS_OPCIONES).map((e) => (
                    <Picker.Item label={e[1].name} value={e[0]} key={e[0]} />
                  ))}
                </Picker>
              </Item>
              <Item>
                <Label>Numero de Cuenta:</Label>
                <Input
                  name="numero"
                  keyboardType="numeric"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("numero")}
                  onBlur={handleBlur("numero")}
                  value={values.numero}
                />
              </Item>

              <Item>
                <Label>CBU/CVU:</Label>
                <Input
                  name="cbu"
                  keyboardType="numeric"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cbu")}
                  onBlur={handleBlur("cbu")}
                  value={values.cbu}
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
