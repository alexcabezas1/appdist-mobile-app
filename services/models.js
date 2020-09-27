import * as SQLite from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";
import { validateYupSchema } from "formik";
import moment from "moment";

const DATABASE_NAME = "mybudget.db";

const openDatabase = async () => SQLite.openDatabase(DATABASE_NAME);

const currentDateTime = () => moment().format("YYYY-MM-DDTHH:mm:ss") + "Z";
const timestamp = () => Date.now();

class Ingreso extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "ingresos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      origen: { type: types.TEXT, not_null: true },
      cuenta_destino_id: { type: types.INTEGER, not_null: true },
      frecuencia: { type: types.TEXT, not_null: true },
      recurrencia: { type: types.INTEGER, not_null: true, default: () => 0 },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }

  static async registrar(values) {
    const newValues = {
      ...values,
      recurrencia: values.frecuencia === "una_vez" ? 0 : values.recurrencia,
    };
    const newIngreso = new Ingreso(newValues);
    const ingreso = await newIngreso.save();
    console.log(ingreso);
    const { recurrencia, frecuencia, cuenta_destino_id, cantidad } = newValues;

    let currentFutureDate = moment();
    const newMovimiento = new CuentaMovimiento({
      cuenta_id: cuenta_destino_id,
      concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.INGRESO,
      tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA,
      cantidad,
      ingreso_id: ingreso.id,
      fecha_operacion: currentFutureDate.format("YYYY-MM-DD"),
    });
    await newMovimiento.save();

    if (recurrencia > 0 && frecuencia != "una_vez") {
      for (let i = 0; i < recurrencia - 1; i++) {
        const futureDate = currentFutureDate.add(
          1,
          FRECUENCIA_A_MOMENT[frecuencia]
        );
        currentFutureDate = futureDate;

        const newMovimiento = new CuentaMovimiento({
          cuenta_id: cuenta_destino_id,
          concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.INGRESO,
          tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.ACREDITA,
          cantidad,
          ingreso_id: ingreso.id,
          fecha_operacion: currentFutureDate.format("YYYY-MM-DD"),
        });
        await newMovimiento.save();
      }
    }
  }

  static async remover(id) {
    const sql = `DELETE FROM cuentas_movimientos WHERE ingreso_id = ?`;
    await this.repository.databaseLayer.executeSql(sql, [id]);
    await Ingreso.destroy(id);
  }

  static todos() {
    const sql = `
    SELECT
      i.id As key,
      i.id,
      i.cantidad,
      i.origen,
      i.cuenta_destino_id,
      i.frecuencia,
      i.recurrencia,
      i.fecha_operacion,
      i.fecha_creacion,
      c.numero AS cuenta_numero,
      c.banco_asociado AS cuenta_banco_asociado
    FROM ingresos i
    INNER JOIN cuentas c ON i.cuenta_destino_id = c.id
    ORDER BY i.fecha_creacion DESC
  `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class Cuenta extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "cuentas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      descripcion: { type: types.TEXT },
      numero: { type: types.TEXT },
      banco_asociado: { type: types.TEXT, not_null: true },
      cbu: { type: types.TEXT },
      saldo: { type: types.NUMERIC, default: () => 0 },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static cuentasActivas() {
    const sql = `
      SELECT
        id as key,
        id,
        numero,
        banco_asociado,
        cbu,
        fecha_creacion
      FROM cuentas WHERE borrado = false
      ORDER BY fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

/*
      const cuentas = await Cuenta.query({
        columns: "id, numero, banco_asociado, cbu, fecha_creacion",
        where: {
          borrado_eq: false,
        },
      });
*/

class CuentaMovimiento extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "cuentas_movimientos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cuenta_id: { type: types.INTEGER, not_null: true },
      concepto: { type: types.TEXT, not_null: true },
      tipo: { type: types.TEXT, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      ingreso_id: { type: types.INTEGER },
      egreso_id: { type: types.INTEGER },
      tarjeta_id: { type: types.INTEGER },
      prestamo_cuota_id: { type: types.INTEGER },
      inversion_id: { type: types.INTEGER },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
}

class Egreso extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "egresos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      motivo: { type: types.TEXT, not_null: true },
      medio_pago: { type: types.TEXT, not_null: true },
      numero_cuotas: { type: types.INTEGER, not_null: true, default: () => 1 },
      tarjeta_id: { type: types.INTEGER },
      cuenta_id: { type: types.INTEGER },
      cuota_prestamo_id: { type: types.INTEGER },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }
}

class Tarjeta extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "tarjetas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tipo: { type: types.TEXT, not_null: true },
      entidad_emisor: { type: types.TEXT, not_null: true },
      cuenta_id: { type: types.INTEGER },
      ultimos_numeros: { type: types.TEXT },
      fecha_vencimiento: { type: types.DATE, not_null: true },
      fecha_cierre_resumen: { type: types.DATE, not_null: true },
      fecha_vencimiento_resumen: { type: types.DATE, not_null: true },
      debito_automatico: {
        type: types.BOOLEAN,
        not_null: true,
        default: () => false,
      },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static tarjetasActivas() {
    const sql = `
      SELECT
        t.id AS key,
        t.id,
        t.tipo,
        t.entidad_emisor,
        t.cuenta_id,
        t.ultimos_numeros,
        t.fecha_vencimiento,
        t.fecha_cierre_resumen,
        t.fecha_vencimiento_resumen,
        t.debito_automatico,
        t.fecha_creacion,
        c.banco_asociado AS cuenta_banco_asociado,
        c.numero AS cuenta_numero
      FROM tarjetas t
      LEFT JOIN cuentas c ON t.cuenta_id = c.id
      WHERE t.borrado = false
      ORDER BY t.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class TarjetaMovimiento extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "tarjetas_movimientos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tarjeta_id: { type: types.INTEGER, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      egreso_id: { type: types.INTEGER, not_null: true },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
}

class Inversion extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "inversiones";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      tipo_inversion: { type: types.INTEGER, not_null: true },
      descripcion: { type: types.TEXT, not_null: true },
      capital_invertido: { type: types.NUMERIC, not_null: true },
      interes: { type: types.INTEGER },
      cantidad_adquirida: { type: types.INTEGER },
      intermediario: { type: types.TEXT },
      cuenta_origen_id: { type: types.INTEGER, not_null: true },
      cuenta_destino_id: { type: types.INTEGER, not_null: true },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_vencimiento: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
}

