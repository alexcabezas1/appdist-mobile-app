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

export default function RegistrarPrestamo({ navigation, props }) {
  const plazo_del_prestamo = ["3_meses", "6_meses", "1_año", "3_años", "5_años"];
  

  const initialValues = {
    capitalprincipal: "0.0",
    interes: "0.0",
    cantidad_de_cuotas: "1",
    rol: "prestamista",
    plazo: "3_meses",
    fecha_vencimiento_en: undefined,
    fecha_transaccion_en: undefined,
  };

  const validationSchema = Yup.object({
    capitalprincipal: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("Es requerido"),
      interes: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(999999999, "cifra no permitida")
      .required("Es requerido"),
    cuotas_prestamo_por_vencer: Yup.string().when("rol", {
      is: "cuota_de_prestamo",
      then: Yup.string().test("required", "*", (v) => v != "no_aplica"),
      otherwise: Yup.string().notRequired(),
    }),
    cantidad_de_cuotas: Yup.number()
      .typeError("debe ser un número")
      .min(1, "debe ser mayor a 0")
      .max(36, "cifra no permitida"),
    fecha_vencimiento_en: Yup.date().required("*"),
    
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
          <Button transparent onPress={() => navigation.navigate("Préstamos")}>
            <Icon name="arrow-back" />
            <Text>Volver</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent onPress={() => navigation.navigate("Préstamos")}>
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
                <Label>Capital principal</Label>
                <ErrorMessage
                  component={Label}
                  name="capitalprincipal"
                  style={styles.errorInput}
                />
                <Input
                  name="capitalprincipal"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("capitalprincipal")}
                  onBlur={handleBlur("capitalprincipal")}
                  value={values.capitalprincipal}
                />
              </Item>
              <Item stackedLabel>
                <Label>Interés %</Label>
                <ErrorMessage
                  component={Label}
                  name="interes"
                  style={styles.errorInput}
                  
                />
                <Input
                  name="interes"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("interes")}
                  onBlur={handleBlur("interes")}
                  value={values.interes} 
                    
                />
                
              </Item>
              <Item>
                <Label>Cantidad de Cuotas</Label>
                <ErrorMessage
                  component={Label}
                  name="cantidad_de_cuotas"
                  style={styles.errorInput}
                />
                <Input
                  name="cantidad_de_cuotas"
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("cantidad_de_cuotas")}
                  onBlur={handleBlur("cantidad_de_cuotas")}
                  value={values.cantidad_de_cuotas}
                />
              </Item>
              <Item>
                <Label>Plazo del préstamo</Label>
                <Picker
                  name="plazo"
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Plazo"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.plazo}
                  onValueChange={(v) => setFieldValue("plazo", v)}
                >
                  <Picker.Item label="3 meses" value="3_meses" />
                  <Picker.Item label="6 meses" value="6_meses" />
                  <Picker.Item label="1 año" value="1_año" />
                  <Picker.Item label="3 años" value="3_años" />
                  <Picker.Item label="5 años" value="5_años" />
                </Picker>
              </Item>
              
              <Item>
                <Label>Fecha de vencimiento:</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_vencimiento_en"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_vencimiento_en"
                  defaultDate={values.fecha_vencimiento_en}
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
                  onDateChange={(v) => setFieldValue("fecha_vencimiento_en", v)}
                  disabled={false}
                />
              </Item>

              <Item>
                <Label>Fecha de transacción:</Label>
                <ErrorMessage
                  component={Label}
                  name="fecha_transaccion_en"
                  style={styles.errorInput}
                />
                <DatePicker
                  name="fecha_transaccion_en"
                  defaultDate={values.fecha_transaccion_en}
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
                  onDateChange={(v) => setFieldValue("fecha_transaccion_en", v)}
                  disabled={false}
                />
              </Item>
              <Item>
                <Label>Rol</Label>
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
                  <Picker.Item label="Prestamista" value="prestamista" />
                  <Picker.Item label="Prestatario" value="prestatario" />
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
