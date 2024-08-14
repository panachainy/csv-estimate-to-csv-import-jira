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

    convertCsv(inputPath, outputPath);

    var actualData = await readCsv(outputPath)
        .then(data => data)
        .catch(err => console.error(err));
    expect(actualData).toEqual
        (
            [
                [
                    "Issue Type",
                    "Summary",
                    "Story point",
                    "Issue Key",
                    "Parent"
                ],
                [
                    "Epic",
                    "Pre-Payment infra",
                    "",
                    "Pre-Payment infra",
                    ""
                ],
                [
                    "Story",
                    "[FE] setup Frontend payment",
                    "",
                    "[FE] setup Frontend payment",
                    "Pre-Payment infra"
                ],
                [
                    "Subtask",
                    "Setup FE Repository",
                    "0.5",
                    "Setup FE Repository",
                    "[FE] setup Frontend payment"
                ],
                [
                    "Subtask",
                    "Setup Deploy + CI CD",
                    "1",
                    "Setup Deploy + CI CD",
                    "[FE] setup Frontend payment"
                ],
                [
                    "Story",
                    "[BE] setup Backend payment service",
                    "",
                    "[BE] setup Backend payment service",
                    "Pre-Payment infra"
                ],
                [
                    "Subtask",
                    "Setup BE Repository",
                    "0.5",
                    "Setup BE Repository",
                    "[BE] setup Backend payment service"
                ],
                [
                    "Epic",
                    "Payment Topup",
                    "",
                    "Payment Topup",
                    ""
                ],
                [
                    "Story",
                    "[BE] integrate 3rd party service",
                    "",
                    "[BE] integrate 3rd party service",
                    "Payment Topup"
                ],
                [
                    "Subtask",
                    "add crystal after OPN Success",
                    "1",
                    "add crystal after OPN Success",
                    "[BE] integrate 3rd party service"
                ],
                [
                    "Subtask",
                    "write test",
                    "1",
                    "write test",
                    "[BE] integrate 3rd party service"
                ]
            ]
        )
});
