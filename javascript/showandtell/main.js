var ShowAndTell = require("./showandtell");
module.exports = function setup() {
  React.render(
    React.createElement(ShowAndTell, null),
    document.getElementById("show-and-tell")
  )
}
