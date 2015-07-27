var ShowAndTell = require("./showandtell");
module.exports = function setup() {
  React.render(
    <ShowAndTell />,
    document.getElementById("show-and-tell")
  )
}
