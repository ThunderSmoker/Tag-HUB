import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";

export const metadata = {
  title: "TagHUB",
  description: "Discover & Share AI Prompts",
};

const SignupLayout = ({ children }) => (
  <html
    lang="en"
    style={{
      margin: 0,
      padding: 0,
      fontFamily: "El Messiri, sans-serif",
    }}
  >
    <body style={{ background: " #031323", overflow: "hidden" }}>
      <Provider>{children}</Provider>
    </body>
  </html>
);

export default SignupLayout;
