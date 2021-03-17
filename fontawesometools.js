const fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var figlet = require('figlet');

function createSearchIndexArrayFromIconsObj(iconsObjPath){
    try {
      if (fs.existsSync(iconsObjPath)) {
        let rawData = fs.readFileSync(iconsObjPath);
        let iconsList = JSON.parse(rawData)
        const SearchIndexArray = [];
        for(const icon in iconsList){
            const entry = iconsList[icon];
            const iconObj = {
                name: icon,
                label: entry.label,
                searchTerms: entry.search.terms,
            }
            console.log(`${icon} => ${entry.label}`);
            SearchIndexArray.push(iconObj);
        }
        console.log(`\u001b[1;32mParsed ${SearchIndexArray.length} icon entries successfuly. \u001b[0;39m`)
        const SearchIndexFile = {
          searchIndexArray: SearchIndexArray,
          date: new Date()
        }
        let output = JSON.stringify(SearchIndexFile);
        return fs.writeFileSync('searchIndexArray.json', output);
      }else{
        return console.error('Could not locate the icons.json file in the specified path: ' + iconsObjPath);
      }
    } catch(err) {
      return console.error('There was an error while saving the file.\n➥ ' + err);
    }
}

function printHelp(){
    console.log('\u001b[1;39mFontAwesome Tools is a CLI specifically designed to set up and update the VSCode Font Awesome Gallery extension. It can parse new icons.json files and much more. \u001b[0;39m \n');
    console.log('Usage syntax:');
    console.log(' -t csi, ijtc //Specifies the tool type. \n --path ./icons.json //Specifies the path to the icons.json file. \n -help, -h //Shows help menu.');
    console.log('Available Tools:');
    console.log(' ---csi - Create Search Index // Creates json file containing an array of icons and their search terms.\n ---ijtc - Icons.json to const // Generates an icons.ts file that exports an iconsList var.')
}

(async function main(){
    //Prints the figlet
    console.log(`\u001b[1;32m ${figlet.textSync('FontAwesome Tools!')} \u001b[0;39m`);
    setTimeout(() => {
      switch (argv.t) {
          case 'csi':
              if(!argv.path) return console.log('You must specify an icons.json path using the "--path=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m');
              console.log('Creating search index from icons object.');
              console.log('➥ icons.json path: ' + argv.path)
              createSearchIndexArrayFromIconsObj(argv.path);
              break;
          default:
              printHelp();
              break;
      }
    }, 2000);
}())