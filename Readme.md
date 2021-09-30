# AutoFi - Backend Challenge

## By Gaston Martinez

This is the resolution to the AutoFi's Backend challenge

## Documentation

The project has a folder called 'docs' with a swagger and a postman collection

## Installation

First, export the next variables (this magically makes mongo-memory-server works)
#### Linux
```sh
export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.2.8.tgz
export MONGOMS_VERSION=4.2.8
```

### In codesandbox.io

Export the 'MONGOMS' variables in the step before

Install dependencies and start the service

```sh
npm i
npm run dev
```

### By hand

Export the 'MONGOMS' variables in the step before

Install dependencies and start the service

```sh
cd ~/AutoFi
npm i
npm run dev
```

### Docker

Not working, I had some problems with mongo in memory binaries inside a docker container

### Use the api

In the /docs folder are a swagger and a postman collection files to play with the api 
- Use the 'Upload CSV' request to send a csv. Remember to attach a file to it and set the variable 'provider_name'. This endpoint returns a batchId to use in 'Get Batch ID' 
- Use the 'Get Batch ID' request to check the status of a csv 
- use 'Change Config' request to modified the columns to store in the db. Remember to send an array oh strings in the property 'acceptedValues'

### Some curl examples
```sh
# Submit a csv
curl --location --request POST 'http://localhost:3000/upload-csv' --form 'cardata=@./example.csv' --form 'provider_name="ProviderName"'

curl --location --request POST 'http://localhost:3000/upload-csv' --form 'cardata=@./short.example.csv' --form 'provider_name="ProviderName"'

# Query status
curl --location --request GET 'http://localhost:3000/batch/c41cd58b-c2f6-4f37-b77a-6299876e33bf' 

# Modify accepted columns
curl --location --request POST 'http://localhost:3000/config' \
--header 'Content-Type: application/json' \
--data-raw '{
    "acceptedValues":[
       "uuid"
    ]
}'

```

## Test

Tests must run by hand

```sh
cd ~/AutoFi
npm test
```

## Some considerations

- I din't use an ORM since the document fields are variable, they don't have a specific schema
- I added more endpoints to make everything easier to test
- The accepted columns are fixed during the process of a csv. If you modify the columns, only the upcoming processes will notice that change


## TO DO

- Organize endpoints for providers if more endpoints are nedeed - move /upload-csv to /providers/{provderId}/upload-csv - move /batch/{batchId} to /providers/{provderId}/batch/{batchId}
- Use interfaces or Typescript for the classes, this would make the design much better. Using interfaces is easier to make components interchangeables
- Run csv processing in threads.
- There are more tests to implement
- Remember you have some docs (Swagger and a postman collection)
- I uploaded the .env file to facilitate testing (to deploy it I should use configmaps+secrets or another mechanism)
