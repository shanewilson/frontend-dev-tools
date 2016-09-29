#!/usr/bin/env babel-node

const fs = require('graceful-fs');
const path = require('path');
const { introspectionQuery } = require('graphql/utilities');
const request = require('sync-request');
const chalk = require('chalk');
const config = require('hobbes');

const apiUrl = config.get('proxy');
const graphqlHubUrl = `${apiUrl}/graphql`;
console.log(`⚡  Fetching GraphQL Schema from ${chalk.white(graphqlHubUrl)}`);
try {
  const status = request('GET', `${apiUrl}/status`);
  const response = request('POST', graphqlHubUrl, {
    json: {
      query: introspectionQuery,
    },
  });

  if (response.statusCode === 200) {
    const schema = JSON.parse(response.body.toString('utf-8'));
    const version = JSON.parse(status.body.toString('utf-8'));

    fs.writeFileSync(
      path.join(config.get('path_project'), 'data', 'schema.json'),
      JSON.stringify(schema, null, 2)
    );
    fs.writeFileSync(
      path.join(config.get('path_project'), 'data', 'version.json'),
      JSON.stringify(version, null, 2)
    );
    console.log(`${chalk.green('✓')}  GraphQL Schema ${chalk.green('updated')} to commit ${chalk.white(version.commit)}`);
  } else {
    console.log(`${chalk.red('✗')}  Failed to update schema`);
    console.log(response);
  }
} catch (e) {
  console.log(`${chalk.red('✗')}  ${e}`);
}
