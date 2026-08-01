let pairingCode = null;
const sessions = new Map();
const warns    = new Map();

module.exports = {
  setPairingCode : (c) => { pairingCode = c; },
  getPairingCode : ()  => pairingCode,
  addSession     : (id, sock) => sessions.set(id, sock),
  removeSession  : (id) => sessions.delete(id),
  sessionCount   : ()  => sessions.size,
  getSessions    : ()  => sessions,
  getWarn        : (key) => warns.get(key) || 0,
  addWarn        : (key) => { warns.set(key, (warns.get(key)||0)+1); return warns.get(key); },
  resetWarn      : (key) => warns.delete(key),
};
