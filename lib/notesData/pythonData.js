// Complete Python course — each lecture lives in lib/notesData/python/
import { lecture01 } from "./python/lecture01";
import { lecture02 } from "./python/lecture02";
import { lecture03 } from "./python/lecture03";
import { lecture04 } from "./python/lecture04";
import { lecture05 } from "./python/lecture05";
import { lecture06 } from "./python/lecture06";
import { lecture07 } from "./python/lecture07";
import { lecture08 } from "./python/lecture08";
import { lecture09 } from "./python/lecture09";
import { lecture10 } from "./python/lecture10";
import { lecture11 } from "./python/lecture11";
import { lecture12 } from "./python/lecture12";
import { lecture13 } from "./python/lecture13";
import { lecture14 } from "./python/lecture14";
import { lecture15 } from "./python/lecture15";

const lectures = [
  lecture01,
  lecture02,
  lecture03,
  lecture04,
  lecture05,
  lecture06,
  lecture07,
  lecture08,
  lecture09,
  lecture10,
  lecture11,
  lecture12,
  lecture13,
  lecture14,
  lecture15,
];

export const pythonData = {
  id: "python",
  slug: "python",
  name: "Python",
  icon: "fab fa-python",
  iconColor: "#3776ab",
  badge: "Backend & Data Science",
  description: "Complete Python course: setup with uv, core syntax, data structures, functions, OOP, packaging, exceptions and logging, files, generators and decorators, type hints and Pydantic, asyncio, pytest, FastAPI, NumPy and pandas.",
  totalLectures: lectures.length,
  lectures,
};
