// Complete Java course — each lecture lives in lib/notesData/java/
import { lecture01 } from "./java/lecture01";
import { lecture02 } from "./java/lecture02";
import { lecture03 } from "./java/lecture03";
import { lecture04 } from "./java/lecture04";
import { lecture05 } from "./java/lecture05";
import { lecture06 } from "./java/lecture06";
import { lecture07 } from "./java/lecture07";
import { lecture08 } from "./java/lecture08";
import { lecture09 } from "./java/lecture09";
import { lecture10 } from "./java/lecture10";
import { lecture11 } from "./java/lecture11";
import { lecture12 } from "./java/lecture12";
import { lecture13 } from "./java/lecture13";
import { lecture14 } from "./java/lecture14";
import { lecture15 } from "./java/lecture15";

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

export const javaData = {
  id: "java",
  slug: "java",
  name: "Java",
  icon: "fab fa-java",
  iconColor: "#f89820",
  badge: "Enterprise Language",
  description: "Complete Java course: JVM and setup, core syntax, OOP, exceptions, collections and generics, lambdas and streams, modern Java 21–25, concurrency, JDBC, Maven/Gradle and JUnit, Spring Boot REST APIs, JPA and Spring Security.",
  totalLectures: lectures.length,
  lectures,
};
