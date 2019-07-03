workflow "Build, Test, and Publish" {
  resolves = [
    "Publish",
  ]
  on = "release"
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "test"
}

action "Publish" {
  needs = "Test"
  uses = "artemnovichkov/action-zem@master"
  args = "publish"
  secrets = ["ZEM_TOKEN"]
}
