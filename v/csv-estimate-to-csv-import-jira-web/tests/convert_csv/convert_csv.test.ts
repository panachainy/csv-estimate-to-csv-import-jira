import { expect, test } from "bun:test";
import { convertCsv } from "../../src/convert_csv/convert_csv";
import * as fs from 'fs';

test("when convertCsv should be correct expect data", async () => {
    const inputPath = 'tests/convert_csv/source_tasks.csv'
    const outputPath = 'tests/convert_csv/des_import_test.csv'
    const expectPath = 'tests/convert_csv/expect_csv.csv'

    await convertCsv(inputPath, outputPath);

    const actualData = fs.readFileSync(outputPath, 'utf8');
    const expectData = fs.readFileSync(expectPath, 'utf8');

    expect(actualData).toEqual(expectData)
});

