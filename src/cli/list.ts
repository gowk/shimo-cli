import { Result } from "meow";
import { pick } from "lodash";
import {
  getFileList,
  getUpdated,
  getCreated,
  getShared,
  getUsed,
  getStarred,
  getShortcuts,
  getTrash,
} from "../list";
import { format } from "../utils/format";
import { parseLimit, parseFrom } from "../utils/cliParser";

const DEFAULT_FIELDS = ["guid", "name", "createdAt", "updatedAt", "user.name"];
// other fields:  "user", "updatedUser", "type"

const MAX_LIMIT = 150;
const DEFAULT_LIMIT = 20;

async function getFiles(category: string, cli: Result) {
  const limit = parseLimit(cli, DEFAULT_LIMIT, MAX_LIMIT, 1);
  const from = parseFrom(cli);
  switch (category) {
    case "updated":
      return getUpdated(limit, from);
    case "used":
      return getUsed(limit, from);
    case "created":
      return getCreated(limit, from);
    case "shared":
      return getShared(limit, from);
    case "starred":
      return getStarred();
    case "shortcuts":
      return getShortcuts();
    case "trash":
      return getTrash();
    default:
      return getFileList(category);
  }
}

export const name = ["list"];
export const description = [
  "display file list from desktop or folder",
  "shimo-cli list [desktop|updated|used|created|shared|starred|shortcuts|trash|$guid]",
  "--format\tdisplay format",
  "--fields\tfields filter, split by comma",
  "--limit \tset return line count",
].join("\n\t");
export const command = async (cli: Result) => {
  const files = await getFiles(cli.input[1], cli);
  const fields: string[] = cli.flags.fields
    ? (cli.flags.fields as string).split(",")
    : DEFAULT_FIELDS;
  const result = files.map((file) => pick(file, fields));
  process.stdout.write(format(result, cli.flags.format) + "\n");
};
