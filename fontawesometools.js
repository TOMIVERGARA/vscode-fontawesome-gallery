const fs = require("fs");
var figlet = require("figlet");
var deepEqual = require("deep-equal");
var argv = require("minimist")(process.argv.slice(2));

function createSearchIndexArrayFromIconsObj(iconsObjPath) {
  try {
    if (fs.existsSync(iconsObjPath)) {
      let rawData = fs.readFileSync(iconsObjPath);
      let iconsList = JSON.parse(rawData);
      const SearchIndexArray = [];
      for (const icon in iconsList) {
        const entry = iconsList[icon];
        const iconName = icon.replace("fag_", "");
        const iconObj = {
          name: iconName,
          label: entry.label,
          searchTerms: entry.search.terms.length
            ? entry.search.terms
            : [iconName, entry.label],
        };
        console.log(`${icon} => ${entry.label}`);
        SearchIndexArray.push(iconObj);
      }
      console.log(
        `\u001b[1;32mParsed ${SearchIndexArray.length} icon entries successfuly. \u001b[0;39m`
      );
      const SearchIndexFile = {
        searchIndexArray: SearchIndexArray,
        date: new Date(),
      };
      let output = JSON.stringify(SearchIndexFile);
      return fs.writeFileSync("searchIndexArray.json", output);
    } else {
      return console.error(
        "Could not locate the fagIcons.json file in the specified path: " +
          iconsObjPath
      );
    }
  } catch (err) {
    return console.error("There was an error while saving the file.\n➥ " + err);
  }
}

function createFormattedIconsFile(iconsObjPath) {
  try {
    if (fs.existsSync(iconsObjPath)) {
      let rawData = fs.readFileSync(iconsObjPath);
      let iconsList = JSON.parse(rawData);
      let length = 0;
      const IconsObject = {};
      for (const icon in iconsList) {
        const entry = iconsList[icon];
        const formattedName = `fag_${icon.replace(/-/gi, "_")}`;
        const formattedIconEntry = {
          changes: entry.changes,
          name: icon,
          label: entry.label,
          search: entry.search,
          styles: entry.styles,
          unicode: entry.unicode,
          voted: entry.voted,
        };
        console.log(`${icon} => \u001b[1;32mReady! \u001b[0;39m`);
        IconsObject[formattedName] = formattedIconEntry;
        length++;

        if (!IconsObject[formattedName].search.terms.length) {
          IconsObject[formattedName].search.terms.push(icon, entry.label);
        }
      }

      console.log(
        `\u001b[1;32mParsed and formatted ${length} icon entries successfuly. \u001b[0;39m`
      );
      let output = JSON.stringify(IconsObject);
      return fs.writeFileSync("fagIcons.json", output);
    } else {
      return console.error(
        "Could not locate the icons.json file in the specified path: " +
          iconsObjPath
      );
    }
  } catch (err) {
    return console.error("There was an error while saving the file.\n➥ " + err);
  }
}

