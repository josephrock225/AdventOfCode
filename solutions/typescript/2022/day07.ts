import { input, print } from "common";

interface Node {
  name: string;
  parent?: Node;
  type: FileType;
  size: number;
  children: Record<string, Node>;
}

enum FileType {
  FILE,
  DIR,
}

function tree(terminal: string[]): Node {
  const home: Node = {
    name: "/",
    type: FileType.DIR,
    size: 0,
    children: {},
  };

  const root = home;
  let dir = home;

  for (const line of terminal) {
    if (line.includes("$ ls")) continue;

    // cd command
    if (line.includes("$ cd")) {
      if (line.includes("cd /")) {
        dir = root;
      } else if (line.includes("cd ..")) {
        dir = dir.parent || dir;
      } else {
        const subDir = line.replace("$ cd ", "");
        dir = dir.children[subDir] || dir;
      }
      continue;
    }

    const listedFile = line.split(" ");
    if (listedFile[0] === "dir") {
      const subDir: Node = {
        name: listedFile[1],
        parent: dir,
        type: FileType.DIR,
        size: 0,
        children: {},
      };
      dir.children[subDir.name] = subDir;
    } else {
      const subDir: Node = {
        name: listedFile[1],
        parent: dir,
        type: FileType.FILE,
        size: parseInt(listedFile[0]),
        children: {},
      };
      dir.children[subDir.name] = subDir;
    }
  }
  setSize(root);
  return root;
}

function setSize(node: Node): number {
  if (node.type === FileType.FILE) return node.size;
  for (const child of Object.keys(node.children)) {
    setSize(node.children[child]);
    node.size += node.children[child].size;
  }
  return node.size;
}

function sumDirOfMaxSize(node: Node, max: number): number {
  if (node.type === FileType.FILE) return 0;
  let sum = 0;
  if (node.size <= max) sum += node.size;
  for (const child of Object.keys(node.children)) {
    sum += sumDirOfMaxSize(node.children[child], max);
  }
  return sum;
}

function fileToDelete(node: Node, min: number, best = 70000000): number {
  if (node.type === FileType.DIR && node.size >= min && node.size < best) {
    best = node.size;
  }
  for (const child of Object.keys(node.children)) {
    const test = fileToDelete(node.children[child], min, best);
    test >= min && test < best ? best = test : best;
  }
  return best;
}

function pt1(raw: string): number {
  const terminal = raw.split("\n");
  const directory = tree(terminal);
  return sumDirOfMaxSize(directory, 100000);
}

function pt2(raw: string): number {
  const terminal = raw.split("\n");
  const directory = tree(terminal);

  const minAmountToDelete = 30000000 - (70000000 - directory.size);
  return fileToDelete(directory, minAmountToDelete);
}

const raw = input(2022, 7);
print(pt1(raw), pt2(raw));
