import { expect, test } from "bun:test";
import { convertCsv, type CsvARow } from "./index";
import * as fs from 'fs';
import { parse } from "fast-csv";

test("when convert csv_a to csv_b should be correct", () => {
    const inputPath = 'assets/templates/source_tasks.csv'
    const outputPath = 'assets/templates/des_import_test.csv'
    convertCsv(inputPath, outputPath);

    const csvAData: CsvARow[] = [];

    // Read CSV_A
    fs.createReadStream(outputPath)
        .pipe(parse())
        .on('data', (data: CsvARow) => csvAData.push(data))

    console.log(csvAData)

});