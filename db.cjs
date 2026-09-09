let d;
function getDB() {
  if(!d) {
    d = import("lowdb/node").then(({JSONFilePreset}) => 
      JSONFilePreset("db.json", {
        playlists: {}
      })
    );
  }
  return d;
}

module.exports = { getDB };