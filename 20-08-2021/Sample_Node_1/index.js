'use strict';

const Hapi = require('hapi');
const { Client } = require('pg');

const server = new Hapi.Server();

server.connection({
    port: 3000, 
    host: 'localhost'
});

server.start(function (err) {
    if(err) {
        console.log('Error in start', err);
    }
    console.log('Server started at: ', server.info.uri);
});

server.route({
    method:'GET',
    path: '/',
    handler: function (request, response) {
        return response('The server is started successfully: Home Page');
    }
});

server.route({
    method:'GET',
    path: '/hapi',
    handler: function (request, response) {
        return response('The server is started successfully: Hapi Page');
    }
});

const client = new Client({
    user: 'bharathikannan',
    host: 'localhost',
    database: 'postgres',
    port: 5432,
});

client.connect(function(err) {
    if(err) {
        throw new Error('Database connection error');
    }
    console.log('Database connected successfully');
});

client.query('SELECT * FROM addresses', function(err, res) {
    if(err) {
        console.error('Table Connection Error');
    }
    console.log('Response', res.rows);
    client.end();
    process.exit(1);
});