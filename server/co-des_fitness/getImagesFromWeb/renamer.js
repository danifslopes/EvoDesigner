const fs = require('fs')
let path = "/Applications/MAMP/htdocs/tenserflow/9_autoencoder_server/server/trainingVis/public/images/";
const files = fs.readdirSync(path);

let i = 0;
for (const file of files) {
    if (file.endsWith('.jpg')) {
        fs.rename(
            path + file,
            path + i + ".jpg",
            err => {
                console.log(err)
            }
        )
        i++;
    }
}