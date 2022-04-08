Cron Parser
-----------
This is a script which parses a cron string and expands each field to show the times at which it will run.

It works for standard cron format with five time fields (minute, hour, day of month, month, and day of week) plus a command.

Installation
------------
Assuming you’ve already installed [Node.js](https://nodejs.org/en/), checkout this repository to a directory and make it your working directory.

```bash
$ cd cron_parser
$ npm install
```

Running The Test Suite
----------------------
If you've installed the dependencies, via:

```bash
$ npm install
```

then from the root of the project, you can just call
```bash
$ npm run test
```

alternatively you can run the tests (and get detailed output) by running:
```bash
$ jest
```

How To Use
----------
Pass cron string as a single argument.

If application is not your working directory: 

```bash
$ node cron_parser "*/15 0 1,15 * 1-5 /usr/bin/find"
```

if application is your current working directory you need to provide path to main script (index.js)

```bash
$ node index.js "*/15 0 1,15 * 1-5 /usr/bin/find"
```

Output should be in following format
```bash
minute         0 15 30 45
hour           0
day of month   1 15
month          1 2 3 4 5 6 7 8 9 10 11 12
day of week    1 2 3 4 5
command        /usr/bin/find
```
