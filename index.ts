import * as csv from 'csv-parser';
import fs from 'fs';
import fastCsv from 'fast-csv';
import axios from 'axios';

interface CSV_A_Row {
    Epic: string;
    'Features (Story)': string;
    SubTask: string;
    Summary: string;
    'DevOps (MD)': number;
    'BE (MD)': number;
    'FE (MD)': number;
    'UX UI (MD)': number;
    'QA (MD)': number;
    Notes: string;
    URL: string;
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
            .on('data', (data: CSV_A_Row) => {
                const epicKey = epicMap[data.Epic] || `epic_${issueKeyCounter}`;
                epicMap[data.Epic] = epicKey;

                const storyKey = storyMap[data.Epic + data['Features (Story)']] || `story_${issueKeyCounter}`;
                storyMap[data.Epic + data['Features (Story)']] = storyKey;

                const storyPoint = data['DevOps (MD)'] + data['BE (MD)'] + data['FE (MD)'] + data['UX UI (MD)'] + data['QA (MD)'];

                outputData.push({
                    IssueType: data.SubTask ? 'Subtask' : data['Features (Story)'] ? 'Story' : 'Epic',
                    Summary: data.Summary,
                    'Story point': storyPoint,
                    'Issue Key': `${data.IssueType}_${issueKeyCounter}`,
                    Parent: data.SubTask ? storyKey : epicKey,
                });

                issueKeyCounter++;
            })
            .on('end', () => {
                fastCsv
                    .write(outputData, { headers: true })
                    .pipe(fs.createWriteStream(outputFilePath))
                    .on('finish', () => {
                        console.log('CSV_B file created successfully');
                        // Replace with your Jira API endpoint and authentication
                        const jiraApi = axios.create({
                            baseURL: jiraUrl,
                            headers: {
                                Authorization: `Basic ${Buffer.from(`${jiraToken}:`).toString('base64')}`,
                                'Content-Type': 'application/json',
                            },
                        });

                        // Example of creating an issue in Jira
                        const createIssue = async (issueData: CSV_B_Row) => {
                            try {
                                const response = await jiraApi.post('/rest/api/3/issue', issueData);
                                console.log('Issue created:', response.data);
                            } catch (error) {
                                console.error('Error creating issue:', error);
                            }
                        };

                        outputData.forEach(async (issue) => {
                            await createIssue(issue);
                        });

                        resolve();
                    });
            });
    });
}

const inputFilePath = 'csv_a.csv';
const outputFilePath = 'csv_b.csv';
const jiraUrl = 'https://your-jira-instance.atlassian.net';
const jiraToken = 'your-jira-api-token';

processCSV(inputFilePath, outputFilePath, jiraUrl, jiraToken)
    .then(() => console.log('Process completed'))
    .catch((error) => console.error('Error:', error));
