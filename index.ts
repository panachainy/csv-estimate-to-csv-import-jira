import { convertCsv } from "./convert_csv";

const inputPath = 'assets/templates/source_tasks.csv'
const outputPath = 'assets/templates/des_import.csv'

await convertCsv(inputPath, outputPath);

console.log("convertCsv done")
