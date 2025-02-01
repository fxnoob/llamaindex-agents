import db from "../db";

interface TableSchema {
    [tableName: string]: {
        columns: { [columnName: string]: string };
        primaryKeys: string[];
        foreignKeys: { column: string; refTable: string; refColumn: string }[];
    };
}

export async function getDatabaseSchema(): Promise<TableSchema> {
    try {
        const tableColumns = await db
            .select(
                "t.TABLE_NAME as table_name",
                "c.COLUMN_NAME as column_name",
                "c.DATA_TYPE as data_type",
                "c.CHARACTER_MAXIMUM_LENGTH as max_length",
                "k.CONSTRAINT_NAME as primary_key"
            )
            .from("INFORMATION_SCHEMA.TABLES as t")
            .leftJoin("INFORMATION_SCHEMA.COLUMNS as c", function () {
                this.on("t.TABLE_NAME", "=", "c.TABLE_NAME").andOn(
                    "t.TABLE_SCHEMA",
                    "=",
                    "c.TABLE_SCHEMA"
                );
            })
            .leftJoin("INFORMATION_SCHEMA.KEY_COLUMN_USAGE as k", function () {
                this.on("c.TABLE_NAME", "=", "k.TABLE_NAME").andOn(
                    "c.COLUMN_NAME",
                    "=",
                    "k.COLUMN_NAME"
                );
            })
            .where("t.TABLE_TYPE", "BASE TABLE")
            .orderBy("t.TABLE_NAME", "c.ORDINAL_POSITION");

        // Query Foreign Keys
        const foreignKeys = await db
            .select(
                "fk.name as fk_name",
                "tp.name as table_name",
                "cp.name as column_name",
                "tr.name as ref_table",
                "cr.name as ref_column"
            )
            .from("sys.foreign_keys as fk")
            .innerJoin(
                "sys.foreign_key_columns as fkc",
                "fk.object_id",
                "fkc.constraint_object_id"
            )
            .innerJoin("sys.tables as tp", "fkc.parent_object_id", "tp.object_id")
            .innerJoin("sys.columns as cp", function () {
                this.on("fkc.parent_object_id", "=", "cp.object_id").andOn(
                    "fkc.parent_column_id",
                    "=",
                    "cp.column_id"
                );
            })
            .innerJoin("sys.tables as tr", "fkc.referenced_object_id", "tr.object_id")
            .innerJoin("sys.columns as cr", function () {
                this.on("fkc.referenced_object_id", "=", "cr.object_id").andOn(
                    "fkc.referenced_column_id",
                    "=",
                    "cr.column_id"
                );
            })
            .orderBy("tp.name");

        // Organize schema into structured output
        const schema: TableSchema = {};

        tableColumns.forEach((row) => {
            const { table_name, column_name, data_type, max_length, primary_key } = row;
            if (!schema[table_name]) {
                schema[table_name] = {
                    columns: {},
                    primaryKeys: [],
                    foreignKeys: [],
                };
            }

            let columnType = data_type;
            if (max_length !== null) columnType += `(${max_length})`;

            schema[table_name].columns[column_name] = columnType;

            if (primary_key) {
                schema[table_name].primaryKeys.push(column_name);
            }
        });

        foreignKeys.forEach((fk) => {
            const { table_name, column_name, ref_table, ref_column } = fk;
            if (schema[table_name]) {
                schema[table_name].foreignKeys.push({
                    column: column_name,
                    refTable: ref_table,
                    refColumn: ref_column,
                });
            }
        });

        return schema;
    } catch (err) {
        console.error("Error fetching database schema:", err);
        throw err;
    }
}

export async function getSchema(): Promise<string> {
    const schema = await getDatabaseSchema();
    let output = `Database: ${process.env.DB_DATABASE}\n\n`;

    // Overall statistics
    const tableNames = Object.keys(schema);
    const totalTables = tableNames.length;
    let overallColumns = 0;
    let overallForeignKeys = 0;
    let overallPrimaryKeys = 0;
    let tableWithMostColumns = { name: "", count: 0 };
    let tableWithLeastColumns = { name: "", count: Number.MAX_SAFE_INTEGER };
    const dataTypeDistribution: { [dataType: string]: number } = {};

    tableNames.forEach((tableName) => {
        const tableInfo = schema[tableName];
        const columnsCount = Object.keys(tableInfo.columns).length;
        overallColumns += columnsCount;
        overallForeignKeys += tableInfo.foreignKeys.length;
        overallPrimaryKeys += tableInfo.primaryKeys.length;

        if (columnsCount > tableWithMostColumns.count) {
            tableWithMostColumns = { name: tableName, count: columnsCount };
        }
        if (columnsCount < tableWithLeastColumns.count) {
            tableWithLeastColumns = { name: tableName, count: columnsCount };
        }

        // Count data types distribution; strip length if present, e.g., "varchar(50)" becomes "varchar"
        Object.values(tableInfo.columns).forEach((colType) => {
            const baseType = colType.split("(")[0].trim().toLowerCase();
            dataTypeDistribution[baseType] = (dataTypeDistribution[baseType] || 0) + 1;
        });
    });

    const averageColumnsPerTable = totalTables > 0 ? overallColumns / totalTables : 0;

    // Append overall stats to output
    output += `Total Tables: ${totalTables}\n`;
    output += `Overall Columns: ${overallColumns}\n`;
    output += `Average Columns per Table: ${averageColumnsPerTable.toFixed(2)}\n`;
    output += `Overall Primary Keys: ${overallPrimaryKeys}\n`;
    output += `Overall Foreign Keys: ${overallForeignKeys}\n`;
    output += `Table with Most Columns: ${tableWithMostColumns.name} (${tableWithMostColumns.count})\n`;
    output += `Table with Least Columns: ${tableWithLeastColumns.name} (${tableWithLeastColumns.count})\n\n`;

    output += `Data Type Distribution:\n`;
    Object.keys(dataTypeDistribution).forEach((dataType) => {
        output += `  - ${dataType}: ${dataTypeDistribution[dataType]}\n`;
    });
    output += "\n";

    // Detailed table stats
    tableNames.forEach((tableName) => {
        output += `Table: ${tableName}\n`;
        const tableInfo = schema[tableName];
        const tableColumnsCount = Object.keys(tableInfo.columns).length;
        const tableFKCount = tableInfo.foreignKeys.length;

        output += `    Columns Count: ${tableColumnsCount}\n`;
        output += `    Foreign Keys Count: ${tableFKCount}\n`;
        output += `    Primary Keys: ${tableInfo.primaryKeys.join(", ") || "None"}\n`;

        Object.keys(tableInfo.columns).forEach((colName) => {
            let line = `    - ${colName} (${tableInfo.columns[colName]})`;
            if (tableInfo.primaryKeys.includes(colName)) line += " [PK]";
            tableInfo.foreignKeys.forEach((fk) => {
                if (fk.column === colName) {
                    line += ` [FK -> ${fk.refTable}(${fk.refColumn})]`;
                }
            });
            output += line + "\n";
        });
        output += "\n";
    });

    return output;
}
