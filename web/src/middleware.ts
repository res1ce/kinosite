export { default } from "next-auth/middleware";

export const config = {
  // Защищаем всё /admin, кроме страницы логина
  matcher: ["/admin((?!/login).*)"],
};


