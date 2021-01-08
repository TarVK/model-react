const FS = require("fs");
const Path = require("path");

module.exports = function (source, map, meta) {
    source = source.replace("export default", "const _defau =");

    this.addDependency(this.data.jsFilePath);
    this.addDependency(this.data.mdFilePath);
    const TSfile = FS.readFileSync(this.data.filePath, "UTF8");
    const JSfile = FS.readFileSync(this.data.jsFilePath, "UTF8");
    const MDfile = FS.readFileSync(this.data.mdFilePath, "UTF8");

    this.cacheable();
    this.callback(
        null,
        `${source} \n export default {result:_defau, TS:${JSON.stringify(
            TSfile
        )}, JS: ${JSON.stringify(JSfile)}, MD: ${JSON.stringify(MDfile)}}`,
        map
    );
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
    const filePath = remainingRequest.split("!").pop().replace(/\?.*$/, "");

    const ext = Path.extname(filePath);

    data.filePath = filePath;
    basePath = filePath.substring(0, filePath.length - ext.length);
    data.jsFilePath = basePath + ".jsx";
    data.mdFilePath = basePath + ".md";
};
