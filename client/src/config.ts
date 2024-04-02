export class Config {
  static apiUrl = process.env.NODE_ENV === "development" ? "http://localhost:4000" : window.origin;
}
