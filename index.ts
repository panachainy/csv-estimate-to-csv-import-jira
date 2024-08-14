const csv = require('csv-parser');
import fs from 'fs';
import fastCsv from 'fast-csv';
import axios from 'axios';


interface CSV_A_Row {
    Epic: string;
    'Features (Story)': string;
    SubTask: string;
    'DevOps (MD)': number;
    'BE (MD)': number;
    'FE (MD)': number;
    'UX UI (MD)': number;
    'QA (MD)': number;
    Notes: string;
    URL: string;
    'Column 11': string;
    'Column 12': string;
}

interface CSV_B_Row {
    IssueType: string;
    Summary: string;
    'Story point': number;
    'Issue Key': string;
    Parent: string;
}

async function processCSV(inputFilePath: string, outputFilePath: string, jiraUrl: string, jiraToken: string) {
    const epicMap: Record<string, string> = {};
    const storyMap: Record<string, string> = {};
    let issueKeyCounter = 1;

    const outputData: CSV_B_Row[] = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(inputFilePath)
            .pipe(csv())
            .on('data', async (data: CSV_A_Row) => {
                try {
                    const epicKey = epicMap[data.Epic] || `epic_${issueKeyCounter}`;
                    epicMap[data.Epic] = epicKey;

                    const storyKey = storyMap[data.Epic + data['Features (Story)']] || `story_${issueKeyCounter}`;
                    storyMap[data.Epic + data['Features (Story)']] = storyKey;

                    const storyPoint = data['DevOps (MD)'] + data['BE (MD)'] + data['FE (MD)'] + data['UX UI (MD)'] + data['QA (MD)'];

                    outputData.push({
                        IssueType: data.SubTask ? 'Subtask' : data['Features (Story)'] ? 'Story' : 'Epic',
                        Summary: data.SubTask ? data.SubTask : data['Features (Story)'] ? data['Features (Story)'] : data.Epic,
                        'Story point': storyPoint,
                        'Issue Key': `${data.IssueType}_${issueKeyCounter}`,
                        Parent: data.SubTask ? storyKey : epicKey,
                    });

                    issueKeyCounter++;
                } catch (error) {
                    console.error('Error processing CSV data:', error);
                }
            })
            .on('end', () => {
                fastCsv
                    .write(outputData, { headers: true })
                    .pipe(fs.createWriteStream(outputFilePath))
                    .on('finish', () => {
                        console.log('CSV_B file created successfully');
                        // ... Jira import logic ...
                    })
                    .on('error', (error) => {
                        console.error('Error writing CSV_B file:', error);
                    });
            })
            .on('error', (error) => {
                console.error('Error reading CSV_A file:', error);
            });
    });
}

// ... rest of your code


// ... rest of your code


const inputFilePath = 'assets/templates/source_tasks.csv';
const outputFilePath = 'assets/templates/des_import.csv';
const jiraUrl = 'https://your-jira-instance.atlassian.net';
const jiraToken = 'your-jira-api-token';

processCSV(inputFilePath, outputFilePath, jiraUrl, jiraToken)
    .then(() => console.log('Process completed'))
    .catch((error) => console.error('Error:', error));
