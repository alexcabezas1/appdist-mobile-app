import * as SQLite from "expo-sqlite";
import { BaseModel, types } from "expo-sqlite-orm";
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
      recurrencia: { type: types.INTEGER, not_null: true, default: () => 1 },
      fecha_operacion: { type: types.DATE, not_null: true },
      fecha_creacion: {
        type: types.DATETIME,
        not_null: true,
        default: () => currentDateTime(),
      },
    };
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

  static cuentas_activas() {
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
      banco_asociado: { type: types.TEXT, not_null: true },
      cuenta_id: { type: types.INTEGER },
      ultimos_numeros: { type: types.INTEGER },
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
      numero_cuotas: { type: types.INTEGER, not_null: true, default: () => 1 },
      dia_vencimiento_cuota: { type: types.INTEGER },
      plazo_prestamo: { type: types.INTEGER, not_null: true, default: () => 1 },
      debito_automatico: {
        type: types.BOOLEAN,
        not_null: true,
        default: () => false,
      },
      cuenta_id: { type: types.INTEGER },
      rol: { type: types.TEXT, not_null: true },
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
};
