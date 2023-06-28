'use strict';

const fsp = require('fs').promises;
const dirs = require('../utilities/directories');

async function init() {
    console.log('Database - Initializing!');

    //Directories needed
    const directoriesReady = await initDirectory();

    //Metadata needed
    let metadataReady = false;
    if (directoriesReady) {
        metadataReady = await initMetadata();
    }

    return directoriesReady && metadataReady;
}

async function initDirectory() {
    // ./database
    const databaseCreated = await createDirectory('database', dirs.database);

    // ./database/quizData
    const quizDataCreated = await createDirectory('quizData', dirs.quizData);

    return databaseCreated && quizDataCreated
};

async function initMetadata() {
    //metadata.json
    const metadataCreated = await createMetadata('metadata.json', dirs.database);
    return metadataCreated;
}

async function directoryExist(dir, dirPath) {
    //Check if directory folder exists
    console.log('Database - Checking if directory exists! -', dir);

    let exists = false;
    try {
        await fsp.readdir(dirPath);
        console.log('Database - Found directory! -', dir);
        exists = true;
    } catch (err) {
        console.log('Database - Directory not found! - ' + dir);
        // console.debug('DirectoryExist() ERROR - ' + err);
    }

    return exists;
}

async function createNewDirectory(dir, dirPath) {
    let created = false;
    console.log('Database - Attempt creation of directory! -', dir);
    try {
        await fsp.mkdir(dirPath)
        //Created directory
        console.log('Database - Successfully created directory! -', dir);
        created = true;
    } catch (err) {
        console.log('Database - Failed to create directory! -', dir);
        // console.debug('createNewDirectory() - ERROR - ' + err);
    }

    return created;
}

async function fileExists(fileName, filePath) {
    let exists = false;
    try {
        await fsp.access(filePath + '/' + fileName, fsp.constants.R_OK | fsp.constants.W_OK);
        console.log('Database - Found file! -', fileName);
        exists = true;
    } catch (err) {
        console.log('Database - Did not find file! -', fileName);
        // console.debug('fileExists() ERROR - ' + err);
    }

    return exists;
}

async function writeFile(fileName, fileDir, content) {
    let fileCreated = false;
    const filePath = fileDir + '/' + fileName + '.json';
    try {
        await fsp.writeFile(filePath, JSON.stringify(content, null, '\t'));
        fileCreated = true;
        console.log('Database - File created successfully1 - ' + fileName);
    } catch (err) {
        fileCreated = false;
        console.log('Database - Failed writing file! - ' + fileName);
        // console.debug('writeFile() - ERROR - ' + err);
    }
    return fileCreated;
}

async function createDirectory(dir, dirPath) {
    //Check if already exists
    const exists = await directoryExist(dir, dirPath);
    if (exists) {
        console.log('Database - Directory already exists: ' + dir);
        return true;
    }

    //Directory does not exists, attempt creation of it
    return await createNewDirectory(dir, dirPath);
}

async function createMetadata(file, filePath) {
    const metadataExists = await fileExists(file, filePath);
    if (metadataExists) {
        return true;
    }

    //File does not exist, attempt creation
    console.log('Database - File not detected! -', file);
    console.log('Database - Attempt creation of file! -', file);
    const quizArr = await scanForQuiz();

    //Construct the metadata object
    const metadataContent = {
        version: 'v1.0.0',
        name: 'quiz',
        quizCount: quizArr.length,
        quizArr: quizArr
    };

    //write file
    console.log('Database - Writing metadata file: ' + JSON.stringify(metadataContent));
    const metadataWritten = writeFile('metadata', filePath, metadataContent);
    return metadataWritten;
}

async function scanForQuiz() {
    const quizDir = dirs.quizData;
    let quizArr = [];
    try {
        quizArr = await fsp.readdir(quizDir, { withFileTypes: true });
        quizArr = quizArr.filter(quiz => quiz.isDirectory());
        quizArr = quizArr.map((quiz) => quiz.name);
    } catch (err) {
        console.log('Database - Failed to scan for quiz! - ' + quizDir);
        console.debug('scanForQuiz() - ERROR - ' + err);
    }

    return quizArr;
}

async function writeQuiz(quizData) {
    //Get filename based on count
    const metadata = JSON.parse(await readMetadata());
    const quizName = metadata.quizCount.toString();
    const quizDir = dirs.quizData + '/' + quizName;

    //TODO - use quizData param for the data
    const content = {
        title: 'Drenge med ledsagere!',
        intro: 'En quiz omkring vores lokation!',
        questions: [
            {
                category: 'Find mig',
                question: 'Hvad står der på statuen som er placeret her?',
                answer: "Athena",
                image: '/quiz/image/first/image1.svg',
                imageAlt: 'find mig',
                imageSize: 'medium',
            },
            {
                category: 'Vælg én',
                question: 'Af de valgte muligheder, hvilken passer så bedst på hvad der vises her?',
                answer: "Statue",
                choices: [
                    'Statue',
                    'Toilet',
                    'Sti',
                    'Græs'
                ],
                image: '/quiz/image/first/image2.png',
                imageAlt: 'vælg én',
                imageSize: 'large'
            }
        ],
        author: 'Kasper Worm',
        updated: '09-05-2023',
        created: '09-05-2023'
    };
    //Check if directory exists, otherwie create it
    const directoryCreated = await createDirectory(quizName, quizDir);

    let fileCreated = false;
    if (directoryCreated) {
        //TODO - introduce check if file exists?
        //Create file
        fileCreated = await writeFile(quizName, quizDir, content);
    }

    //Update metadata count if file was created
    if (fileCreated) {
        metadata.quizCount += 1;
        metadata.quizArr.push(quizName);
        const metadataUpdated = await updateMetadata(metadata);
        if (metadataUpdated) {
            console.log('Database - Updated metadata count!')
        }
    }

    return fileCreated;
}

async function updateMetadata(metadata) {
    const updated = await writeFile('metadata', dirs.database, metadata);
    return updated;
}

async function readFile(filePath) {
    let fileData;
    try {
        const data = await fsp.readFile(filePath, { encoding: 'utf8' });
        fileData = data;
    } catch (err) {
        console.log(err);
    }
    return fileData;
}

async function readMetadata() {
    const metadata = await readFile(dirs.staticFiles.metadata);
    return metadata;
}

async function getQuiz(id) {
    const metadata = await readMetadata();
    if (metadata && JSON.parse(metadata).quizArr && JSON.parse(metadata).quizArr.indexOf(id) > -1) {
        const quizDirPath = dirs.quizData + '/' + id + '/' + id + '.json';
        const quiz = await readFile(quizDirPath);
        return JSON.parse(quiz);
    }
}

module.exports = {
    init: init,
    writeQuiz: writeQuiz,
    getQuiz: getQuiz,
    readMetadata: readMetadata
};