function createFormattedIconsFileV6(allJsFile) {
  //Original code from Janne252
  //https://github.com/Janne252/vscode-fontawesome-auto-complete/blob/master/data/fontawesome-6/metadata/convert.icons.raw.json.mjs

  global.window = {};
  require(allJsFile);

  const icons = global.window.___FONT_AWESOME___.styles;

  const knownStyles = [
    { key: "fab", alias: "fa-brands", name: "brands" },
    { key: "far", alias: "fa-regular", name: "regular" },
    { key: "fas", alias: "fa-solid", name: "solid" },
    { key: "fa", alias: "fa-solid", name: "solid" },
  ];
  const faCopyOf = "fas";

  for (const faIcon in icons["fa"]) {
    const faData = icons["fa"][faIcon];
    const fasData = icons[faCopyOf][faIcon];

    if (!deepEqual(faData, fasData)) {
      throw new Error(
        `Expected icons.fa["${faIcon}"]: ${faData.length} to match icons.${faCopyOf}["${faIcon}"]: ${fasData.length}`
      );
    }
  }

  for (const style of knownStyles) {
    const byKey = Object.keys(icons[style.key]);
    const byAlias = Object.keys(icons[style.alias]);

    if (
      byKey.length == byAlias.length &&
      byKey.every((a) => byAlias.some((b) => a == b))
    ) {
      console.info(`${style.key} == ${style.alias} sanity check passed`);
    } else {
      throw new Error(`${style.key} != ${style.alias} sanity check failed`);
    }
  }

  for (const style in icons) {
    if (
      !knownStyles.some((check) => check.key == style || check.alias == style)
    ) {
      throw new Error(`Unsupported icon style "${style}"`);
    }
  }

  const IconsObject = {};

  for (const style of knownStyles) {
    for (const icon in icons[style.key]) {
      const [width, height, maybe_aliases, unicode, svg_path] =
        icons[style.key][icon];

      const formattedName = `fag_${icon.replace(/-/gi, "_")}`;
      let formattedLabel = icon
        .replace(/-/gi, " ")
        .split(" ")
        .map((word) => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
        .join(" ");
      if (!(icon in IconsObject)) {
        const formattedIconEntry = {
          changes: [],
          name: icon,
          label: formattedLabel,
          search: {
            terms: [],
          },
          styles: [],
          unicode: unicode,
          voted: false,
        };
        IconsObject[formattedName] = formattedIconEntry;
      }

      // Register style
      if (!IconsObject[formattedName].styles.includes(style.name)) {
        IconsObject[formattedName].styles.push(style.name);
      }
      // Register search terms
      if (!IconsObject[formattedName].search.terms.includes(icon)) {
        IconsObject[formattedName].search.terms.push(icon, formattedLabel);
      }
    }
  }

  fs.writeFileSync("./fagIcons.json", JSON.stringify(IconsObject, null, 2), {
    encoding: "utf8",
  });

  console.log(
    `\u001b[1;32mParsed and formatted ${IconsObject.length} icon entries successfuly. \u001b[0;39m`
  );
}

//Migrates search terms from V5 to V6
function migrateSearchTerms(searchIndexArrayV5, fagIconsV6) {
  try {
    if (fs.existsSync(searchIndexArrayV5) && fs.existsSync(fagIconsV6)) {
      let rawSearchIndexData = fs.readFileSync(searchIndexArrayV5);
      let searchIndexArrayObj = JSON.parse(rawSearchIndexData);
      let rawFagIcons = fs.readFileSync(fagIconsV6);
      let fagIcons = JSON.parse(rawFagIcons);
      for (const icon of searchIndexArrayObj.searchIndexArray) {
        const formattedName = `fag_${icon.name.replace(/-/gi, "_")}`;
        //Check if icon exist in V6:
        if (!fagIcons.hasOwnProperty(formattedName)) continue;
        const originalTerms = fagIcons[formattedName].search.terms;
        //Check if icon already has the same search terms
        for (const termSI of icon.searchTerms) {
          console.log(originalTerms);
          if (deepEqual(fagIcons[formattedName].search.terms[0], termSI))
            continue;
          if (deepEqual(fagIcons[formattedName].search.terms[1], termSI))
            continue;
          fagIcons[formattedName].search.terms.push(termSI);
        }
      }
      let output = JSON.stringify(fagIcons);
      return fs.writeFileSync("fagIcons.json", output);
    } else {
      return console.error(
        "Could not locate the fagIcons.json or the searchIndexArray v5 file in the specified paths: " +
          fagIconsV6 +
          " and " +
          searchIndexArrayV5
      );
    }
  } catch (err) {
    return console.error("There was an error while saving the file.\n➥ " + err);
  }
}

function printHelp() {
  console.log(
    "\u001b[1;39mFontAwesome Tools is a CLI specifically designed to set up and update the VSCode Font Awesome Gallery extension. It can parse new icons.json files and much more. \u001b[0;39m \n"
  );
  console.log("Usage:");
  console.log("node fontawesometools.js [OPTIONS] \n");
  console.log("Applications Options:");
  console.log(
    "  -t csi, cfi, cfiV6, mst          //Specifies the tool type. \n  -h, -help             //Shows help menu. \n  --path ./icons.json   //Specifies the path to the icons.json file. \n --path2  //Used to provide an extra path. \n"
  );
  console.log("Available Tools:");
  console.log(
    " ---csi - Create Search Index      // Creates json file containing an array of icons and their search terms.\n ---cfi - Create Formatted Icons   // Generates a fagIcons.json file with the formatted icon list.\n ---cfiV6 - Create Formatted Icons for FA V6   // Generates an fagIcons.json file with the formatted icon list from all.js file, for FontAwesome 6.\n ---mst - Migrate search terms   //Migrates search terms from v5 to populate v6."
  );
}

(async function main() {
  //Prints the figlet
  console.log(
    `\u001b[1;32m ${figlet.textSync("FontAwesome Tools!")} \u001b[0;39m`
  );
  setTimeout(() => {
    switch (argv.t) {
      case "csi":
        if (!argv.path)
          return console.log(
            'You must specify an fagIcons.json path using the "--path=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m'
          );
        console.log("Creating search index from icons object.");
        console.log("➥ icons.json path: " + argv.path);
        setTimeout(() => createSearchIndexArrayFromIconsObj(argv.path), 2000);
        break;
      case "cfi":
        if (!argv.path)
          return console.log(
            'You must specify an icons.json path using the "--path=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m'
          );
        console.log("Creating formatted icons file from icons object.");
        console.log("➥ icons.json path: " + argv.path);
        setTimeout(() => createFormattedIconsFile(argv.path), 2000);
        break;
      case "cfiV6":
        if (!argv.path)
          return console.log(
            'You must specify an all.js file path using the "--path=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m'
          );
        console.log("Creating formatted icons file from all.js file.");
        console.log("➥ all.js path: " + argv.path);
        setTimeout(() => createFormattedIconsFileV6(argv.path), 2000);
        break;
      case "mst":
        if (!argv.path)
          return console.log(
            'You must specify a fagIcons.json file path using the "--path=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m'
          );
        if (!argv.path2)
          return console.log(
            'You must specify a searchIndexArray.json file path using the "--path2=" flag. \n\u001b[1;31mEarly exiting... \u001b[0;39m'
          );
        console.log("Migrating search terms.");
        console.log("➥ fagIcons.json path: " + argv.path);
        console.log("➥ searchIndexArray.json path: " + argv.path2);
        setTimeout(() => migrateSearchTerms(argv.path2, argv.path), 2000);
        break;
      default:
        printHelp();
        break;
    }
  }, 2000);
})();
