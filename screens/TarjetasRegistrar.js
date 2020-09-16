import React, { useState } from "react";
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


export default function RegistrarTarjeta({ navigation, props }) {


  const initialValues = {
      nroTarjeta:"",
      cuentaBancaria:"",
      entidad:"",
      mesVencimiento:"",
      añoVencimiento:"",
      fechaCierre:"",
  };

  const validationSchema = Yup.object({
    nroTarjeta: Yup.string()
    .matches(/^[0-9]{4}$/, 'Ultimos 4 digitos')
    .required("(Requerido)"),
    cuentaBancaria: Yup.string().required("(Requerido)"),
    entidad: Yup.string().required("(Requerido)"),
    mesVencimiento: Yup.string().required("(Requerido)"),
    añoVencimiento: Yup.string().required("(Requerido)"),
    fechaCierre: Yup.date().required("(Requerido)"),
  });


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
                  <Label>Cuenta Bancaria: </Label>
                  <ErrorMessage
                    component={Label}
                    name="cuentaBancaria"
                    style={styles.errorInput}
                  />
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    selectedValue={values.cuentaBancaria}
                    onValueChange={(v) => setFieldValue("cuentaBancaria", v)}
                  >
                    <Picker.Item 
                      label="Elegir cuenta" 
                      value="" />
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
              <Item>
                  <Label>Entidad: </Label>
                  <ErrorMessage
                    component={Label}
                    name="entidad"
                    style={styles.errorInput}
                  />
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined, color: "#5073F3" }}
                    selectedValue={values.entidad}
                    onValueChange={(v) => setFieldValue("entidad", v)}
                  >
                      <Picker.Item label ="Elegir entidad" value="no_aplica"/>
                      <Picker.Item
                      label="American Express"
                      value="AMEX"
                      />
                      <Picker.Item
                      label="Visa"
                      value="VISA"
                      />
                      <Picker.Item
                      label="Master Card"
                      value="MASTERCARD"
                      />
                      <Picker.Item
                      label="Otros"
                      value="OTROS"
                      />                      
                  </Picker>
              </Item>
              <Item>
                <Label>N° Tarjeta: </Label>
                <ErrorMessage
                  component={Label}
                  name="nroTarjeta"
                  style={styles.errorInput}
                />
                <Input
                  name="nroTarjeta"
                  placeholder="Ingresar"
                  placeHolderStyle={{ color: "#d3d3d3" }}
                  keyboardType="number-pad"
                  style={{ color: "#5073F3" }}
                  onChangeText={handleChange("nroTarjeta")}
                  onBlur={handleBlur("nroTarjeta")}
                  value={values.nroTarjeta}
                />
              </Item>
              <Item>
                <Label>Mes Vencimiento:</Label>        
                <ErrorMessage
                  component={Label}
                  name="mesVencimiento"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}                  
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Seleccione el mes"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.mesVencimiento}
                  onValueChange={(v) => setFieldValue("mesVencimiento", v)}                
                >
                    <Picker.Item label="Seleccionar Mes" value=""/>
                    <Picker.Item label="1" value="01"/>
                    <Picker.Item label="2" value="02"/>
                    <Picker.Item label="3" value="03"/>
                    <Picker.Item label="4" value="04"/>
                    <Picker.Item label="5" value="05"/>
                    <Picker.Item label="6" value="06"/>
                    <Picker.Item label="7" value="07"/>
                    <Picker.Item label="8" value="08"/>
                    <Picker.Item label="9" value="09"/>
                    <Picker.Item label="10" value="10"/>
                    <Picker.Item label="11" value="11"/>
                    <Picker.Item label="12" value="12"/>
                </Picker>
              </Item>
              <Item>
                <Label>Año Vencimiento:</Label>        
                <ErrorMessage
                  component={Label}
                  name="añoVencimiento"
                  style={styles.errorInput}
                />
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}                  
                  style={{ width: undefined, color: "#5073F3" }}
                  placeholder="Seleccione el año"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={values.anoVencimiento}
                  onValueChange={(v) => setFieldValue("añoVencimiento", v)}                
                >
                    <Picker.Item label="Seleccionar Año" value=""/>
                    <Picker.Item label="2020" value="20"/>
                    <Picker.Item label="2021" value="21"/>
                    <Picker.Item label="2022" value="22"/>
                    <Picker.Item label="2023" value="23"/>
                    <Picker.Item label="2024" value="24"/>
                    <Picker.Item label="2025" value="25"/>
                    <Picker.Item label="2026" value="26"/>
                </Picker>
              </Item>
              
              <Item>
                <Label>Cierre de resumen: </Label>
                <ErrorMessage
                  component={Label}
                  name="fechaCierre"
                  style={styles.errorInput}
                />
                <DatePicker
                  format
                  name="fechaCierre"
                  defaultDate={values.fechaCierre}
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
                  onDateChange={(v) => setFieldValue("fechaCierre", v)}
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
