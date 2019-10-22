# Authentication tutorial using jsonwebtoken package

## Signup process

During the signup phase, the user enters **username**, **email** and **password**. First, you have to check against backend if the user with same username and email exists. If true, send bad request. Otherwise, add user and send the **JWT token**, if you directly want to login the user. This depends on the application requirement. Sometimes you want to login directly after signup; sometimes you dont

## Login process

Ask for (username or email) and password. If no username or email or password specified, return **Bad Response** status code ie 400. If (username and password) or (email and password) is specified, fetch that user from database and check password using bcrypt.compare function

`bcrypt.compare(password, user.password, (error, status) => {})`

if success, create token and send to client app
