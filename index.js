// index.js is not loaded into Jint (only commands.js is). It exists so this
// plugin's directory looks like every other plugin and so external tooling
// that expects an entry file works. The real background logic lives in
// commands.js and runs under pluginContext.setInterval.
