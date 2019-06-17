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

# Filter for master branch
action "Master" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Publish" {
  needs = "Master"
  uses = "artemnovichkov/action-zem@master"
  args = "publish"
  secrets = ["ZEM_TOKEN"]
}
