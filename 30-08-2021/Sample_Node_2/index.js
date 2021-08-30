'use strict';

const Hapi = require('hapi');
const Pool = require('pg').Pool;
let ejs = require('ejs');
const inert = require('inert');
const vision = require('vision');
const dotenv = require('dotenv');
const Joi = require('joi');
dotenv.config();

const loginFile = './public/html/login.html';
const signUpFile = './public/html/signUp.html';
const showMessageFile = './public/html/showMessage.html';
const profileFile = './public/html/profile.html';

const server = new Hapi.Server();

const pool = new Pool({
    user: process.env.USERNAME,
    host: process.env.HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT
});

server.connection({
    port: process.env.PORT, 
    host: process.env.HOST
});

server.start(function (err) {
    if(err) {
        console.log('Error in server start', err);
    }
    console.log('Server started at: ', server.info.uri);
});

server.register(vision, (err) => {
    if (err) {
        throw err;
    }

    server.views({
        engines: { html: ejs },
        path: __dirname
    });

    server.route({ 
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply.view('./views/html/index.html', { title: 'Home page' });
        } 
    });

    server.register(inert, (err) => {   
        if(err) {
            console.log('Error in inert');
        }  
    
        server.route({
          method: 'GET',
          path: '/login',
          handler: function (request, reply) {
                reply.file(loginFile);
            }                                        
        });
    
        server.route({
            method: 'POST',
            path: '/loginSubmit',
            handler: function (request, reply) {
                  if(request) {
                      let username = request.payload.username;
                      let password = request.payload.password;
          
                      ejs.renderFile(profileFile, { username: username }, {}, (err, str) => {
                            if (err) {
                                console.log('Error in rendering', err);
                            } else {
                                pool.on('error', (err, client) => {
                                    console.error('Unexpected error on idle client', err)
                                    process.exit(-1)
                                });
                                pool.connect((err, client, done) => {
                                    if (err) throw err
                                    done();
                                    client.query(`SELECT password FROM userdetails where username = '${username}'`, (err, res) => {
                                        if (err) {
                                            console.log('Error in retrieving data from account Table', err.stack);
                                            let message = 'Error in retrieving data from account Table';
                                            return reply.view(showMessageFile, { message: message });
                                        } else {
                                            let check_password = res.rows[0].password;
                                            if(password === check_password) {
                                                console.log('Authentication Successful');
                                                reply(str).header('Content-Type','text/html');
                                            } else {
                                                console.log('Authentication Failure');
                                                let message = 'Authentication Failure';
                                                return reply.view(showMessageFile, { message: message });
                                                // ejs.renderFile('./views/html/showMessage.html', { message: message }, {}, (err, str) => {
                                                //     if (err) {
                                                //         console.log('Error in rendering', err);
                                                //     } else {
                                                //         console.log('Redirecting to Auth Failure Page');
                                                //         reply(str).header('Content-Type','text/html'); 
                                                //     }
                                                // });
                                            }
                                        }
                                    });
                                });
                            }    
                        });
                    }
                }                                        
        });
    
        server.route({
            method: 'GET',
            path: '/signup',
            handler: function (request, reply) {
                  reply.file(signUpFile);
              }                                        
        });
    
        server.route({
            method: 'POST',
            path: '/signupSubmit',
            config: {
                validate: {
                    payload:
                        Joi.object({
                            username: Joi.string().required(),
                            phone: Joi.number().required(),
                            email: Joi.string().required(),
                            password: Joi.string().required(),
                            account: Joi.string().required()
                        })
                }
            },
            handler: function (request, reply) {
                let userData = {};
                if(request) {
                    userData.username = request.payload.username;
                    userData.phone = request.payload.phone;
                    userData.email = request.payload.email;
                    userData.password = request.payload.password;
                    userData.account = request.payload.account;
                    userData.role_id = process.env.ACCOUNT_OWNER_ROLE_ID;
                    console.log(userData, 'userData');
                    pool.on('error', (err, client) => {
                        console.error('Unexpected error on idle client', err)
                        process.exit(-1)
                    });
                    const accountText = 'INSERT INTO accountdetails(account_name) VALUES ($1)';
                    const accountValues = [userData.account];
                    pool.connect((err, client, done) => {
                        if (err) throw err
                        client.query(accountText, accountValues, (err, res) => {
                            done()
                            if (err) {
                                console.log('Error in inserting data in account Table', err.stack);
                                let message = `Account ${userData.account} already exists`;
                                return reply.view(showMessageFile, { message: message });
                            } else {
                                console.log('Inserted Data Successfully in account Table', res.rows[0]);
                                client.query(`SELECT account_id FROM accountdetails where account_name = '${userData.account}'`, (err, res) => {
                                    if (err) {
                                        console.log('Error in retrieving data from account Table', err.stack);
                                        let message = 'Data Failure';
                                        return reply.view(showMessageFile, { message: message });
                                    } else {
                                        console.log('Data retrieved Successfully from account Table', res.rows[0].account_id);
                                        const account_id = res.rows[0].account_id;
                                        const insertText = 'INSERT INTO userdetails(username, phone, email, password, account_id, role_id) VALUES ($1, $2, $3, $4, $5, $6)'
                                        const insertValues = [userData.username, userData.phone, userData.email, userData.password, account_id, 1]
                                        client.query(insertText, insertValues, (err, res) => {
                                            if (err) {
                                                console.log('Error in inserting data in User Table', err.stack);
                                                let message = 'Data Failure';
                                                return reply.view(showMessageFile, { message: message });
                                            } else {
                                                console.log('Inserted Data Successfully in User Table', res.rows[0]);
                                                let message = 'Data Success';
                                                userData = {};
                                                return reply.view(showMessageFile, { message: message });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            }                                        
        });
    
    });
});