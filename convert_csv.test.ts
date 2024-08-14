import { expect, test } from "bun:test";
import { convertCsv, type CsvBRow } from "./convert_csv";
import * as fs from 'fs';
import * as csv from 'fast-csv';
// import * as csv from '@fast-csv/parse';

// test("when convert csv_a to csv_b should be correct", () => {
//     const inputPath = 'assets/templates/source_tasks.csv'
//     const outputPath = 'des_import_test.csv'

//     convertCsv(inputPath, outputPath);

//     const csvData: CsvBRow[] = [];

//     // Read CSV_A
//     fs.createReadStream(outputPath)
//         .pipe(parse())
//         .on('data', (data: CsvBRow) => csvData.push(data))

//     // console.log(csvAData)

//     expect(csvData).toEqual([""])
// });





async function readCsv(filePath: string): Promise<any[]> {
    const data: any[] = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv.parse())
            .on('data', (row) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', (error) => reject(error));
    });
}


test("2222222", async () => {
    const inputPath = 'assets/templates/source_tasks.csv'
    const outputPath = 'des_import_test.csv'

    // convertCsv(inputPath, outputPath);

    var actualData = await readCsv(outputPath)
        .then(data => data)
        .catch(err => console.error(err));
    expect(actualData).toEqual([""])
});
