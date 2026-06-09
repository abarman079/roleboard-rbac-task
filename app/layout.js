import "./globals.css";

export const metadata = {
  title: "RoleBoard - RBAC Task",
  description: "Role based post and comment management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}