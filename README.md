# code-test
A code test that has been assigned to me.


### npm start
to activate node

### npm test
to run test

### nc localhost 9000
in another terminal shell/window/tab
you will need to have netcat installed for this last part

Running `npm start` will automatically pipe mylogfile.log back into itself and generate 
an object log file - ObjectLog.log (that still needs to be parsed into human readable content)

Running `npm test` as it is won't do anything (the way I know how to write tests
involves using the jest dependency and I couldn't figure out how to write a
test without it yet)

Running `nc localhost 9000` will allow you to add new lines to the mylogfile.log file and geneate
new logs into the LogObject.log file by text into the terminal.
