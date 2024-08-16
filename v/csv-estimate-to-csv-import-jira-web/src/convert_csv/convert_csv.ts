import * as fs from 'fs';
import * as csv from 'fast-csv';

interface CsvARow {
    Epic: string;
    'Features (Story)': string;
    'Sub-Task': string;
    Description: string;
    'DevOps (MD)': string;
    'BE (MD)': string;
    'FE (MD)': string;
    'UX UI (MD)': string;
    'QA (MD)': string;
}

interface CsvBRow {
    IssueType: string;
    Summary: string;
    Description: string;
    'Story point': string;
    IssueKey: string;
    Parent: string;
}

async function convertCsv(inputFilePath: string, outputFilePath: string): Promise<void> {
    const csvData: CsvBRow[] = [];
    const exitingEpic: string[] = [];
    const exitingStory: string[] = [];

    // Read CSV_A
    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csv.parse({ headers: true }))
            .on('data', (row: any) => {

                if (!exitingEpic.includes(row.Epic)) {
                    csvData.push({
                        IssueType: "Epic",
                        Summary: row.Epic,
                        Description: "",
                        'Story point': "",
                        IssueKey: row.Epic,
                        Parent: "",
                    } as CsvBRow)
                    exitingEpic.push(row.Epic);
                }

                if (!exitingStory.includes(row["Features (Story)"])) {
                    csvData.push({
                        IssueType: "Story",
                        Summary: row['Features (Story)'],
                        Description: '',
                        'Story point': "",
                        IssueKey: row['Features (Story)'],
                        Parent: row.Epic,
                    } as CsvBRow)
                    exitingStory.push(row["Features (Story)"]);
                }
                const sp = row['DevOps (MD)'] as number + row['BE (MD)'] as number + row['FE (MD)'] as number + row['UX UI (MD)'] as number + row['QA (MD)'] as number

                csvData.push({
                    IssueType: "Subtask",
                    Summary: row['Sub-Task'],
                    Description: row.Description,
                    'Story point': sp + "",
                    IssueKey: row['Sub-Task'],
                    Parent: row['Features (Story)'],
                } as CsvBRow)
            })
            .on('end', () => {
                csv.write(csvData, { headers: true })
                    .pipe(fs.createWriteStream(outputFilePath))
                    .on('finish', () => {
                        console.log('CSV_B file created successfully');
                        resolve();
                    });
            })
            .on('error', (error) => reject(error));
    });
}

export { convertCsv };
export type { CsvARow, CsvBRow };
