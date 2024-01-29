module.exports = {
  // https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration
  branches: [
    { name: "main" },
    { name: "next" },
    { name: "+([0-9])?(.{+([0-9]),x}).x" },
    { name: "dev", prerelease: true },
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogTitle: "# Changelog",
      },
    ],
    [
      // https://goreleaser.com/cookbooks/semantic-release/
      // replaces the github plugin
      "@semantic-release/exec",
      {
        prepareCmd: "goreleaser build --clean --snapshot",
        publishCmd: [
          "export GORELEASER_CURRENT_TAG=${nextRelease.gitTag}",
          "export GORELEASER_PREVIOUS_TAG=${lastRelease.gitTag}",
          "echo '${nextRelease.notes}' > /tmp/release-notes.md",
          "goreleaser release --clean --release-notes /tmp/release-notes.md",
        ].join("\n"),
      },
    ],
    [
      "semantic-release-major-tag",
      {
        customTags: ["v${major}", "v${major}.${minor}"],
      },
    ],
    [
      "@semantic-release/git",
      {
        message: "chore(release): ${nextRelease.version}",
        assets: ["CHANGELOG.md"],
      },
    ],
  ],
};