class Prestamo extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "prestamos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      capital_principal: { type: types.NUMERIC, not_null: true },
      interes: { type: types.INTEGER, not_null: true },
      dia_vencimiento_cuota: { type: types.INTEGER },
      plazo: { type: types.INTEGER, not_null: true, default: () => 1 },
      debito_automatico: {
        type: types.BOOLEAN,
        not_null: true,
        default: () => false,
      },
      cuenta_id: { type: types.INTEGER },
      rol: { type: types.TEXT, not_null: true },
      nombre_prestamista: { type: types.TEXT },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }

  static calcularCuota({ capital_principal, interes, plazo }) {
    const interes_porcentaje = parseFloat(interes) / 100;
    return (
      (interes_porcentaje * parseFloat(capital_principal)) /
      (1 - Math.pow(1 + interes_porcentaje, -plazo))
    );
  }

  static async registrar(values) {
    const newPrestamo = new Prestamo(values);
    const prestamo = await newPrestamo.save();

    const { dia_vencimiento_cuota, plazo, debito_automatico, rol } = values;
    const now = moment();
    let fechaActualVencimiento = moment(
      now.format("Y") +
        "-" +
        now.format("M") +
        "-" +
        dia_vencimiento_cuota.padStart(2, "0"),
      "YYYY-MM-DD"
    );
    const plazo_numero = PRESTAMOS_PLAZO_OPCIONES[plazo].numero;
    const cuotaCantidad = Prestamo.calcularCuota({
      ...values,
      plazo: plazo_numero,
    });

    for (let i = 0; i < plazo_numero; i++) {
      const fechaFuturaVencimiento = fechaActualVencimiento.add(1, "months");

      const newPrestamoCuota = new PrestamoCuota({
        prestamo_id: prestamo.id,
        numero_cuota: i + 1,
        cantidad: cuotaCantidad,
        fecha_vencimiento: fechaFuturaVencimiento.format("YYYY-MM-DD"),
      });
      const prestamoCuota = await newPrestamoCuota.save();

      if (debito_automatico && rol === "prestatario") {
        const newCuentaMovimiento = new CuentaMovimiento({
          cuenta_id: prestamo.cuenta_id,
          concepto: CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES.PRESTAMO_CUOTA,
          tipo: CUENTAS_MOVIMIENTOS_TIPO_OPCIONES.DEBITA,
          cantidad: cuotaCantidad,
          prestamo_cuota_id: prestamoCuota.id,
          fecha_operacion: fechaFuturaVencimiento.format("YYYY-MM-DD"),
        });
        await newCuentaMovimiento.save();
      }

      fechaActualVencimiento = fechaFuturaVencimiento;
    }
  }

  static async remover(id) {
    const delete_movimientos_sql = `
    DELETE FROM cuentas_movimientos
    WHERE prestamo_cuota_id IN (
        SELECT id
        FROM prestamos_cuotas
        WHERE prestamo_id = ?
    )`;
    await this.repository.databaseLayer.executeSql(delete_movimientos_sql, [
      id,
    ]);

    const delete_cuotas_sql = `DELETE FROM prestamos_cuotas WHERE prestamo_id = ?`;
    await this.repository.databaseLayer.executeSql(delete_cuotas_sql, [id]);

    await Prestamo.destroy(id);
  }

  static todosActivos() {
    const sql = `
      SELECT
        p.id AS key,
        p.id,
        p.capital_principal,
        p.interes,
        p.plazo,
        p.dia_vencimiento_cuota,
        p.debito_automatico,
        p.cuenta_id,
        p.rol,
        p.nombre_prestamista,
        p.fecha_operacion,
        p.fecha_creacion,
        c.banco_asociado AS cuenta_banco_asociado,
        c.numero AS cuenta_numero
      FROM prestamos p
      LEFT JOIN cuentas c ON p.cuenta_id = c.id
      WHERE p.borrado = false
      ORDER BY p.fecha_creacion DESC
    `;
    const params = [];
    return this.repository.databaseLayer
      .executeSql(sql, params)
      .then(({ rows }) => rows);
  }
}

