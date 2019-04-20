workflow "publish on release" {
  resolves = ["publish"]
  on = "release"
}

action "publish" {
  uses = "actions/npm@master"
  args = "publish"
}
