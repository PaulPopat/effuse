import jwt from "jsonwebtoken";

export function Encode(data: object) {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      data,
      process.env.JWT_KEY ?? "",
      {
        algorithm: "HS256",
        issuer: process.env.JWT_ISSUER,
        expiresIn: 15 * 60,
        audience: process.env.JWT_ISSUER,
      },
      (error, data) => (data ? res(data) : rej(error)),
    );
  });
}
