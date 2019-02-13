const { Readable } = require("stream");
const { pipeToDocker, execDocker } = require("../utils/docker");

function createSecret(secret, manifests) {
  return new Promise(function(resolve, reject) {
    const { type, name, source } = secret;
    let rejected = false;
    const rejectOnce = (...args) => {
      if (!rejected) {
        rejected = true;
        reject(...args);
      }
    };

    if (type === 'string') {
      var s = new Readable();
      s.push(source);
      s.push(null);
    }

    console.log(`Creating secret ${name}`);

    const onExit = (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        rejectOnce();
      }
    };

    const onError = err => {
      rejectOnce(err);
    };

    const onStdout = data => {
      console.log(`${data.toString()}`);
    };

    const onStderr = data => {
      console.log(`${data}`);
    };

    if (type === 'string') {

      pipeToDocker(
        s,
        ["secret", "create", "--label", `pack.manifest.name=${manifests.name}`,name, "-"],
        onExit,
        onError,
        onStdout,
        onStderr
      )
    }else {
      execDocker(["secret", "create", "--label", `pack.manifest.name=${manifests.name}`,name, source],
        { env: process.env },
        (error, stdout, stderr) => {
          if (error) {
            onError(error);
          }else {
            console.log(stdout);
            onExit(0)
          }
        }
      );
    }

    
  });
}

module.exports = createSecret;
