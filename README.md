# NODE FILE HANDLER

This project involves the development of a Node.js function aimed at efficiently downloading large video files from a designated Google Drive directory while concurrently initiating the upload process to another Google Drive directory. The implementation incorporates a chunked uploading mechanism to enhance the efficiency and resilience of uploads, particularly for handling large files. Additionally, the project entails the creation of an endpoint to monitor the status of both the download and chunked upload processes, offering real-time visibility into the progress of each chunk.

## Features

- Download Functionality
- Chunked Download/Upload Mechanism
- Progress Monitoring Endpoint

## Tech Stack

**Server:** Node, Express, GoogleAPI, JWT, MongoDB, PassportJS, Typescript.

**Deployment:** AWS, AWS Lambda, Serverless

## Run Locally

Clone the project

```bash
  git clone https://github.com/LoushikLK/express-g-drive-fille-handler.git
```

Go to the project directory

```bash
  cd express-g-drive-fille-handler
```

Install dependencies

```bash
  npm install
```

Start the development server

```bash
  npm run dev
```

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`

`GOOGLE_API_KEY`

`GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET`

`GOOGLE_CALLBACK_URL`

`PASSPORT_SECRET`

`JWT_SECRET`

## Demo

- [Deployed to AWS Lambda](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)

## API Reference

#### Login

```http
  GET {{BASE_URL}}/api/v1/auth/google/login
```

#### Callback

```http
  GET {{BASE_URL}}/api/v1/auth/google/callback
```

#### List All Files

```http
  GET {{BASE_URL}}/api/v1/drive/all-files
```

| Parameter       | Type     | Description                     |
| :-------------- | :------- | :------------------------------ |
| `authorization` | `Bearer` | **Required**. Token is required |

#### Download A File ById

```http
  GET {{BASE_URL}}/api/v1/drive/download/:srcFileId
```

| Parameter   | Type     | Description                             |
| :---------- | :------- | :-------------------------------------- |
| `srcFileId` | `string` | **Required**. Drive file ID is required |

#### Transfer A File

```http
  POST {{BASE_URL}}/api/v1/drive/transfer-file
```

| Body           | Type     | Description                               |
| :------------- | :------- | :---------------------------------------- |
| `srcFileId`    | `string` | **Required**. Drive file ID is required   |
| `destFolderId` | `string` | **Required**. Drive folder ID is required |

#### Get File Transfer Status

```http
  GET {{BASE_URL}}/api/v1/drive/status
```
