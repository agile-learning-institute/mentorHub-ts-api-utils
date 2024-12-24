# mentorHub-ts-api-utils

NPM install
```sh
npm install @agile-learning-institute/mentorhub-ts-api-utils
```
NOTE: This adds the package to your project’s dependencies. Ensure your project uses Node.js 16+ and TypeScript 4.9+ for compatibility.

## Overview
These utilities provide a unified and reusable set of tools to streamline development for MentorHub's TypeScript-based APIs. They abstract common operations, reduce boilerplate code, and enforce best practices for configuration, request handling, and MongoDB interaction. 

#### Table of Contents
- [Express Utilities](#express-utilities)
- [Config Utilities](#config-utilities)
- [Mongo Utilities](#mongo-utilities)
- [Contributing](#contributing)

# Express Utilities
This is a collection of simple Express utilities:
- Token() decodes and constructs a Roles Based Access Control (RBAC) token
- Breadcrumb(token) builds the breadcrumb used when updating the database

## Usage

### Tokens
 All API will be secured with industry standard bearer tokens used to implement Role Based Access Control (RBAC). The create_token method will decode the token and extract claims for a user_id and roles, throwing an exception if the token is not found or not properly encoded. 
```json
{
    "user_id": "The users PersonID",
    "roles": ["Staff", "Mentor", "Member"]
}
```
Valid roles are listed in the mentorhub-mongodb repo's [enumerators file](https://github.com/agile-learning-institute/mentorHub-mongodb/blob/main/configurations/enumerators/enumerators.json) but the roles listed above are the only one's currently used in the mentorHub platform.

### Breadcrumbs
 All database collections include a lastModified "breadcrumb" property used to track changes over time. This breadcrumb should be provided to all database write functions. The breadcrumb has the following properties:
```json
{
        "atTime": "date-time the document was last modified",
        "byUser": "UserID claim from the access token",
        "fromIp": "IP Address the request originated at",  
        "correlationId": "A correlationID to use in logging"
}
```

### Example
Here is how these methods are used in a Express Controller
```ts
import { Request, Response } from 'express';
import { Token, decodeToken, Breadcrumb, createBreadcrumb } 
    from '@agile-learning-institute/mentorhub-ts-api-utils/config';
export default class SomeController {

  public getSomething = (req: Request, res: Response) => {
    const token: Token = decodeToken(req);
    const breadcrumb: Breadcrumb = createBreadcrumb(token);
    // Do something with token, breadcrumb
    if (!token.roles.includes("Staff")) throw new Error("Access Denied");
    const updateData = {"some":"update"};
    updateData.lastSaved = breadcrumb;
```

# Config Utilities
This is collection of utilities to support API Configuration in a standard way
- Config handles configuration values
- ConfigController is a Express request handler

## Usage
Standard Config

### Config
Standard mentorHub configuration values. Configurations are managed in a consistent way favoring file based configuration values, then environment configuration values, and then default values. See the [Config.ts](./src/config/Config.ts) for details on the configuration values.

```ts
import Config from '@agile-learning-institute/mentorhub-ts-api-utils/config';
config: Config = Config.getInstance();
console.log(`Built at ${config.BUILT_AT}`)
```

### config_routes()
 This is a simple express request handler to be used to expose the config data on a config endpoint.
```ts
import ConfigController from '@agile-learning-institute/mentorhub-ts-api-utils/config';

const app = express();
const configController = new ConfigController();
app.get('/api/config/', (req, res) => configController.getConfig(req, res));
```

# Mongo Utilities
Simple wrappers for MongoIO and a Config Initializer. 
- [getInstance()](#getInstance) returns the singleton object
- [connect()](#connectprimary_collection) connects to the database and initializes values in the Config singleton
- [disconnect](#disconnect) gracefully disconnects from the database
- [getDocuments](#getDocumentscollection_name-match-project-order) gets a list of documents
- [getDocument](#getDocumentcollection_name-string_id) gets a single document by id
- [createDocument](#createDocumentcollection_name-document) creates a new document
- [updateDocument](#updateDocumentcollection_name-_id-updates) updates an existing document (by id)
- [deleteDocument](#deleteDocumentcollection_name-string_id) hard deletes a document (by id) 

## Usage

### getInstance()
 Get a reference to the Singleton object
```ts
import MongoIO from '@agile-learning-institute/mentorhub-ts-api-utils/config';
mongoIO = MongoIO.getInstance();
```

### connect(primary_collection)
 This method will connect to the Mongo Database, and load the ``config.versions[]`` and ``config.enumerators{}`` properties. The enumerators loaded are based on the current version of the collection provided. 
```ts
mongoIO = MongoIO.getInstance();
mongoIO.connect(config.MAIN_COLLECTION_NAME)
```

### disconnect()
 This method will disconnect from the database in a graceful way. You should call this method when the server process is ending.
```ts
mongoIO = MongoIO.getInstance()
mongoIO.disconnect()
```

### getDocuments(collection_name, match, project, order)
 This is a convenience method to get a list of documents based on Mongo Match, project, and sort order parameters. 
```ts
match = {"name": {"$regex": query}};
project = {"_id":1,"name":1};
order = [('name', 1)];
documents = mongoIO.getDocuments("COLLECTION_NAME", match, project, order);
```

### getDocument(collection_name, string_id)
 This is a convenience method to get a single document based on ID
```ts
document = mongoIO.getDocument("COLLECTION_NAME", "_ID String");
```

### createDocument(collection_name, document)
 This is a convenient method for creating a single document
```ts
document = {"foo":"bar"};
created = mongoIO.createDocument("COLLECTION_NAME", document);
```

### updateDocument(collection_name, _id, updates)
 This is a convenience method for updating a single document based on ID
```ts
id = "24-byte-id";
patch = {"foo":"bar"};
updated = mongoIO.updateDocument("COLLECTION_NAME", id, patch);
```

### deleteDocument(collection_name, string_id)
 This is a convenience method for deleting a document based on ID. This is an actual live delete, not a soft delete. 
```ts
id = "24-byte-id";
updated = mongoIO.deleteDocument("COLLECTION_NAME", id);
```

# Contributing
If you want to contribute to this library, here are the instructions.

## Prerequisites

- [mentorHub Developers Edition](https://github.com/agile-learning-institute/mentorHub/tree/main/mentorHub-developer-edition)
- [NodeJS](https://nodejs.org/en/download)

### Optional

- [Mongo Compass](https://www.mongodb.com/try/download/compass) Useful for visually exploring and managing MongoDB collections.
- [Step CI](https://docs.stepci.com/guides/getting-started.html) Ideal for black-box testing APIs to validate behavior against specifications.

## Contributing

### Install dependencies
```bash
npm install
```

### Clean build output
```bash
npm run clean
```

### Clean and Build Typescript for deployment
```bash
npm run build
```

### Unit Test Typescript for deployment
```bash
npm run test
```
NOTE: The MongoIO unit tests are actually integration tests that expect the MentorHub MongoDB to be found at the default configuration. If you have the MentorHub developers edition installed you can use ``mh up mongodb`` to start this database. 

### ESLint Typescript
```bash
npm run lint
```

### Bump patch version before publishing
```bash
npm version patch
```

### Publish the Package
NOTE: CI will run ``build``, ``test``, and ``publish`` to deploy new versions.
```bash
npm run publish-it
```
