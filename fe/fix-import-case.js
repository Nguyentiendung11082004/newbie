import fs from "fs";
import path from "path";

const rootDir = path.join(process.cwd(), "src");

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function getRealBaseName(filePath) {
  try {
    return path.basename(fs.realpathSync(filePath));
  } catch {
    return null;
  }
}

const files = getAllFiles(rootDir);
let fixCount = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  let updated = false;

  const importRegex = /(from\s+['"])(\..*?)(['"])/g;
  content = content.replace(importRegex, (full, before, importPath, after) => {
    const absPath = path.resolve(path.dirname(file), importPath);

    // Check thư mục
    if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) {
      const realName = getRealBaseName(absPath);
      const usedName = path.basename(importPath);
      if (realName && realName !== usedName) {
        updated = true;
        fixCount++;
        return before + importPath.replace(usedName, realName) + after;
      }
    }

    // Check file
    const fileExts = [".tsx", ".ts"];
    for (const ext of fileExts) {
      if (fs.existsSync(absPath + ext)) {
        const realName = getRealBaseName(absPath + ext).replace(ext, "");
        const usedName = path.basename(importPath);
        if (realName && realName !== usedName) {
          updated = true;
          fixCount++;
          return before + importPath.replace(usedName, realName) + after;
        }
      }
    }

    return full;
  });

  if (updated) {
    fs.writeFileSync(file, content, "utf-8");
    console.log(`✅ Fixed imports in: ${file}`);
  }
});

console.log(`\n🎯 Done! Fixed ${fixCount} import path(s).`);
