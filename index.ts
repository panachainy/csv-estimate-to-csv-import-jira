import * as fs from 'fs';
import { parse, stringify } from 'fast-csv';

interface CsvARow {
    Epic: string;
    'Features (Story)': string;
    'Sub-Task': string;
    'DevOps (MD)': number;
    'BE (MD)': number;
    'FE (MD)': number;
    'UX UI (MD)': number;
    'QA (MD)': number;
    // ... other columns
}

interface CsvBRow {
    IssueType: string;
    Summary: string;
    'Story point': number;
    IssueKey: string;
    Parent: string;
}

async function convertCsv(inputFilePath: string, outputFilePath: string) {
    const csvAData: CsvARow[] = [];

    // Read CSV_A
    fs.createReadStream(inputFilePath)
        .pipe(parse())
        .on('data', (data: CsvARow) => csvAData.push(data))
        .on('end', () => {
            // Data transformation logic
            const csvBData: CsvBRow[] = [];

            // Basic transformation example - replace with your actual logic
            csvAData.forEach((row) => {
                const issueType = row['Sub-Task'] ? 'Sub-Task' : row['Features (Story)'] ? 'Story' : 'Epic';
                const storyPoint = row['DevOps (MD)'] + row['BE (MD)'] + row['FE (MD)'] + row['UX UI (MD)'] + row['QA (MD)'];
                const issueKey = row['Sub-Task'] || row['Features (Story)'] || row.Epic; // Replace with a more robust logic
                const parent = issueType === 'Sub-Task' ? row['Features (Story)'] : issueType === 'Story' ? row.Epic : '';

                console.log(row)

                csvBData.push({
                    IssueType: issueType,
                    Summary: row[issueType],
                    'Story point': storyPoint,
                    IssueKey: issueKey,
                    Parent: parent,
                });
            });


            // console.log(csvBData)

            // // Write CSV_B
            // stringify(csvBData, { headers: true })
            //     .pipe(fs.createWriteStream(outputFilePath))
            //     .on('finish', () => console.log('CSV_B written successfully'))
            //     .on('error', (error) => console.error('Error writing CSV_B:', error));
        });
}


// Example usage
convertCsv('assets/templates/source_tasks.csv', 'assets/templates/des_import.csv');
