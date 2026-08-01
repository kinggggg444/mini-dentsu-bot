const ai         = require('./ai');
const group      = require('./group');
const owner      = require('./owner');
const fun        = require('./fun');
const games      = require('./games');
const sound      = require('./sound');
const other      = require('./other');
const anime      = require('./anime');
const downloader = require('./downloader');
const global_cmds= require('./global');
const search     = require('./search');
const menu       = require('./menu');

module.exports = {
  ...menu,
  ...ai,
  ...group,
  ...owner,
  ...fun,
  ...games,
  ...sound,
  ...other,
  ...anime,
  ...downloader,
  ...global_cmds,
  ...search,
};