class PrestamoCuota extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "prestamos_cuotas";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      prestamo_id: { types: types.INTEGER, not_null: true },
      numero_cuota: { types: types.INTEGER, not_null: true },
      cantidad: { type: types.NUMERIC, not_null: true },
      fecha_vencimiento: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
      fecha_borrado: { type: types.DATETIME },
      borrado: { type: types.BOOLEAN, default: () => false },
    };
  }
}

class Presupuesto extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "presupuestos";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
}

class PresupuestoDetalle extends BaseModel {
  constructor(obj) {
    super(obj);
  }

  static get database() {
    return openDatabase;
  }

  static get tableName() {
    return "presupuestos_detalle";
  }

  static get columnMapping() {
    return {
      id: { type: types.INTEGER, primary_key: true },
      presupuesto_id: { type: types.INTEGER, not_null: true },
      rubro: { type: types.TEXT, not_null: true },
      cantidad_estimada: { type: types.NUMERIC, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
  }
}

const createTables = () =>
  Promise.all(
    Ingreso.createTable(),
    Cuenta.createTable(),
    CuentaMovimiento.createTable(),
    Egreso.createTable(),
    Tarjeta.createTable(),
    TarjetaMovimiento.createTable(),
    Inversion.createTable(),
    Prestamo.createTable(),
    PrestamoCuota.createTable(),
    Presupuesto.createTable(),
    PresupuestoDetalle.createTable()
  );

const dropTables = () =>
  Promise.all(
    Ingreso.dropTable(),
    Cuenta.dropTable(),
    CuentaMovimiento.dropTable(),
    Egreso.dropTable(),
    Tarjeta.dropTable(),
    TarjetaMovimiento.dropTable(),
    Inversion.dropTable(),
    Prestamo.dropTable(),
    PrestamoCuota.dropTable(),
    Presupuesto.dropTable(),
    PresupuestoDetalle.dropTable()
  );

const prepareDatabase = async () => {
  await createTables();
};

const BANCOS_OPCIONES = {
  banco_nacion: { name: "Nación", tipo: "cbu" },
  banco_santander: { name: "Santander Río", tipo: "cbu" },
  banco_galicia: { name: "Galicia", tipo: "cbu" },
  banco_provincia: { name: "Provincia", tipo: "cbu" },
  banco_hsbc: { name: "HSBC", tipo: "cbu" },
  banco_citibank: { name: "CitiBank", tipo: "cbu" },
  banco_comafi: { name: "Comafi", tipo: "cbu" },
  banco_frances: { name: "Frances", tipo: "cbu" },
  mercadopago: { name: "MercadoPago", tipo: "cvu" },
};

const TARJETAS_TIPO_OPCIONES = {
  credito: "Crédito",
  debito: "Débito",
};

const TARJETAS_ENTIDAD_OPCIONES = {
  visa: "Visa",
  amex: "American Express",
  mastercard: "MasterCard",
  otro: "Otro",
};

const INGRESOS_FRECUENCIA_OPCIONES = {
  mensual: "Mensual",
  semanal: "Semanal",
  diario: "Diario",
  una_vez: "Una sola vez",
};

const FRECUENCIA_A_MOMENT = {
  mensual: "months",
  semanal: "weeks",
  diario: "days",
};

const INGRESOS_ORIGEN_OPCIONES = {
  sueldo_relacion_dependencia: "Sueldo en Relación de Dependencia",
  alquiler_propiedad: "Alquiler de Propiedad",
  facturacion_autonomo: "Facturación como Autónomo",
  extraordinario: "Extraordinario",
  otro: "Otro",
};

const CUENTAS_MOVIMIENTOS_TIPO_OPCIONES = {
  ACREDITA: "acredita",
  DEBITA: "debita",
};

const CUENTAS_MOVIMIENTOS_CONCEPTO_OPCIONES = {
  INGRESO: "ingreso",
  EGRESO: "egreso",
  TARJETA: "tarjeta",
  PRESTAMO_CUOTA: "prestamo_cuota",
  INVERSION: "inversion",
};

const PRESTAMOS_PLAZO_OPCIONES = {
  "3_meses": { name: "3 meses", numero: 3 },
  "6_meses": { name: "6 meses", numero: 6 },
  "12_meses": { name: "12 meses", numero: 12 },
  "24_meses": { name: "24 meses", numero: 24 },
  "36_meses": { name: "36 meses", numero: 36 },
  "48_meses": { name: "48 meses", numero: 48 },
  "60_meses": { name: "60 meses", numero: 60 },
};

const PRESTAMOS_ROL_OPCIONES = {
  prestamista: "Prestamista",
  prestatario: "Prestatario",
};

export {
  Ingreso,
  Cuenta,
  CuentaMovimiento,
  Egreso,
  Tarjeta,
  TarjetaMovimiento,
  Inversion,
  Prestamo,
  PrestamoCuota,
  Presupuesto,
  PresupuestoDetalle,
  createTables,
  dropTables,
  prepareDatabase,
  currentDateTime,
  timestamp,
  BANCOS_OPCIONES,
  TARJETAS_TIPO_OPCIONES,
  TARJETAS_ENTIDAD_OPCIONES,
  INGRESOS_FRECUENCIA_OPCIONES,
  INGRESOS_ORIGEN_OPCIONES,
  PRESTAMOS_PLAZO_OPCIONES,
  PRESTAMOS_ROL_OPCIONES,
};
