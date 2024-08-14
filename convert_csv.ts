import * as fs from 'fs';
import * as csv from 'fast-csv';

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

    // FIXME: https://c2fo.github.io/fast-csv/docs/introduction/example
    // Read CSV_A
    fs.createReadStream(inputFilePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (data: CsvARow) => csvAData.push(data))
        .on('end', () => {
            console.log(csvAData)

        })
    // .on('end', () => {
    //     // Data transformation logic
    //     const csvBData: CsvBRow[] = [];

    //     // Basic transformation example - replace with your actual logic
    //     csvAData.forEach((row, index) => {
    //         const issueType = row['Sub-Task'] ? 'Sub-Task' : row['Features (Story)'] ? 'Story' : 'Epic';
    //         const storyPoint = row['DevOps (MD)'] + row['BE (MD)'] + row['FE (MD)'] + row['UX UI (MD)'] + row['QA (MD)'];
    //         const issueKey = row['Sub-Task'] || row['Features (Story)'] || row.Epic; // Replace with a more robust logic
    //         const parent = issueType === 'Sub-Task' ? row['Features (Story)'] : issueType === 'Story' ? row.Epic : '';

    //         // Note: skip header
    //         if (index == 0) { return }

    //         csvBData.push({
    //             IssueType: issueType,
    //             Summary: row[issueType],
    //             'Story point': storyPoint,
    //             IssueKey: issueKey,
    //             Parent: parent,
    //         });
    //     });

    //     // console.log(csvBData)

    //     // // Write CSV_B
    //     // stringify(csvBData, { headers: true })
    //     //     .pipe(fs.createWriteStream(outputFilePath))
    //     //     .on('finish', () => console.log('CSV_B written successfully'))
    //     //     .on('error', (error) => console.error('Error writing CSV_B:', error));

    //     fastCsv
    //         .write(csvBData, { headers: true })
    //         .pipe(fs.createWriteStream(outputFilePath))
    //         .on('finish', () => {
    //             console.log('CSV_B file created successfully');


    //             // Replace with your Jira API endpoint and authentication
    //             // const jiraApi = axios.create({
    //             //     baseURL: jiraUrl,
    //             //     headers: {
    //             //         Authorization: `Basic ${Buffer.from(`${jiraToken}:`).toString('base64')}`,
    //             //         'Content-Type': 'application/json',
    //             //     },
    //             // });

    //             // // Example of creating an issue in Jira
    //             // const createIssue = async (issueData: CSV_B_Row) => {
    //             //     try {
    //             //         const response = await jiraApi.post('/rest/api/3/issue', issueData);
    //             //         console.log('Issue created:', response.data);
    //             //     } catch (error) {
    //             //         console.error('Error creating issue:', error);
    //             //     }
    //             // };

    //             // outputData.forEach(async (issue) => {
    //             //     await createIssue(issue);
    //             // });

    //             // resolve();
    //         });
    // });
}

export { convertCsv };
export type { CsvARow, CsvBRow };
